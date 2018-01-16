require('dotenv').config('./.env')

import { Kayn, REGIONS, RedisCache, METHOD_NAMES } from 'kayn'
import request from 'superagent'
import jsonfile from 'jsonfile'
const mongoose = require('mongoose')
require('./models')
const PLAYER_SCHEMA_NAME = 'Player'
const Player = mongoose.model(PLAYER_SCHEMA_NAME)

const TARGET_QUEUE = 'RANKED_SOLO_5x5'

const staticChampions = jsonfile.readFileSync('./static_champions.json')

if (process.env.NODE_ENV === 'development') {
    mongoose.connect(process.env.LOCAL_MONGO_URL)
} else if (process.env.NODE_ENV === 'production') {
    mongoose.connect(
        `mongodb://${process.env.MONGO_USER}:${
            process.env.MONGO_PASS
        }@ds161029.mlab.com:61029/${process.env.MONGO_USER}`,
    )
} else {
    throw new Error('.env file is missing NODE_ENV environment variable.')
}

const kayn = Kayn()({
    debugOptions: {
        isEnabled: true,
        showKey: true,
    },
    requestOptions: {
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 3000,
    },
    cacheOptions: {
        cache: new RedisCache({
            host: 'redis',
            port: 6379,
            keyPrefix: 'kayn',
        }),
        ttls: {
            [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID]: 1000 * 60 * 60 * 60,
            [METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID]: 1000 * 60 * 60 * 60,
            [METHOD_NAMES.MATCH.GET_RECENT_MATCHLIST]: 1000 * 60 * 60 * 60,
            [METHOD_NAMES.MATCH.GET_MATCH]:
                1000 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 60,
            [METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID]: 9999999999,
            [METHOD_NAMES.CHAMPION.GET_CHAMPIONS]: 9999999999,
        },
    },
})

// regionsCompleted is simply used for debugging purposes.
// ex: Challengers regionsCompleted: ['na', 'euw', 'kr']
// Once there are 11 regions in both Challengers/Masters,
// we're effectively done.
const regionsCompleted = {
    challengers: [],
    masters: [],
}

// temp
const isOneTrick = (otGames, total) => otGames / total >= 0.45
// 0.45 works for accurate stats + large number of games

const getLeagueByRank = async (region, rank) => {
    if (rank === 'challengers') {
        return kayn.Challenger.list(TARGET_QUEUE).region(region)
    }
    if (rank === 'masters') {
        return kayn.Master.list(TARGET_QUEUE).region(region)
    }
    throw new Error('Parameter `rank` is not correct.')
}

/**
 * getStats closes over stats, providing a way for us to find a particular summoner
 * within the stats.json file as if we're making a call to the old stats endpoint.
 * @param {number} summonerID - The summoner id to look for.
 * @returns {object} a stats object or `undefined` if not found.
 */
const getStats = async summonerID =>
    (await request.get(`http://one-tricks-stats:3002/api/stats/${summonerID}`))
        .body

// Cached Static Champion keys for getStaticChampion.
const staticChampionKeys = Object.keys(staticChampions.data)

/**
 * getStaticChampion replaces the need for kayn.Static.Champion.get which gets
 * rate limited very easily.
 * @param {number} id - The ID of the champion in `https://ddragon.leagueoflegends.com/cdn/7.24.2/data/en_US/champion.json`.
 * @returns {object} the static champion object (pretty much always.
 */
const getStaticChampion = id => {
    const targetKey = staticChampionKeys.find(
        key => parseInt(staticChampions.data[key].key) === id,
    )
    return staticChampions.data[targetKey]
    // It should always return.
}

/**
 * createOneTrick products the DTO that will be stored in our MongoDB database.
 * This is not to be applied to Riot's Static endpoint. It is to be applied to
 * the source (DDragon) instead.
 * @param {number} id - The summoner ID.
 * @param {number} wins - The number of wins on the champion being processed.
 * @param {number} losses - The number of losses on the champion being processed.
 * @param {object} champData - The static champion DTO returned by the API.
 * @returns {object} a one trick DTO that fits into our MongoDB Player Schema.
 */
const createOneTrick = (id, wins, losses, champData) => {
    // Put all bandaid fixes here.
    if (champData && champData.id === 'MonkeyKing') {
        return {
            champ: 'Wukong',
            id,
            wins,
            losses,
        }
    } else if (champData) {
        return {
            champ: champData.id,
            id,
            wins,
            losses,
        }
    }
    throw new Error('createOneTrick somehow failed.')
}

/**
 * clearsPlayerInDB removes all one tricks from the database given a rank and region.
 * This is an async/awaitable wrapper function to prevent callback hell.
 * @param {string} rank - 'challengers' or 'masters'.
 * @param {string} region
 */
const clearPlayersInDB = async (rank, region) =>
    new Promise((resolve, reject) => {
        Player.collection.remove(
            {
                rank: rank.charAt(0),
                region,
            },
            err => {
                if (err) reject(err)
                else resolve(true)
            },
        )
    })

/**
 * insertPlayersIntoDB inserts a set of one tricks into the database.
 * @param {[]object} payload - An object of one trick DTO's.
 * @param {string} region
 * @param {string} regionsCompleted - Helper array to show what regions have been processed.
 */
const insertPlayersIntoDB = async (oneTricks, region, rank) => {
    const payload = oneTricks.map(el => ({
        ...el,
        ...{
            rank: rank.charAt(0),
            region,
        },
    }))

    return new Promise((resolve, reject) => {
        if (payload.length === 0) resolve()

        Player.collection.insert(payload, (err, docs) => {
            if (err) {
                throw new Error(err)
            }
            regionsCompleted[rank].push(region)
            regionsCompleted[rank].sort()
            resolve(true)
        })
    })
}

// Mutating function... I want to use asyncMapOverChunk from ./stats hmm.
const chunkGenerate = async (generator, entries) => {
    let results = []
    const summonersChunkSize = entries.length / 4
    const processChunk = async chunk => Promise.all(chunk.map(generator))
    for (let i = 0; i < entries.length; i += summonersChunkSize) {
        const chunk = await processChunk(
            entries.slice(i, i + summonersChunkSize),
        )
        // Deal with return-early-case in getOneTrick.
        const filtered = chunk.filter(el => typeof el === 'object')
        results = results.concat(filtered)
    }
    return results
}

// getOneTrick is a helper function for allowing us to process requests in chunks.
const getOneTrick = region => async ({ wins, losses, playerOrTeamId }) => {
    const totalGames = wins + losses
    const playerStats = await getStats(playerOrTeamId, region)
    if (!playerStats) return true
    const champStats = playerStats.champions.find(
        ({ stats: { totalSessionsPlayed } }) =>
            isOneTrick(totalSessionsPlayed, totalGames),
    )
    if (!champStats) return true

    // Process champion stats.
    const {
        totalSessionsPlayed,
        wins: totalSessionsWon,
        losses: totalSessionsLost,
    } = champStats.stats

    const champId = champStats.id
    if (champId !== 0) {
        // Some ID's funnily equaled 0 (in the past).
        const champData = getStaticChampion(champId)
        const { summonerId } = playerStats

        return {
            ...createOneTrick(summonerId, wins, losses, champData),
            name: (await kayn.Summoner.by.id(summonerId).region(region)).name,
        }
    }

    throw new Error('getOneTrick somehow failed.')
}

/**
 * generate generates all the one tricks given a combination of rank and region.
 * @param {string} rank - This should work with getLeagueByRank. (Either 'challengers' or 'masters').
 * @param {string} region - An abbreviated region ('na1', 'euw', etc). Use `REGIONS` from `kayn`.
 */
async function generate(rank, region) {
    const { entries } = await getLeagueByRank(region, rank)
    const oneTricks = await chunkGenerate(getOneTrick(region), entries)
    await clearPlayersInDB(rank.charAt(0), region)
    await insertPlayersIntoDB(oneTricks, region, rank)
    return true
}

const main = async () =>
    new Promise((resolve, reject) =>
        setTimeout(async () => {
            const processChunk = async (rank, chunk) =>
                Promise.all(chunk.map(r => generate(rank, REGIONS[r])))
            const keys = Object.keys(REGIONS)
            const start = async (rank, chunkSize) => {
                for (let i = 0; i < keys.length; i += chunkSize) {
                    await processChunk(rank, keys.slice(i, i + chunkSize))
                }
            }
            await start('challengers', 4)
            await start('masters', 2)
            resolve(true)
        }, 20000),
    )

export default main

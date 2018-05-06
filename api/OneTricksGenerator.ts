require('dotenv').config('./.env')

import kayn from './kayn'
import { REGIONS } from 'kayn'
import * as mongoose from 'mongoose'
import getStats from './getStats'
import getStaticChampion from './getStaticChampion'
import { LeagueV3LeagueListDTO } from 'kayn/typings/dtos';

require('./models')
const PLAYER_SCHEMA_NAME = 'Player'
const Player = mongoose.model(PLAYER_SCHEMA_NAME)

const TARGET_QUEUE = 'RANKED_SOLO_5x5'

if (process.env.NODE_ENV === 'development') {
    mongoose.connect('mongodb://mongo/one-tricks')
} else if (process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.MONGO_URI!)
} else {
    throw new Error('.env file is missing NODE_ENV environment variable.')
}

// temp
const isOneTrick = (otGames: number, total: number): boolean => otGames / total >= 0.6
// 0.45 works for accurate stats + large number of games

const getLeagueByRank = async (region: string, rank: string) => {
    if (rank === 'challengers') {
        return kayn.Challenger.list(TARGET_QUEUE).region(region)
    }
    if (rank === 'masters') {
        return kayn.Master.list(TARGET_QUEUE).region(region)
    }
    throw new Error('Parameter `rank` is not correct.')
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
const createOneTrick = (id: number, wins: number, losses: number, champData: { id: string, key: string }) => {
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
            champ: champData.key,
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
const clearPlayersInDB = async (rank: string, region: string): Promise<any> =>
    new Promise((resolve, reject) => {
        Player.collection.remove(
            {
                rank: rank.charAt(0),
                region,
            },
            err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            },
        )
    })

/**
 * insertPlayersIntoDB inserts a set of one tricks into the database.
 * @param {[]object} payload - An object of one trick DTO's.
 * @param {string} region
 * @param {string} rank
 */
const insertPlayersIntoDB = async (oneTricks: any[], region: string, rank: string) => {
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
                throw new Error(err.message)
            }
            resolve(true)
        })
    })
}

// Mutating function... I want to use asyncMapOverChunk from ./stats hmm.
const chunkGenerate = async (generator: any, entries: LeagueV3LeagueListDTO[]) => {
    let results: any[] = []
    const summonersChunkSize = entries.length / 4
    const processChunk = async (chunk: any) => Promise.all(chunk.map(generator))
    for (let i = 0; i < entries.length; i += summonersChunkSize) {
        const chunk = await processChunk(
            entries.slice(i, i + summonersChunkSize),
        )
        // Deal with return-early-case in getOneTrick.
        const filtered = chunk.filter(el => typeof el === 'object')
        results = results.concat(filtered as any)
    }
    return results
}

// getOneTrick is a helper function for allowing us to process requests in chunks.
const getOneTrick = (region: string) => async ({ wins, losses, playerOrTeamId }: { wins: number, losses: number, playerOrTeamId: number }) => {
    const totalGames = wins + losses
    const playerStats = await getStats(playerOrTeamId)
    if (!playerStats) return true
    const champStats = playerStats.champions.find(
        ({ stats: { totalSessionsPlayed } }: { stats: { totalSessionsPlayed: number } }) =>
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
            ...createOneTrick(
                summonerId,
                totalSessionsWon,
                totalSessionsLost,
                champData,
            ),
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
async function generate(rank: string, region: string) {
    try {
        const { entries } = await getLeagueByRank(region, rank)
        const oneTricks = await chunkGenerate(getOneTrick(region), entries!)
        console.log('oneTricks:', oneTricks.length)
        await clearPlayersInDB(rank.charAt(0), region)
        await insertPlayersIntoDB(oneTricks, region, rank)
    } catch (exception) {
        console.error(exception)
    }

    return true
}

const main = async () =>
    new Promise((resolve, reject) =>
        setTimeout(async () => {
            const processChunk = async (rank: string, chunk: any[]) =>
                Promise.all(chunk.map(r => generate(rank, REGIONS[r])))
            const keys = Object.keys(REGIONS)
            const start = async (rank: string, chunkSize: number) => {
                for (let i = 0; i < keys.length; i += chunkSize) {
                    await processChunk(rank, keys.slice(i, i + chunkSize))
                }
            }
            await start('challengers', 11)
            await start('masters', 11)
            resolve(true)
        }, 20000),
    )

export default main

require('dotenv').config('./.env')

import { Kayn, REGIONS, METHOD_NAMES, BasicJSCache, RedisCache } from 'kayn'
import RegionHelper from 'kayn/dist/lib/Utils/RegionHelper'

const { asPlatformID } = RegionHelper

import jsonfile from 'jsonfile'

import ChampionStats from './entities/ChampionStats'
import OneTrick from './entities/OneTrick'
import PlayerStats from './entities/PlayerStats'
import Summoner from './entities/Summoner'

import asyncMapOverArrayInChunks from './utils/generic/asyncMapOverArrayInChunks'
import range from './utils/generic/range'

import MatchResponseHelper from './utils/response/MatchResponseHelper'

import LeagueKaynHelper from './utils/kayn-dependent/LeagueKaynHelper'
import MatchlistKaynHelper from './utils/kayn-dependent/MatchlistKaynHelper'

const LEAGUE_QUEUE = 'RANKED_SOLO_5x5'

const mockBaseStats = jsonfile.readFileSync('./stats.json')
console.log(mockBaseStats.players.length)

// Local Helpers
const processMatch = playerStats => match => {
    const summonerID = playerStats.summonerID
    const data = MatchResponseHelper.getMatchInfoForSummoner(match, summonerID)
    if (!data) return
    const { didWin, championID, gameID } = data
    if (playerStats.containsChampion(championID)) {
        playerStats.editExistingChampion(championID, didWin, gameID)
    } else {
        playerStats.pushChampion(ChampionStats(championID, didWin), gameID)
    }
}
const inPlatform = region => ({ platformId: platformID }) =>
    platformID.toLowerCase() === asPlatformID(region)

const store = json => {
    console.time('stats.json')
    jsonfile.writeFileSync('./stats.json', json)
    console.timeEnd('stats.json')
}

const main = async () => {
    const kayn = Kayn()({
        debugOptions: {
            isEnabled: true,
            showKey: true,
        },
        requestOptions: {
            numberOfRetriesBeforeAbort: 10,
            delayBeforeRetry: 50000,
            burst: false,
        },
    })

    const allStats = []
    mockBaseStats.players.forEach(player => {
        const p = PlayerStats()
        p.load(player)
        allStats.push(p)
    })
    const playerExists = id => allStats.some(el => el.summonerID === id)

    // TODO: Is this unique?
    // Removed `region` property because players can transfer regions.
    const getPlayer = id => allStats.find(el => el.summonerID === id)

    const makeStats = async (rank, region, summoners) => {
        const summonersChunkSize = summoners.length / 4

        const allPlayerStats = await asyncMapOverArrayInChunks(
            summoners,
            summonersChunkSize,
            async ({ id: summonerID, accountID }) => {
                const playerStats = playerExists(summonerID)
                    ? getPlayer(summonerID)
                    : PlayerStats(summonerID, region)

                // This is named `fullListOfMatches` because it's a list of the match
                // objects, not matchlist objects.
                const fullListOfMatches = (await MatchlistKaynHelper.getEntireMatchlist(
                    kayn,
                )(accountID, region))
                    .filter(inPlatform(region))
                    .filter(({ gameId: matchID }) =>
                        playerStats.doesNotContainMatch(matchID),
                    )

                const matches = await MatchlistKaynHelper.rawMatchlistToMatches(
                    kayn,
                )(fullListOfMatches, region)

                // Mutation: Process matches in matchlist.
                matches.forEach(processMatch(playerStats))
                return playerStats
            },
        )

        const newStats = allPlayerStats.reduce(
            (total, playerStats) =>
                !playerExists(playerStats.summonerID)
                    ? total.concat(playerStats)
                    : total,
            [],
        )

        const json = {
            players: allStats.concat(newStats).map(el => el.asObject()),
        }

        console.log('storing', region, rank)
        store(json)
        return true
    }

    const processStatsInChunks = async (rank, region) => {
        const league = await kayn[rank].list(LEAGUE_QUEUE).region(region)
        const summoners = await Promise.all(
            league.entries.map(
                LeagueKaynHelper.leagueEntryToSummoner(kayn)(region),
            ),
        )
        const len = summoners.length
        const chunkSize = 50
        for (let i = 0; i < len; i += chunkSize) {
            console.log('======')
            console.log('starting:', rank, region, i, i + chunkSize)
            console.log('======')
            try {
                await makeStats(rank, region, summoners.slice(i, i + chunkSize))
            } catch (exception) {
                console.log('makeStats failed...')
            }
            console.log('======')
            console.log('ending:', rank, region, i, i + chunkSize)
            console.log('======')
        }
        return true
    }

    const keys = Object.keys(REGIONS)
    // Masive amounts of paralle calls seem to break riot-ratelimiter,
    // keep this at 1 for now and play it safe.
    const challengersChunkSize = 4
    const mastersChunkSize = 4
    const processChunk = async (rank, chunk) =>
        Promise.all(chunk.map(r => processStatsInChunks(rank, REGIONS[r])))
    for (let i = 0; i < keys.length; i += challengersChunkSize) {
        console.log(
            'starting',
            'challenger',
            keys.slice(i, i + challengersChunkSize),
        )
        await processChunk(
            'Challenger',
            keys.slice(i, i + challengersChunkSize),
        )
        console.log('done')
    }
    for (let i = 0; i < keys.length; i += mastersChunkSize) {
        console.log('starting', 'masters', keys.slice(i, i + mastersChunkSize))
        await processChunk('Master', keys.slice(i, i + mastersChunkSize))
        console.log('done')
    }
    return true
}

export default main

require('dotenv').config('./.env')

import {
    Kayn,
    REGIONS,
    METHOD_NAMES,
    BasicJSCache,
    LRUCache,
    RedisCache,
} from 'kayn'
import RegionHelper from 'kayn/dist/lib/Utils/RegionHelper'

const { asPlatformID } = RegionHelper

import { Stats } from './mongodb'

import ChampionStats from './entities/ChampionStats'
import OneTrick from './entities/OneTrick'
import PlayerStats, { loadPlayerStats } from './entities/PlayerStats'
import Summoner from './entities/Summoner'

import asyncMapOverArrayInChunks from './utils/generic/asyncMapOverArrayInChunks'
import range from './utils/generic/range'

import MatchResponseHelper from './utils/response/MatchResponseHelper'

import LeagueKaynHelper from './utils/kayn-dependent/LeagueKaynHelper'
import MatchlistKaynHelper from './utils/kayn-dependent/MatchlistKaynHelper'

const LEAGUE_QUEUE = 'RANKED_SOLO_5x5'

// Local Helpers

// processMatch is a mutating function dependent on the PlayerStats class.
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

const storePlayerStats = (summonerId, json) =>
    Stats.findOneAndUpdate(
        {
            summonerId,
        },
        {
            summonerId,
            champions: json.champions,
            region: json.region,
            matchesProcessed: json.matchesProcessed,
        },
        {
            upsert: true,
        },
    )

const getPlayer = summonerId => Stats.findOne({ summonerId })

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
        cacheOptions: {
            cache: new LRUCache({ max: 1000 }),
            timeToLives: {
                useDefault: true,
            },
        },
    })

    const tryCatchGetPlayerStats = async (summonerId, region) => {
        try {
            return loadPlayerStats(await getPlayer(summonerId))
        } catch (ex) {
            return PlayerStats(summonerId, region)
        }
    }

    const makeOne = async (summonerID, accountID, region) => {
        console.log('Processing:', summonerID, accountID, region)
        const playerStats = await tryCatchGetPlayerStats(summonerID, region) // This is named `fullListOfMatches` because it's a list of the match
        // objects, not matchlist objects.
        const fullListOfMatches = (await MatchlistKaynHelper.getEntireMatchlist(
            kayn,
        )(accountID, region)).filter(
            el =>
                inPlatform(region)(el) &&
                playerStats.doesNotContainMatch(el.gameId),
        )

        const matches = await MatchlistKaynHelper.rawMatchlistToMatches(kayn)(
            fullListOfMatches,
            region,
        )

        // Mutation: Process matches in matchlist.
        matches.forEach(processMatch(playerStats))

        try {
            if (matches.length > 0) {
                const res = await storePlayerStats(
                    summonerID,
                    playerStats.asObject(),
                )
            }
        } catch (storeException) {
            console.log('Was unable to store:', storeException, summonerID)
        }
    }

    const makeStats = async (rank, region, summoners) => {
        const summonersChunkSize = summoners.length / 4

        await asyncMapOverArrayInChunks(
            summoners,
            summonersChunkSize,
            async ({ id: summonerID, accountID }) => {
                try {
                    await makeOne(summonerID, accountID, region)
                } catch (exception) {
                    console.error(exception)
                }
            },
        )

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
        const chunkSize = 25
        for (let i = 0; i < len; i += chunkSize) {
            console.log('======')
            console.log('starting:', rank, region, i, i + chunkSize)
            console.log('======')
            try {
                await makeStats(rank, region, summoners.slice(i, i + chunkSize))
            } catch (exception) {
                console.log('makeStats failed...', exception)
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
    const challengersChunkSize = 11
    const mastersChunkSize = 6
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

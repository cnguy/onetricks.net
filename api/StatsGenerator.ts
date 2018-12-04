import {
    Kayn,
    REGIONS,
    METHOD_NAMES,
    BasicJSCache,
    LRUCache,
    RedisCache,
} from 'kayn'
// @ts-ignore
import RegionHelper from 'kayn/dist/lib/Utils/RegionHelper'

const { asPlatformID } = RegionHelper

import { Stats, Player } from './mongodb'

import ChampionStats from './entities/ChampionStats'
import OneTrick from './entities/OneTrick'
import PlayerStats, { loadPlayerStats, _PlayerStats, RawPlayerStats } from './entities/PlayerStats'
import Summoner, { RawSummoner } from './entities/Summoner'

import asyncMapOverArrayInChunks from './utils/generic/asyncMapOverArrayInChunks'
import range from './utils/generic/range'

import MatchResponseHelper from './utils/response/MatchResponseHelper'

import LeagueKaynHelper from './utils/kayn-dependent/LeagueKaynHelper'
import MatchlistKaynHelper from './utils/kayn-dependent/MatchlistKaynHelper'
import { MatchV3MatchDto } from 'kayn/typings/dtos';

const LEAGUE_QUEUE = 'RANKED_SOLO_5x5'

// Local Helpers

// processMatch is a mutating function dependent on the PlayerStats class.
const processMatch = (playerStats: _PlayerStats) => (match: MatchV3MatchDto) => {
    const summonerID = playerStats.summonerID
    const data = MatchResponseHelper.getChampionWin(match, summonerID)
    if (!data) return
    const { didWin, championID, gameID } = data
    if (playerStats.containsChampion(championID!)) {
        playerStats.editExistingChampion(championID!, didWin, gameID!)
    } else {
        playerStats.pushChampion(ChampionStats(championID!, didWin), gameID!)
    }
}

const inPlatform = (region: string) => ({ platformId: platformID }: MatchV3MatchDto) =>
    platformID!.toLowerCase() === asPlatformID(region)

const storePlayerStats = (summonerId: number, json: RawPlayerStats) =>
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

const getPlayer = (summonerId: number) => Stats.findOne({ summonerId })

export enum Modes {
    Update, BruteForceAll, SequentialAll
}

const main = async (mode = Modes.BruteForceAll) => {
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

    const tryCatchGetPlayerStats = async (summonerId: number, region: string) => {
        try {
            const player: any = await getPlayer(summonerId)
            return loadPlayerStats(player)
        } catch (ex) {
            return PlayerStats(summonerId, region)
        }
    }

    const makeOne = async (summonerID: number, accountID: number, region: string) => {
        console.log('Processing:', summonerID, accountID, region)
        const playerStats = await tryCatchGetPlayerStats(summonerID, region) // This is named `fullListOfMatches` because it's a list of the match
        // objects, not matchlist objects.
        const fullListOfMatches = (await MatchlistKaynHelper.getEntireMatchlist(
            kayn,
        )(accountID, region))!.filter(
            (el: MatchV3MatchDto) =>
                inPlatform(region)(el) &&
                playerStats.doesNotContainMatch(el.gameId!),
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

    const makeStats = async (rank: string, region: string, summoners: RawSummoner[]) => {
        const summonersChunkSize = summoners.length / 4

        await asyncMapOverArrayInChunks(
            summoners,
            summonersChunkSize,
            async ({ id: summonerID, accountID }: RawSummoner) => {
                try {
                    await makeOne(summonerID, accountID, region)
                } catch (exception) {
                    console.error(exception)
                }
            },
        )

        return true
    }

    const processStatsInChunks = async (rank: string, region: string) => {
        const league = await (kayn as any)[rank].list(LEAGUE_QUEUE).region(region)
        const promises: Promise<RawSummoner>[] = league.entries.map(LeagueKaynHelper.leagueEntryToSummoner(kayn)(region))
        const summoners = await Promise.all(
            promises
        )
        const len = summoners.length
        const chunkSize = 20
        for (let i = 0; i < len; i += chunkSize) {
            console.log('======')
            console.log('starting:', rank, region, i, i + chunkSize)
            console.log('======')
            try {
                let sliceToProcess: RawSummoner[] = summoners.slice(i, i + chunkSize)
                if (mode === Modes.BruteForceAll) {
                    // pass
                } else if (mode === Modes.Update) {
                    // async filter not possible btw so just gonna use map
                    const summonersNotInDatabase = (await Promise.all(sliceToProcess.map(async (summoner) => {
                        const count = await Stats.count({ summonerId: summoner.id }).exec()
                        return (count === 0) ? summoner : undefined
                    }))).filter(Boolean)
                    sliceToProcess = (summonersNotInDatabase as RawSummoner[])
                }
                await makeStats(rank, region, sliceToProcess)
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
    const challengersChunkSize = mode !== Modes.SequentialAll ? 11 : 1
    const mastersChunkSize = mode !== Modes.SequentialAll ? 4 : 1
    const processChunk = async (rank: string, chunk: string[]) =>
        Promise.all(chunk.map(r => processStatsInChunks(rank, (REGIONS as any)[r])))
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

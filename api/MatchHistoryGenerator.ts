require('dotenv').config('./.env')

import kayn from './kayn'
// @ts-ignore
import RegionHelper from 'kayn/dist/lib/Utils/RegionHelper'

const { asPlatformID } = RegionHelper

import { getStaticChampionByName } from './getStaticChampion'
import MatchResponseHelper from './utils/response/MatchResponseHelper'
import { MatchV4MatchDto } from 'kayn/typings/dtos'
import { Player } from './mongodb'
import { Player as PlayerType } from './models'

const findPlayers = async (ranks: string[], regions: string[]): Promise<any> =>
    new Promise((resolve, reject) => {
        Player.find(
            {
                rank: { $in: ranks.map(r => r.charAt(0).toLowerCase()) },
                region: { $in: regions },
            },
            (err, docs) => {
                if (err) return reject(err)
                if (docs)
                    return resolve((docs as any).map(({ _doc }: any) => _doc))
            },
        )
    })

const processMatch = (match: MatchV4MatchDto, summonerId: string) => {
    // kda, summoners, champ that they were against, did they win?
    return MatchResponseHelper.getMatchInfoForSummoner(match, summonerId)
}

interface MatchHistoryItem {
    accountId: string
    name: string
    summonerId: string
    gameId: number
    championId: number
    timestamp: number
    role: string
    platformId: string
    region: string
}

const getRole = (role: string, lane: string): string | null => {
    if (role === 'SOLO' && lane === 'TOP') {
        return 'TOP'
    } else if (role === 'NONE' && lane === 'JUNGLE') {
        return 'JUNGLE'
    } else if (role === 'SOLO' && lane === 'MID') {
        return 'MID'
    } else if (role === 'DUO_CARRY' && lane === 'BOTTOM') {
        return 'BOT_CARRY'
    } else if (role === 'DUO_SUPPORT' && lane === 'BOTTOM') {
        return 'BOT_SUPPORT'
    } else {
        return null
    }
}

const processPlayers = async (
    players: PlayerType[],
    championId: number,
    roleNumbers: number[],
) => {
    const playersWithChampIds = players
        .map(({ champ, ...rest }) => ({
            ...rest,
            championId: getStaticChampionByName(champ).id!,
        }))
        .filter(el => el.championId === championId)

    const payload: MatchHistoryItem[] = (await Promise.all(
        playersWithChampIds.map(async ({ id, championId, region }) => {
            const { accountId, name } = await kayn.Summoner.by
                .id(id)
                .region(region)
            const { matches } = await kayn.Matchlist.by
                .accountID(accountId!)
                .query({
                    champion: championId,
                    queue: 420,
                    beginIndex: 0,
                    endIndex: 20,
                })
                .region(region)
            return (matches as any)
                .map(
                    ({
                        gameId,
                        champion,
                        timestamp,
                        role,
                        lane,
                        platformId,
                    }: {
                        gameId: number
                        champion: number
                        timestamp: number
                        role: string
                        lane: string
                        platformId: string
                    }) => ({
                        accountId,
                        name,
                        summonerId: id,
                        gameId,
                        championId: champion,
                        timestamp,
                        role: getRole(role, lane),
                        platformId,
                        region,
                    }),
                )
                .filter(
                    ({
                        role,
                        platformId,
                        region,
                    }: {
                        role: string | null
                        platformId: string
                        region: string
                    }) => {
                        // Ignore matches not in user's current region.
                        if (platformId.toLowerCase() !== asPlatformID(region)) {
                            return false
                        }
                        if (role === 'TOP') {
                            return roleNumbers.includes(1)
                        } else if (role === 'JUNGLE') {
                            return roleNumbers.includes(2)
                        } else if (role === 'MID') {
                            return roleNumbers.includes(3)
                        } else if (role === 'BOT_CARRY') {
                            return roleNumbers.includes(4)
                        } else if (role === 'BOT_SUPPORT') {
                            return roleNumbers.includes(5)
                        } else {
                            // console.log('My code is wrong:', role, lane)
                            return false
                        }
                    },
                )
        }),
    ))
        .reduce((t, c) => t.concat(c), [])
        .sort(
            (a: MatchHistoryItem, b: MatchHistoryItem) =>
                b.timestamp - a.timestamp,
        )
        .slice(0, 100)

    const res = await Promise.all(
        payload.map(async ({ gameId, region, summonerId, ...rest }) => ({
            gameId,
            region,
            summonerId,
            ...rest,
            ...processMatch(
                await kayn.Match.get(gameId).region(region),
                summonerId,
            ),
        })),
    )

    return res
}

const main = async (
    ranks: string[],
    regions: string[],
    championId: number,
    roleNumbers: number[],
) => {
    const players = await findPlayers(ranks, regions)
    return await processPlayers(players, championId, roleNumbers)
}

export default main

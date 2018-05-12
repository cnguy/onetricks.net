require('dotenv').config('./.env')

import kayn from './kayn'
// @ts-ignore
import RegionHelper from 'kayn/dist/lib/Utils/RegionHelper'

const { asPlatformID } = RegionHelper

import { getStaticChampionByName } from './getStaticChampion'
import MatchResponseHelper from './utils/response/MatchResponseHelper'
import { MatchV3MatchDto } from 'kayn/typings/dtos';
import { MongoError } from 'mongodb';
import { Player } from './mongodb';
import { Player as PlayerType } from './models';

const findPlayers = async (ranks: string[], regions: string[]): Promise<any> =>
    new Promise((resolve, reject) => {
        Player.find(
            {
                rank: { $in: ranks.map(r => r.charAt(0).toLowerCase()) },
                region: { $in: regions },
            },
            (err, docs) => {
                if (err) return reject(err)
                if (docs) return resolve((docs as any).map(({ _doc }: any) => _doc))
            },
        )
    })

const processMatch = (match: MatchV3MatchDto, summonerId: number) => {
    // kda, summoners, champ that they were against, did they win?
    return MatchResponseHelper.getMatchInfoForSummoner(match, summonerId)
}

interface MatchHistoryItem {
    accountId: number,
    name: string,
    summonerId: number,
    gameId: number,
    championId: number,
    timestamp: number,
    role: string,
    lane: string,
    platformId: string,
    region: string,
}

const processPlayers = async (players: PlayerType[], championId: number, roleNumbers: number[]) => {
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
                            gameId: number,
                            champion: number,
                            timestamp: number,
                            role: string,
                            lane: string,
                            platformId: string,
                        }) => ({
                            accountId,
                            name,
                            summonerId: id,
                            gameId,
                            championId: champion,
                            timestamp,
                            role,
                            lane,
                            platformId,
                            region,
                        }),
            )
                .filter(({ role, lane, platformId, region }: { role: string, lane: string, platformId: string, region: string }) => {
                    // Ignore matches not in user's current region.
                    if (platformId.toLowerCase() !== asPlatformID(region)) {
                        return false
                    }
                    if (role === 'SOLO' && lane === 'TOP') {
                        return roleNumbers.includes(1)
                    } else if (role === 'NONE' && lane === 'JUNGLE') {
                        return roleNumbers.includes(2)
                    } else if (role === 'SOLO' && lane === 'MID') {
                        return roleNumbers.includes(3)
                    } else if (role === 'DUO_CARRY' && lane === 'BOTTOM') {
                        return roleNumbers.includes(4)
                    } else if (role === 'DUO_SUPPORT' && lane === 'BOTTOM') {
                        return roleNumbers.includes(5)
                    } else {
                        // console.log('My code is wrong:', role, lane)
                        return false
                    }
                })
        }),
    ))
        .reduce((t, c) => t.concat(c), [])
        .sort((a: MatchHistoryItem, b: MatchHistoryItem) => b.timestamp - a.timestamp)
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

const main = async (ranks: string[], regions: string[], championId: number, roleNumbers: number[]) => {
    const players = await findPlayers(ranks, regions)
    return await processPlayers(players, championId, roleNumbers)
}

export default main

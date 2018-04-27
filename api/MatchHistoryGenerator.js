require('dotenv').config('./.env')

import kayn from './kayn'
import mongoose from 'mongoose'
require('./models')
const PLAYER_SCHEMA_NAME = 'Player'
const Player = mongoose.model(PLAYER_SCHEMA_NAME)
import RegionHelper from 'kayn/dist/lib/Utils/RegionHelper'
const { asPlatformID } = RegionHelper

import { getStaticChampionByName } from './getStaticChampion'
import MatchResponseHelper from './MatchResponseHelper'

if (process.env.NODE_ENV === 'development') {
    mongoose.connect('mongodb://mongo/one-tricks')
} else if (process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.MONGO_URI)
} else {
    throw new Error('.env file is missing NODE_ENV environment variable.')
}

const findPlayers = async (ranks, regions) => {
    return new Promise((resolve, reject) => {
        Player.find(
            {
                rank: { $in: ranks.map(r => r.charAt(0).toLowerCase()) },
                region: { $in: regions },
            },
            (err, docs) => {
                if (err) return reject(err)
                if (docs) return resolve(docs.map(({ _doc }) => _doc))
            },
        )
    })
}

const processMatch = (match, summonerId) => {
    // kda, summoners, champ that they were against, did they win?
    return MatchResponseHelper.getMatchInfoForSummoner(match, summonerId)
}

const processPlayers = async (players, championId, roleNumbers) => {
    const playersWithChampIds = players
        .map(({ champ, ...rest }) => ({
            ...rest,
            championId: parseInt(getStaticChampionByName(champ).id),
        }))
        .filter(el => el.championId === parseInt(championId))

    const payload = (await Promise.all(
        playersWithChampIds.map(async ({ id, championId, region }) => {
            const { accountId, name } = await kayn.Summoner.by
                .id(id)
                .region(region)
            const { matches } = await kayn.Matchlist.by
                .accountID(accountId)
                .query({
                    champion: championId,
                    queue: 420,
                    beginIndex: 0,
                    endIndex: 20,
                })
                .region(region)
            return matches
                .map(
                    ({
                        gameId,
                        champion,
                        timestamp,
                        role,
                        lane,
                        platformId,
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
                .filter(({ role, lane, platformId, region }) => {
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
        .sort((a, b) => b.timestamp - a.timestamp)
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

const main = async (ranks, regions, championId, roleNumbers) => {
    const players = await findPlayers(ranks, regions)
    return await processPlayers(players, championId, roleNumbers)
}

export default main

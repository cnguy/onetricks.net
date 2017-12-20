require('dotenv').config('../.env');

import { Kayn, REGIONS, RedisCache, METHOD_NAMES } from 'kayn';
const mongoose = require('mongoose');
require('../models');
const PLAYER_SCHEMA_NAME = 'Player';
const Player = mongoose.model(PLAYER_SCHEMA_NAME);

const TARGET_QUEUE = 'RANKED_SOLO_5x5';

if (process.env.NODE_ENV === 'development') {
    mongoose.connect(process.env.LOCAL_MONGO_URL);
} else if (process.env.NODE_ENV === 'production') {
    mongoose.connect(
        `mongodb://${process.env.MONGO_USER}:${
            process.env.MONGO_PASS
        }@ds161029.mlab.com:61029/${process.env.MONGO_USER}`,
    );
} else {
    throw new Error('.env file is missing NODE_ENV environment variable.');
}

const kayn = Kayn()({
    debugOptions: {
        isEnabled: true,
        // showKey: true,
    },
    requestOptions: {
        numberOfRetriesBeforeAbort: 1,
    },
    cacheOptions: {
        cache: new RedisCache(),
        ttls: {
            [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID]: 1000 * 60 * 60 * 60,
            [METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID]: 1000 * 60 * 60 * 60,
            // [METHOD_NAMES.LEAGUE.GET_CHALLENGER_LEAGUE]: 1000 * 60 * 60 * 24,
            // [METHOD_NAMES.LEAGUE.GET_MASTER_LEAGUE]: 1000 * 60 * 60 * 24,
            [METHOD_NAMES.MATCH.GET_RECENT_MATCHLIST]: 1000 * 60 * 60 * 60,
            [METHOD_NAMES.MATCH.GET_MATCH]:
                1000 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 60,
            [METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID]: 9999999999,
            [METHOD_NAMES.CHAMPION.GET_CHAMPIONS]: 9999999999,
        },
    },
});

const regionsCompleted = {
    challengers: [],
    masters: [],
};

// temp
const isOneTrick = (otGames, total) => otGames / total >= 0.45;
// 0.45 works for accurate stats + large number of games

const getLeagueByRank = async (region, rank) => {
    if (rank === 'challengers') {
        return kayn.Challenger.list(TARGET_QUEUE).region(region);
    }
    if (rank === 'masters') {
        return kayn.Master.list(TARGET_QUEUE).region(region);
    }
    throw new Error('Parameter `rank` is not correct.');
};

import jsonfile from 'jsonfile';
const stats = jsonfile.readFileSync('./stats.json').players;
/**
 * getStats closes over stats, providing a way for us to find a particular summoner
 * within the stats.json file as if we're making a call to the old stats endpoint.
 * @param {number} summonerID - The summoner id to look for.
 * @returns {object} a stats object or `undefined` if not found.
 */
const getStats = summonerID =>
    stats.find(p => parseInt(p.summonerId) === parseInt(summonerID));

/**
 * createOneTrick products the DTO that will be stored in our MongoDB database.
 * @param {number} id - The summoner ID.
 * @param {number} wins - The number of wins on the champion being processed.
 * @param {number} losses - The number of losses on the champion being processed.
 * @param {object} champData - The static champion DTO returned by the API.
 * @returns {object} a one trick DTO that fits into our MongoDB Player Schema.
 */
const createOneTrick = (id, wins, losses, champData) => {
    // Put all bandaid fixes here.
    if (champData && champData.key === 'MonkeyKing') {
        return {
            champ: 'Wukong',
            id,
            wins,
            losses,
        };
    } else if (champData) {
        return {
            champ: champData.key,
            id,
            wins,
            losses,
        };
    }
    throw new Error('createOneTrick somehow failed.');
};

/**
 * clearsPlayerInDB removes all one tricks from the database given a rank and region.
 * This is an async/awaitable wrapper function to prevent callback hell.
 * @param {string} rank - 'challengers' or 'masters'.
 * @param {string} region
 */
const clearPlayersInDB = async (rank, region) => {
    return new Promise((resolve, reject) => {
        Player.collection.remove(
            {
                rank: rank.charAt(0),
                region,
            },
            err => {
                if (err) reject(err);
                else resolve(true);
            },
        );
    });
};

/**
 * insertPlayersIntoDB inserts a set of one tricks into the database.
 * @param {[]object} payload - An object of one trick DTO's.
 * @param {string} region
 * @param {string} regionsCompleted - Helper array to show what regions have been processed.
 */
const insertPlayersIntoDB = async (payload, region, rank) => {
    return new Promise((resolve, reject) => {
        const count = payload.reduce((total, val) => total + (val === region), 0)
        if (count >= 2 || payload.length === 0) resolve();
        
        Player.collection.insert(payload, (err, docs) => {
            if (err) {
                throw new Error(err);
            }
            console.log(
                `${payload.length} players were successfully stored in ${region}, ${rank}.`,
            );
            console.log(rank);
            regionsCompleted[rank].push(region);
            regionsCompleted[rank].sort();
            console.log(regionsCompleted);
            resolve(true);
        });
    });
};

/**
 * generate generates all the one tricks given a combination of rank and region.
 * @param {string} rank - This should work with getLeagueByRank. (Either 'challengers' or 'masters').
 * @param {string} region - An abbreviated region ('na1', 'euw', etc). Use `REGIONS` from `kayn`.
 */
async function generate(rank, region) {
    const oneTricks = {};

    let numOfOneTricksLeft = 0;
    let done = false;

    const league = await getLeagueByRank(region, rank);
    let countdown = league.entries.length;

    console.log('countdown:', countdown, 'for', region, rank);

    await Promise.all(
        league.entries.map(async player => {
            const { wins, losses } = player;
            const totalGames = wins + losses;

            const playerStats = getStats(player.playerOrTeamId, region);
            if (!playerStats) {
                return;
            }
            --countdown;
            console.log(
                region,
                `-COUNTERS: (${countdown},${numOfOneTricksLeft})`,
            );

                for (const champStats of playerStats.champions) {
                    const {
                        totalSessionsPlayed,
                        wins: totalSessionsWon,
                        losses: totalSessionsLost,
                    } = champStats.stats;

                    if (isOneTrick(totalSessionsPlayed, totalGames)) {
                        const champId = champStats.id;
                        if (champId !== 0) {
                            const champData = await kayn.Static.Champion.get(
                                champId,
                            );
                            numOfOneTricksLeft += 1;
                            const { summonerId } = playerStats;
                            oneTricks[summonerId] = createOneTrick(
                                summonerId,
                                wins,
                                losses,
                                champData,
                            );
    
                            console.log(champData.key, 'detected');
    
                            const summoner = await kayn.Summoner.by
                                .id(summonerId)
                                .region(region);
    
                            console.log(`checking ${summonerId}`);
    
                            oneTricks[summonerId].name = summoner.name;
    
                            numOfOneTricksLeft -= 1;
    
                            console.log(
                                region,
                                `COUNTERS-: (${countdown},${numOfOneTricksLeft})`,
                            );
    
                            if (
                                countdown === 0 &&
                                numOfOneTricksLeft === 0 &&
                                !done
                            ) {
                                const payload = Object.keys(oneTricks).map(key => ({
                                    ...oneTricks[key],
                                    ...{
                                        rank: rank.charAt(0),
                                        region,
                                    },
                                }));
    
                                // Possible errors being ignored here.
                                console.log('clearing', rank, region);
                                await clearPlayersInDB(rank.charAt(0), region);
                                console.log('finished clearing', rank, region);
                                console.log('inserting', rank, region);
                                console.log(payload);
                                done = await insertPlayersIntoDB(
                                    payload,
                                    region,
                                    rank,
                                );
                                console.log('finished inserting', rank, region);
                                
                                console.log('returning', rank, region);
                                return done;
                            }
                        }
                        break; // if first champ shows proof of one trick
                    }
            }
        }),
    );
}

const main = async () => {
    const promises = [
        generate('challengers', REGIONS.NORTH_AMERICA),
        generate('masters', REGIONS.NORTH_AMERICA),
        generate('challengers', REGIONS.KOREA),
        generate('masters', REGIONS.KOREA),
        generate('challengers', REGIONS.EUROPE_WEST),
        generate('masters', REGIONS.EUROPE_WEST),
        generate('challengers', REGIONS.EUROPE),
        generate('masters', REGIONS.EUROPE),
        generate('challengers', REGIONS.BRAZIL),
        generate('masters', REGIONS.BRAZIL),
        generate('challengers', REGIONS.OCEANIA),
        generate('masters', REGIONS.OCEANIA),
        generate('challengers', REGIONS.JAPAN),
        generate('masters', REGIONS.JAPAN),
        generate('challengers', REGIONS.LATIN_AMERICA_NORTH),
        generate('masters', REGIONS.LATIN_AMERICA_NORTH),
        generate('challengers', REGIONS.LATIN_AMERICA_SOUTH),
        generate('masters', REGIONS.LATIN_AMERICA_SOUTH),
        generate('challengers', REGIONS.TURKEY),
        generate('masters', REGIONS.TURKEY),
        generate('challengers', REGIONS.RUSSIA),
        generate('masters', REGIONS.RUSSIA),
    ];

    await Promise.all(promises);
    console.log(promises);
};

try {
    main();
} catch (exception) {
    console.error(exception);
}

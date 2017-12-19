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
        isEnabled: false,
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
            [METHOD_NAMES.LEAGUE.GET_CHALLENGER_LEAGUE]: 1000 * 60 * 60 * 24,
            [METHOD_NAMES.LEAGUE.GET_MASTER_LEAGUE]: 1000 * 60 * 60 * 24,
            [METHOD_NAMES.MATCH.GET_RECENT_MATCHLIST]: 1000 * 60 * 60 * 60,
            [METHOD_NAMES.MATCH.GET_MATCH]:
                1000 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 60,
            [METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID]: 9999999999,
            [METHOD_NAMES.CHAMPION.GET_CHAMPIONS]: 9999999999,
        },
    },
});

const regionsCompleted = [];

// temp
const isOneTrick = (otGames, total) => otGames / total >= 0.25;
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

const getStats = (summonerID, region) => {
    return stats.find(p => parseInt(p.summonerId) === parseInt(summonerID));
}; // && p.region === region);

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
                        if (champData && champData.key === 'MonkeyKing') {
                            oneTricks[summonerId] = {
                                champ: 'Wukong',
                                id: summonerId,
                                wins: totalSessionsWon,
                                losses: totalSessionsLost,
                            };
                        } else if (champData) {
                            oneTricks[summonerId] = {
                                champ: champData.key,
                                id: summonerId,
                                wins: totalSessionsWon,
                                losses: totalSessionsLost,
                            };
                        }

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
                            const final = [];

                            for (const key of Object.keys(oneTricks)) {
                                final.push({
                                    ...oneTricks[key],
                                    ...{
                                        rank: rank.charAt(0),
                                        region,
                                    },
                                });
                            }

                            Player.collection.remove(
                              {
                                  rank: rank.charAt(0),
                                  region,
                              },
                              err => {
                                  if (err) {
                                      console.log(err);
                                  }
                                  if (!err) {
                                      if (final.length > 0) {
                                          const count = final.reduce(
                                              (total, val) =>
                                                  total + (val === region),
                                              0,
                                          );

                                          if (count < 2) {
                                              Player.collection.insert(
                                                  final,
                                                  (err, docs) => {
                                                      if (err) {
                                                          console.log(err);
                                                      } else {
                                                          console.log(
                                                              `${
                                                                  final.length
                                                              } players were successfully stored in ${region}.`,
                                                          );
                                                          regionsCompleted.push(
                                                              region,
                                                          );
                                                          console.log(
                                                              regionsCompleted.sort(),
                                                          );
                                                          console.log(
                                                              regionsCompleted.length,
                                                          );
                                                          done = true;
                                                          return done;
                                                      }
                                                  },
                                              );
                                          }
                                      }
                                  }
                              },
                          );

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
};

try {
    main();
} catch (exception) {
    console.error(exception);
}

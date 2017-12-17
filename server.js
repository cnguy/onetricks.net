/* eslint-disable no-restricted-syntax */
const express = require('express');

const app = express();
const compression = require('compression');
app.use(compression());

require('dotenv').config();

const mongoose = require('mongoose');
require('./models');

const Player = mongoose.model('Player');

// mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds161029.mlab.com:61029/${process.env.MONGO_USER}`);
mongoose.connect(process.env.LOCAL_MONGO_URL);

app.set('port', (process.env.PORT || 3001));

import { Kayn, REGIONS, METHOD_NAMES, RedisCache, } from 'kayn';

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
          [METHOD_NAMES.LEAGUE.GET_CHALLENGER_LEAGUE]:
              1000 * 60 * 60 * 24,
          [METHOD_NAMES.LEAGUE.GET_MASTER_LEAGUE]: 1000 * 60 * 60 * 24,
          [METHOD_NAMES.MATCH.GET_RECENT_MATCHLIST]: 1000 * 60 * 60 * 60,
          [METHOD_NAMES.MATCH.GET_MATCH]:
              1000 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 60,
          [METHOD_NAMES.STATIC.GET_CHAMPION_BY_ID]: 9999999999,
          [METHOD_NAMES.CHAMPION.GET_CHAMPIONS]: 9999999999,
      },
  },
});

// const KindredAPI = require('kindred-api');


// const k = new KindredAPI.Kindred({
//   key: process.env.RIOT_API_KEY,
//   defaultRegion: KindredAPI.REGIONS.NORTH_AMERICA,
//   debug: true,
//   limits: KindredAPI.LIMITS.PROD,
//   spread: true,
//   retryOptions: {
//     auto: true,
//     numberOfRetriesBeforeBreak: 3,
//   },
//   cache: new KindredAPI.RedisCache(),
//   cacheTTL: {
//     CHAMPION: KindredAPI.TIME_CONSTANTS.MONTH,
//     CHAMPION_MASTERY: 1800,
//     CURRENT_GAME: KindredAPI.TIME_CONSTANTS.NONE,
//     FEATURED_GAMES: KindredAPI.TIME_CONSTANTS.NONE,
//     GAME: KindredAPI.TIME_CONSTANTS.HOUR,
//     LEAGUE: KindredAPI.TIME_CONSTANTS.SIX_HOURS,
//     STATIC: KindredAPI.TIME_CONSTANTS.MONTH,
//     STATUS: KindredAPI.TIME_CONSTANTS.NONE,
//     MATCH: KindredAPI.TIME_CONSTANTS.MONTH,
//     MATCH_LIST: 1800,
//     RUNES_MASTERIES: KindredAPI.TIME_CONSTANTS.WEEK,
//     STATS: KindredAPI.TIME_CONSTANTS.HOUR,
//     SUMMONER: KindredAPI.TIME_CONSTANTS.DAY,
//   },
// });

const ranks = {
  CHALLENGER: 'challengers',
  MASTER: 'masters',
};

var regionsCompleted = [];

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

const isOneTrick = (otGames, total) => (otGames / total >= 0.25);
// 0.45 works for accurate stats + large number of games

const getRank = {
  challengers: (region, cb) => {
    console.log('challengers:', region)
    kayn.Challenger.list('RANKED_SOLO_5x5').region(region).callback(cb)
  },
  masters: (region, cb) => {
    console.log('masters:', region)
    kayn.Master.list('RANKED_SOLO_5x5').region(region).callback(cb)
  },
}

import jsonfile from 'jsonfile';
const stats = jsonfile.readFileSync('./stats.json').players;
console.log('hello')
const getStats = (summonerID, region) => {
  return stats.find(p => parseInt(p.summonerId) === parseInt(summonerID))};// && p.region === region);

function update(rank, region) {
  (() => {
    console.log('begin');
    const oneTricks = {};
    // debug variables
    let numOfOneTricksLeft = 0;
    let countdown = 0;
    let done = false;

    (() => {
      getRank[rank](region, (err, players) => {
        // riotApi.get(urlGenerator[rank](region), (err, players) => {
        if (err) console.log('rankregionerr:', err);
        if (players && players.entries) {
          countdown = players.entries.length;
          console.log(countdown);

          for (const player of players.entries) {
            const { wins, losses } = player;
            const games = wins + losses;

              // riotApi.get(urlGenerator.stats(region)(player.playerOrTeamId), (err, playerStats) => {
                (() => {
                  let playerStats = getStats(player.playerOrTeamId, region);
                    if (err) {
                      console.log('playerorteamid err:', err);
                    }
    
                    if (playerStats) {
                      --countdown;
                      console.log(region, `-COUNTERS: (${countdown},${numOfOneTricksLeft})`);
    
                      for (const champStats of playerStats.champions) {
                        const { totalSessionsPlayed, wins: totalSessionsWon, losses: totalSessionsLost } = champStats.stats;
                        // TODO: CHECK SECOND CHAMP HERE
                        if (isOneTrick(totalSessionsPlayed, games)) {
                          const champId = champStats.id;
                          if (champId !== 0) {
                            (() => {
                              kayn.Static.Champion.get(champId).callback((err, champData) => {
                                // riotApi.get(urlGenerator.champion(region)(champId), (err, champData) => {
                                if (err) {
                                  console.log('regionchampid:', err);
                                }
    
                                if (champData) {
                                  numOfOneTricksLeft += 1;
                                  const { summonerId } = playerStats;
                                  if (champData && champData.key === 'MonkeyKing') {
                                    oneTricks[summonerId] = { champ: 'Wukong', id: summonerId, wins: totalSessionsWon, losses: totalSessionsLost };
                                  } else if (champData) {
                                    oneTricks[summonerId] = { champ: champData.key, id: summonerId, wins: totalSessionsWon, losses: totalSessionsLost };
                                  }
    
                                  console.log(champData.key + ' detected');
                                  (() => {
                                    kayn.Summoner.by.id(summonerId).region(region).callback((err, data) => {
                                      // riotApi.get(urlGenerator.summoner(region)(summonerId), (err, data) => {
                                      if (err) {
                                        console.log('summonnername:', err);
                                      }
    
                                      if (data) {
                                        console.log(`checking ${summonerId}`);
                                        // Storing the name could be meh in case they change it. But I want to save API calls. A few errors (1-2) are whatever considering that it'll reset every day.
                                        oneTricks[summonerId].name = data.name;
                                        // console.log(oneTricks);
    
                                        numOfOneTricksLeft -= 1;
                                        console.log(region, `COUNTERS-: (${countdown},${numOfOneTricksLeft})`);
    
                                        if (countdown === 0 && numOfOneTricksLeft === 0 && !done) {
                                          const final = [];
    
                                          for (const key of Object.keys(oneTricks)) {
                                            final.push(Object.assign({}, oneTricks[key], { rank: rank.charAt(0) }, { region }));
                                          }
                                          // TODO: update if duplicate already exists or name is diff
                                          (() => {
                                            Player.collection.remove({ rank: rank.charAt(0), region }, (err) => {
                                              if (err) console.log(err);
                                              if (!err) {
                                                // console.log(`removed docs from ${rank}, ${region}`);
    
                                                if (final.length > 0) {
                                                  const count = final.reduce((total, val) => total + (val === region), 0)
                                                  if (count < 2) {
                                                    Player.collection.insert(final, (err, docs) => {
                                                      if (err) {
                                                        console.log(err);
                                                      } else {
                                                        // console.log(docs);
                                                        // console.log(oneTricks)
                                                        console.log(`${final.length} players were successfully stored in ${region}.`)
                                                        regionsCompleted.push(region);
                                                        console.log(regionsCompleted.sort());
                                                        console.log(regionsCompleted.length);
                                                        done = true;
                                                        return;
                                                      }
                                                    });
                                                  }
                                                }
                                              }
                                              else console.log(err, 'couldn\'t remove');
                                            });
                                          })(final);
                                        }
                                      }
                                    });
                                  })(summonerId);
                                }
                              });
                            })(playerStats, champId, totalSessionsWon, totalSessionsLost);
                            break; // if first champ shows proof of 1trick
                          }
                        }
                      }
    
                      if (countdown === 0 && numOfOneTricksLeft === 0 && !done) {
                        const final = [];
    
                        for (const key of Object.keys(oneTricks)) {
                          final.push(Object.assign({}, oneTricks[key], { rank: rank.charAt(0) }, { region }));
                        }
                        // TODO: update if duplicate already exists or name is diff
                        (() => {
                          Player.collection.remove({ rank: rank.charAt(0), region }, (err) => {
                            if (err) console.log(err);
                            if (!err) {
                              // console.log(`removed docs from ${rank}, ${region}`);
                              if (final.length > 0) {
                                const count = final.reduce((total, val) => total + (val === region), 0)
                                if (count < 2) {
                                  Player.collection.insert(final, (err, docs) => {
                                    if (err) {
                                      console.log(err);
                                    } else {
                                      // console.log(docs);
                                      // console.log(oneTricks)
                                      console.log('$d players were successfully stored.', docs.length);
                                      console.log('done with' + region);
                                      regionsCompleted.push(region);
                                      console.log(regionsCompleted.sort());
                                      console.log(regionsCompleted.length);
                                      done = true;
                                      return;
                                    }
                                  });
                                }
                              }
                            }
                            else console.log(err, 'couldn\'t remove');
                          });
                        })(final);
                      }
                    }

                }

                )()
          }
        }
      });
    })();
  })();
}

app.get('/all', (req, res, next) => {
  const multiple = req.query.multiple || false;

  if (multiple) {
    const _regions = req.query.region.split(',') || null;

    if (regions) {
      Player.find({ region: { $in: _regions } }, (err, players) => {
        if (err) return next(err);
        res.json(players);
      });
    }
  } else {
    const region = req.query.region || null;

    if (region && region !== 'all') {
      Player.find({ region }, (err, players) => {
        if (err) return next(err);
        res.json(players);
      });
    } else {
      Player.find((err, players) => {
        if (err) return next(err);
        res.json(players);
      });
    }
  }
});

app.get('/masters', (req, res) => {
  const multiple = req.query.multiple || false;

  if (multiple) {
    const _regions = req.query.region.split(',') || null;

    if (regions) {
      Player.find({ region: { $in: _regions } }, (err, players) => {
        if (err) return next(err);
        res.json(players);
      });
    }
  }
  else {
    const region = req.query.region || null;

    if (region && region !== 'all') {
      Player.find({ rank: 'm', region }, (err, masters, next) => {
        if (err) return next(err);
        res.json(masters);
      });
    } else {
      Player.find({ rank: 'm' }, (err, masters, next) => {
        if (err) return next(err);
        res.json(masters);
      });
    }
  }
});

app.get('/challengers', (req, res) => {
  const multiple = req.query.multiple || false;

  if (multiple) {
    const _regions = req.query.region.split(',') || null;

    if (regions) {
      Player.find({ region: { $in: _regions } }, (err, players) => {
        if (err) return next(err);
        res.json(players);
      });
    }
  } else {
    const region = req.query.region || null;

    if (region && region !== 'all') {
      Player.find({ rank: 'c', region }, (err, challengers, next) => {
        if (err) return next(err);
        res.json(challengers);
      });
    } else {
      Player.find({ rank: 'c' }, (err, challengers, next) => {
        if (err) return next(err);
        res.json(challengers);
      });
    }
  }
});

app.get(`/${process.env.SECRET_URL}`, (req, res) => {
  console.log('let us try to update this bullshit');  
  update('challengers', REGIONS.NORTH_AMERICA);
  update('masters', REGIONS.NORTH_AMERICA);
  update('challengers', REGIONS.KOREA);
  update('masters', REGIONS.KOREA);
  update('challengers', REGIONS.EUROPE_WEST);
  update('masters', REGIONS.EUROPE_WEST);
  update('challengers', REGIONS.EUROPE);
  update('masters', REGIONS.EUROPE);
  update('challengers', REGIONS.BRAZIL);
  update('masters', REGIONS.BRAZIL);
  update('challengers', REGIONS.OCEANIA);
  update('masters', REGIONS.OCEANIA);
  update('challengers', REGIONS.JAPAN);
  update('masters', REGIONS.JAPAN);
  update('challengers', REGIONS.LATIN_AMERICA_NORTH);
  update('masters', REGIONS.LATIN_AMERICA_NORTH);
  update('challengers', REGIONS.LATIN_AMERICA_SOUTH);
  update('masters', REGIONS.LATIN_AMERICA_SOUTH);
  update('challengers', REGIONS.TURKEY);
  update('masters', REGIONS.TURKEY);
  update('challengers', REGIONS.RUSSIA);
  update('masters', REGIONS.RUSSIA);
});
// update('challengers', REGIONS.NORTH_AMERICA);
app.use((req, res, next) =>
  res.render('404', { status: 404, url: req.url }),
);

app.use((err, req, res, next) => {
  res.render('500', {
    status: err.status || 500,
    error: err,
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

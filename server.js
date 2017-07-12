/* eslint-disable no-restricted-syntax */
const express = require('express');

const app = express();
const compression = require('compression');
app.use(compression());

require('dotenv').config();

const mongoose = require('mongoose');
require('./models');

const Player = mongoose.model('Player');

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ds161029.mlab.com:61029/${process.env.MONGO_USER}`);

app.set('port', (process.env.PORT || 3001));

const regions = {
  BRAZIL: 'br',
  EUROPE: 'eune',
  EUROPE_WEST: 'euw',
  KOREA: 'kr',
  LATIN_AMERICA_NORTH: 'lan',
  LATIN_AMERICA_SOUTH: 'las',
  NORTH_AMERICA: 'na',
  OCEANIA: 'oce',
  RUSSIA: 'ru',
  TURKEY: 'tr',
  JAPAN: 'jp',
};

const KindredAPI = require('kindred-api');

const k = new KindredAPI.Kindred({
  key: process.env.RIOT_API_KEY,
  defaultRegion: KindredAPI.REGIONS.NORTH_AMERICA,
  debug: true,
  limits: KindredAPI.LIMITS.PROD,
  spread: true,
  retryOptions: {
    auto: true,
    numberOfRetriesBeforeBreak: 3,
  },
  cache: new KindredAPI.RedisCache(),
  cacheTTL: {
    CHAMPION: KindredAPI.TIME_CONSTANTS.MONTH,
    CHAMPION_MASTERY: 1800,
    CURRENT_GAME: KindredAPI.TIME_CONSTANTS.NONE,
    FEATURED_GAMES: KindredAPI.TIME_CONSTANTS.NONE,
    GAME: KindredAPI.TIME_CONSTANTS.HOUR,
    LEAGUE: KindredAPI.TIME_CONSTANTS.SIX_HOURS,
    STATIC: KindredAPI.TIME_CONSTANTS.MONTH,
    STATUS: KindredAPI.TIME_CONSTANTS.NONE,
    MATCH: KindredAPI.TIME_CONSTANTS.MONTH,
    MATCH_LIST: 1800,
    RUNES_MASTERIES: KindredAPI.TIME_CONSTANTS.WEEK,
    STATS: KindredAPI.TIME_CONSTANTS.HOUR,
    SUMMONER: KindredAPI.TIME_CONSTANTS.DAY,
  },
});

const ranks = {
  CHALLENGER: 'challengers',
  MASTER: 'masters',
};

var regionsCompleted = [];

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

const isOneTrick = (otGames, total) => (otGames / total >= 0.45);

const getRank = {
  challengers: (region, cb) => k.getChallengers({ region }, cb),
  masters: (region, cb) => k.getMasters({ region }, cb),
}

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

            (() => {
              // riotApi.get(urlGenerator.stats(region)(player.playerOrTeamId), (err, playerStats) => {
              k.getRankedStats({ id: +player.playerOrTeamId, region }, (err, playerStats) => {
                if (err) {
                  console.log('playerorteamid err:', err);
                  console.log(playerStats);
                }

                if (playerStats) {
                  --countdown;
                  console.log(region, `-COUNTERS: (${countdown},${numOfOneTricksLeft})`);

                  for (const champStats of playerStats.champions) {
                    const { totalSessionsPlayed, totalSessionsWon, totalSessionsLost } = champStats.stats;
                    // TODO: CHECK SECOND CHAMP HERE
                    if (isOneTrick(totalSessionsPlayed, games)) {
                      const champId = champStats.id;
                      if (champId !== 0) {
                        (() => {
                          k.getChampion({ id: champId, region }, (err, champData) => {
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
                                k.getSummoner({ id: summonerId, region }, (err, data) => {
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
                                            console.log(`removed docs from ${rank}, ${region}`);

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
                          console.log(`removed docs from ${rank}, ${region}`);
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
              });
            })(games);
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
  update('challengers', regions.NORTH_AMERICA);
  update('masters', regions.NORTH_AMERICA);
  update('challengers', regions.KOREA);
  update('masters', regions.KOREA);
  update('challengers', regions.EUROPE_WEST);
  update('masters', regions.EUROPE_WEST);
  update('challengers', regions.EUROPE);
  update('masters', regions.EUROPE);
  update('challengers', regions.BRAZIL);
  update('masters', regions.BRAZIL);
  update('challengers', regions.OCEANIA);
  update('masters', regions.OCEANIA);
  update('challengers', regions.JAPAN);
  update('masters', regions.JAPAN);
  update('challengers', regions.LATIN_AMERICA_NORTH);
  update('masters', regions.LATIN_AMERICA_NORTH);
  update('challengers', regions.LATIN_AMERICA_SOUTH);
  update('masters', regions.LATIN_AMERICA_SOUTH);
  update('challengers', regions.TURKEY);
  update('masters', regions.TURKEY);
  update('challengers', regions.RUSSIA);
  update('masters', regions.RUSSIA);
});

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

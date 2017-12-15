import { Kayn, REGIONS, METHOD_NAMES, RedisCache } from 'kayn';

import mongoose from 'mongoose';

import cloneDeep from 'lodash.cloneDeep';

import jsonfile from 'jsonfile';

import ChampionStats from './entities/ChampionStats';
import OneTrick from './entities/OneTrick';
import PlayerStats from './entities/PlayerStats';
import Summoner from './entities/Summoner';

const mockBaseStats = jsonfile.readFileSync('stats.json');
console.log(mockBaseStats.players.length);

// Helpers
const findParticipantIdentity = (match, summonerID) =>
    match.participantIdentities.find(
        ({ player }) => player.summonerId === parseInt(summonerID),
    );
const findParticipant = (match, participantID) =>
    match.participants.find(
        ({ participantId }) => participantId === participantID,
    );

const didTeamWin = (match, teamID) =>
    match.teams.find(({ teamId }) => teamId === teamID).win === 'Win';

const leagueEntryToSummoner = (kayn, region) => async ({
    playerOrTeamId,
    playerOrTeamName,
}) =>
    Summoner(
        playerOrTeamId,
        playerOrTeamName,
        (await kayn.Summoner.by.id(playerOrTeamId).region(region)).accountId,
    ).asObject();

const matchlistToMatches = async (matchlist, kayn, region) =>
    Promise.all(
        matchlist.matches.map(async ({ gameId }) => {
            try {
                return await kayn.Match.get(gameId).region(region);
            } catch (ex) {
                return false;
            }
        }),
    );

const main = async () => {
    const kayn = Kayn()({
        debugOptions: {
            isEnabled: false,
            // showKey: true,
        },
        cacheOptions: {
            cache: new RedisCache(),
            ttls: {
                [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID]: 1000 * 60 * 60 * 60,
                [METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID]: 1000 * 60 * 60 * 60,
                [METHOD_NAMES.LEAGUE.GET_CHALLENGER_LEAGUE]:
                    1000 * 60 * 60 * 60,
                [METHOD_NAMES.LEAGUE.GET_MASTER_LEAGUE]: 1000 * 60 * 60 * 60,
                [METHOD_NAMES.MATCH.GET_RECENT_MATCHLIST]: 1000 * 60 * 60 * 60,
                [METHOD_NAMES.MATCH.GET_MATCH]: 1000 * 60 * 60 * 60 * 60 * 60,
            },
        },
    });
    // TODO: Make this work with multiple regions + the Master league.

    const fn = async region => {
        const challengerLeague = await kayn.Challenger.list(
            'RANKED_SOLO_5x5',
        ).region(region);
        const mastersLeague = await kayn.Master.list('RANKED_SOLO_5x5').region(
            region,
        );

        const summoners = (await Promise.all(
            challengerLeague.entries.map(leagueEntryToSummoner(kayn, region)),
        )).concat(
            await Promise.all(
                mastersLeague.entries.map(leagueEntryToSummoner(kayn, region)),
            ),
        );
        let numberOfPlayers = summoners.length;
        console.log('going to process:', numberOfPlayers);
        const allStats = [];
        mockBaseStats.players.forEach(player => {
            const p = PlayerStats();
            p.load(player);
            allStats.push(p);
        });

        const playerExists = id => allStats.some(el => el.summonerID === id);
        const getPlayer = (id, region) =>
            allStats.find(el => el.summonerID === id && el.region === region);
        let i = 0; // for debugging

        // Process stats for each summoner.
        await Promise.all(
            summoners.map(async ({ id: summonerID, accountID }) => {
                const matchlist = await kayn.Matchlist.Recent.by
                    .accountID(accountID)
                    .region(region);
                const playerStats = playerExists(summonerID)
                    ? getPlayer(summonerID, region)
                    : PlayerStats(summonerID, region);
                const trimmedMatchlist = cloneDeep(matchlist);

                trimmedMatchlist.matches = trimmedMatchlist.matches.filter(
                    match => !playerStats.containsMatch(match.gameId),
                );
                // const trimmedMatchlist = matchlist.matches.filter(match => {
                //     return !playerStats.containsMatch(match.gameId);
                // })

                if (
                    trimmedMatchlist.matches.some(el => el.gameId === 643506234)
                ) {
                    // Some matches return 404 for some reason.
                    // This is because they're from a different region.
                    console.log('this matchlist exists');
                }
                // console.log(
                //     'trimmed match list......:',
                //     trimmedMatchlist.matches.length,
                // );
                // console.log('matchlist...:', matchlist.matches.length);

                // map(match => {
                //     if (playerStats.containsMatch(match.gameId)) {

                //     }
                // })
                // const matches = await matchlistToMatches(matchlist, kayn, region);
                const matches = (await matchlistToMatches(
                    trimmedMatchlist,
                    kayn,
                    region,
                )).filter(match => match);

                // Process matches in matchlist.
                matches.forEach(match => {
                    if (typeof match === 'boolean') {
                        console.log('still a boolean');
                    }
                    const { gameId: gameID } = match;
                    // console.log(gameId);

                    // if (playerStats.containsMatch(gameID)) {
                    //     ++i;
                    //     return;
                    // }

                    const {
                        participantId: participantID,
                    } = findParticipantIdentity(match, summonerID);
                    const participant = findParticipant(match, participantID);
                    const { teamId: teamID } = participant;
                    const { championId: championID } = participant;
                    const { stats } = participant;
                    const didWin = didTeamWin(match, teamID);
                    if (playerStats.containsChampion(championID)) {
                        playerStats.editExistingChampion(
                            championID,
                            didWin,
                            gameID,
                        );
                    } else {
                        playerStats.pushChampion(
                            ChampionStats(championID, didWin),
                            gameID,
                        );
                    }
                    //console.log(++i);
                });
                if (!playerExists(summonerID)) allStats.push(playerStats);
                // console.log(--numberOfPlayers);
            }),
        );

        const json = {
            players: allStats.map(el => el.asObject()),
        };

        // mock
        console.log('writing to stats.json');
        jsonfile.writeFileSync('stats.json', json);
        console.log('>> FINISHED');
        console.log('reading stats.json');
        const myJson = jsonfile.readFileSync('stats.json');
        console.log('>> FINISHED');

        //jsonfile.writeFileSync('stats.json', json);
        /*
        console.log('done');
        // mock api request! :)*/
        const getStatsOfSummoner = id =>
            myJson.players.find(({ summonerId }) => id === summonerId);
        //console.log(getStatsOfSummoner(19770082));

        console.log(
            myJson.players.filter(({ summonerId }) => summonerId === 19770082),
        );
        // console.log('ignored:', i);
        console.log(allStats.length);
        // yes! :)
    };

    await fn(REGIONS.NORTH_AMERICA);
    await fn(REGIONS.EUROPE_WEST);
    await fn(REGIONS.EUROPE);
};

main();

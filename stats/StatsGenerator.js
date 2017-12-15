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

    const allStats = [];
    mockBaseStats.players.forEach(player => {
        const p = PlayerStats();
        p.load(player);
        allStats.push(p);
    });
    const playerExists = id => allStats.some(el => el.summonerID === id);

    // TODO: Is this unique?
    // Removed `region` property because players can transfer regions.
    const getPlayer = (id) =>
        allStats.find(el => el.summonerID === id);

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
    //     const playerExists = id => allStats.some(el => el.summonerID === id);
    // const getPlayer = (id, region) =>
    //     allStats.find(el => el.summonerID === id && el.region === region);

        // Process stats for each summoner.
        await Promise.all(
            summoners.map(async ({ id: summonerID, accountID }) => {
                const matchlist = await kayn.Matchlist.Recent.by
                    .accountID(accountID)
                    .region(region);
                // if (playerExists(summonerID) && getPlayer(summonerID, accountID) === undefined) {
                //     console.log('found the shithead', summonerID, accountID, region)
                // }

                const playerStats = playerExists(summonerID)
                    ? getPlayer(summonerID)
                    : PlayerStats(summonerID, region);
                const trimmedMatchlist = cloneDeep(matchlist);

                trimmedMatchlist.matches = trimmedMatchlist.matches.filter(
                    match => !playerStats.containsMatch(match.gameId),
                );

                const matches = (await matchlistToMatches(
                    trimmedMatchlist,
                    kayn,
                    region,
                )).filter(match => match);

                // Process matches in matchlist.
                matches.forEach(match => {
                    const { gameId: gameID } = match;

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
                });
                if (!playerExists(summonerID)) allStats.push(playerStats);
                console.log(--numberOfPlayers);
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

    await Promise.all(Object.keys(REGIONS).map(r => fn(REGIONS[r])));
};

main();

import { Kayn, REGIONS, METHOD_NAMES, RedisCache } from 'kayn';

import jsonfile from 'jsonfile';

import ChampionStats from './entities/ChampionStats';
import OneTrick from './entities/OneTrick';
import PlayerStats from './entities/PlayerStats';
import Summoner from './entities/Summoner';

const mockBaseStats = {
    players: [
        {
            summonerId: 19770082,
            champions: [
                {
                    id: 98,
                    stats: { wins: 1, losses: 0, totalSessionsPlayed: 1 },
                },
                {
                    id: 92,
                    stats: { wins: 2, losses: 5, totalSessionsPlayed: 7 },
                },
                {
                    id: 240,
                    stats: { wins: 1, losses: 2, totalSessionsPlayed: 3 },
                },
                {
                    id: 58,
                    stats: { wins: 0, losses: 1, totalSessionsPlayed: 1 },
                },
                {
                    id: 68,
                    stats: { wins: 1, losses: 0, totalSessionsPlayed: 1 },
                },
                {
                    id: 64,
                    stats: { wins: 2, losses: 0, totalSessionsPlayed: 2 },
                },
                {
                    id: 126,
                    stats: { wins: 0, losses: 1, totalSessionsPlayed: 1 },
                },
                {
                    id: 57,
                    stats: { wins: 1, losses: 0, totalSessionsPlayed: 1 },
                },
                {
                    id: 127,
                    stats: { wins: 0, losses: 1, totalSessionsPlayed: 1 },
                },
                {
                    id: 516,
                    stats: { wins: 0, losses: 1, totalSessionsPlayed: 1 },
                },
                {
                    id: 150,
                    stats: { wins: 1, losses: 0, totalSessionsPlayed: 1 },
                },
            ],
            matchesProcessed: [
                2670483986,
                2670455322,
                2670353451,
                2670233122,
                2670135394,
                2670081071,
                2670016512,
                2669979339,
                2669960909,
                2669681284,
                2669628753,
                2669626307,
                2669641148,
                2669616188,
                2669612901,
                2669578154,
                2669581642,
                2669515711,
                2669449345,
                2669437434,
            ],
        },
    ],
};

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

const leagueEntryToSummoner = kayn => async ({
    playerOrTeamId,
    playerOrTeamName,
}) =>
    Summoner(
        playerOrTeamId,
        playerOrTeamName,
        (await kayn.Summoner.by.id(playerOrTeamId)).accountId,
    ).asObject();

const matchlistToMatches = async (matchlist, kayn) =>
    Promise.all(matchlist.matches.map(({ gameId }) => kayn.Match.get(gameId)));

const main = async () => {
    const kayn = Kayn()({
        debugOptions: {
            isEnabled: false,
        },
        cacheOptions: {
            cache: new RedisCache(),
            ttls: {
                [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID]: 1000 * 60 * 60 * 60,
                [METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID]: 1000 * 60 * 60 * 60,
                [METHOD_NAMES.LEAGUE.GET_CHALLENGER_LEAGUE]:
                    1000 * 60 * 60 * 60,
                [METHOD_NAMES.MATCH.GET_RECENT_MATCHLIST]: 1000 * 60 * 60 * 60,
                [METHOD_NAMES.MATCH.GET_MATCH]: 1000 * 60 * 60 * 60 * 60 * 60,
            },
        },
    });
    // TODO: Make this work with multiple regions + the Master league.
    const league = await kayn.Challenger.list('RANKED_SOLO_5x5');
    const summoners = await Promise.all(
        league.entries.map(leagueEntryToSummoner(kayn)),
    );
    const allStats = [];
    const p = PlayerStats();
    p.load(mockBaseStats.players[0]);
    allStats.push(p);

    const playerExists = id => allStats.some(el => el.summonerID === id);
    const getPlayer = id => allStats.find(el => el.summonerID === id);
    let i = 0; // for debugging
    // TODO: How to use allStats as a starting point?

    // Process stats for each summoner.
    await Promise.all(
        summoners.map(async ({ id: summonerID, accountID }) => {
            const matchlist = await kayn.Matchlist.Recent.by.accountID(
                accountID,
            );
            const matches = await matchlistToMatches(matchlist, kayn);
            const playerStats = playerExists(summonerID)
                ? getPlayer(summonerID)
                : PlayerStats(summonerID);

            // Process matches in matchlist.
            matches.forEach(match => {
                const { gameId: gameID } = match;

                if (playerStats.containsMatch(gameID)) {
                    return;
                }

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
        }),
    );

    const json = {
        players: allStats.map(el => el.asObject()),
    };

    // mock
    //console.log('write');
    const myJson = jsonfile.readFileSync('stats.json');
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

    // yes! :)
};

main();

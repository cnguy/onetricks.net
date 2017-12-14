import { Kayn, REGIONS, METHOD_NAMES, RedisCache } from 'kayn';

import jsonfile from 'jsonfile';

import ChampionStats from './entities/ChampionStats';
import OneTrick from './entities/OneTrick';
import PlayerStats from './entities/PlayerStats';
import Summoner from './entities/Summoner';

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
    let i = 0; // for debugging

    // Process stats for each summoner.
    await Promise.all(
        summoners.map(async ({ id: summonerID, accountID }) => {
            const matchlist = await kayn.Matchlist.Recent.by.accountID(
                accountID,
            );
            const matches = await matchlistToMatches(matchlist, kayn);
            const playerStats = PlayerStats(summonerID);

            // Process matches in matchlist.
            matches.forEach(match => {
                const {
                    participantId: participantID,
                } = findParticipantIdentity(match, summonerID);
                const participant = findParticipant(match, participantID);
                const { teamId: teamID } = participant;
                const { championId: championID } = participant;
                const { stats } = participant;
                const { gameId: gameID } = match;
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
                console.log(++i);
                allStats.push(playerStats);
            });
        }),
    );

    const json = {
        players: allStats.map(el => el.asObject()),
    };

    // mock
    console.log('write');
    const myJson = jsonfile.readFileSync('stats.json');
    console.log('done');
    // mock api request! :)
    const getStatsOfSummoner = id =>
        myJson.players.find(({ summonerId }) => id === summonerId);
    console.log(getStatsOfSummoner(19770082));
    // yes! :)
};

main();

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

const platformIDs = {
    BRAZIL: 'br1',
    EUROPE: 'eun1',
    EUROPE_WEST: 'euw1',
    KOREA: 'kr',
    LATIN_AMERICA_NORTH: 'la1',
    LATIN_AMERICA_SOUTH: 'la2',
    NORTH_AMERICA: 'na1',
    NORTH_AMERICA_OLD: 'na',
    OCEANIA: 'oc1',
    RUSSIA: 'ru',
    TURKEY: 'tr1',
    JAPAN: 'jp1',
};
const regionKeys = Object.keys(REGIONS);
const asPlatformID = regionAbbr => platformIDs[regionKeys.find(eq(regionAbbr))];
const eq = v => k => REGIONS[k] === v;

// Helpers
const findParticipantIdentity = (match, summonerID) =>
    match.participantIdentities.find(({ player }) => {
        if (!player) {
            return;
        }
        return player.summonerId === parseInt(summonerID);
    });

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
                // This means that the match belongs to a different region (if 404).
                return false;
            }
        }),
    );

const main = async () => {
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
                [METHOD_NAMES.LEAGUE.GET_CHALLENGER_LEAGUE]:
                    1000 * 60 * 60 * 24,
                [METHOD_NAMES.LEAGUE.GET_MASTER_LEAGUE]: 1000 * 60 * 60 * 24,
                [METHOD_NAMES.MATCH.GET_MATCH]:
                    1000 * 60 * 60 * 60 * 60 * 60 * 60 * 60 * 60,
                [METHOD_NAMES.MATCH.GET_MATCHLIST]: 1000 * 60 * 60 * 24,
                [METHOD_NAMES.MATCH.GET_RECENT_MATCHLIST]: 1000 * 60 * 60 * 25,
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
    const getPlayer = id => allStats.find(el => el.summonerID === id);

    const fn = async region => {
        const challengerLeague = await kayn.Challenger.list(
            'RANKED_SOLO_5x5',
        ).region(region);
        const mastersLeague = await kayn.Master.list('RANKED_SOLO_5x5').region(
            region,
        );
        const summoners = (await Promise.all(
            challengerLeague.entries.map(leagueEntryToSummoner(kayn, region)),
            mastersLeague.entries.map(leagueEntryToSummoner(kayn, region)),
        )).reduce((prev, curr) => prev.concat(curr), []);

        const summonersChunkSize = summoners.length / 4;

        for (let i = 0; i < summoners.length; i += summonersChunkSize) {
            // Process stats for each summoner.
            await Promise.all(
                summoners
                    .slice(i, i + summonersChunkSize)
                    .map(async ({ id: summonerID, accountID }) => {
                        const matchlist = await kayn.Matchlist.by
                            .accountID(accountID)
                            .region(region)
                            .query({
                                queue: 420,
                                season: 9, // 7/8/9 is what we want rn.
                            });

                        const totalNumOfGames = matchlist.totalGames;

                        if (totalNumOfGames > 100) {
                            for (
                                let matchlistBeginIndex = 100;
                                matchlistBeginIndex < totalNumOfGames;
                                matchlistBeginIndex += 100
                            ) {
                                try {
                                    const m = await kayn.Matchlist.by
                                        .accountID(accountID)
                                        .region(region)
                                        .query({
                                            queue: 420,
                                            season: 9,
                                            beginIndex: matchlistBeginIndex,
                                            endIndex: matchlistBeginIndex + 100,
                                        });
                                    if (m.matches.length > 0) {
                                        matchlist.matches = matchlist.matches.concat(
                                            m.matches,
                                        );
                                    }
                                } catch (ex) {
                                    console.log('matchlist limit reached.');
                                    matchlistBeginIndex = 300;
                                    break;
                                }
                            }
                        }

                        // console.log(
                        //     'total number of matches:',
                        //     matchlist.matches.length,
                        //     totalNumOfGames,
                        // );

                        // Filter out matches that belong to a different platform
                        // than where the summoner currently resides.
                        matchlist.matches = matchlist.matches.filter(
                            m =>
                                m.platformId.toLowerCase() ===
                                asPlatformID(region),
                        );

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

                            const participantIdentity = findParticipantIdentity(
                                match,
                                summonerID,
                            );
                            if (!participantIdentity) return; // undefined edge case
                            const {
                                participantId: participantID,
                            } = participantIdentity;
                            const participant = findParticipant(
                                match,
                                participantID,
                            );
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
                            // console.log('MEM:', process.memoryUsage());
                        });
                        if (!playerExists(summonerID))
                            allStats.push(playerStats);
                    }),
            );
        }

        const json = {
            players: allStats.map(el => el.asObject()),
        };

        console.log('writing to stats.json', region);
        jsonfile.writeFileSync('stats.json', json);
        console.log('>> FINISHED');
        console.log('reading stats.json', region);
        const myJson = jsonfile.readFileSync('stats.json');
        console.log('>> FINISHED');
        const getStatsOfSummoner = id =>
            myJson.players.find(({ summonerId }) => id === summonerId);
        console.log('allStats.length:', allStats.length);
    };

    // I run out of memory doing this with 100 matches.
    // This works with the recent endpoint (20 matches per perspon).
    // await Promise.all(Object.keys(REGIONS).map(r => fn(REGIONS[r])));

    const keys = Object.keys(REGIONS);
    const chunkSize = 4; // 3 works for challenger
    const processChunk = async chunk =>
        Promise.all(chunk.map(r => fn(REGIONS[r])));
    for (let i = 0; i < keys.length; i += chunkSize) {
        console.log('processed starting', keys.slice(i, i + chunkSize));
        await processChunk(keys.slice(i, i + chunkSize));
        console.log('processed done', keys.slice(i, i + chunkSize));
    }
};

main();

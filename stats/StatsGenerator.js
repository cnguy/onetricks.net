require('dotenv').config('./.env');

import { Kayn, REGIONS, METHOD_NAMES, RedisCache } from 'kayn';

import cloneDeep from 'lodash.clonedeep';

import jsonfile from 'jsonfile';

import ChampionStats from './entities/ChampionStats';
import OneTrick from './entities/OneTrick';
import PlayerStats from './entities/PlayerStats';
import Summoner from './entities/Summoner';

const LEAGUE_QUEUE = 'RANKED_SOLO_5x5';
const MATCHLIST_CONFIG = {
    queue: 420,
    season: 9,
};

const mockBaseStats = jsonfile.readFileSync('/usr/src/stats/stats.json');
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

const leagueEntryToSummoner = kayn => region => async ({
    playerOrTeamId,
    playerOrTeamName,
}) =>
    Summoner(
        playerOrTeamId,
        playerOrTeamName,
        (await kayn.Summoner.by.id(playerOrTeamId).region(region)).accountId,
    ).asObject();

const matchlistToMatches = kayn => async (matchlist, region) => {
    const matchlistChunkSize = matchlist.matches.length / 5;
    let matches = [];
    for (let i = 0; i < matchlist.matches.length; i += matchlistChunkSize) {
        const currentMatches = await Promise.all(
            matchlist.matches
                .slice(i, i + matchlistChunkSize)
                .map(async ({ gameId }) => {
                    try {
                        return await kayn.Match.get(gameId).region(region);
                    } catch (ex) {
                        // This means that the match belongs to a different region (if 404).
                        return false;
                    }
                }),
        );
        matches = matches.concat(currentMatches);
    }
    return matches.filter(Boolean);
};

const reducerGetRest = kayn => (accountID, region) => async promise => {
    const { currentMatches, beginIndex } = await promise;
    const newBeginIndex = {
        beginIndex: beginIndex + 100,
    };
    const defaultReturn = {
        ...{ currentMatches },
        ...newBeginIndex,
    };
    try {
        const { matches: newMatches } = await kayn.Matchlist.by
            .accountID(accountID)
            .region(region)
            .query({
                ...MATCHLIST_CONFIG,
                beginIndex,
                endIndex: newBeginIndex.beginIndex,
            });
        return newMatches.length > 0
            ? Promise.resolve({
                  currentMatches: currentMatches.concat(newMatches),
                  ...newBeginIndex,
              })
            : Promise.resolve(defaultReturn);
    } catch (ex) {
        return Promise.resolve(defaultReturn);
    }
};

const range = length => Array(Math.ceil(length)).fill();

const getRestOfMatchlist = kayn => async (accountID, region, totalGames) => {
    if (totalGames > 100) {
        const initialValue = { currentMatches: [], beginIndex: 100 };
        const { currentMatches: matches } = await range(
            totalGames / 100,
        ).reduce(
            reducerGetRest(kayn)(accountID, region),
            Promise.resolve(initialValue),
        );
        return matches;
    }
    return [];
};

const processMatch = playerStats => match => {
    const { gameId: gameID } = match;
    const summonerID = playerStats.summonerID;

    const participantIdentity = findParticipantIdentity(match, summonerID);
    if (!participantIdentity) return; // undefined edge case
    const { participantId: participantID } = participantIdentity;
    const participant = findParticipant(match, participantID);
    const { teamId: teamID } = participant;
    const { championId: championID } = participant;
    const { stats } = participant;
    const didWin = didTeamWin(match, teamID);
    if (playerStats.containsChampion(championID)) {
        playerStats.editExistingChampion(championID, didWin, gameID);
    } else {
        playerStats.pushChampion(ChampionStats(championID, didWin), gameID);
    }
    // console.log('MEM:', process.memoryUsage());
};
const inPlatform = region => ({ platformId: platformID }) =>
    platformID.toLowerCase() === asPlatformID(region);
const containsMatch = playerStats => ({ gameId: gameID }) =>
    !playerStats.containsMatch(gameID);

const store = json => {
    console.log('writing to stats.json');
    jsonfile.writeFileSync('/usr/src/stats/stats.json', json);
    console.log('>> FINISHED');
};

const main = async () => {
    const kayn = Kayn()({
        debugOptions: {
            isEnabled: true,
            showKey: true,
        },
        requestOptions: {
            numberOfRetriesBeforeAbort: 1,
        },
        cacheOptions: {
            cache: new RedisCache({
                host: 'redis',
                port: 6379,
                keyPrefix: 'kayn',
            }),
            ttls: {
                [METHOD_NAMES.SUMMONER.GET_BY_SUMMONER_ID]: 1000 * 60 * 60 * 60,
                [METHOD_NAMES.SUMMONER.GET_BY_ACCOUNT_ID]: 1000 * 60 * 60 * 60,
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

    const fn = async (rank, region) => {
        const league = await kayn[rank].list(LEAGUE_QUEUE).region(region);
        const summoners = await Promise.all(
            league.entries.map(leagueEntryToSummoner(kayn)(region)),
        );

        console.log('summoners.length:', summoners.length);

        const summonersChunkSize = summoners.length / 2;

        for (let i = 0; i < summoners.length; i += summonersChunkSize) {
            // Process stats for each summoner.
            await Promise.all(
                summoners
                    .slice(i, i + summonersChunkSize)
                    .map(async ({ id: summonerID, accountID }) => {
                        const matchlist = await kayn.Matchlist.by
                            .accountID(accountID)
                            .region(region)
                            .query(MATCHLIST_CONFIG);

                        const totalNumOfGames = matchlist.totalGames;

                        const rest = await getRestOfMatchlist(kayn)(
                            accountID,
                            region,
                            totalNumOfGames,
                        );
                        if (rest.length > 0)
                            matchlist.matches = matchlist.matches.concat(rest);

                        // Filter out matches that belong to a different platform
                        // than where the summoner currently resides.
                        matchlist.matches = matchlist.matches.filter(
                            inPlatform(region),
                        );

                        const playerStats = playerExists(summonerID)
                            ? getPlayer(summonerID)
                            : PlayerStats(summonerID, region);
                        const trimmedMatchlist = cloneDeep(matchlist);

                        trimmedMatchlist.matches = trimmedMatchlist.matches.filter(
                            containsMatch(playerStats),
                        );

                        const matches = await matchlistToMatches(kayn)(
                            trimmedMatchlist,
                            region,
                        );

                        // Process matches in matchlist.
                        matches.forEach(processMatch(playerStats));
                        if (!playerExists(summonerID))
                            allStats.push(playerStats);
                    }),
            );
        }

        const json = {
            players: allStats.map(el => el.asObject()),
        };

        store(json);
        return true;
    };

    const keys = Object.keys(REGIONS);
    const chunkSize = 1;
    const processChunk = async (rank, chunk) =>
        Promise.all(chunk.map(r => fn(rank, REGIONS[r])));
    for (let i = 0; i < keys.length; i += chunkSize) {
        console.log('starting first chunk');
        await processChunk('Challenger', keys.slice(i, i + chunkSize));
        console.log('done with first chunk');
    }
    for (let i = 0; i < keys.length; i += chunkSize) {
        await processChunk('Master', keys.slice(i, i + chunkSize));
    }
    return true;
};

export default main;

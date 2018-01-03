require('dotenv').config('./.env');

import { Kayn, REGIONS, METHOD_NAMES, RedisCache } from 'kayn';
import RegionHelper from 'kayn/dist/lib/Utils/RegionHelper';

const { asPlatformID } = RegionHelper;

import jsonfile from 'jsonfile';

import ChampionStats from './entities/ChampionStats';
import OneTrick from './entities/OneTrick';
import PlayerStats from './entities/PlayerStats';
import Summoner from './entities/Summoner';

import asyncMapOverArrayInChunks from './utils/generic/asyncMapOverArrayInChunks';
import range from './utils/generic/range';

import MatchResponseHelper from './utils/response/MatchResponseHelper';

import LeagueKaynHelper from './utils/kayn-dependent/LeagueKaynHelper';
import MatchlistKaynHelper from './utils/kayn-dependent/MatchlistKaynHelper';

const LEAGUE_QUEUE = 'RANKED_SOLO_5x5';
const MATCHLIST_CONFIG = {
    queue: 420,
    season: 9,
};

const mockBaseStats = jsonfile.readFileSync('/usr/src/stats/stats.json');
console.log(mockBaseStats.players.length);

// Local Helpers 
const processMatch = playerStats => match => {
    const { gameId: gameID } = match;
    const summonerID = playerStats.summonerID;

    const participantIdentity = MatchResponseHelper.findParticipantIdentity(
        match,
        summonerID,
    );
    if (!participantIdentity) return; // undefined edge case
    const { participantId: participantID } = participantIdentity;
    const participant = MatchResponseHelper.findParticipant(
        match,
        participantID,
    );
    const { teamId: teamID } = participant;
    const { championId: championID } = participant;
    const { stats } = participant;
    const didWin = MatchResponseHelper.didTeamWin(match, teamID);
    if (playerStats.containsChampion(championID)) {
        playerStats.editExistingChampion(championID, didWin, gameID);
    } else {
        playerStats.pushChampion(ChampionStats(championID, didWin), gameID);
    }
    // console.log('MEM:', process.memoryUsage());
};
const inPlatform = region => ({ platformId: platformID }) =>
    platformID.toLowerCase() === asPlatformID(region);
const doesNotContainMatch = playerStats => ({ gameId: gameID }) =>
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
            league.entries.map(
                LeagueKaynHelper.leagueEntryToSummoner(kayn)(region),
            ),
        );

        console.log('summoners.length:', summoners.length);

        const summonersChunkSize = summoners.length / 2;

        const allPlayerStats = await asyncMapOverArrayInChunks(
            summoners,
            summonersChunkSize,
            async ({ id: summonerID, accountID }) => {
                const matchlist = await kayn.Matchlist.by
                    .accountID(accountID)
                    .region(region)
                    .query(MATCHLIST_CONFIG);

                const { totalGames: totalNumOfGames } = matchlist;

                const rest = await MatchlistKaynHelper.getRestOfMatchlist(kayn)(
                    accountID,
                    region,
                    totalNumOfGames,
                );

                const playerStats = playerExists(summonerID)
                    ? getPlayer(summonerID)
                    : PlayerStats(summonerID, region);

                const fullMatchlist = matchlist.matches
                    .concat(rest)
                    .filter(inPlatform(region))
                    .filter(doesNotContainMatch(playerStats));

                const matches = await MatchlistKaynHelper.rawMatchlistToMatches(
                    kayn,
                )(fullMatchlist, region);

                // Mutation: Process matches in matchlist.
                matches.forEach(processMatch(playerStats));
                return playerStats;
            },
        );

        const newStats = allPlayerStats.reduce(
            (total, playerStats) =>
                !playerExists(playerStats.summonerID)
                    ? total.concat(playerStats)
                    : total,
            [],
        );

        const json = {
            players: allStats.concat(newStats).map(el => el.asObject()),
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

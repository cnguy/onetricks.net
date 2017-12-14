import { Kayn, REGIONS, METHOD_NAMES, RedisCache } from 'kayn';

import ChampionStats from './entities/ChampionStats';
import OneTrick from './entities/OneTrick';
import PlayerStats from './entities/PlayerStats';
import Summoner from './entities/Summoner';

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
            },
        },
    });
    const league = await kayn.Challenger.list('RANKED_SOLO_5x5');
    const summoners = await Promise.all(
        league.entries.map(
            async ({ playerOrTeamId, playerOrTeamName }) =>
                await Summoner(
                    playerOrTeamId,
                    playerOrTeamName,
                    (await kayn.Summoner.by.id(playerOrTeamId)).accountId,
                ).asObject(),
        ),
    );
    const matchlist = await kayn.Matchlist.Recent.by.accountID(
        summoners[0].accountID,
    );
    const matches = await Promise.all(
        matchlist.matches.map(async ({ gameId }) => kayn.Match.get(gameId)),
    );
    console.log(matches);

    const playerStats = PlayerStats(summoners[0].id);
    matches.forEach(match => {
        const {
            participantId: participantID,
        } = match.participantIdentities.find(
            el => el.player.summonerId === parseInt(summoners[0].id),
        );
        const participant = match.participants.find(
            ({ participantId }) => participantId === participantID,
        );
        const { teamId: teamID } = participant;
        const { championId: championID } = participant;
        const { stats } = participant;
        const didWin =
            match.teams.find(({ teamId }) => teamId === teamID).win === 'Win';
        if (playerStats.containsChampion(championID)) {
          playerStats.editExistingChampion(championID, didWin, match.gameId);
        } else {
          playerStats.pushChampion(ChampionStats(championID, didWin), match.gameId);
        }
    });

    console.log(playerStats);
};

main();

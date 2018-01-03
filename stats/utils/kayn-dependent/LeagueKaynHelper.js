import Summoner from '../../entities/Summoner';

class LeagueKaynHelper {
    static leagueEntryToSummoner = kayn => region => async ({
        playerOrTeamId,
        playerOrTeamName,
    }) =>
        Summoner(
            playerOrTeamId,
            playerOrTeamName,
            (await kayn.Summoner.by.id(playerOrTeamId).region(region))
                .accountId,
        ).asObject();
}

export default LeagueKaynHelper;

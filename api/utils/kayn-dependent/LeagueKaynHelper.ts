import Summoner, { RawSummoner } from '../../entities/Summoner'
import { LeagueV3LeagueListDTO, LeagueV3LeaguePositionDTO } from 'kayn/typings/dtos';
import * as kayn from 'kayn'

class LeagueKaynHelper {
    static leagueEntryToSummoner = (kayn: kayn.KaynClass) => (region: string) => async ({
        playerOrTeamId,
        playerOrTeamName,
    }: LeagueV3LeaguePositionDTO): Promise<RawSummoner> =>
        Summoner(
            parseInt(playerOrTeamId!),
            playerOrTeamName!,
            (await kayn.Summoner.by.id(parseInt(playerOrTeamId!)).region(region))
                .accountId!,
        ).asObject()
}

export default LeagueKaynHelper

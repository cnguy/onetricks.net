import Summoner, { RawSummoner } from '../../entities/Summoner'
import { LeagueV3LeagueListDTO, LeagueV3LeaguePositionDTO, LeagueV4LeaguePositionDTO } from 'kayn/typings/dtos';
import * as kayn from 'kayn'

class LeagueKaynHelper {
    static leagueEntryToSummoner = (kayn: kayn.KaynClass) => (region: string) => async ({
        summonerId,
        summonerName,
    }: LeagueV4LeaguePositionDTO): Promise<RawSummoner> =>
        Summoner(
            summonerId!,
            summonerName!,
            (await kayn.SummonerV4.by.id(summonerId!).region(region))
                .accountId!,
        ).asObject()
}

export default LeagueKaynHelper

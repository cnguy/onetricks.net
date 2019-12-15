import asyncMapOverArrayInChunks from '../generic/asyncMapOverArrayInChunks'
import range from '../generic/range'
import * as kayn from 'kayn'
import { MatchV4MatchDto, MatchV4MatchReferenceDto } from 'kayn/typings/dtos'

const MATCHLIST_CONFIG = {
    queue: 420,
    beginTime: 1546981200 * 1000,
}

class MatchlistKaynHelper {
    static rawMatchlistToMatches = (kayn: kayn.KaynClass) => async (
        matchlist: number[],
        region: string,
    ) => {
        const matchlistChunkSize = 500

        const matches = await asyncMapOverArrayInChunks(
            matchlist,
            matchlistChunkSize,
            async (matchID: number) => {
                try {
                    return await kayn.Match.get(matchID).region(region)
                } catch (ex) {
                    return false
                }
            },
        )

        return matches.filter(Boolean) as MatchV4MatchDto[]
    }

    static getRankedMatchlistForIndexQuery = (kayn: kayn.KaynClass) => (
        accountID: string,
        region: string,
        indexQuery?: { beginIndex?: number; endIndex?: number },
    ) =>
        kayn.Matchlist.by
            .accountID(accountID)
            .region(region)
            .query(MATCHLIST_CONFIG)
            .query(indexQuery || {})

    static getEntireMatchlist = (kayn: kayn.KaynClass) => async (
        accountID: string,
        region: string,
    ) => {
        const {
            matches,
            totalGames,
        } = await MatchlistKaynHelper.getRankedMatchlistForIndexQuery(kayn)(
            accountID,
            region,
        )
        let rest: MatchV4MatchDto[] = []
        if (totalGames! > 100) {
            let beginIndex = 100
            for (;;) {
                const matchlist = await MatchlistKaynHelper.getRankedMatchlistForIndexQuery(
                    kayn,
                )(accountID, region, {
                    beginIndex,
                    endIndex: beginIndex + 100,
                })
                if (matchlist.matches!.length === 0) break
                rest = rest.concat(matchlist.matches!)
                beginIndex += 100
            }
        }
        const res = [matches].concat(rest)
        return res.reduce(
            (t: MatchV4MatchReferenceDto[], c: MatchV4MatchReferenceDto[]) =>
                t.concat(c!),
            [],
        )
    }
}

export default MatchlistKaynHelper

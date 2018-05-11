import asyncMapOverArrayInChunks from '../generic/asyncMapOverArrayInChunks'
import range from '../generic/range'
import * as kayn from 'kayn'
import { MatchV3MatchDto, MatchV3MatchReferenceDto } from 'kayn/typings/dtos';

const MATCHLIST_CONFIG = {
    queue: 420,
    season: 11,
}

class MatchlistKaynHelper {
    static rawMatchlistToMatches = (kayn: kayn.KaynClass) => async (matchlist: MatchV3MatchDto[], region: string) => {
        const matchlistChunkSize = 100

        const matches = await asyncMapOverArrayInChunks(
            matchlist,
            matchlistChunkSize,
            async ({ gameId }: MatchV3MatchDto) => {
                try {
                    return await kayn.Match.get(gameId!).region(region)
                } catch (ex) {
                    return false
                }
            },
        )

        return matches.filter(Boolean)
    }

    static getRankedMatchlistForIndexQuery = (kayn: kayn.KaynClass) => (
        accountID: number,
        region: string,
        indexQuery?: { beginIndex?: number, endIndex?: number },
    ) =>
        kayn.Matchlist.by
            .accountID(accountID)
            .region(region)
            .query(MATCHLIST_CONFIG)
            .query(indexQuery || {})

    static getEntireMatchlist = (kayn: kayn.KaynClass) => async (accountID: number, region: string) => {
        const {
            matches,
            totalGames,
        } = await MatchlistKaynHelper.getRankedMatchlistForIndexQuery(kayn)(
            accountID,
            region,
        )
        let rest: MatchV3MatchDto[] = []
        if (totalGames! > 100) {
            let beginIndex = 100
            for (; ;) {
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
        return res.reduce((t: MatchV3MatchReferenceDto[], c: MatchV3MatchReferenceDto[]) => t.concat(c!), [])
    }
}

export default MatchlistKaynHelper

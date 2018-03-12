import asyncMapOverArrayInChunks from '../generic/asyncMapOverArrayInChunks'
import range from '../generic/range'

const MATCHLIST_CONFIG = {
    queue: 420,
    season: 11,
}

class MatchlistKaynHelper {
    static rawMatchlistToMatches = kayn => async (matchlist, region) => {
        const matchlistChunkSize = matchlist.length / 5

        const matches = await asyncMapOverArrayInChunks(
            matchlist,
            matchlistChunkSize,
            async ({ gameId }) => {
                try {
                    return await kayn.Match.get(gameId).region(region)
                } catch (ex) {
                    return false
                }
            },
        )

        return matches.filter(Boolean)
    }

    static getRankedMatchlistForIndexQuery = kayn => (
        accountID,
        region,
        indexQuery,
    ) =>
        kayn.Matchlist.by
            .accountID(accountID)
            .region(region)
            .query(MATCHLIST_CONFIG)
            .query(indexQuery || {})

    static getEntireMatchlist = kayn => async (accountID, region) => {
        const {
            matches,
            totalGames,
        } = await MatchlistKaynHelper.getRankedMatchlistForIndexQuery(kayn)(
            accountID,
            region,
        )
        let rest = []
        if (totalGames > 100) {
            let beginIndex = 100
            for (;;) {
                const matchlist = await MatchlistKaynHelper.getRankedMatchlistForIndexQuery(
                    kayn,
                )(accountID, region, {
                    beginIndex,
                    endIndex: beginIndex + 100,
                })
                if (matchlist.matches.length === 0) break
                rest = rest.concat(matchlist.matches)
                beginIndex += 100
            }
        }
        const res = [matches].concat(rest)
        return res.reduce((t, c) => t.concat(c), [])
    }
}

export default MatchlistKaynHelper

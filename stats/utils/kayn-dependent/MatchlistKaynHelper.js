import asyncMapOverArrayInChunks from '../generic/asyncMapOverArrayInChunks';
import range from '../generic/range';

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

class MatchlistKaynHelper {
    static rawMatchlistToMatches = kayn => async (matchlist, region) => {
        const matchlistChunkSize = matchlist.length / 5;

        const matches = await asyncMapOverArrayInChunks(
            matchlist,
            matchlistChunkSize,
            async ({ gameId }) => {
                try {
                    return await kayn.Match.get(gameId).region(region);
                } catch (ex) {
                    return false;
                }
            },
        );

        return matches.filter(Boolean);
    };

    static getRestOfMatchlist = kayn => async (
        accountID,
        region,
        totalGames,
    ) => {
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
}

export default MatchlistKaynHelper;

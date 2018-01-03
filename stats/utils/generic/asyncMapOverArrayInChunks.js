const asyncMapOverArrayInChunks = async (array, chunkSize, mapFunction) => {
    // Mutation
    let results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const playerStatsArray = await Promise.all(
            array.slice(i, i + chunkSize).map(mapFunction),
        );
        results = results.concat(playerStatsArray);
    }
    return results;
};

export default asyncMapOverArrayInChunks;

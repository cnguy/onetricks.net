import range from './range';

const asyncMapOverArrayInChunks = async (array, chunkSize, mapFunction) => {
    const initialValue = {
        total: [],
        index: 0,
    }
    const { total } = await range(array.length / chunkSize).reduce(async promise => {
        const { total, index } = await promise;
        const endIndex = index + chunkSize;
        const current = await Promise.all(
            array.slice(index, endIndex).map(mapFunction),
        );
        return Promise.resolve({
            total: total.concat(current),
            index: endIndex,
        });
    }, Promise.resolve(initialValue));

    return total; 
};

export default asyncMapOverArrayInChunks;

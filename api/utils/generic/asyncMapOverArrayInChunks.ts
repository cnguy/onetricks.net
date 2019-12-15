import range from './range'

const asyncMapOverArrayInChunks = async (
    array: any[],
    chunkSize: number,
    mapFunction: any,
) => {
    const initialValue = {
        total: [],
        index: 0,
    }
    // TODO: Why can array.length and chunkSize both be 0 in the first place?
    if (array.length == 0) return []
    const { total } = await range(array.length / chunkSize).reduce(
        async (promise: Promise<any>) => {
            const { total, index } = await promise
            const endIndex = index + chunkSize
            const current = await Promise.all(
                array.slice(index, endIndex).map(mapFunction),
            )
            return Promise.resolve({
                total: total.concat(current),
                index: endIndex,
            })
        },
        Promise.resolve(initialValue),
    )

    return total
}

export default asyncMapOverArrayInChunks

import { Stats } from './mongodb';

const getStats = async (summonerID: number): Promise<any> =>
    Stats.findOne({ summonerId: summonerID })

const tryCatchGetStats = async (summonerID: number): Promise<any> => {
    try {
        return await getStats(summonerID)
    } catch (exception) {
        return null
    }
}

export default tryCatchGetStats

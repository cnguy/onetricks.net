import * as request from 'request'

/**
 * getStats closes over stats, providing a way for us to find a particular summoner
 * within the stats.json file as if we're making a call to the old stats endpoint.
 * @param {number} summonerID - The summoner id to look for.
 * @returns {object} a stats object or `undefined` if not found.
 */
const getStats = async (summonerID: number): Promise<any> =>
    new Promise((resolve, reject) => {
        request(
            {
                url: `http://one-tricks-stats:3002/api/stats/${summonerID}`,
                json: true,
            },
            function (error: any, response: any, body: any) {
                if (error) return reject(error)
                else {
                    if (body.statusCode >= 400) {
                        return reject(error)
                    }
                    return resolve(body)
                }
            },
        )
    })

const tryCatchGetStats = async (summonerID: number): Promise<any> => {
    try {
        return await getStats(summonerID)
    } catch (exception) {
        return null
    }
}

export default tryCatchGetStats

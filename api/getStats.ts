import * as request from 'request'

/**
 * getStats gets stats from our stats API.
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

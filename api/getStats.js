import request from 'request'

/**
 * getStats closes over stats, providing a way for us to find a particular summoner
 * within the stats.json file as if we're making a call to the old stats endpoint.
 * @param {number} summonerID - The summoner id to look for.
 * @returns {object} a stats object or `undefined` if not found.
 */
const getStats = async summonerID =>
    new Promise((resolve, reject) => {
        request({
            url: `http://one-tricks-stats:3002/api/stats/${summonerID}`,
            json: true,
        }, function (error, response, body) {
            if (body) return resolve(body)
            else return resolve(undefined)

        })
    })

export default getStats

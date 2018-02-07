/* eslint-disable no-restricted-syntax */
const express = require('express')

const app = express()
const compression = require('compression')
app.use(compression())

require('dotenv').config()

import jsonfile from 'jsonfile'
const stats = jsonfile.readFileSync('./stats.json').players
/**
 * getStats closes over stats, providing a way for us to find a particular summoner
 * within the stats.json file as if we're making a call to the old stats endpoint.
 * @param {number} summonerID - The summoner id to look for.
 * @returns {object} a stats object or `undefined` if not found.
 */
const getStats = summonerID =>
    stats.find(p => parseInt(p.summonerId) === parseInt(summonerID))

app.set('port', process.env.PORT || 3002)

app.get('/api/stats/:summonerID', (req, res, next) => {
    return res.json(getStats(req.params.summonerID))
})

app.use((req, res, next) => res.render('404', { status: 404, url: req.url }))

app.use((err, req, res, next) => {
    res.render('500', {
        status: err.status || 500,
        error: err,
    })
})

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`) // eslint-disable-line no-console
})

import generator from './StatsGenerator'

const main = async () => {
    console.log('start generator')
    //    await generator();
    console.log('completely done')
}

// if (process.env.NODE_ENV === 'development') main()

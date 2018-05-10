/* eslint-disable no-restricted-syntax */
const express = require('express')

const app = express()
const compression = require('compression')
app.use(compression())

require('dotenv').config()

import { Stats, parseStats } from './mongodb'

app.set('port', process.env.PORT || 3002)

app.get('/api/stats/:summonerID', async (req, res, next) => {
    const { summonerID } = req.params
    try {
        const stats = await Stats.findOne({
            summonerId: parseInt(summonerID),
        })
        if (stats) {
            res.json(parseStats(stats))
        } else {
            res.json({ statusCode: 404 })
        }
    } catch (ex) {
        res.json({ statusCode: 500 })
    }
})

app.use((req, res, next) => res.json({ statusCode: 404, url: req.url }))

app.use((err, req, res, next) => {
    res.json({
        statusCode: err.status || 500,
        error: err,
    })
})

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}`) // eslint-disable-line no-console
})

import generator from './StatsGenerator'

const main = async () => {
    try {
        console.log('begin')
        await generator()
        console.log('done')
    } catch (ex) {
        console.log(ex)
    }
    process.exit()
}

// main()

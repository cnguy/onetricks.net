/* eslint-disable no-restricted-syntax */
import * as express from 'express'
import * as compression from 'compression'
import * as cors from 'cors'

const app = express()
app.use(compression())
app.use(cors())

require('dotenv').config()

import * as mongoose from 'mongoose'
require('./models')

import kayn from './kayn'

const Player = mongoose.model('Player')

if (process.env.NODE_ENV === 'development') {
    mongoose.connect('mongodb://mongo:27017/one-tricks')
} else {
    try {
        mongoose.connect(process.env.MONGO_URI!)
    } catch (ex) {
        console.error('exception..:', ex)
    }
}

import generator from './OneTricksGenerator'
import MHGenerator from './MatchHistoryGenerator'
import { setInterval } from 'timers'

app.set('port', process.env.PORT || 80)

app.get('/all', (req, res, next) => {
    if (req.query.multiple) {
        const _regions = req.query.region.split(',') || null

        if (_regions) {
            Player.find({ region: { $in: _regions } }, (err, players) => {
                if (err) return next(err)
                res.json(players)
            })
        }
    } else {
        const region = req.query.region || null

        if (region && region !== 'all') {
            Player.find(
                {
                    region,
                },
                (err, players) => {
                    if (err) return next(err)
                    res.json(players)
                },
            )
        } else {
            Player.find((err, players) => {
                if (err) return next(err)
                res.json(players)
            })
        }
    }
})

const oneParamParseInt = n => parseInt(n, 10)

const tryMatchHistoryFromCache = url => {
    return new Promise((resolve, reject) => {
        if ((kayn as any).config.cacheOptions.cache) {
            (kayn as any).config.cacheOptions.cache.get({ key: url }, (err, data) => {
                if (data) {
                    return resolve(data)
                } else {
                    return reject(err)
                }
            })
        } else {
            return reject()
        }
    })
}

app.get('/match-history', async (req, res, next) => {
    try {
        res.json(await tryMatchHistoryFromCache(req.url))
    } catch (ex) {
        const { championId } = req.query
        const ranks = req.query.ranks.split(',')
        const regions = req.query.regions.split(',')
        const roleNumbers = req.query.roleNumbers
            .split(',')
            .map(oneParamParseInt)
        const data = await MHGenerator(ranks, regions, championId, roleNumbers)
        if ((kayn as any).config.cacheOptions.cache) {
            (kayn as any).config.cacheOptions.cache.set(
                { key: req.url, ttl: 100000 },
                data,
            )
        }
        res.json(data)
    }
})

import { getStaticChampionByName } from './getStaticChampion'

app.get('/static-champion-by-name/:name/id', (req, res, next) => {
    const { name } = req.params
    res.json(getStaticChampionByName(name).id)
})

app.use((req, res, next) => res.json({ statusCode: 404, url: req.url }))

app.use((err, req, res, next) => {
    res.json({
        statusCode: err.status || 500,
        error: err,
    })
})

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`) // eslint-disable-line no-console
})

const main = async () => {
    try {
        console.log('starting script')
        const done = await generator()
        console.log('script done:', done)
        setInterval(async () => {
            await generator()
        }, 86400000)
    } catch (exception) {
        console.log(exception)
    }
}

// main()

import * as koa from 'koa'
import * as koaCompress from 'koa-compress'
import * as koaRouter from 'koa-router'
import * as mongoose from 'mongoose'

import generator from './OneTricksGenerator'
import StatsGenerator from './StatsGenerator'
import { getStaticChampionByName } from './getStaticChampion'
import kayn from './kayn'
import MHGenerator from './MatchHistoryGenerator'
import { setInterval } from 'timers'
import { Player } from './mongodb';

require('dotenv').config()
require('./models')

const PORT: number = 80

const app = new koa()
const router = new koaRouter()

app.use(koaCompress())
app.listen(PORT)

router.get('/one-tricks', async (ctx) => {
    try {
        ctx.body = await Player.find().exec()
    } catch (ex) {
        ctx.throw(500)
    }
})

router.get('/match-history', async (ctx) => {
    const { url } = ctx
    try {
        ctx.body = await tryMatchHistoryFromCache(url)
    } catch (ex) {
        const championId = parseInt(ctx.query.championId)
        const ranks: string[] = ctx.query.ranks.split(',')
        const regions: string[] = ctx.query.regions.split(',')
        const roleNumbers: number[] = ctx.query.roleNumbers
            .split(',')
            .map(oneParamParseInt)
        const data = await MHGenerator(ranks, regions, championId, roleNumbers)
        if ((kayn as any).config.cacheOptions.cache) {
            (kayn as any).config.cacheOptions.cache.set(
                { key: url, ttl: 100000 },
                data,
            )
        }
        ctx.body = data
    }
})

app
    .use(router.routes())
    .use(router.allowedMethods())

const oneParamParseInt = (n: string): number => parseInt(n, 10)

const tryMatchHistoryFromCache = (url: string): any => {
    return new Promise((resolve, reject) => {
        if ((kayn as any).config.cacheOptions.cache) {
            (kayn as any).config.cacheOptions.cache.get({ key: url }, (err: any, data: any[]) => {
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

interface StaticChampionByNameParams {
    name: string
}

router.get('/static-champion-by-name/:name/id', async ctx => {
    const { name }: StaticChampionByNameParams = ctx.params
    ctx.body = getStaticChampionByName(name).id
})

const main = async () => {
    /*
    try {
        console.log('starting script')
        const done = await generator()
        console.log('script done:', done)
        setInterval(async () => {
            await generator()
        }, 86400000)
    } catch (exception) {
        console.log(exception)
    }*/
    console.log('start')
    const done = await StatsGenerator()
    console.log('done')
}

main()

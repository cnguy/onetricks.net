import * as cors from 'koa2-cors'
import * as koa from 'koa'
import * as koaCompress from 'koa-compress'
import * as koaRouter from 'koa-router'
import * as schedule from 'node-schedule'
import * as gmailSend from 'gmail-send'

import generator from './OneTricksGenerator'
import StatsGenerator, { Modes } from './StatsGenerator'
import { getStaticChampionByName } from './getStaticChampion'
import kayn from './kayn'
import MHGenerator from './MatchHistoryGenerator'
import { Player, Stats } from './mongodb';
import { RedisCache, LRUCache } from 'kayn';

const gmail = gmailSend({
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
    to: process.env.GMAIL_USERNAME,
})

require('dotenv').config()
require('./models')

const PORT: number = 80

const app = new koa()
const router = new koaRouter()

app.use(koaCompress())
app.use(cors({ origin: '*' }))
app.listen(PORT)

router.get('/one-tricks', async (ctx) => {
    try {
        ctx.body = await Player.find().exec()
    } catch (ex) {
        ctx.throw(500)
    }
})

if (process.env.NODE_ENV !== 'production') {
    router.get('/analyzed', async (ctx) => {
        try {
            ctx.body = await tryFromCache('analyzed')
        } catch (ex) {
            const stats = await Stats.find().exec()
            const next = stats
                .map((el: any) => el.matchesProcessed)
                .reduce((t, c) => t.concat(c), [])
            ctx.body = {
                playersAnalyzed: stats.length,
                matchesAnalyzed: (new Set(next)).size
            }
        }
    })
}

router.get('/match-history', async (ctx) => {
    const { url } = ctx
    try {
        ctx.body = await tryFromCache(url)
    } catch (ex) {
        const championId = parseInt(ctx.query.championId)
        const ranks: string[] = ctx.query.ranks.split(',')
        const regions: string[] = ctx.query.regions.split(',')
        const roleNumbers: number[] = ctx.query.roleNumbers
            .split(',')
            .map(oneParamParseInt)
        const data = await MHGenerator(ranks, regions, championId, roleNumbers)
            ; (matchHistoryCache as any).set(
                { key: url, ttl: 100000 },
                data,
            )
        ctx.body = data
    }
})

app
    .use(router.routes())
    .use(router.allowedMethods())

const oneParamParseInt = (n: string): number => parseInt(n, 10)

const matchHistoryCache = process.env.NODE_ENV === 'production'
    ? new RedisCache({
        host: process.env.REDIS_MH,
        port: process.env.REDIS_MH_PORT as any,
        keyPrefix: 'kayn-',
        password: process.env.REDIS_MH_PASSWORD,
    })
    : new LRUCache({ max: 1000 })

const tryFromCache = (url: string): any => {
    return new Promise((resolve, reject) => {
        (matchHistoryCache as any).get({ key: url }, (err: any, data: any) => {
            if (data) {
                return resolve(data)
            } else {
                return reject(err)
            }
        })
    })
}

interface StaticChampionByNameParams {
    name: string
}

router.get('/static-champion-by-name/:name/id', async ctx => {
    const { name }: StaticChampionByNameParams = ctx.params
    ctx.body = getStaticChampionByName(name).id
})

// TODO: Convert to async / await function.
const sendUpdateMail = (type: Modes, dateText: string) => {
    const typeText = type === Modes.Update ? 'update' : (type === Modes.BruteForceAll ? 'bruteForceAll' : 'sequentialAll')
    const currentDate = new Date(Date.now())
    currentDate.setHours(currentDate.getHours() - 7)
    gmail({
        subject: `onetricks.net build (${typeText})`,
        text: `${dateText}: ` +
            currentDate.getDate() + "/"
            + (currentDate.getMonth() + 1) + "/"
            + currentDate.getFullYear() + " @ "
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds()
    }, function (err: any, done: any) { console.log(err, done) })
}

const main = async (mode = Modes.Update) => {
    try {
        // NOTE: Docker uses UTC time!!!
        schedule.scheduleJob('25 5 * * *', async () => {
            console.log('STARTING STATS')
            sendUpdateMail(Modes.Update, "start")
            await StatsGenerator(mode)
            sendUpdateMail(Modes.Update, "finish")
            console.log('END STATS')
            if (mode === Modes.Update) {
                console.log('START ONE TRICKS')
                await generator()
                console.log('END ONE TRICKS')
            }
        })

        schedule.scheduleJob('35 18 * * 5', async () => {
            console.log('STARTING STATS')
            sendUpdateMail(Modes.SequentialAll, "start")
            await StatsGenerator(Modes.SequentialAll)
            sendUpdateMail(Modes.SequentialAll, "finish")
            console.log('END STATS')
            console.log('START ONE TRICKS')
            await generator()
            console.log('END ONE TRICKS')
        })
    } catch (ex) {
        console.error(ex)
    }
}

main()

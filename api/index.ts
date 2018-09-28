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
import { Player } from './mongodb';

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

// TODO: Convert to async / await function.
const sendUpdateMail = (type: Modes, dateText: string) => {
    const typeText = type === Modes.Update ? 'update' : 'bruteForceAll'
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
            sendUpdateMail(Modes.BruteForceAll, "start")
            await StatsGenerator(Modes.BruteForceAll)
            sendUpdateMail(Modes.BruteForceAll, "finish")
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

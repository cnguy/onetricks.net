require('dotenv').config('./.env')

import { Kayn, BasicJSCache, LRUCache, RedisCache, METHOD_NAMES } from 'kayn'

const redisCache = new RedisCache({
    host: 'redis-19169.c44.us-east-1-2.ec2.cloud.redislabs.com',
    port: 19169,
    keyPrefix: 'kayn-',
    password: process.env.REDIS_PASSWORD,
})

const kayn = Kayn()({
    debugOptions: {
        isEnabled: true,
        showKey: true,
    },
    requestOptions: {
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 3000,
    },
    cacheOptions: {
        cache: redisCache,
        timeToLives: {
            useDefault: true,
        },
    },
})

export default kayn

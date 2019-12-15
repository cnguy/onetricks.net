import { Kayn, LRUCache, RedisCache } from 'kayn'

const cache =
    process.env.NODE_ENV === 'production'
        ? new RedisCache({
              host: process.env.REDIS_KAYN,
              port: process.env.REDIS_KAYN_PORT as any,
              keyPrefix: 'kayn-',
              password: process.env.REDIS_KAYN_PASSWORD,
          })
        : new LRUCache({ max: 1000 })

export default Kayn()({
    debugOptions: {
        isEnabled: true,
        showKey: true,
    },
    requestOptions: {
        numberOfRetriesBeforeAbort: 10,
        delayBeforeRetry: 3000,
    },
    cacheOptions: {
        cache,
        timeToLives: {
            useDefault: true,
        },
    },
})

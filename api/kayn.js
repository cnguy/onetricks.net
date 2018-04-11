require('dotenv').config('./.env')

import { Kayn, BasicJSCache, LRUCache, RedisCache, METHOD_NAMES } from 'kayn'

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
        cache: new LRUCache({ max: 1000 }),
        timeToLives: {
            useDefault: true,
        },
    },
})

export default kayn

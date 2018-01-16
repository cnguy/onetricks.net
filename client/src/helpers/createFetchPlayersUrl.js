// @flow

import type { region as regionType } from '../constants/flowTypes.js'

const createFetchPlayersUrl = (args: regionType | Array<regionType>): string =>
    `${
        process.env.NODE_ENV === 'production'
            ? 'https://cors-anywhere.herokuapp.com/http://104.131.26.226:3001/'
            : ''
    }all?region=${
        Array.isArray(args) ? `${args.join(',')}&multiple=true` : `${args}`
    }`

export default createFetchPlayersUrl

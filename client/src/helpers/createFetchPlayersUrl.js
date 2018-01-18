// @flow

import type { region as regionType } from '../constants/flowTypes.js'

const createFetchPlayersUrl = (args: regionType | Array<regionType>): string =>
    `${(function() {
        if (process.env.NODE_ENV === 'production') {
            return 'https://cors-anywhere.herokuapp.com/http://104.131.26.226:3001/'
        } else {
            // TODO: Fix..
            return 'https://cors-anywhere.herokuapp.com/http://104.131.26.226:3001/'
            // return 'http://localhost:3001/'
        }
    })()}all?region=${
        Array.isArray(args) ? `${args.join(',')}&multiple=true` : `${args}`
    }`

export default createFetchPlayersUrl

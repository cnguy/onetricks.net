const createFetchPlayersUrl = args =>
    `https://cors-anywhere.herokuapp.com/http://${
        process.env.NODE_ENV === 'production'
            ? '104.131.26.226:3001'
            : '05a6d1ea.ngrok.io'
    }/all?region=${
        Array.isArray(args) ? `${args.join(',')}&multiple=true` : `${args}`
    }`

export default createFetchPlayersUrl

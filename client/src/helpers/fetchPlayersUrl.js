const fetchPlayersUrl = `https://cors-anywhere.herokuapp.com/${
    process.env.NODE_ENV === 'production'
        ? 'http://104.131.26.226:3001'
        : 'http://8b733b23.ngrok.io'
    }/all?region=all`

export default fetchPlayersUrl

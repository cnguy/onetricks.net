const fetchPlayersUrl = `${
    process.env.NODE_ENV === 'production'
        ? 'http://104.131.26.226'
        : 'https://cors-anywhere.herokuapp.com/https://8b733b23.ngrok.io'
}/all?region=all`

export default fetchPlayersUrl

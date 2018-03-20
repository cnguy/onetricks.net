const fetchPlayersUrl = `${
    process.env.NODE_ENV === 'production'
        ? 'https://104.131.26.226:3001'
        : 'https://cors-anywhere.herokuapp.com/https://8b733b23.ngrok.io'
}/all?region=all`

export default fetchPlayersUrl

const fetchPlayersUrl = `${
    process.env.NODE_ENV === 'production'
        ? 'http://104.131.26.226:3001'
        : 'https://cors-anywhere.herokuapp.com/http://8b733b23.ngrok.io'
}/all?region=all`

export default fetchPlayersUrl

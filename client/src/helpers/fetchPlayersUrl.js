const fetchPlayersUrl = `https://cors-anywhere.herokuapp.com/http://${
    process.env.NODE_ENV === 'production'
        ? '104.131.26.226:3001'
        : '2ffe1d6c.ngrok.io'
}/all?region=all`

export default fetchPlayersUrl

const fetchPlayersUrl = `https://cors-anywhere.herokuapp.com/http://${
    process.env.NODE_ENV === 'production'
        ? '104.131.26.226:3001'
        : '37ca33ae.ngrok.io'
}/all?region=all`

export default fetchPlayersUrl

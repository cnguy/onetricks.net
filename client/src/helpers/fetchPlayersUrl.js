const fetchPlayersUrl = `https://cors-anywhere.herokuapp.com/http://${
    process.env.NODE_ENV === 'production'
        ? '104.131.26.226:3001'
        : '9f709a40.ngrok.io'
}/all?region=all`

export default fetchPlayersUrl

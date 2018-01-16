class _OneTrick {
    constructor(summonerID, summonerName, championName) {
        this.summonerID = summonerID
        this.summonerName = summonerName
        this.championName = championName
    }

    asObject() {
        const { championName: champ, summonerID: id, summonerName: name } = this

        return {
            [id]: { champ, id, name },
        }
    }
}

const OneTrick = (summonerID, summonerName, championName) =>
    new _OneTrick(summonerID, summonerName, championName)

export default OneTrick

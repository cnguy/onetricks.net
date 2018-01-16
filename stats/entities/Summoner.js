class _Summoner {
    constructor(summonerID, summonerName, accountID) {
        this.id = parseInt(summonerID)
        this.name = summonerName
        this.accountID = accountID
    }

    asObject() {
        const { id, name, accountID } = this

        return {
            id,
            name,
            accountID,
        }
    }
}

const Summoner = (id, name, accountID) => new _Summoner(id, name, accountID)

export default Summoner

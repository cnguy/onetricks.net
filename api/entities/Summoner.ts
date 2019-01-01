export interface RawSummoner {
    id: string
    name: string
    accountID: string
}

export class _Summoner {
    id: string
    name: string
    accountID: string

    constructor(summonerID: string, summonerName: string, accountID: string) {
        this.id = summonerID
        this.name = summonerName
        this.accountID = accountID
    }

    asObject(): RawSummoner {
        const { id, name, accountID } = this

        return {
            id,
            name,
            accountID,
        }
    }
}

const Summoner = (id: string, name: string, accountID: string) => new _Summoner(id, name, accountID)

export default Summoner

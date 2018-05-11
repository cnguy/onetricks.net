export interface RawSummoner {
    id: number
    name: string
    accountID: number
}

export class _Summoner {
    id: number
    name: string
    accountID: number

    constructor(summonerID: number, summonerName: string, accountID: number) {
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

const Summoner = (id: number, name: string, accountID: number) => new _Summoner(id, name, accountID)

export default Summoner

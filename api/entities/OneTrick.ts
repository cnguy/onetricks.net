export class _OneTrick {
    summonerID: number
    summonerName: string
    championName: string

    constructor(summonerID: number, summonerName: string, championName: string) {
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

const OneTrick = (summonerID: number, summonerName: string, championName: string) =>
    new _OneTrick(summonerID, summonerName, championName)

export default OneTrick

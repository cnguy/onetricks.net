import ChampionStats, { RawChampionStats, _ChampionStats } from './ChampionStats'
import { _OneTrick } from './OneTrick';

export interface RawPlayerStats {
    summonerId: number
    champions: RawChampionStats[]
    matchesProcessed: number[]
    region: string
}

export class _PlayerStats {
    summonerID: number
    ChampionStats: _ChampionStats[]
    matchesProcessed: number[]
    region: string

    constructor(summonerID: number, region: string) {
        this.summonerID = summonerID
        this.ChampionStats = []
        this.matchesProcessed = []
        this.region = region
    }

    load(playerStats: RawPlayerStats) {
        this.summonerID = playerStats.summonerId
        this.ChampionStats = playerStats.champions.map(champion => {
            const c = ChampionStats(0, false)
            c.load(champion)
            return c
        })
        this.matchesProcessed = playerStats.matchesProcessed
        this.region = playerStats.region
    }

    editExistingChampion(championID: number, didWin: boolean, matchID: number) {
        const { ChampionStats } = this
        const i = ChampionStats.findIndex(({ id }) => id === championID)
        if (didWin) {
            ChampionStats[i].incrementWins()
        } else {
            ChampionStats[i].incrementLosses()
        }
        this.matchesProcessed.push(matchID)
    }

    pushChampion(ChampionStat: _ChampionStats, matchID: number) {
        const { ChampionStats } = this
        ChampionStats.push(ChampionStat)
        this.matchesProcessed.push(matchID)
    }

    containsChampion(championID: number) {
        const { ChampionStats } = this
        return ChampionStats.find(({ id }) => id === championID)
    }

    containsMatch(matchID: number) {
        const { matchesProcessed } = this
        return matchesProcessed.some(id => id === matchID)
    }

    doesNotContainMatch(matchID: number) {
        return !this.containsMatch(matchID)
    }

    asObject(): RawPlayerStats {
        const { summonerID, ChampionStats, region } = this

        return {
            summonerId: summonerID,
            champions: ChampionStats.map(el => el.asObject()),
            matchesProcessed: this.matchesProcessed,
            region,
        }
    }
}

const PlayerStats = (summonerID: number, region: string) =>
    new _PlayerStats(summonerID, region)

export const loadPlayerStats = (playerStats: RawPlayerStats) => {
    const p = PlayerStats(0, "")
    p.load(playerStats)
    return p
}
export default PlayerStats

export interface RawChampionStats {
    id: number
    stats: {
        wins: number
        losses: number
        totalSessionsPlayed: number
    }
}

export class _ChampionStats {
    id: number
    wins: number
    losses: number

    constructor(id: number, win: boolean) {
        this.id = id
        this.wins = win ? 1 : 0
        this.losses = win ? 0 : 1
    }

    load(championStats: RawChampionStats) {
        this.id = championStats.id
        this.wins = championStats.stats.wins
        this.losses = championStats.stats.losses
    }

    incrementWins() {
        this.wins += 1
    }

    incrementLosses() {
        this.losses += 1
    }

    asObject(): RawChampionStats {
        const { id, wins, losses } = this

        return {
            id,
            stats: {
                wins,
                losses,
                totalSessionsPlayed: wins + losses, // kinda unnecessary
            },
        }
    }
}

const ChampionStats = (id: number, win: boolean) => new _ChampionStats(id, win)

export default ChampionStats

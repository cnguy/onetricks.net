class _ChampionStats {
  constructor(id, win) {
    this.id = parseInt(id);
    this.wins = win ? 1 : 0;
    this.losses = win ? 0 : 1;
  }

  incrementWins() {
    this.wins += 1;
  }

  incrementLosses() {
    this.losses += 1;
  }

  asObject() {
    const { id, wins, losses } = this;

    return ({
      id,
      stats: {
        wins,
        losses,
        totalSessionsPlayed: wins + losses, // kinda unnecessary
      }
    })
  }
}

const ChampionStats = (id, win) =>
  new _ChampionStats(id, win);

export default ChampionStats;
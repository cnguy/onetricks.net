class _PlayerStats {
  constructor(summonerID) {
    this.summonerID = parseInt(summonerID);
    this.ChampionStats = [];
    this.matchesProcessed = [];
  }

  pushChampion(ChampionStat, matchID) {
    const { ChampionStats } = this;
    ChampionStats.push(ChampionStat);
    this.matchesProcessed.push(matchID);
  }

  asObject() {
    const { summonerID, ChampionStats } = this;

    return ({
      summonerId: summonerID,
      champions: ChampionStats.map(el => el.asObject()),
      matchesProcessed: this.matchesProcessed,
    });
  }
}

const PlayerStats = (summonerID, ChampionStats) =>
  new _PlayerStats(summonerID, ChampionStats);

export default PlayerStats;

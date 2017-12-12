class OneTrick {
  constructor(summonerID, summonerName, championName) {
    this.summonerID = summonerID;
    this.summonerName = summonerName;
    this.championName = championName;
  }

  asObject() {
    return {
      [summonerID]: {
        champ: championName,
        id: summonerID,
        name: summonerName,
      }
    }
  }
};

export default (summonerID, summonerName, championName) => new OneTrick(summonerID, summonerName, championName);
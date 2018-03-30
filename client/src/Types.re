type player = {
  championName: string,
  id: int,
  name: string,
  rank: Rank.rank,
  region: Region.region,
  wins: int,
  losses: int,
};

type players = list(player);

type oneTrick = {
  champion: string,
  players,
};

type oneTricks = list(oneTrick);
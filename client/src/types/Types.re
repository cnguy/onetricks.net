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

type kda = {
  kills: int,
  deaths: int,
  assists: int,
};

type summonerSpells = {
  d: int,
  f: int,
};

type perks = {
  perk0: int,
  perk0Var1: int,
  perk0Var2: int,
  perk0Var3: int,
  perk1: int,
  perk1Var1: int,
  perk1Var2: int,
  perk1Var3: int,
  perk2: int,
  perk2Var1: int,
  perk2Var2: int,
  perk2Var3: int,
  perk3: int,
  perk3Var1: int,
  perk3Var2: int,
  perk3Var3: int,
  perk4: int,
  perk4Var1: int,
  perk4Var2: int,
  perk4Var3: int,
  perk5: int,
  perk5Var1: int,
  perk5Var2: int,
  perk5Var3: int,
  perkPrimaryStyle: int,
  perkSubStyle: int,
};

type miniGameRecord = {
  gameId: int,
  region: Region.region,
  summonerId: int,
  accountId: int,
  name: string,
  championId: int,
  timestamp: int,
  role: Role.role,
  kda,
  didWin: bool,
  items: list(int),
  trinket: int,
  summonerSpells,
  perks,
};

type miniGameRecords = list(miniGameRecord);

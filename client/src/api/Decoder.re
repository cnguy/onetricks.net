open Types;

let player = json =>
  Json.Decode.{
    championName: json |> field("champ", string),
    id: json |> field("id", int),
    name: json |> field("name", string),
    rank: json |> field("rank", string) |> Rank.fromString,
    region: json |> field("region", string) |> Region.fromString,
    wins: json |> field("wins", int),
    losses: json |> field("losses", int),
  };

let kda = json =>
  Json.Decode.{
    kills: json |> field("kills", int),
    deaths: json |> field("deaths", int),
    assists: json |> field("assists", int),
  };

let summonerSpells = json =>
  Json.Decode.{d: json |> field("d", int), f: json |> field("f", int)};

let perks = json =>
  Json.Decode.{
    perk0: json |> field("perk0", int),
    perk0Var1: json |> field("perk0Var1", int),
    perk0Var2: json |> field("perk0Var2", int),
    perk0Var3: json |> field("perk0Var3", int),
    perk1: json |> field("perk1", int),
    perk1Var1: json |> field("perk1Var1", int),
    perk1Var2: json |> field("perk1Var2", int),
    perk1Var3: json |> field("perk1Var3", int),
    perk2: json |> field("perk2", int),
    perk2Var1: json |> field("perk2Var1", int),
    perk2Var2: json |> field("perk2Var2", int),
    perk2Var3: json |> field("perk2Var3", int),
    perk3: json |> field("perk3", int),
    perk3Var1: json |> field("perk3Var1", int),
    perk3Var2: json |> field("perk3Var2", int),
    perk3Var3: json |> field("perk3Var3", int),
    perk4: json |> field("perk4", int),
    perk4Var1: json |> field("perk4Var1", int),
    perk4Var2: json |> field("perk4Var2", int),
    perk4Var3: json |> field("perk4Var3", int),
    perk5: json |> field("perk5", int),
    perk5Var1: json |> field("perk5Var1", int),
    perk5Var2: json |> field("perk5Var2", int),
    perk5Var3: json |> field("perk5Var3", int),
    perkPrimaryStyle: json |> field("perkPrimaryStyle", int),
    perkSubStyle: json |> field("perkSubStyle", int),
  };

let miniGameRecord = json =>
  Json.Decode.{
    gameId: json |> field("gameId", int),
    region: json |> field("region", string) |> Region.fromString,
    summonerId: json |> field("summonerId", int),
    accountId: json |> field("accountId", int),
    name: json |> field("name", string),
    championId: json |> field("championId", int),
    timestamp: json |> field("timestamp", int),
    role: json |> field("role", string) |> Role.fromString,
    kda: json |> field("kda", kda),
    didWin: json |> field("didWin", bool),
    items: json |> field("items", list(int)),
    trinket: json |> field("trinket", int),
    summonerSpells: json |> field("summonerSpells", summonerSpells),
    perks: json |> field("perks", perks),
  };

let players = json => json |> Json.Decode.list(player);

let miniGameRecords = json => json |> Json.Decode.list(miniGameRecord);

let championId = json => json |> Json.Decode.int;

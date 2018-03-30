open Types;

module Decode = {
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
  let players = json => json |> Json.Decode.list(player);
};
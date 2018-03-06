type sort =
  | Region
  | Rank
  | Name
  | Wins
  | Losses
  | WinRate
  | None;

let toString = sortStr =>
  switch sortStr {
  | Region => "REGION"
  | Rank => "RANK"
  | Name => "NAME"
  | Wins => "WINS"
  | Losses => "LOSSES"
  | WinRate => "WINRATE"
  | None => "NONE"
  };

let fromString = sort =>
  switch sort {
  | "REGION" => Region
  | "RANK" => Rank
  | "NAME" => Name
  | "WINS" => Wins
  | "LOSSES" => Losses
  | "WINRATE" => WinRate
  | "NONE" => None
  | _ => None
  };
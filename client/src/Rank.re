type rank =
  | None
  | All
  | Challenger
  | Masters;

let toRoute = (rank: rank) =>
  switch (rank) {
  | All => ""
  | Challenger => "?rank=challenger"
  | Masters => "?rank=masters"
  };

let fromString = (rankStr: string) =>
  switch (rankStr) {
  | "c" => Challenger
  | "m" => Masters
  | _ => None
  };

let toString = (rank: rank) =>
  switch (rank) {
  | None => ""
  | Challenger => "c"
  | Masters => "m"
  };
type rank =
  | All
  | Challenger
  | Masters;

let toRoute = (rank: rank) =>
  switch (rank) {
  | All => ""
  | Challenger => "?rank=challenger"
  | Masters => "?rank=masters"
  };
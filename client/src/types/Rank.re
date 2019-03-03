type rank =
  | All
  | Challenger
  | Grandmasters
  | Masters;

type ranks = list(rank);

let toRoute = (rank: rank) =>
  switch (rank) {
  | All => ""
  | Challenger => "?rank=challenger"
  | Grandmasters => "?rank=grandmasters"
  | Masters => "?rank=masters"
  };

let fromString = (rankStr: string) =>
  switch (rankStr) {
  | "c" => Challenger
  | "g" => Grandmasters
  | "m" => Masters
  | _ => All
  };

let toString = (rank: rank) =>
  switch (rank) {
  | Challenger => "c"
  | Grandmasters => "g"
  | Masters => "m"
  | _ => ""
  };

let toCsvString = (ranks: ranks) => {
  let tmp: string =
    ranks
    |> List.fold_left(
         (total, current) =>
           total ++ "," ++ String.uppercase(current |> toString),
         "",
       );
  if (String.length(tmp) > 0) {
    String.sub(tmp, 1, String.length(tmp) - 1);
  } else {
    "";
  };
};
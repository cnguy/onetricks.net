type rank =
  | All
  | Challenger
  | Masters;

type ranks = list(rank);

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
  | _ => All
  };

let toString = (rank: rank) =>
  switch (rank) {
  | Challenger => "c"
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

type rank =
  | None
  | All
  | Challenger
  | Masters;

type ranks = list(rank);

let toRoute = (rank: rank) =>
  switch (rank) {
  | All => ""
  | Challenger => "?rank=challenger"
  | Masters => "?rank=masters"
  | _ => ""
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
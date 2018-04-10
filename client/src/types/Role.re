type role =
  | Top
  | Jungle
  | Middle
  | DuoCarry
  | Support;

type roles = list(role);

let toInt = (role: role) =>
  switch (role) {
  | Top => 1
  | Jungle => 2
  | Middle => 3
  | DuoCarry => 4
  | Support => 5
  };

let toCsvString = (roles: roles) => {
  let tmp: string =
    roles
    |> List.fold_left(
         (total, current) =>
           total ++ "," ++ String.uppercase(current |> toInt |> string_of_int),
         "",
       );
  if (String.length(tmp) > 0) {
    String.sub(tmp, 1, String.length(tmp) - 1);
  } else {
    "";
  };
};
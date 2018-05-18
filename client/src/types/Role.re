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

let fromString = (roleStr: string) =>
  switch (roleStr) {
  | "TOP" => Top
  | "JUNGLE" => Jungle
  | "MID" => Middle
  | "BOT_CARRY" => DuoCarry
  | "BOT_SUPPORT" => Support
  | _ => failwith("Invalid role string.")
  };

let toString = (role: role) =>
  switch (role) {
  | Top => "TOP"
  | Jungle => "JUNGLE"
  | Middle => "MID"
  | DuoCarry => "DUO CARRY"
  | Support => "SUPPORT"
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
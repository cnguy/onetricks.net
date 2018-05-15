type lane =
  | Top
  | Jungle
  | Middle
  | Bottom;

let fromString = (laneStr: string) =>
  switch (laneStr) {
  | "TOP" => Top
  | "JUNGLE" => Jungle
  | "MID" => Middle
  | "BOTTOM" => Bottom
  | _ => failwith("Invalid lane string.")
  };

let toString = (lane: lane) =>
  switch (lane) {
  | Top => "TOP"
  | Jungle => "JUNGLE"
  | Middle => "MID"
  | Bottom => "BOTTOM"
  };
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
  };

let toString = (lane: lane) =>
  switch (lane) {
  | Top => "TOP"
  | Jungle => "JUNGLE"
  | Middle => "MID"
  | Bottom => "BOTTOM"
  };
type region =
  | All
  | NorthAmerica
  | Korea
  | EuropeWest
  | EuropeEast
  | LatinNorthAmerica
  | LatinSouthAmerica
  | Brazil
  | Japan
  | Turkey
  | Russia
  | Oceania;

type regions = list(region);

let list = [
  NorthAmerica,
  Korea,
  EuropeWest,
  EuropeEast,
  LatinNorthAmerica,
  LatinSouthAmerica,
  Brazil,
  Japan,
  Turkey,
  Russia,
  Oceania,
];

let toString = region =>
  switch (region) {
  | All => "all"
  | NorthAmerica => "na"
  | Korea => "kr"
  | EuropeWest => "euw"
  | EuropeEast => "eune"
  | LatinNorthAmerica => "lan"
  | LatinSouthAmerica => "las"
  | Brazil => "br"
  | Japan => "jp"
  | Turkey => "tr"
  | Russia => "ru"
  | Oceania => "oce"
  };

let fromString = regionStr =>
  switch (regionStr) {
  | "na" => NorthAmerica
  | "kr" => Korea
  | "euw" => EuropeWest
  | "eune" => EuropeEast
  | "lan" => LatinNorthAmerica
  | "las" => LatinSouthAmerica
  | "br" => Brazil
  | "jp" => Japan
  | "tr" => Turkey
  | "ru" => Russia
  | "oce" => Oceania
  | _ => All
  };

let toStringList = (regions: regions) => regions |> List.map(toString);

let toReadableStringList = (regions: list(string)) : string => {
  let tmp: string =
    regions
    |> List.fold_left(
         (total, current) => total ++ ", " ++ String.uppercase(current),
         "",
       );
  if (String.length(tmp) > 0) {
    String.sub(tmp, 1, String.length(tmp) - 1);
  } else {
    "";
  };
};

let toDisplayText =
    (~isMultiRegionFilterOn: bool, ~region: region, ~regions: regions) =>
  if (isMultiRegionFilterOn) {
    if (regions == list) {
      "All Regions.";
    } else {
      (regions |> toStringList |> toReadableStringList) ++ " Regions.";
    };
  } else if (region == All) {
    "All Regions.";
  } else {
    "the " ++ (region |> toString |> String.uppercase) ++ " Region.";
  };

let toCsvString = (regions: regions) => {
  let rs =
    switch (regions) {
    | [All] => list
    | _ => regions
    };
  let tmp: string =
    rs
    |> List.fold_left(
         (total, current) =>
           total
           ++ ","
           ++ (String.uppercase(current |> toString) |> String.lowercase),
         "",
       );
  if (String.length(tmp) > 0) {
    String.sub(tmp, 1, String.length(tmp) - 1);
  } else {
    "";
  };
};
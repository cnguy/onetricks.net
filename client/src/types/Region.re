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
  | Oceania
  | None;

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
  | _ => "???"
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
  | "all" => All
  | _ => None
  };

let toStringList = (regions: list(region)) => regions |> List.map(toString);

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
    (~isMultiRegionFilterOn: bool, ~region: region, ~regions: list(region)) =>
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
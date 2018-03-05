let regions = [|
  "na",
  "kr",
  "euw",
  "eune",
  "lan",
  "las",
  "br",
  "jp",
  "tr",
  "ru",
  "oce"
|];

type region =
  | NA
  | KR
  | EUW
  | EUNE
  | LAN
  | LAS
  | BR
  | JP
  | TR
  | RU
  | OCE
  | UNKNOWN;

let allRegions = [NA, KR, EUW, EUNE, LAN, LAS, BR, JP, TR, RU, OCE];

let regionToString = (region: region) =>
  switch region {
  | NA => "na"
  | KR => "kr"
  | EUW => "eune"
  | EUNE => "eune"
  | LAN => "lan"
  | LAS => "las"
  | BR => "br"
  | JP => "jp"
  | TR => "tr"
  | RU => "ru"
  | OCE => "oce"
  | _ => "???"
  };

let regionFromString = (regionStr: string) =>
  switch regionStr {
  | "na" => NA
  | "kr" => KR
  | "euw" => EUW
  | "eune" => EUNE
  | "lan" => LAN
  | "las" => LAS
  | "br" => BR
  | "jp" => JP
  | "tr" => TR
  | "ru" => RU
  | "oce" => OCE
  | _ => UNKNOWN
  };

let isValidRegion = (region: region) : bool => allRegions |> List.mem(region);

let isValidRegionStr = (region: string) : bool =>
  allRegions |> List.mem(regionFromString(region));
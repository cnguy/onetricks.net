open Types;

let parseIntoOneTricks = (decoded: players) : oneTricks =>
  decoded
  |> List.fold_left(
       (total, curr: player) => {
         let oneTrick = {champion: curr.championName, players: [curr]};
         if (total |> List.exists(el => el.champion == curr.championName)) {
           let target =
             total |> List.find(el => el.champion == curr.championName);
           let merged = {
             champion: curr.championName,
             players: target.players |> List.append(oneTrick.players),
           };
           total
           |> List.filter(el => el.champion != curr.championName)
           |> List.append([merged]);
         } else {
           total |> List.append([oneTrick]);
         };
       },
       [],
     );

/* TODO: Add API call handling before fallback. Use repromise let-bindings? */
let url =
  switch (Environment.nodeEnv()) {
  | Environment.Production => "http://api.onetricks.net"
  | Environment.Development => "http://localhost"
  };

let fallbackGet = (cb: oneTricks => unit) : unit => {
  Js.Promise.(
    Fetch.fetch("http://media.onetricks.net/api/fallback-3-26-2018.json")
    |> then_(Fetch.Response.json)
    |> then_(payload =>
         payload |> Decoder.players |> parseIntoOneTricks |> cb |> resolve
       )
    |> catch(error => Js.log(error) |> resolve)
    |> resolve
  )
  |> ignore;
  ();
};

let get = (cb: oneTricks => unit) =>
  Js.Promise.(
    Fetch.fetch(url ++ "/one-tricks")
    |> then_(Fetch.Response.json)
    |> then_(payload =>
         payload |> Decoder.players |> parseIntoOneTricks |> cb |> resolve
       )
    |> catch(_error => cb |> fallbackGet |> resolve)
  )
  |> ignore;

let getChampionIdFromName = (championName: string, cb: option(int) => unit) => {
  let requestURL =
    url
    ++ "/static-champion-by-name/"
    ++ OneTricksHelpers.capitalizeChampion(championName)
    ++ "/id";
  Js.Promise.(
    Fetch.fetch(requestURL)
    |> then_(Fetch.Response.json)
    |> then_(payload => Some(Decoder.championId(payload)) |> cb |> resolve)
    |> catch(_error => None |> cb |> resolve)
  );
};

let getMatchHistoryForChampionAndRegions =
    (
      ~ranks: Rank.ranks,
      ~regions: Region.regions,
      ~championId: int,
      ~roles: Role.roles,
      cb: option(miniGameRecords) => unit,
    ) => {
  let requestURL =
    url
    ++ "/match-history"
    ++ "?championId="
    ++ string_of_int(championId)
    ++ "&ranks="
    ++ Rank.toCsvString(ranks)
    ++ "&regions="
    ++ Region.toCsvString(regions)
    ++ "&roleNumbers="
    ++ (roles |> Role.toCsvString);
  Js.Promise.(
    Fetch.fetch(requestURL)
    |> then_(Fetch.Response.json)
    |> then_(payload =>
         Some(Decoder.miniGameRecords(payload)) |> cb |> resolve
       )
    |> catch(_error => None |> cb |> resolve)
  )
  |> ignore;
};
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
  (
    switch (Environment.Production /* env */) {
    | Environment.Production => "http://104.131.26.226"
    | Environment.Development =>
      "https://cors-anywhere.herokuapp.com/" ++ Environment.getNgrokURL()
    | Environment.None => ""
    }
  )
  ++ "/all?region=all";

let get = (cb: oneTricks => unit) =>
  Js.Promise.(
    Fetch.fetch("https://media.onetricks.net/api/fallback-3-26-2018.json")
    |> then_(Fetch.Response.json)
    |> then_(payload =>
         payload |> Decoder.players |> parseIntoOneTricks |> cb |> resolve
       )
    |> catch(error => Js.log(error) |> resolve)
  )
  |> ignore;
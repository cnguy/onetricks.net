type route =
  | Home
  | PlayersView(string, Rank.rank)
  | Matchups(string)
  | MatchHistory(string, Rank.rank)
  | FAQ
  | RiotEndorsement
  | NotFound;

let routeFromUrl = (url: ReasonReact.Router.url) =>
  switch (url.path, url.search) {
  | ([], _) => Home
  | (["champions", championName], "") => PlayersView(championName, Rank.All)
  | (["champions", championName], "rank=challenger") =>
    PlayersView(championName, Rank.Challenger)
  | (["champions", championName], "rank=masters") =>
    PlayersView(championName, Rank.Masters)
  | (["champions", championName, "matchups"], "") => Matchups(championName)
  | (["champions", championName, "history"], "") =>
    MatchHistory(championName, Rank.All)
  | (["champions", championName, "history"], "rank=challenger") =>
    MatchHistory(championName, Rank.Challenger)
  | (["champions", championName, "history"], "rank=masters") =>
    MatchHistory(championName, Rank.Masters)
  | (["faq"], "") => FAQ
  | (["riot-endorsement"], "") => RiotEndorsement
  | _ => NotFound
  };

let routeToUrl = (route: route) =>
  switch (route) {
  | Home => "/"
  | PlayersView(championName, rank) =>
    "/champions/" ++ championName ++ Rank.toRoute(rank)
  | Matchups(championName) => "/champions/" ++ championName ++ "/matchups"
  | MatchHistory(championName, rank) =>
    "/champions/" ++ championName ++ "/history" ++ Rank.toRoute(rank)
  | FAQ => "/faq"
  | RiotEndorsement => "/riot-endorsement"
  | NotFound => "/404"
  };
type route =
  | Home
  | PlayersView(string, Rank.rank)
  | Matchups(string)
  | MatchHistory(string)
  | FAQ
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
    MatchHistory(championName)
  | (["faq"], "") => FAQ
  | _ => NotFound
  };

let routeToUrl = (route: route) =>
  switch (route) {
  | Home => "/"
  | PlayersView(championName, rank) =>
    "/champions/" ++ championName ++ Rank.toRoute(rank)
  | Matchups(championName) => "/champions/" ++ championName ++ "/matchups"
  | MatchHistory(championName) => "/champions/" ++ championName ++ "/history"
  | FAQ => "/faq"
  | NotFound => "/404"
  };
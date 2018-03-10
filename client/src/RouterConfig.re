type route =
  | Home
  | PlayersView(string, Rank.rank)
  | NotFound;

let routeFromUrl = (url: ReasonReact.Router.url) =>
  switch (url.path, url.search) {
  | ([], _) => Home
  | (["champions", championName], "") => PlayersView(championName, Rank.All)
  | (["champions", championName], "rank=challenger") =>
    PlayersView(championName, Rank.Challenger)
  | (["champions", championName], "rank=masters") =>
    PlayersView(championName, Rank.Masters)
  | _ => NotFound
  };

let routeToUrl = (route: route) =>
  switch (route) {
  | Home => "/"
  | PlayersView(championName, rank) =>
    "/champions/" ++ championName ++ Rank.toRoute(rank)
  | NotFound => "/404"
  };
type route =
  | Home
  | PlayersView(string, Rank.rank)
  | Matchups(string, Rank.rank)
  | MatchHistory(string, Rank.rank)
  | RunesSummonersItems(string, Rank.rank)
  | FAQ
  | FeatureRequests
  | RiotEndorsement
  | NotFound;

let routeFromUrl = (url: ReasonReact.Router.url) =>
  switch (url.path, url.search) {
  | ([], _) => Home
  | (["champions", championName], "") => PlayersView(championName, Rank.All)
  | (["champions", championName], "rank=challenger") =>
    PlayersView(championName, Rank.Challenger)
  | (["champions", championName], "rank=grandmasters") =>
    PlayersView(championName, Rank.Grandmasters)
  | (["champions", championName], "rank=masters") =>
    PlayersView(championName, Rank.Masters)
  | (["champions", championName, "matchups"], "") =>
    Matchups(championName, Rank.All)
  | (["champions", championName, "matchups"], "rank=challenger") =>
    Matchups(championName, Rank.Challenger)
  | (["champions", championName, "matchups"], "rank=masters") =>
    Matchups(championName, Rank.Masters)
  | (["champions", championName, "history"], "") =>
    MatchHistory(championName, Rank.All)
  | (["champions", championName, "history"], "rank=challenger") =>
    MatchHistory(championName, Rank.Challenger)
  | (["champions", championName, "history"], "rank=masters") =>
    MatchHistory(championName, Rank.Masters)
  | (["champions", championName, "runes-summoners-items"], "") =>
    RunesSummonersItems(championName, Rank.All)
  | (["champions", championName, "runes-summoners-items"], "rank=challenger") =>
    RunesSummonersItems(championName, Rank.Challenger)
  | (["champions", championName, "runes-summoners-items"], "rank=masters") =>
    RunesSummonersItems(championName, Rank.Masters)
  | (["faq"], "") => FAQ
  | (["feature-requests"], "") => FeatureRequests
  | (["riot-endorsement"], "") => RiotEndorsement
  | _ => NotFound
  };

let routeToUrl = (route: route) =>
  switch (route) {
  | Home => "/"
  | PlayersView(championName, rank) =>
    "/champions/" ++ championName ++ Rank.toRoute(rank)
  | Matchups(championName, rank) =>
    "/champions/" ++ championName ++ "/matchups" ++ Rank.toRoute(rank)
  | MatchHistory(championName, rank) =>
    "/champions/" ++ championName ++ "/history" ++ Rank.toRoute(rank)
  | RunesSummonersItems(championName, rank) =>
    "/champions/"
    ++ championName
    ++ "/runes-summoners-items"
    ++ Rank.toRoute(rank)
  | FAQ => "/faq"
  | FeatureRequests => "/feature-requests"
  | RiotEndorsement => "/riot-endorsement"
  | NotFound => "/404"
  };

let isRouteOrSubroute = (url: ReasonReact.Router.url, ~ofRoute: route): bool => {
  let currentRoute = url |> routeFromUrl;
  currentRoute == ofRoute;
};
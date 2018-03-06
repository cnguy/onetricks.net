type route =
  | Home
  | PlayersView(string)
  | NotFound;

let routeFromUrl = (url: ReasonReact.Router.url) =>
  switch (url.path, url.search) {
  | ([""], _) => Home
  | (["champions", championName], "") => PlayersView(championName)
  | _ => NotFound
  };

let routeToUrl = (route: route) =>
  switch route {
  | Home => "/"
  | PlayersView(championName) => "/champions/" ++ championName
  | NotFound => "/404"
  };
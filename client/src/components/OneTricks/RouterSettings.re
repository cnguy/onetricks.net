module RouterConfig = {
  type route =
    | Home
    | PlayersViewAllRegionsSinglePick(string)
    | PlayersViewSingleRegion(string, Constants.region)
    | PlayersViewMultipleRegionNoneSelected(string)
    | PlayersViewOneOrMoreSelected(string, list(Constants.region))
    | NotFound;
  let routeFromUrl = (url: ReasonReact.Router.url) =>
    switch (url.path, url.search) {
    | ([""], _) => Home
    | (["champions", championName], "") =>
      PlayersViewAllRegionsSinglePick(championName)
    | (["champions", championName, region], "") =>
      if (Constants.isValidRegionStr(region)) {
        PlayersViewSingleRegion(
          championName,
          Constants.regionFromString(region)
        );
      } else {
        NotFound;
      }
    | (["champions", championName], "?regions=none") =>
      PlayersViewMultipleRegionNoneSelected(championName)
    | (["champions", championName], regions) =>
      if (String.length(regions) > 7) {
        let splitPoint = String.length("regions"); /* clarity */
        let pre = String.sub(regions, 0, splitPoint);
        let post = Js.String.substr(splitPoint + 1, regions);
        let regionsFromQuery =
          switch pre {
          | "regions" =>
            Js.String.splitByRe(Js.Re.fromString(","), post)
            |> Array.to_list
            |> List.map(Constants.regionFromString)
          | _ => []
          };
        if (regionsFromQuery |> List.mem(Constants.UNKNOWN)) {
          NotFound;
        } else {
          PlayersViewOneOrMoreSelected(championName, regionsFromQuery);
        };
      } else {
        NotFound;
      }
    | _ => NotFound
    };
  let routeToUrl = (route: route) =>
    switch route {
    | Home => "/"
    | PlayersViewAllRegionsSinglePick(championName) =>
      "/champions/" ++ championName
    | PlayersViewSingleRegion(championName, region) =>
      "/champions/" ++ championName ++ "/" ++ Constants.regionToString(region)
    | PlayersViewMultipleRegionNoneSelected(championName) =>
      "/champions/" ++ championName ++ "?region=none"
    | PlayersViewOneOrMoreSelected(championName, regions) =>
      let regionsQuery =
        regions
        |> List.map(Constants.regionToString)
        |> Constants.regionQueryToCsvList;
      "/champions/" ++ championName ++ "?region=" ++ regionsQuery;
    | NotFound => "/404"
    };
};
module RouterConfig = {
  type route =
    | HOME
    | PLAYERS_VIEW_ALL_REGIONS_SINGLE_PICK(string)
    | PLAYERS_VIEW_SINGLE_REGION(string, Constants.region)
    | PLAYERS_VIEW_MULTIPLE_PICK_NO_REGION(string)
    | PLAYERS_VIEW_MULTIPLE_PICK(string, list(Constants.region))
    | NOT_FOUND;
  let routeFromUrl = (url: ReasonReact.Router.url) =>
    switch (url.path, url.search) {
    | ([""], _) => HOME
    | (["champions", championName], "") =>
      PLAYERS_VIEW_ALL_REGIONS_SINGLE_PICK(championName)
    | (["champions", championName, region], "") =>
      if (Constants.isValidRegionStr(region)) {
        PLAYERS_VIEW_SINGLE_REGION(
          championName,
          Constants.regionFromString(region)
        );
      } else {
        NOT_FOUND;
      }
    | (["champions", championName], "?regions=none") =>
      PLAYERS_VIEW_MULTIPLE_PICK_NO_REGION(championName)
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
          NOT_FOUND;
        } else {
          PLAYERS_VIEW_MULTIPLE_PICK(championName, regionsFromQuery);
        };
      } else {
        NOT_FOUND;
      }
    | _ => NOT_FOUND
    };
  let routeToUrl = (route: route) =>
    switch route {
    | HOME => "/"
    | PLAYERS_VIEW_ALL_REGIONS_SINGLE_PICK(championName) =>
      "/champions/" ++ championName
    | PLAYERS_VIEW_SINGLE_REGION(championName, region) =>
      "/champions/" ++ championName ++ "/" ++ Constants.regionToString(region)
    | PLAYERS_VIEW_MULTIPLE_PICK_NO_REGION(championName) =>
      "/champions/" ++ championName ++ "?region=none"
    | PLAYERS_VIEW_MULTIPLE_PICK(championName, regions) =>
      let regionsQuery =
        regions
        |> List.map(Constants.regionToString)
        |> Constants.regionQueryToCsvList;
      "/champions/" ++ championName ++ "?region=" ++ regionsQuery;
    | NOT_FOUND => "/404"
    };
};
type action =
  /* misc actions */
  | ResetSearchKey
  | SetRegion(string)
  | SetSearchKey(string)
  | SetSortKey(Sort.sort)
  | SetChampionIconsSortKey(Sorts.oneTricksListSort)
  | ToggleMultiRegionFilter
  | ToggleMerge
  | ToggleRegion(string)
  | Nothing;

type championPane = {
  searchKey: string,
  sortBy: Sorts.oneTricksListSort,
  threshholdCountToShow: int,
};

type misc = {
  areChampionPanesMerged: bool,
  region: Region.region,
  regions: list(Region.region),
  isMultiRegionFilterOn: bool,
  areImagesLoaded: bool,
};

type playersView = {
  sortKey: Sort.sort,
  shouldSortReverse: bool,
};

type state = {
  championPane,
  misc,
  playersView,
};

module Router = ReRoute.CreateRouter(RouterConfig);

let component = ReasonReact.reducerComponent("OneTricksRe");

let make =
    (~allOneTricks: array(JsTypes.oneTrick), ~areImagesLoaded, _children) => {
  ...component,
  initialState: () => {
    championPane: {
      searchKey: "",
      sortBy: Sorts.Number,
      threshholdCountToShow: 0,
    },
    misc: {
      areChampionPanesMerged: true,
      areImagesLoaded: false,
      isMultiRegionFilterOn: false,
      region: Region.All,
      regions: Region.list,
    },
    playersView: {
      sortKey: Sort.WinRate,
      shouldSortReverse: false,
    },
  },
  reducer: (action, state) =>
    switch (action) {
    | Nothing =>
      Js.log("Nothing will happen");
      ReasonReact.Update(state);
    | SetRegion(value) =>
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          region: Region.fromString(value),
        },
      })
    | SetSearchKey(value) =>
      ReasonReact.Update({
        ...state,
        championPane: {
          ...state.championPane,
          searchKey: String.lowercase(value),
        },
      })
    | SetSortKey(sortKey) =>
      ReasonReact.Update({
        ...state,
        playersView: {
          sortKey,
          shouldSortReverse:
            if (sortKey == state.playersView.sortKey) {
              ! state.playersView.shouldSortReverse;
            } else {
              false;
            },
        },
      })
    | SetChampionIconsSortKey(sortKey) =>
      ReasonReact.Update({
        ...state,
        championPane: {
          ...state.championPane,
          sortBy: sortKey,
        },
      })
    | ToggleMultiRegionFilter =>
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          regions:
            if (state.misc.isMultiRegionFilterOn) {
              [];
            } else if (Region.toString(state.misc.region) == "all") {
              Region.list;
            } else {
              [state.misc.region];
            },
          isMultiRegionFilterOn: ! state.misc.isMultiRegionFilterOn,
        },
      })
    | ToggleMerge =>
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          areChampionPanesMerged: ! state.misc.areChampionPanesMerged,
        },
      })
    | ToggleRegion(r) =>
      let region = Region.fromString(r);
      let newRegions =
        if (state.misc.regions |> List.mem(region)) {
          state.misc.regions |> List.filter(r => r !== region);
        } else {
          List.append(state.misc.regions, [region]);
        };
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          regions: newRegions,
        },
      });
    | _ => ReasonReact.Update(state)
    },
  subscriptions: _self => [
    Sub(
      () =>
        ReasonReact.Router.watchUrl(url =>
          GoogleAnalytics.send(
            [%bs.raw {| window.location.pathname |}],
            url.search,
          )
        ),
      ReasonReact.Router.unwatchUrl,
    ),
  ],
  render: self => {
    let regionatedOneTricks: array(JsTypes.oneTrick) =
      allOneTricks
      |> Array.to_list
      |> (
        switch (self.state.championPane.sortBy) {
        | Sorts.WinRate => Sorts.oneTricksByWinRate
        | _ => Sorts.numberOfOneTricks
        }
      )
      |> List.map(el => {
           let tmp = el##players |> Array.to_list;
           let newPlayers =
             if (! self.state.misc.isMultiRegionFilterOn
                 && Region.toString(self.state.misc.region) == "all") {
               /* optimization */
               tmp;
             } else {
               List.filter(
                 (player: JsTypes.player) =>
                   if (! self.state.misc.isMultiRegionFilterOn) {
                     self.state.misc.region
                     == Region.fromString(player##region);
                   } else {
                     self.state.misc.regions
                     |> List.mem(Region.fromString(player##region));
                   },
                 tmp,
               );
             };
           {"players": Array.of_list(newPlayers), "champion": el##champion};
         })
      |> List.filter(el => Array.length(el##players) > 0)
      |> JsHelpers.filterBySearchKey(self.state.championPane.searchKey)
      |> Array.of_list;
    <Router.Container>
      ...(
           (~currentRoute) =>
             <div className="one-tricks-re">
               <Header />
               <ChampionPaneUtilities
                 areChampionPanesMerged=self.state.misc.areChampionPanesMerged
                 isMultiRegionFilterOn=self.state.misc.isMultiRegionFilterOn
                 searchKey=self.state.championPane.searchKey
                 resetSearchKey=(_event => self.send(SetSearchKey("")))
                 regions=(
                   self.state.misc.regions
                   |> Array.of_list
                   |> Array.map(Region.toString)
                 )
                 toggleMerge=(_event => self.send(ToggleMerge))
                 onSearchKeyChange=(
                   event =>
                     self.send(SetSearchKey(Utils.getEventValue(event)))
                 )
                 region=(Region.toString(self.state.misc.region))
                 toggleRegion=(
                   regionValue => self.send(ToggleRegion(regionValue))
                 )
                 toggleMultiRegionFilter=(
                   _event => self.send(ToggleMultiRegionFilter)
                 )
                 setRegionFilter=(
                   event => self.send(SetRegion(Utils.getEventValue(event)))
                 )
                 setChampionIconsSortKey=(
                   value => self.send(SetChampionIconsSortKey(value))
                 )
               />
               (
                 switch (
                   ReasonReact.Router.dangerouslyGetInitialUrl().path,
                   ReasonReact.Router.dangerouslyGetInitialUrl().search,
                 ) {
                 | (["champions", championName, ..._rest], search) =>
                   let baseURL = "/champions/" ++ championName;
                   let newSearch =
                     (String.length(search) > 0 ? "?" : "") ++ search;
                   <ul>
                     <li>
                       <span
                         className="link"
                         onClick=(
                           _event =>
                             ReasonReact.Router.push(baseURL ++ newSearch)
                         )>
                         (Utils.ste("Players"))
                       </span>
                     </li>
                     <li>
                       <span
                         className="link"
                         onClick=(
                           _event =>
                             ReasonReact.Router.push(baseURL ++ "/matchups")
                         )>
                         (Utils.ste("Champion Matchups"))
                       </span>
                     </li>
                     <li>
                       <span
                         className="link"
                         onClick=(
                           _event =>
                             ReasonReact.Router.push(baseURL ++ "/history")
                         )>
                         (Utils.ste("Match History"))
                       </span>
                     </li>
                   </ul>;
                 | _ => ReasonReact.nullElement
                 }
               )
               (
                 switch (currentRoute) {
                 | RouterConfig.Home =>
                   let regionInfoText =
                     Region.toDisplayText(
                       ~isMultiRegionFilterOn=
                         self.state.misc.isMultiRegionFilterOn,
                       ~region=self.state.misc.region,
                       ~regions=self.state.misc.regions,
                     );
                   <ContentPane
                     isMultiRegionFilterOn=self.state.misc.
                                             isMultiRegionFilterOn
                     regions=self.state.misc.regions
                     allPlayers=regionatedOneTricks
                     regionInfoText
                     areChampionPanesMerged=self.state.misc.
                                              areChampionPanesMerged
                     setDisplayValue=(() => "inline")
                     renderEmptyResults=(() => ReasonReact.nullElement)
                     handleImageLoad=(_event => ())
                   />;
                 | RouterConfig.PlayersView(currentChampion, rank) =>
                   let players =
                     regionatedOneTricks
                     |> JsHelpers.filterPlayersByRank(_, ~rank)
                     |> JsHelpers.extractPlayers(~currentChampion, _);
                   if (Array.length(players) == 0) {
                     <div className="empty-results">
                       (
                         Utils.ste(
                           "No players found for the champion: "
                           ++ currentChampion
                           ++ ".",
                         )
                       )
                     </div>;
                   } else {
                     <PlayersView
                       players
                       goBack=(_event => ReasonReact.Router.push("/"))
                       champ=currentChampion
                       show=true
                       onSort=(sortKey => self.send(SetSortKey(sortKey)))
                       sortKey=self.state.playersView.sortKey
                       sortReverse=self.state.playersView.shouldSortReverse
                     />;
                   };
                 | RouterConfig.Matchups(currentChampion) =>
                   <div>
                     (
                       Utils.ste(
                         "Matchups will be implemented in the near future!",
                       )
                     )
                   </div>
                 | RouterConfig.MatchHistory(currentChampion) =>
                   <div>
                     (
                       Utils.ste(
                         "Match history will be implemented in the near future!",
                       )
                     )
                   </div>
                 | RouterConfig.NotFound => <NotFound />
                 }
               )
               <FAQ />
               <Copyright />
             </div>
         )
    </Router.Container>;
  },
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~allOneTricks=jsProps##allOneTricks,
      ~areImagesLoaded=jsProps##areImagesLoaded,
      jsProps##children,
    )
  );
open Types;

type action =
  | ResetSearchKey
  | SetRegion(string)
  | SetSearchKey(string)
  | SetSortKey(Sort.sort)
  | SetChampionIconsSortKey(Sorts.oneTricksListSort)
  | SetOneTricks(oneTricks)
  | ToggleMultiRegionFilter
  | ToggleMerge
  | ToggleRegion(string)
  | Nothing;

type championPane = {
  searchKey: string,
  sortBy: Sorts.oneTricksListSort,
  threshholdCountToShow: int,
  oneTricks,
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

let make = _children => {
  ...component,
  initialState: () => {
    championPane: {
      searchKey: "",
      sortBy: Sorts.Number,
      threshholdCountToShow: 0,
      oneTricks: [],
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
    | SetOneTricks(oneTricks) =>
      ReasonReact.Update({
        ...state,
        championPane: {
          ...state.championPane,
          oneTricks,
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
  didMount: self => {
    OneTricksService.get(payload => self.send(SetOneTricks(payload)));
    NoUpdate;
  },
  render: self => {
    let regionatedOneTricks: oneTricks =
      self.state.championPane.oneTricks
      |> (
        switch (self.state.championPane.sortBy) {
        | Sorts.WinRate => Sorts.oneTricksByWinRate
        | _ => Sorts.numberOfOneTricks
        }
      )
      |> List.map(({champion, players}) => {
           let newPlayers =
             if (! self.state.misc.isMultiRegionFilterOn
                 && Region.toString(self.state.misc.region) == "all") {
               /* optimization */
               players;
             } else {
               players
               |> List.filter((player: player) =>
                    self.state.misc.isMultiRegionFilterOn ?
                      self.state.misc.regions |> List.mem(player.region) :
                      self.state.misc.region === player.region
                  );
             };
           {champion, players: newPlayers};
         })
      |> List.filter(({players}) => List.length(players) > 0)
      |> OneTricksHelpers.filterBySearchKey(self.state.championPane.searchKey);
    <Router.Container>
      ...(
           (~currentRoute) =>
             <div className="one-tricks-re">
               <Header />
               <span
                 className="link"
                 onClick=(_event => ReasonReact.Router.push("/"))>
                 (ReactUtils.ste("Home"))
               </span>
               (ReactUtils.ste(" "))
               <span
                 className="link"
                 onClick=(_event => ReasonReact.Router.push("/faq"))>
                 (ReactUtils.ste("FAQ"))
               </span>
               (ReactUtils.ste(" "))
               <span
                 className="link"
                 onClick=(
                   _event => ReasonReact.Router.push("/riot-endorsement")
                 )>
                 (ReactUtils.ste("Not Endorsed by Riot Games"))
               </span>
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
                     self.send(
                       SetSearchKey(ReactUtils.getEventValue(event)),
                     )
                 )
                 region=(Region.toString(self.state.misc.region))
                 toggleRegion=(
                   regionValue => self.send(ToggleRegion(regionValue))
                 )
                 toggleMultiRegionFilter=(
                   _event => self.send(ToggleMultiRegionFilter)
                 )
                 setRegionFilter=(
                   event =>
                     self.send(SetRegion(ReactUtils.getEventValue(event)))
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
                         (ReactUtils.ste("Players"))
                       </span>
                     </li>
                     <li>
                       <span
                         className="link"
                         onClick=(
                           _event =>
                             ReasonReact.Router.push(baseURL ++ "/matchups")
                         )>
                         (ReactUtils.ste("Champion Matchups"))
                       </span>
                     </li>
                     <li>
                       <span
                         className="link flash"
                         onClick=(
                           _event =>
                             ReasonReact.Router.push(
                               baseURL ++ "/history" ++ newSearch,
                             )
                         )>
                         (ReactUtils.ste("Match History (New! Try it out)"))
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
                     |> OneTricksHelpers.filterPlayersByRank(_, ~rank)
                     |> OneTricksHelpers.extractPlayers(~currentChampion, _);
                   if (List.length(players) == 0) {
                     <div className="empty-results">
                       (
                         ReactUtils.ste(
                           "No players found for the champion: "
                           ++ currentChampion
                           ++ ".",
                         )
                       )
                     </div>;
                   } else {
                     <PlayersView
                       players
                       champ=currentChampion
                       show=true
                       onSort=(sortKey => self.send(SetSortKey(sortKey)))
                       sortKey=self.state.playersView.sortKey
                       sortReverse=self.state.playersView.shouldSortReverse
                       ranks=[rank]
                       regions=(
                                 if (self.state.misc.isMultiRegionFilterOn) {
                                   self.state.misc.regions;
                                 } else {
                                   [self.state.misc.region];
                                 }
                               )
                     />;
                   };
                 | RouterConfig.Matchups(_currentChampion) =>
                   <div>
                     (
                       ReactUtils.ste(
                         "Matchups will be implemented in the near future!",
                       )
                     )
                   </div>
                 | RouterConfig.MatchHistory(currentChampion, rank) =>
                   <MatchHistory
                     championName=currentChampion
                     ranks=[rank]
                     regions=(
                               if (self.state.misc.isMultiRegionFilterOn) {
                                 self.state.misc.regions;
                               } else {
                                 [self.state.misc.region];
                               }
                             )
                   />
                 | RouterConfig.FAQ => <FAQ />
                 | RouterConfig.RiotEndorsement => <Copyright />
                 | RouterConfig.NotFound => <NotFound />
                 }
               )
             </div>
         )
    </Router.Container>;
  },
};
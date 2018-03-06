type sort =
  | REGION
  | RANK
  | NAME
  | WINS
  | LOSSES
  | WINRATE
  | NONE;

type action =
  /* misc actions */
  | ResetSearchKey
  | SetRegion(string)
  | SetSearchKey(string)
  | SetSortKey(sort)
  | ToggleAdvancedFilter
  | ToggleMerge
  | ToggleRegion(string)
  | Nothing;

type championPane = {
  isMultipleRegionFilterOn: bool,
  searchKey: string
};

type misc = {
  areChampionPanesMerged: bool,
  region: Region.region,
  regions: list(Region.region),
  areImagesLoaded: bool
};

type playersView = {
  sortKey: sort,
  shouldSortReverse: bool,
  currentChampion: string
};

type state = {
  championPane,
  misc,
  playersView
};

module Router = ReRoute.CreateRouter(RouterConfig);

let component = ReasonReact.reducerComponent("OneTricksRe");

let extractPlayers =
    (~currentChampion: string, ~listOfOneTricks: array(JsTypes.oneTrick)) => {
  let target =
    List.filter(
      (el: JsTypes.oneTrick) =>
        Utils.parseChampionNameFromRoute(el##champion) === currentChampion,
      Array.to_list(listOfOneTricks)
    );
  if (List.length(target) === 1) {
    Array.of_list(target)[0]##players;
  } else {
    [||];
  };
};

let make =
    (~allOneTricks: array(JsTypes.oneTrick), ~areImagesLoaded, _children) => {
  ...component,
  initialState: () => {
    championPane: {
      isMultipleRegionFilterOn: false,
      searchKey: ""
    },
    misc: {
      areChampionPanesMerged: true,
      region: Region.All,
      regions: Region.list,
      areImagesLoaded: false
    },
    playersView: {
      sortKey: WINRATE,
      shouldSortReverse: false,
      currentChampion:
        switch (
          ReasonReact.Router.dangerouslyGetInitialUrl().path: list(string)
        ) {
        | ["champions", name] => name
        | ["champions", name, region] => name
        | _ => ""
        }
    }
  },
  reducer: (action, state) =>
    switch action {
    | Nothing =>
      Js.log("Nothing will happen");
      ReasonReact.Update(state);
    | SetRegion(value) =>
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          region: Region.fromString(value)
        }
      })
    | SetSearchKey(value) =>
      ReasonReact.Update({
        ...state,
        championPane: {
          ...state.championPane,
          searchKey: String.lowercase(value)
        }
      })
    | SetSortKey(sortKey) =>
      ReasonReact.Update({
        ...state,
        playersView: {
          ...state.playersView,
          sortKey,
          shouldSortReverse:
            if (sortKey == state.playersView.sortKey) {
              ! state.playersView.shouldSortReverse;
            } else {
              false;
            }
        }
      })
    | ToggleAdvancedFilter =>
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          regions:
            if (state.championPane.isMultipleRegionFilterOn) {
              [];
            } else if (Region.toString(state.misc.region) == "all") {
              Region.list;
            } else {
              [state.misc.region];
            }
        },
        championPane: {
          ...state.championPane,
          isMultipleRegionFilterOn:
            ! state.championPane.isMultipleRegionFilterOn
        }
      })
    | ToggleMerge =>
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          areChampionPanesMerged: ! state.misc.areChampionPanesMerged
        }
      })
    | ToggleRegion(r) =>
      let region = Region.fromString(r);
      let newRegions =
        if (state.misc.regions |> List.mem(region)) {
          state.misc.regions
          |> List.filter(r => r !== region) /*else if (List.length(state.misc.regions) == 1             && state.misc.regions |> List.nth(0) |> Constants.regionToString == "none") {    [region];  } */;
        } else {
          List.append(state.misc.regions, [region]);
        };
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          regions: newRegions
        }
      });
    | _ => ReasonReact.Update(state)
    },
  render: self => {
    let regionatedOneTricks: array(JsTypes.oneTrick) =
      allOneTricks
      |> Array.to_list
      |> List.map(el => {
           let tmp = el##players |> Array.to_list;
           let newPlayers =
             if (! self.state.championPane.isMultipleRegionFilterOn
                 && Region.toString(self.state.misc.region) == "all") {
               /* optimization */
               tmp;
             } else {
               List.filter(
                 (player: JsTypes.player) =>
                   if (! self.state.championPane.isMultipleRegionFilterOn) {
                     self.state.misc.region
                     == Region.fromString(player##region);
                   } else {
                     self.state.misc.regions
                     |> List.mem(Region.fromString(player##region));
                   },
                 tmp
               );
             };
           {"players": Array.of_list(newPlayers), "champion": el##champion};
         })
      |> List.filter(el => Array.length(el##players) > 0)
      |> Array.of_list;
    let tempOnSort = str =>
      self.send(
        SetSortKey(
          switch str {
          | "REGION" => REGION
          | "RANK" => RANK
          | "NAME" => NAME
          | "WINS" => WINS
          | "LOSSES" => LOSSES
          | "WINRATE" => WINRATE
          | "NONE" => NONE
          | _ => NONE
          }
        )
      );
    let sortKeyToStr = sortKey =>
      switch sortKey {
      | REGION => "REGION"
      | RANK => "RANK"
      | NAME => "NAME"
      | WINS => "WINS"
      | LOSSES => "LOSSES"
      | WINRATE => "WINRATE"
      | NONE => "NONE"
      };
    <Router.Container>
      ...(
           (~currentRoute) =>
             <div className="one-tricks-re">
               <Header />
               <ChampionPaneUtilities
                 areChampionPanesMerged=self.state.misc.areChampionPanesMerged
                 isMultipleRegionFilterOn=self.state.championPane.
                                            isMultipleRegionFilterOn
                 searchKey=self.state.championPane.searchKey
                 resetSearchKey=(_event => self.send(SetSearchKey("")))
                 regions=(
                   self.state.misc.regions
                   |> Array.of_list
                   |> Array.map(Region.toString)
                 )
                 toggleMerge=(_event => self.send(ToggleMerge))
                 onSearchKeyChange=(
                   event => self.send(SetSearchKey(Utils.getEventValue(event)))
                 )
                 region=(Region.toString(self.state.misc.region))
                 toggleRegion=(
                   regionValue => self.send(ToggleRegion(regionValue))
                 )
                 handleToggleAdvancedFilter=(
                   _event => self.send(ToggleAdvancedFilter)
                 )
                 setRegionFilter=(
                   event => self.send(SetRegion(Utils.getEventValue(event)))
                 )
               />
               (
                 switch currentRoute {
                 | RouterConfig.Home => ReasonReact.nullElement
                 | RouterConfig.PlayersView(currentChampion) =>
                   let players =
                     extractPlayers(
                       ~currentChampion=self.state.playersView.currentChampion,
                       ~listOfOneTricks=regionatedOneTricks
                     );
                   if (Array.length(players) == 0) {
                     <div className="empty-results">
                       (
                         Utils.ste(
                           "No players found for the champion: "
                           ++ self.state.playersView.currentChampion
                           ++ "."
                         )
                       )
                     </div>;
                   } else {
                     <PlayersView
                       players
                       goBack=(_event => ReasonReact.Router.push("/"))
                       champ=self.state.playersView.currentChampion
                       show=true
                       onSort=tempOnSort
                       sortKey=(sortKeyToStr(self.state.playersView.sortKey))
                       sortReverse=self.state.playersView.shouldSortReverse
                     />;
                   };
                 | RouterConfig.NotFound => <div className="not-found" />
                 }
               )
               <FAQ />
               <Copyright />
             </div>
         )
    </Router.Container>;
  }
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~allOneTricks=jsProps##allOneTricks,
      ~areImagesLoaded=jsProps##areImagesLoaded,
      jsProps##children
    )
  );
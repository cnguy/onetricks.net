type sort =
  | REGION
  | RANK
  | NAME
  | WINS
  | LOSSES
  | WINRATE
  | NONE;

type page =
  | HOME
  | PLAYERS_VIEW_ALL_REGIONS_SINGLE_PICK
  | PLAYERS_VIEW
  | PLAYERS_VIEW_SINGLE_REGION
  | PLAYER;

type action =
  /* router actions */
  | ShowHome
  | ShowPlayersViewForChampionAllRegionsSinglePick(string)
  | ShowPlayersViewForChampion(string)
  | ShowPlayersViewForChampionSingleRegion(string, string)
  | ShowPlayer(int)
  /* misc actions */
  | ResetSearchKey
  | SetRegion(string)
  | SetSearchKey(string)
  | SetSortKey(sort)
  | ToggleAdvancedFilter
  | ToggleMerge
  | ToggleRegion(string)
  | Nothing;

/*
     withState('all', 'setAll', {}), // LET JS HANDLE THIS FOR NOW
     withState('region', 'setRegion', 'all'),
     withState('regions', 'setRegions', DEFAULT_REGIONS.slice()),
     withState('champ', 'setChampionName', ''), // Shouldn't need this with URLs
     withState('players', 'setPlayers', []), // Shouldn't need this with URLs
     withState('showChamps', 'setShowChamps', true),
     withState('imagesLoaded', 'setImagesLoaded', false),
 */
type championPane = {
  isMultipleRegionFilterOn: bool,
  searchKey: string
};

type misc = {
  areChampionPanesMerged: bool,
  region: string,
  regions: array(string),
  areImagesLoaded: bool
};

type playersView = {
  sortKey: sort,
  shouldSortReverse: bool,
  currentChampion: string
};

type router = {page};

type state = {
  championPane,
  misc,
  playersView,
  router
};

let component = ReasonReact.reducerComponent("OneTricksRe");

let urlToShownPage = (path, search) =>
  switch (path, search) {
  | ([""], _) => HOME
  | (["player", id], "") => PLAYER
  | (["champions", name], "") => PLAYERS_VIEW_ALL_REGIONS_SINGLE_PICK
  | (["champions", name], _) => PLAYERS_VIEW
  | (["champions", name, region], "") => PLAYERS_VIEW_SINGLE_REGION
  | _ => HOME
  };

let urlToAction = (path, search) =>
  switch (path, search) {
  | ([""], "") => ShowHome
  | (["player", id], "") => ShowPlayer(int_of_string(id))
  | (["champions", name], "") =>
    ShowPlayersViewForChampionAllRegionsSinglePick(name)
  | (["champions", name], _) =>
    Js.log("show just one players view");
    ShowPlayersViewForChampion(name);
  | (["champions", name, region], "") =>
    Js.log("show players view for single");
    ShowPlayersViewForChampionSingleRegion(name, region);
  | _ => ShowHome
  };

let splitRegionQuery = csvRegions =>
  if (String.length(csvRegions) > 7) {
    let splitPoint = 7; /* length of word `regions` */
    let pre = String.sub(csvRegions, 0, splitPoint);
    let post = Js.String.substr(splitPoint + 1, csvRegions);
    if (pre === "regions") {
      let splitted = Js.String.splitByRe(Js.Re.fromString(","), post);
      Js.log(splitted);
      if (Array.length(splitted) > 0) {
        splitted;
      } else {
        [||];
      };
    } else {
      Array.copy(Constants.regions);
    };
  } else {
    [||];
  };

let extractPlayers =
    (~currentChampion: string, ~listOfOneTricks: array(Types.oneTrick)) => {
  let target =
    List.filter(
      (el: Types.oneTrick) =>
        Utils.parseChampionNameFromRoute(el##champion) === currentChampion,
      Array.to_list(listOfOneTricks)
    );
  if (List.length(target) === 1) {
    Array.of_list(target)[0]##players;
  } else {
    [||];
  };
};

let make = (~allOneTricks: array(Types.oneTrick), ~areImagesLoaded, _children) => {
  ...component,
  initialState: () => {
    championPane: {
      isMultipleRegionFilterOn:
        switch (
          ReasonReact.Router.dangerouslyGetInitialUrl().path,
          ReasonReact.Router.dangerouslyGetInitialUrl().search
        ) {
        | (["champions", name], "") => false
        | (["champions", name], csvRegions) => true
        /*
         let regions = splitRegionQuery(csvRegions);
         Array.length(regions) > 0;
         */
        | _ => false
        },
      searchKey: ""
    },
    misc: {
      areChampionPanesMerged: true,
      region:
        switch (
          ReasonReact.Router.dangerouslyGetInitialUrl().path,
          ReasonReact.Router.dangerouslyGetInitialUrl().search
        ) {
        | (["champions", name], "") => "all"
        | (["champions", name], csvRegions) =>
          let splitted = splitRegionQuery(csvRegions);
          let region = splitted[0];
          if (Array.length(splitted) == 1
              && Constants.regions
              |> Array.to_list
              |> List.mem(region)) {
            region;
          } else if (Constants.regions |> Array.to_list |> List.mem(region)) {
            "all"; /* compiler */
          } else {
            if (region != "none") {
              ReasonReact.Router.push("/champions/" ++ name);
            };
            "all";
          };
        | (["champions", name, region], "") =>
          if (Constants.regions |> Array.to_list |> List.mem(region)) {
            region;
          } else {
            "all";
          }
        | _ => "all"
        },
      regions:
        switch (
          ReasonReact.Router.dangerouslyGetInitialUrl().path,
          ReasonReact.Router.dangerouslyGetInitialUrl().search
        ) {
        | (["champions", name], "") => Array.copy(Constants.regions)
        | (["champions", name], csvRegions) => splitRegionQuery(csvRegions)
        | _ => Array.copy(Constants.regions)
        },
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
    },
    router: {
      page:
        urlToShownPage(
          ReasonReact.Router.dangerouslyGetInitialUrl().path,
          ReasonReact.Router.dangerouslyGetInitialUrl().search
        )
    }
  },
  reducer: (action, state) =>
    switch action {
    | Nothing =>
      Js.log("Nothing will happen");
      ReasonReact.Update(state);
    | ShowHome => ReasonReact.Update({
                    ...state,
                    router: {
                      page: HOME
                    }
                  })
    | ShowPlayersViewForChampionAllRegionsSinglePick(name) =>
      ReasonReact.Update({
        ...state,
        router: {
          ...state.router,
          page: PLAYERS_VIEW_ALL_REGIONS_SINGLE_PICK
        },
        misc: {
          ...state.misc,
          region: "all"
        },
        playersView: {
          ...state.playersView,
          currentChampion: name
        },
        championPane: {
          ...state.championPane,
          isMultipleRegionFilterOn: false
        }
      })
    | ShowPlayersViewForChampion(name) =>
      let csvRegions =
        splitRegionQuery(ReasonReact.Router.dangerouslyGetInitialUrl().search);
      Js.log("csvRegions");
      Js.log(csvRegions);
      let newRegions = csvRegions;
      let tmp: string =
        newRegions
        |> Array.fold_left((total, current) => total ++ "," ++ current, "");
      let newRegionQuery =
        if (String.length(tmp) > 0) {
          String.sub(tmp, 1, String.length(tmp) - 1);
        } else {
          "";
        };
      Js.log("newRegionQuery");
      Js.log(newRegionQuery);
      /*
       if (String.length(newRegionQuery) == 0) {
         ReasonReact.Router.push(
           "/champions/" ++ state.playersView.currentChampion
         );
       };*/
      ReasonReact.Update({
        ...state,
        router: {
          page: PLAYERS_VIEW
        },
        playersView: {
          ...state.playersView,
          currentChampion: name
        },
        misc: {
          ...state.misc,
          regions: newRegions
        },
        championPane: {
          ...state.championPane,
          isMultipleRegionFilterOn: ! (String.length(newRegionQuery) == 0)
        }
      });
    | ShowPlayersViewForChampionSingleRegion(name, region) =>
      ReasonReact.Update({
        ...state,
        router: {
          page: PLAYERS_VIEW_SINGLE_REGION
        },
        playersView: {
          ...state.playersView,
          currentChampion: name
        },
        misc: {
          ...state.misc,
          region
        },
        championPane: {
          ...state.championPane,
          isMultipleRegionFilterOn: false
        }
      })
    | ShowPlayer(summonerID) =>
      Js.log(summonerID);
      ReasonReact.Update({
        ...state,
        router: {
          page: PLAYER
        }
      });
    | SetRegion(value) =>
      Js.log("setting region");
      Js.log(value);
      Js.log(state.playersView.currentChampion);
      ReasonReact.Router.push(
        "/champions/"
        ++ state.playersView.currentChampion
        ++ (
          if (value == "all") {
            "";
          } else {
            "/" ++ value;
          }
        )
      );
      ReasonReact.Update({
        ...state,
        router: {
          ...state.router,
          page:
            if (value == "all") {
              PLAYERS_VIEW;
            } else {
              PLAYERS_VIEW_SINGLE_REGION;
            }
        },
        misc: {
          ...state.misc,
          region: value
        }
      });
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
      if (state.championPane.isMultipleRegionFilterOn) {
        ReasonReact.Router.push(
          "/champions/"
          ++ state.playersView.currentChampion
          ++ (
            if (state.misc.region == "all") {
              "";
            } else {
              "/" ++ state.misc.region;
            }
          )
        );
      } else {
        let tmp: string =
          Array.copy(
            if (state.misc.region == "all") {
              Constants.regions;
            } else {
              [|state.misc.region|];
            }
          )
          |> Array.fold_left((total, current) => total ++ "," ++ current, "");
        let newRegionQuery =
          if (String.length(tmp) > 0) {
            String.sub(tmp, 1, String.length(tmp) - 1);
          } else {
            "";
          };
        ReasonReact.Router.push(
          "/champions/"
          ++ state.playersView.currentChampion
          ++ "?regions="
          ++ newRegionQuery
        );
      };
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          regions:
            if (state.championPane.isMultipleRegionFilterOn) {
              [||];
            } else if (state.misc.region == "all") {
              Array.copy(Constants.regions);
            } else {
              [|state.misc.region|];
            }
        },
        championPane: {
          ...state.championPane,
          isMultipleRegionFilterOn:
            ! state.championPane.isMultipleRegionFilterOn
        }
      });
    | ToggleMerge =>
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          areChampionPanesMerged: ! state.misc.areChampionPanesMerged
        }
      })
    | ToggleRegion(region) =>
      Js.log("toggle query");
      let newRegions =
        if (state.misc.regions |> Array.to_list |> List.mem(region)) {
          state.misc.regions
          |> Array.to_list
          |> List.filter(r => r !== region)
          |> Array.of_list;
        } else if (Array.length(state.misc.regions) == 1
                   && state.misc.regions[0] == "none") {
          [|region|];
        } else {
          Array.append(state.misc.regions, [|region|]);
        };
      let tmp: string =
        newRegions
        |> Array.fold_left((total, current) => total ++ "," ++ current, "");
      let newRegionQuery =
        if (String.length(tmp) > 0) {
          String.sub(tmp, 1, String.length(tmp) - 1);
        } else {
          "";
        };
      Js.log("newRegionQuery");
      Js.log(newRegionQuery);
      ReasonReact.Router.push(
        "/champions/"
        ++ state.playersView.currentChampion
        ++ (
          if (String.length(newRegionQuery) > 0) {
            "?regions=" ++ newRegionQuery;
          } else {
            "?regions=none";
          }
        )
      );
      ReasonReact.Update({
        ...state,
        misc: {
          ...state.misc,
          regions: newRegions
        }
      });
    | _ => ReasonReact.Update(state)
    },
  subscriptions: self => [
    Sub(
      () =>
        ReasonReact.Router.watchUrl(url => {
          Js.log("watching for URL");
          Js.log(url.path);
          Js.log(url.search);
          self.send(urlToAction(url.path, url.search));
        }),
      /*
       /* Here we should figure out how to parse the region. */
       let splitPoint = 7; /* length of word `regions` */
       let pre = String.sub(csvRegions, 0, splitPoint);
       let post = Js.String.substr(splitPoint + 1, csvRegions);
       if (pre === "regions") {
         let splitted = Js.String.splitByRe(Js.Re.fromString(","), post);
         Js.log("split");
         Js.log(splitted);
       };
       Js.log(csvRegions);
       self.send(Nothing);*/
      ReasonReact.Router.unwatchUrl
    )
  ],
  render: self => {
    let regionatedOneTricks: array(Types.oneTrick) =
      allOneTricks
      |> Array.to_list
      |> List.map(el => {
           let tmp = el##players |> Array.to_list;
           let newPlayers =
             if (! self.state.championPane.isMultipleRegionFilterOn
                 && self.state.misc.region == "all") {
               /* optimization */
               tmp;
             } else {
               List.filter(
                 (player: Types.player) =>
                   if (! self.state.championPane.isMultipleRegionFilterOn) {
                     self.state.misc.region == player##region;
                   } else {
                     self.state.misc.regions
                     |> Array.to_list
                     |> List.mem(player##region);
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
    let mainComponent =
      switch self.state.router.page {
      | PLAYERS_VIEW_ALL_REGIONS_SINGLE_PICK
      | PLAYERS_VIEW
      | PLAYERS_VIEW_SINGLE_REGION =>
        Js.log(self.state.misc.region);
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
      | _ => ReasonReact.nullElement
      };
    <div className="one-tricks-re">
      <Header />
      <button
        className="router-test"
        onClick=(_event => ReasonReact.Router.push("/champions/shaco"))>
        (
          ReasonReact.stringToElement(
            switch self.state.router.page {
            | HOME => "Home"
            | PLAYERS_VIEW => "Players View"
            | PLAYER => "Player!"
            | _ => ""
            }
          )
        )
      </button>
      <ChampionPaneUtilities
        shouldShowChampions=true
        areChampionPanesMerged=self.state.misc.areChampionPanesMerged
        isMultipleRegionFilterOn=self.state.championPane.
                                   isMultipleRegionFilterOn
        searchKey=self.state.championPane.searchKey
        resetSearchKey=(_event => self.send(SetSearchKey("")))
        regions=self.state.misc.regions
        toggleMerge=(_event => self.send(ToggleMerge))
        onSearchKeyChange=(
          event =>
            self.send(
              SetSearchKey(
                ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value
              )
            )
        )
        region=self.state.misc.region
        toggleRegion=(regionValue => self.send(ToggleRegion(regionValue)))
        handleToggleAdvancedFilter=(_event => self.send(ToggleAdvancedFilter))
        setRegionFilter=(
          event =>
            self.send(
              SetRegion(
                ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value
              )
            )
        )
      />
      mainComponent
      <FAQ />
      <Copyright />
    </div>;
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
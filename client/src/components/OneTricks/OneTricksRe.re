type sort =
  | REGION
  | RANK
  | NAME
  | WINS
  | LOSSES
  | WINRATE
  | NONE;

type action =
  /* router actions */
  | ShowHome
  | ShowPlayersViewForChampion(string)
  | ShowPlayer(int)
  /* misc actions */
  | ResetSearchKey
  | SetSearchKey(string)
  | SetSortKey(sort)
  | ShouldSortReverse
  | ToggleMerge
  | ToggleAdvancedFilter
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
  regions: array(string),
  shouldShowChampionIcons: bool,
  areImagesLoaded: bool
};

type playersView = {
  sortKey: sort,
  shouldSortReverse: bool
};

type state = {
  championPane,
  misc,
  playersView
};

let printState = (state: state) =>
  print_string(string_of_bool(state.championPane.isMultipleRegionFilterOn));

let component = ReasonReact.reducerComponent("OneTricksRe");

let make = (~allOneTricks, ~areImagesLoaded, _children) => {
  ...component,
  initialState: () => {
    championPane: {
      isMultipleRegionFilterOn: false,
      searchKey: ""
    },
    misc: {
      areChampionPanesMerged: false,
      regions: Array.copy(Constants.regions),
      shouldShowChampionIcons: true,
      areImagesLoaded: false
    },
    playersView: {
      sortKey: WINRATE,
      shouldSortReverse: false
    }
  },
  reducer: (action, state) =>
    switch action {
    | Nothing =>
      Js.log("Nothing will happen");
      ReasonReact.Update(state);
    | ShowPlayersViewForChampion(name) =>
      Js.log("Show players view for " ++ name);
      ReasonReact.Update(state);
    | ShowPlayer(summonerID) =>
      Js.log(summonerID);
      ReasonReact.Update(state);
    | _ => ReasonReact.Update(state)
    },
  subscriptions: self => [
    Sub(
      () =>
        ReasonReact.Router.watchUrl(url =>
          switch (url.path, url.search) {
          | ([""], "") => self.send(ShowHome)
          | (["player", id], "") => self.send(ShowPlayer(int_of_string(id)))
          | (["champions", name], "") =>
            self.send(ShowPlayersViewForChampion(name))
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
          | _ => self.send(Nothing)
          }
        ),
      ReasonReact.Router.unwatchUrl
    )
  ],
  render: self => {
    Js.log(self.state);
    Js.log(allOneTricks);
    if (areImagesLoaded) {
      <div className="OneTricksRe">
        <button onClick=(_event => ReasonReact.Router.push(""))>
          (ReasonReact.stringToElement("Simple Button"))
        </button>
        <button
          onClick=(_event => ReasonReact.Router.push("/champions/shaco"))>
          (ReasonReact.stringToElement("Test"))
        </button>
        <button onClick=(_event => ReasonReact.Router.push("/player/50"))>
          (ReasonReact.stringToElement("Some Player Button"))
        </button>
      </div>;
    } else {
      ReasonReact.nullElement;
    };
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
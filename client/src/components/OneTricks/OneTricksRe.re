type action =
  | ResetSearchKey
  | SetSearchKey
  | SetSortKey
  | ShouldSortReverse
  | ToggleMerge
  | ToggleAdvancedFilter
  | Nothing;

type championPane = {
  isMultipleRegionFilterOn: bool,
  searchKey: string
};

type misc = {areChampionPanesMerged: bool};

type sortTypes =
  | WINRATE;

type playersView = {
  sortKey: sortTypes,
  shouldSortReverse: bool
};

type state = {
  championPane,
  misc,
  playersView
};

/*
 resetSearchKey,
           setSearchKey,
           setSortKey,
           setSortReverse,
           toggleAdvancedFilter,
           toggleMerge,
   */
/*
    championPane: Object { advFilter: false, searchKey: "" }
 misc: Object { merged: true }
 playersView: Object { sortKey: "WINRATE", sortReverse: false }
 */
let component = ReasonReact.reducerComponent("OneTricksRe");

let make = (~areImagesLoaded, _children) => {
  ...component,
  initialState: () => {},
  reducer: (action, state) =>
    switch action {
    | Nothing => ReasonReact.Update(state)
    | _ => ReasonReact.Update(state)
    },
  subscriptions: self => [
    Sub(
      () =>
        ReasonReact.Router.watchUrl(url =>
          switch url.hash {
          | _ => self.send(Nothing)
          }
        ),
      ReasonReact.Router.unwatchUrl
    )
  ],
  render: _self =>
    if (areImagesLoaded) {
      <div className="OneTricksRe" />;
    } else {
      ReasonReact.nullElement;
    }
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~areImagesLoaded=jsProps##areImagesLoaded, jsProps##children)
  );
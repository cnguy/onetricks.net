let component = ReasonReact.statelessComponent("ChampionPaneUtilities");

let make =
    (
      ~areChampionPanesMerged,
      ~isMultiRegionFilterOn,
      ~searchKey,
      ~resetSearchKey,
      ~regions,
      ~toggleMerge,
      ~onSearchKeyChange,
      ~toggleRegion,
      ~toggleMultiRegionFilter,
      ~region,
      ~setRegionFilter,
      ~setChampionIconsSortKey,
      ~sortBy,
      _children,
    ) => {
  ...component,
  render: _self => {
    let comp =
      <div className="champs-pane-utility">
        <div className="merged-input">
          <ChampionSearch
            onChange=onSearchKeyChange
            value=searchKey
            resetSearchKey
          />
          <RegionSelectMenu isMultiRegionFilterOn region setRegionFilter />
          <MergeSeparateBtn areChampionPanesMerged onClick=toggleMerge />
          (
            switch (
              ReasonReact.Router.dangerouslyGetInitialUrl().path,
              ReasonReact.Router.dangerouslyGetInitialUrl().search,
            ) {
            | ([], "") =>
              <select
                className="sort-select"
                id="sort-select"
                onChange=(
                  event => {
                    let value = ReactUtils.getEventValue(event);
                    setChampionIconsSortKey(
                      switch (value) {
                      | "players" => Sorts.Number
                      | "winrate" => Sorts.WinRate
                      | _ => Sorts.Number
                      },
                    );
                  }
                )
                value=(
                  switch (sortBy) {
                  | Sorts.Number => "players"
                  | Sorts.WinRate => "winrate"
                  }
                )>
                <option value="players">
                  (ReasonReact.stringToElement("by number of players"))
                </option>
                <option value="winrate">
                  (ReasonReact.stringToElement("by win rate"))
                </option>
              </select>
            | _ => ReasonReact.nullElement
            }
          )
        </div>
        <MultiRegionFilter
          isMultiRegionFilterOn
          regions
          toggleMultiRegionFilter
          toggleRegion
        />
      </div>;
    switch (
      ReasonReact.Router.dangerouslyGetInitialUrl().path,
      ReasonReact.Router.dangerouslyGetInitialUrl().search,
    ) {
    | ([], _rest) => comp
    | (["champions", ..._rest], "") => comp
    | _ => ReasonReact.nullElement
    };
  },
};
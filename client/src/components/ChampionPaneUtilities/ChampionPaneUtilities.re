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
      _children,
    ) => {
  ...component,
  render: _self =>
    <div className="champs-pane-utility">
      <Instructions />
      <div className="merged-input">
        <MergeSeparateBtn areChampionPanesMerged onClick=toggleMerge />
        <RegionSelectMenu isMultiRegionFilterOn region setRegionFilter />
        <ChampionSearch
          onChange=onSearchKeyChange
          value=searchKey
          resetSearchKey
        />
      </div>
      <MultiRegionFilter
        isMultiRegionFilterOn
        regions
        toggleMultiRegionFilter
        toggleRegion
      />
      (
        switch (
          ReasonReact.Router.dangerouslyGetInitialUrl().path,
          ReasonReact.Router.dangerouslyGetInitialUrl().search,
        ) {
        | ([], "") =>
          <div>
            <div
              className="link"
              onClick=(_event => setChampionIconsSortKey(Sorts.Number))>
              (ReactUtils.ste("Sort by Number of Players"))
            </div>
            <div
              className="link"
              onClick=(_event => setChampionIconsSortKey(Sorts.WinRate))>
              (ReactUtils.ste("Sort by WinRate"))
            </div>
          </div>
        | _ => ReasonReact.nullElement
        }
      )
    </div>,
};
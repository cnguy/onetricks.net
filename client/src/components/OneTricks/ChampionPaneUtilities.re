let component = ReasonReact.statelessComponent("ChampionPaneUtilities");

let make =
    (
      ~shouldShowChampions,
      ~areChampionPanesMerged,
      ~isMultipleRegionFilterOn,
      ~searchKey,
      ~resetSearchKey,
      ~regions,
      ~toggleMerge,
      ~onSearchKeyChange,
      ~addRegion,
      ~handleToggleAdvancedFilter,
      ~region,
      ~setRegionFilter,
      _children
    ) => {
  ...component,
  render: _self =>
    if (shouldShowChampions) {
      <div className="champs-pane-utility">
        <Instructions />
        <div className="merged-input">
          <MergeSeparateBtn areChampionPanesMerged onClick=toggleMerge />
          <RegionSelectMenu isMultipleRegionFilterOn region setRegionFilter />
          <ChampionSearch
            onChange=onSearchKeyChange
            value=searchKey
            resetSearchKey
          />
        </div>
        <MultipleRegionsFilter
          isMultipleRegionFilterOn
          regions
          toggleMultipleRegionFilter=handleToggleAdvancedFilter
          toggleRegion=addRegion
        />
      </div>;
    } else {
      ReasonReact.nullElement;
    }
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~shouldShowChampions=jsProps##showChamps,
      ~areChampionPanesMerged=jsProps##merged,
      ~isMultipleRegionFilterOn=jsProps##advFilter,
      ~searchKey=jsProps##searchKey,
      ~resetSearchKey=jsProps##resetSearchKey,
      ~regions=jsProps##regions,
      ~toggleMerge=jsProps##toggleMerge,
      ~onSearchKeyChange=jsProps##onChange,
      ~addRegion=jsProps##addRegion,
      ~handleToggleAdvancedFilter=jsProps##handleToggleAdvancedFilter,
      ~region=jsProps##region,
      ~setRegionFilter=jsProps##setRegionFilter,
      jsProps##children
    )
  );
let component = ReasonReact.statelessComponent("ChampionPaneUtilities");

let make =
    (
      ~areChampionPanesMerged,
      ~isMultipleRegionFilterOn,
      ~searchKey,
      ~resetSearchKey,
      ~regions,
      ~toggleMerge,
      ~onSearchKeyChange,
      ~toggleRegion,
      ~handleToggleAdvancedFilter,
      ~region,
      ~setRegionFilter,
      _children
    ) => {
  ...component,
  render: _self =>
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
        toggleRegion
      />
    </div>
};
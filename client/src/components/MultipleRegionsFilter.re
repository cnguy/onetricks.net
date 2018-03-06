let component = ReasonReact.statelessComponent("MultipleRegionsFilter");

let make =
    (
      ~isMultipleRegionFilterOn,
      ~regions,
      ~toggleMultipleRegionFilter: unit => unit,
      ~toggleRegion: string => unit,
      _children
    ) => {
  ...component,
  render: _self =>
    <div className="multiple-filter">
      (
        if (isMultipleRegionFilterOn) {
          <FilterRegion
            toggleRegion
            toggleAdvFilter=toggleMultipleRegionFilter
            regions
          />;
        } else {
          <div
            className="adv-filtering-open"
            onClick=(_event => toggleMultipleRegionFilter())>
            (ReasonReact.stringToElement("Multiple Regions"))
          </div>;
        }
      )
    </div>
};
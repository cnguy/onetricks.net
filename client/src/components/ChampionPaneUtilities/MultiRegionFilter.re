let component = ReasonReact.statelessComponent("MultiRegionFilter");

let make =
    (
      ~isMultiRegionFilterOn,
      ~regions,
      ~toggleMultiRegionFilter: unit => unit,
      ~toggleRegion: string => unit,
      _children,
    ) => {
  ...component,
  render: _self =>
    <div className="multiple-filter">
      (
        if (isMultiRegionFilterOn) {
          <FilterRegion toggleRegion toggleMultiRegionFilter regions />;
        } else {
          <div
            className="adv-filtering-open"
            onClick=(_event => toggleMultiRegionFilter())>
            (ReactUtils.ste("Multiple Regions"))
          </div>;
        }
      )
    </div>,
};

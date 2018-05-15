let component = ReasonReact.statelessComponent("FilterRegion");

let allRegions = Region.list |> Array.of_list |> Array.map(Region.toString);

let regionsSplitPoint = 6;

let firstSetOfRegions = Array.sub(allRegions, 0, regionsSplitPoint);

let secondSetOfRegions =
  Array.sub(
    allRegions,
    regionsSplitPoint,
    Array.length(allRegions) - regionsSplitPoint,
  );

let make = (~toggleRegion, ~toggleMultiRegionFilter, ~regions, _children) => {
  ...component,
  render: _self => {
    let makeRow = (rs, extra) => {
      let buttons =
        Array.map(
          r =>
            <FilterBtn
              key=r onClick=(_event => toggleRegion(r)) active=regions>
              ...(String.uppercase(r))
            </FilterBtn>,
          rs,
        );
      <div className="filter-row"> (ReactUtils.ate(buttons)) extra </div>;
    };
    let closeButton =
      <button
        className="close-adv-filter"
        onClick=(_event => toggleMultiRegionFilter())>
        (ReactUtils.ste("Close"))
      </button>;
    <div className="filter-bar">
      (makeRow(firstSetOfRegions, ReasonReact.null))
      (makeRow(secondSetOfRegions, closeButton))
    </div>;
  },
};
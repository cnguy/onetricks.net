let component = ReasonReact.statelessComponent("RegionSelectMenu");

let make = (~isMultiRegionFilterOn, ~region, ~setRegionFilter, _children) => {
  ...component,
  render: _self =>
    if (isMultiRegionFilterOn) {
      ReasonReact.null;
    } else {
      <select
        className="region-select"
        id="region"
        onChange=setRegionFilter
        value=region>
        <option value="all"> (ReactUtils.ste("All Regions")) </option>
        (
          ReactUtils.ate(
            Array.map(
              region =>
                <option value=region key=region>
                  (ReactUtils.ste(String.uppercase(region)))
                </option>,
              Region.list |> Region.toStringList |> Array.of_list,
            ),
          )
        )
      </select>;
    },
};
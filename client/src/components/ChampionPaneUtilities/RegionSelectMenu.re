let component = ReasonReact.statelessComponent("RegionSelectMenu");

let make = (~isMultiRegionFilterOn, ~region, ~setRegionFilter, _children) => {
  ...component,
  render: _self =>
    if (isMultiRegionFilterOn) {
      ReasonReact.nullElement;
    } else {
      <select
        className="region-select"
        id="region"
        onChange=setRegionFilter
        value=region>
        <option value="all">
          (ReasonReact.stringToElement("All Regions"))
        </option>
        (
          ReasonReact.arrayToElement(
            Array.map(
              region =>
                <option value=region key=region>
                  (ReasonReact.stringToElement(String.uppercase(region)))
                </option>,
              Region.list |> Region.toStringList |> Array.of_list,
            ),
          )
        )
      </select>;
    },
};
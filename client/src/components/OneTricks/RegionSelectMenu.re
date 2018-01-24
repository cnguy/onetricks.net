let component = ReasonReact.statelessComponent("RegionSelectMenu");

let make = (~isMultipleRegionFilterOn, ~region, ~setRegionFilter, _children) => {
  ...component,
  render: _self =>
    if (isMultipleRegionFilterOn) {
      ReasonReact.nullElement;
    } else {
      <select id="region" onChange=setRegionFilter value=region>
        <option value="all"> (ReasonReact.stringToElement("All")) </option>
        (
          ReasonReact.arrayToElement(
            Array.map(
              region =>
                <option value=region key=region>
                  (ReasonReact.stringToElement(String.uppercase(region)))
                </option>,
              Constants.regions
            )
          )
        )
      </select>;
    }
};
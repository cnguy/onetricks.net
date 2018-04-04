let component = ReasonReact.statelessComponent("MergeSeparateBtn");

let make = (~areChampionPanesMerged, ~onClick, _children) => {
  ...component,
  render: _self =>
    <button className="merge-sep-button" onClick>
      <span className="merge-sep-text">
        <span className="merge-sep-action">
          (
            ReasonReact.stringToElement(
              if (areChampionPanesMerged) {"Separate"} else {"Combine"},
            )
          )
        </span>
      </span>
    </button>,
};
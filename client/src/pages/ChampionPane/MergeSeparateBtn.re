let component = ReasonReact.statelessComponent("MergeSeparateBtn");

let make = (~areChampionPanesMerged, ~onClick, _children) => {
  ...component,
  render: _self =>
    switch (
      ReasonReact.Router.dangerouslyGetInitialUrl().path,
      ReasonReact.Router.dangerouslyGetInitialUrl().search,
    ) {
    | ([], "") =>
      <button className="merge-sep-button" onClick>
        <span className="merge-sep-text">
          <span className="merge-sep-action">
            (
              ReasonReact.stringToElement(
                if (areChampionPanesMerged) {
                  "Separate into Challenger's and Master's sections"
                } else {
                  "Merge Challenger's and Master's sections"
                },
              )
            )
          </span>
        </span>
      </button>
    | _ => ReasonReact.nullElement
    },
};
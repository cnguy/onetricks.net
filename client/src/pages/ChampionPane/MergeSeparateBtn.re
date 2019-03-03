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
              ReactUtils.ste(
                if (areChampionPanesMerged) {
                  "Separate into Challenger's, Grandmaster's, & Master's sections"
                } else {
                  "Merge Challenger's, Grandmaster's, & Master's sections"
                },
              )
            )
          </span>
        </span>
      </button>
    | _ => ReasonReact.null
    },
};
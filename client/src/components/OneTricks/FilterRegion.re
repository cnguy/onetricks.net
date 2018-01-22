let component = ReasonReact.statelessComponent("FilterRegion");

let allRegions: array(string) = [|
  "na",
  "kr",
  "euw",
  "eune",
  "lan",
  "las",
  "br",
  "jp",
  "tr",
  "ru",
  "oce"
|];

let regionsSplitPoint = 6;

let firstSetOfRegions = Array.sub(allRegions, 0, regionsSplitPoint);

let secondSetOfRegions = Array.sub(allRegions, regionsSplitPoint, Array.length(allRegions) - regionsSplitPoint);

let make = (~toggleRegion, ~toggleAdvFilter, ~regions) => {
  ...component,
  render: _self => {
    let makeRow = (rs, extra) => {
      let buttons =
        Array.map(
          r =>
            <FilterBtn key=r onClick=(_event => toggleRegion(r)) active=regions>
              ...(String.uppercase(r))
            </FilterBtn>,
          rs
        );
      <div className="filter-row">
        (ReasonReact.arrayToElement(buttons))
        extra
      </div>;
    };
    let closeButton =
      <button
        className="close-adv-filter" onClick=(_event => toggleAdvFilter())>
        (ReasonReact.stringToElement("Close"))
      </button>;
    <div className="filter-bar">
      (makeRow(firstSetOfRegions, ReasonReact.nullElement))
      (makeRow(secondSetOfRegions, closeButton))
    </div>;
  }
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~toggleRegion=jsProps##toggleRegion,
      ~toggleAdvFilter=jsProps##toggleAdvFilter,
      ~regions=jsProps##regions
    )
  );
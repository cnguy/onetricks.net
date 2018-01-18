let component = ReasonReact.statelessComponent("PlayersSortBtn");

let grabTriString = (~sortKey, ~activeSortKey, ~isReversed) =>
  if (sortKey === activeSortKey) {
    if (isReversed) {"&#9650"} else {"&#9660"};
  } else {
    "";
  };

let make = (~onSort, ~sortKey, ~activeSortKey, ~isReversed, ~children) => {
  ...component,
  render: _self => {
    let triString = grabTriString(~sortKey, ~activeSortKey, ~isReversed);
    let triangle =
      if (String.length(triString) > 0) {
        <span className="sort-tri">
          (ReasonReact.stringToElement(triString))
        </span>;
      } else {
        ReasonReact.nullElement;
      };
    let cn =
      "player-sort-link flash"
      ++ (
        if (sortKey == activeSortKey) {
          " active-sort";
        } else {
          "";
        }
      );
    <a className=cn href="#" onClick=(_event => onSort(sortKey))>
      children
      (ReasonReact.stringToElement(" "))
      triangle
    </a>;
  }
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(
      ~onSort=jsProps##onSort,
      ~sortKey=jsProps##sortKey,
      ~activeSortKey=jsProps##activeSortKey,
      ~isReversed=jsProps##reverse,
      ~children=jsProps##children
    )
  );
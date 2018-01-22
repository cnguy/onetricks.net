let component = ReasonReact.statelessComponent("PlayersSortBtn");

let grabTriString = (~sortKey, ~activeSortKey, ~isReversed) =>
  if (sortKey === activeSortKey) {
    if (isReversed) {{js|&#9650;|js}} else {{js|&#9660;|js}};
  } else {
    "";
  };

let make = (~onSort, ~sortKey, ~activeSortKey, ~isReversed, children) => {
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
      (ReasonReact.stringToElement(children))
      (ReasonReact.stringToElement(" "))
      triangle
    </a>;
  }
};
let component = ReasonReact.statelessComponent("PlayersTable");

module Styles = {
  open Css;
  let table =
    style([
      backgroundColor(hex("37474F")),
      textAlign(`center),
      media("only screen and (min-width: 480px)", [width(`percent(100.))]),
    ]);
  let th = style([borderBottom(px(1), `solid, hex("455A64"))]);
  let rowNumber = style([fontSize(em(0.8))]);
};

let sortButtonsInfo = [
  (Sort.None, ""),
  (Sort.Region, "region"),
  (Sort.Rank, "rank"),
  (Sort.Name, "name"),
  (Sort.Wins, "wins"),
  (Sort.Losses, "losses"),
  (Sort.WinRate, "win %"),
];

let make = (~onSort, ~sortKey, ~sortReverse, ~renderableList, _children) => {
  ...component,
  render: _self =>
    <table className=Styles.table>
      <thead>
        <tr>
          (
            ReactUtils.lte(
              List.map(
                ((key, displayText)) =>
                  <th className=Styles.th>
                    <PlayersSortBtn
                      onSort
                      sortKey=key
                      activeSortKey=sortKey
                      isReversed=sortReverse>
                      ...displayText
                    </PlayersSortBtn>
                  </th>,
                sortButtonsInfo,
              ),
            )
          )
          <th className=Styles.th> (ReactUtils.ste("op.gg")) </th>
        </tr>
      </thead>
      <tbody> (ReactUtils.lte(renderableList)) </tbody>
    </table>,
};
let component = ReasonReact.statelessComponent("PlayersTable");

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
    <table className="players-table">
      <thead className="players-table-thead">
        <tr className="players-table-tr">
          (
            ReasonReact.arrayToElement(
              Array.of_list(
                List.map(
                  ((key, displayText)) =>
                    <th className="players-table-th">
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
              ),
            )
          )
          <th className="players-table-th">
            (ReasonReact.stringToElement("op.gg"))
          </th>
          <th className="players-table-th">
            (ReasonReact.stringToElement("lolking"))
          </th>
        </tr>
      </thead>
      <tbody className="players-table-tbody">
        (ReasonReact.arrayToElement(Array.of_list(renderableList)))
      </tbody>
    </table>,
};
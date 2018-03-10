let component = ReasonReact.statelessComponent("PlayersTable");

let sortButtonsInfo = [
  (Sort.Region, "Region"),
  (Sort.Rank, "R"),
  (Sort.Name, "Name"),
  (Sort.Wins, "W"),
  (Sort.Losses, "L"),
  (Sort.WinRate, "WR"),
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
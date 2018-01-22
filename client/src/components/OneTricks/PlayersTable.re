let component = ReasonReact.statelessComponent("PlayersTable");

let make = (~onSort, ~sortKey, ~sortReverse, ~renderableList, _children) => {
  ...component,
  render: _self =>
    <table className="players-table">
      <thead className="players-table-thead">
        <tr className="players-table-tr">
          <th className="players-table-th">
            <PlayersSortBtn
              onSort
              sortKey="REGION"
              activeSortKey=sortKey
              isReversed=sortReverse>
              ..."Region"
            </PlayersSortBtn>
          </th>
          <th className="players-table-th">
            <PlayersSortBtn
              onSort
              sortKey="RANK"
              activeSortKey=sortKey
              isReversed=sortReverse>
              ..."R"
            </PlayersSortBtn>
          </th>
          <th className="players-table-th">
            <PlayersSortBtn
              onSort
              sortKey="NAME"
              activeSortKey=sortKey
              isReversed=sortReverse>
              ..."Name"
            </PlayersSortBtn>
          </th>
          <th className="players-table-th">
            <PlayersSortBtn
              onSort
              sortKey="WINS"
              activeSortKey=sortKey
              isReversed=sortReverse>
              ..."W"
            </PlayersSortBtn>
          </th>
          <th className="players-table-th">
            <PlayersSortBtn
              onSort
              sortKey="LOSSES"
              activeSortKey=sortKey
              isReversed=sortReverse>
              ..."L"
            </PlayersSortBtn>
          </th>
          <th className="players-table-th">
            <PlayersSortBtn
              onSort
              sortKey="WINRATE"
              activeSortKey=sortKey
              isReversed=sortReverse>
              ..."WR"
            </PlayersSortBtn>
          </th>
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
    </table>
};
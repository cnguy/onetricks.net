let component = ReasonReact.statelessComponent("PercentageTable");

let make =
    (~items: list((ReasonReact.reactElement, int)), ~outOf: int, children) => {
  ...component,
  render: _self =>
    <div>
      <h3> children </h3>
      <table>
        <thead> <tr> <th /> <th /> <th /> </tr> </thead>
        <tbody>
          (
            ReactUtils.lte(
              items
              |> List.mapi(
                   (index, (item: ReasonReact.reactElement, count: int)) =>
                   <tr>
                     <td> (ReactUtils.ite(index + 1)) </td>
                     <td> item </td>
                     <td>
                       (
                         ReactUtils.ste(
                           (
                             float_of_int(count)
                             /. float_of_int(outOf)
                             *. 100.
                             |> int_of_float
                             |> string_of_int
                           )
                           ++ "%",
                         )
                       )
                     </td>
                   </tr>
                 ),
            )
          )
        </tbody>
      </table>
    </div>,
};
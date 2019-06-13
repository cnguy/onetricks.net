let component = ReasonReact.statelessComponent("PercentageTable");

module Styles = {
  open Css;
  let main =
    style([
      media(
        "only screen and (min-width: 768px)",
        [flexGrow(1.), flexShrink(1), width(`percent(50.))],
      ),
    ]);
};

let make =
    (~items: list((ReasonReact.reactElement, int)), ~outOf: int, children) => {
  ...component,
  render: _self =>
    <div className=Styles.main>
      <h3> children </h3>
      <table>
        <thead> <tr> <th /> <th /> <th /> </tr> </thead>
        <tbody>
          {ReactUtils.lte(
             items
             |> List.mapi(
                  (index, (item: ReasonReact.reactElement, count: int)) =>
                  <tr>
                    <td> {ReactUtils.ite(index + 1)} </td>
                    <td> item </td>
                    <td>
                      {ReactUtils.ste(
                         (
                           float_of_int(count)
                           /. float_of_int(outOf)
                           *. 100.
                           |> int_of_float
                           |> string_of_int
                         )
                         ++ "%",
                       )}
                    </td>
                  </tr>
                ),
           )}
        </tbody>
      </table>
    </div>,
};
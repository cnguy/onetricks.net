let component = ReasonReact.statelessComponent("WinRate");

let getHexColorFromWinrate = (wr: float) =>
  if (wr < 50.0) {
    "#ff0000";
  } else if (wr < 55.0) {
    "#ffffff";
  } else if (wr < 60.0) {
    "#00ff00";
  } else if (wr < 65.0) {
    "#00ccff";
  } else {
    "#ffa500";
  };

let make = (~wins: int, ~losses: int, _children) => {
  ...component,
  render: _self => {
    let winsAsFloat = Pervasives.float_of_int(wins);
    let lossesAsFloat = Pervasives.float_of_int(losses);
    let winRate = winsAsFloat /. (winsAsFloat +. lossesAsFloat) *. 100.0;
    let style =
      ReactDOMRe.Style.make(~color=getHexColorFromWinrate(winRate), ());
    <span style>
      (
        ReactUtils.ste(
          (winRate |> ceil |> int_of_float |> string_of_int) ++ "%",
        )
      )
    </span>;
  },
};
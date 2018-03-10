let component = ReasonReact.statelessComponent("WinRate");

let colorizeWinRate = (wr: float) => {
  let temp = wr;
  if (temp < 50.0) {
    "#ff0000";
  } else if (temp < 55.0) {
    "#ffffff";
  } else if (temp < 60.0) {
    "#00ff00";
  } else if (temp < 65.0) {
    "#00ccff";
  } else {
    "#ffa500";
  };
};

let make = (~wins: int, ~losses: int, _children) => {
  ...component,
  render: _self => {
    let winsAsFloat = Pervasives.float_of_int(wins);
    let lossesAsFloat = Pervasives.float_of_int(losses);
    let winRate = winsAsFloat /. (winsAsFloat +. lossesAsFloat) *. 100.0;
    let coloredWinRate = colorizeWinRate(winRate);
    let style = ReactDOMRe.Style.make(~color=coloredWinRate, ());
    <span style>
      (
        ReasonReact.stringToElement(
          String.sub(string_of_float(Pervasives.ceil(winRate)), 0, 2) ++ "%",
        )
      )
    </span>;
  },
};
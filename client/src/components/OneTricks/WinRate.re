let component = ReasonReact.statelessComponent("WinRate");

let colorizeWinRate = (wr: float) => {
  let temp = wr;
  if (temp < 50.0) {
    "#ff0000"
  } else if (temp < 55.0) {
    "#ffffff"
  } else if (temp < 60.0) {
    "#00ff00"
  } else if (temp < 65.0) {
    "#00ccff"
  } else {
    "#ffa500";
  }
};

let make = (~wins: float, ~losses: float, _children) => {
  ...component,
  render: _self => {
    let winRate = wins /. (wins +. losses) *. 100.0;
    let coloredWinRate = colorizeWinRate(winRate);
    let style = ReactDOMRe.Style.make(~color=coloredWinRate, ());
    <span style>
      (ReasonReact.stringToElement(string_of_float(winRate)))
    </span>;
  }
};

/* For PlayersView.js */
let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~wins=jsProps##wins, ~losses=jsProps##losses, jsProps##children)
  );
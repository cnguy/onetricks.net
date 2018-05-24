let component = ReasonReact.statelessComponent("KDA");

module Styles = {
  open Css;
  let muted = style([color(hex("AAA"))]);
};

type kda = {
  kills: int,
  deaths: int,
  assists: int,
};

let getHexColorFromFloat = (kda: float) =>
  (
    if (kda < 1.) {
      ColorTier.Poor;
    } else if (kda < 2.) {
      ColorTier.Okay;
    } else if (kda < 3.) {
      ColorTier.Average;
    } else if (kda < 4.) {
      ColorTier.Great;
    } else {
      ColorTier.Excellent;
    }
  )
  |> ColorTier.toHex;

let make = (~kda: kda, ~asDecimal: bool=false, _children) => {
  ...component,
  render: _self =>
    if (asDecimal) {
      let kdaValue =
        (float_of_int(kda.kills) +. float_of_int(kda.assists))
        /. float_of_int(kda.deaths);
      let style =
        ReactDOMRe.Style.make(~color=getHexColorFromFloat(kdaValue), ());
      <span style> (ReactUtils.ste(string_of_float(kdaValue))) </span>;
    } else {
      let separator =
        <span className=Styles.muted> (ReactUtils.ste(" / ")) </span>;
      <span>
        (ReactUtils.ite(kda.kills))
        separator
        (ReactUtils.ite(kda.deaths))
        separator
        (ReactUtils.ite(kda.assists))
      </span>;
    },
};
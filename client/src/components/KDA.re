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

let make = (~kda: kda, _children) => {
  ...component,
  render: _self => {
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
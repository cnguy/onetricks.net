let component = ReasonReact.statelessComponent("Header");

module Styles = {
  open Css;
  let mainHeader =
    style([
      color(white),
      fontSize(em(1.3)),
      marginBottom(px(0)),
      media("only screen and (min-width: 500px)", [fontSize(em(1.7))]),
    ]);
  let marginTopSearchBar = style([marginTop(px(18))]);
  let caption =
    style([
      fontSize(em(0.8)),
      color(white),
      fontStyle(italic),
      marginTop(px(0)),
    ]);
};

let title = "League of Legends One Tricks";

let caption = "Jack of No Trades, Master of One";

let make = (~onSearchKeyChange, ~searchKey, _children) => {
  ...component,
  render: _self =>
    <div
      className="header-container"
      onClick=(_event => ReasonReact.Router.push("/"))>
      <div className="float-left">
        <h1 className=Styles.mainHeader> (ReactUtils.ste(title)) </h1>
        <h2 className=Styles.caption> (ReactUtils.ste(caption)) </h2>
      </div>
      <div className=("float-right " ++ Styles.marginTopSearchBar)>
        <ChampionSearch onChange=onSearchKeyChange value=searchKey />
      </div>
      <div className="clear-both" />
    </div>,
};

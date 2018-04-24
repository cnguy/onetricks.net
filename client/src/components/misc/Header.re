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
  let caption =
    style([
      fontSize(em(0.8)),
      color(grey),
      fontStyle(italic),
      marginTop(px(0)),
    ]);
};

let title = "League of Legends One Trick Ponies";

let caption = "Jack of No Trades, Master of One";

let make = _children => {
  ...component,
  render: _self =>
    <div
      className="header-container"
      onClick=(_event => ReasonReact.Router.push("/"))>
      <h1 className=Styles.mainHeader>
        (ReasonReact.stringToElement(title))
      </h1>
      <h2 className=Styles.caption>
        (ReasonReact.stringToElement(caption))
      </h2>
    </div>,
};
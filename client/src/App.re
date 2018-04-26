let component = ReasonReact.statelessComponent("App");

module Styles = {
  open Css;
  let container = style([maxWidth(px(1024)), margin2(~v=`zero, ~h=`auto)]);
};

let make = _children => {
  ...component,
  render: _self => <div className=Styles.container> <OneTricksRe /> </div>,
};
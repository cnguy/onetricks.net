let component = ReasonReact.statelessComponent("QA");

module Styles = {
  open Css;
  let qaItem = style([padding2(~v=em(1.), ~h=em(0.))]);
  let question = style([color(yellow), margin2(~v=em(0.5), ~h=em(0.))]);
};

let qStr = q => ReactUtils.ste("Q: " ++ q);

let aStr = a => ReactUtils.ste("A: " ++ a);

let make = (~question, ~answer, _children) => {
  ...component,
  render: _self =>
    <div className=Styles.qaItem>
      <h4 className=Styles.question> (qStr(question)) </h4>
      <div> (aStr(answer)) </div>
    </div>,
};
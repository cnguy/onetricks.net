[@bs.config {jsx: 3}]
module Styles = {
  open Css;
  let qaItem = style([padding2(~v=em(1.), ~h=em(0.))]);
  let question = style([color(yellow), margin2(~v=em(0.5), ~h=em(0.))]);
};

let qStr = q => ReactUtils.ste("Q: " ++ q);

let aStr = a => ReactUtils.ste("A: " ++ a);

[@react.component]
let make = (~question, ~answer) =>
  <div className=Styles.qaItem>
    <h4 className=Styles.question> {qStr(question)} </h4>
    <div> {aStr(answer)} </div>
  </div>;

module Jsx2 = {
  let component = ReasonReact.statelessComponent("QA");
  /* `children` is not labelled, as it is a regular parameter in version 2 of JSX */
  let make = (~question, ~answer, children) =>
    ReasonReactCompat.wrapReactForReasonReact(
      make,
      makeProps(~question, ~answer, ()),
      children,
    );
};
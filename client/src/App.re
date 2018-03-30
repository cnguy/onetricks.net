let component = ReasonReact.statelessComponent("App");

let make = _children => {
  ...component,
  render: _self => <div className="container"> <OneTricksRe /> </div>,
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps => make(jsProps##children));
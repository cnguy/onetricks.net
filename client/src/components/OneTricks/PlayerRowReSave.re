let component = ReasonReact.statelessComponent("PlayerRowReSave");

let make = _children => {
  ...component,
  render: _self =>
    <span> <span> (ReasonReact.stringToElement("ok")) </span> </span>
};

let default = ReasonReact.wrapReasonForJs(~component, _jsProps => make());
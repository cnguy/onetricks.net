let component = ReasonReact.statelessComponent("PlayerRowReSave");

/* nullElement is the only way Webpack doesn't complain? */
let make = () => {...component, render: _self => ReasonReact.nullElement};

let default = ReasonReact.wrapReasonForJs(~component, _jsProps => make());
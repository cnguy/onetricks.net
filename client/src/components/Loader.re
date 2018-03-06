let component = ReasonReact.statelessComponent("Loader");

let loaderPath: string = [%bs.raw
  {|
  require("../assets/misc/loading.svg")
|}
];

let make = () => {
  ...component,
  render: _self =>
    <div className="loader center-align">
      <img src=loaderPath className="loader-img" alt="Loading!" />
    </div>
};

let default = ReasonReact.wrapReasonForJs(~component, _jsProps => make());
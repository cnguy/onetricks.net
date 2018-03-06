let component = ReasonReact.statelessComponent("Header");

let title = "League of Legends One Trick Ponies";

let caption = "Jack of No Trades, Master of One";

let make = _children => {
  ...component,
  render: _self =>
    <div
      className="header-container"
      onClick=(_event => ReasonReact.Router.push("/"))>
      <h1 className="main-header"> (ReasonReact.stringToElement(title)) </h1>
      <h2 className="caption"> (ReasonReact.stringToElement(caption)) </h2>
    </div>
};
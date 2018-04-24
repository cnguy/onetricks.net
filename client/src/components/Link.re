let component = ReasonReact.statelessComponent("Link");

module Router = Router.Router;

let make = (~route: RouterConfig.route, ~isActive: bool, children) => {
  ...component,
  render: _self =>
    <Router.Link route>
      <span className=("link" ++ (if (isActive) {" link--active"} else {""}))>
        (ReasonReact.arrayToElement(children))
      </span>
    </Router.Link>,
};
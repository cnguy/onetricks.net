let component = ReasonReact.statelessComponent("Link");

module Router = Router.Router;

module Styles = {
  open Css;
  let link =
    style([
      color(hex("AAA")),
      textDecoration(none),
      cursor(`pointer),
      textTransform(uppercase),
      fontWeight(700),
      hover([
        color(white),
        cursor(`pointer),
        borderBottom(px(1), `solid, white),
        textTransform(uppercase),
      ]),
    ]);
  let activeLink =
    style([
      color(white),
      borderBottom(px(1), `solid, white),
      fontWeight(700),
    ]);
  let className = (isActive: bool) =>
    link
    ++ (
      if (isActive) {
        " " ++ activeLink;
      } else {
        "";
      }
    );
};

let make = (~route: RouterConfig.route, ~isActive: bool, children) => {
  ...component,
  render: _self =>
    <Router.Link route>
      <span className=(Styles.className(isActive))>
        (ReactUtils.ate(children))
      </span>
    </Router.Link>,
};
let component = ReasonReact.statelessComponent("FeatureRequests");

let make = _children => {
  ...component,
  render: _self =>
    <div>
      <p>
        (
          ReactUtils.ste(
            "Hey there. If you want to make feature requests or bug reports, there are two channels for doing so:",
          )
        )
      </p>
      <a
        id="src-code"
        href="https://github.com/cnguy/onetricks.net"
        target="_blank">
        (ReactUtils.ste("1. GitHub"))
      </a>
      <br />
      (ReactUtils.ste("2. email: lolonetricks@gmail.com"))
      <p>
        (
          ReactUtils.ste(
            "Please try to be as specific as possible in any request or report, and use meaningful titles. Any type of contribution, recommendation, or feedback is welcome and very much appreciated!",
          )
        )
      </p>
    </div>,
};

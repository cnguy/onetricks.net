let component = ReasonReact.statelessComponent("NotFound");

let setTimeout: (unit => unit, int) => unit = [%bs.raw
  {|
  function setTimeoutWrapper(callback, milliseconds) {
    setTimeout(callback, milliseconds);
  }
  |}
];

let make = _children => {
  ...component,
  didMount: self => {
    setTimeout(() => ReasonReact.Router.push("/"), 5000);
    NoUpdate;
  },
  render: _self => {
    let url =
      switch (ReasonReact.Router.dangerouslyGetInitialUrl()) {
      | {path, search} =>
        (path |> List.fold_left((total, curr) => total ++ "/" ++ curr, ""))
        ++ (
          switch (search) {
          | "" => ""
          | str => "?" ++ str
          }
        )
      };
    <div className="not-found">
      <h2>
        (
          Utils.ste(
            "Hi. There is nothing to be displayed at the route: \""
            ++ url
            ++ "\".",
          )
        )
      </h2>
      <p className="not-found__steps">
        (
          Utils.ste(
            "You will automatically be redirected to the home page in 5 seconds.",
          )
        )
        <br />
        <span
          className="go-back"
          onClick=(_event => ReasonReact.Router.push("/"))>
          (Utils.ste("Click me to go to the home page."))
        </span>
        <br />
        (
          Utils.ste(
            "If you instead believe there is an error, please email chautnguyen96@gmail.com!",
          )
        )
      </p>
    </div>;
  },
};
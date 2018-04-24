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
  didMount: _self => {
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
          ReactUtils.ste(
            "Hi. There is nothing to be displayed at the route: \""
            ++ url
            ++ "\".",
          )
        )
      </h2>
      <p className="not-found__steps">
        (
          ReactUtils.ste(
            "You will automatically be redirected to the home page in 5 seconds.",
          )
        )
        <br />
        (
          ReactUtils.ste(
            "If you instead believe there is an error, please email chautnguyen96@gmail.com!",
          )
        )
      </p>
    </div>;
  },
};
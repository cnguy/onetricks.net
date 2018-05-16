type environment =
  | Development
  | Production;

let nodeEnv = () =>
  switch ([%bs.raw {| process.env.NODE_ENV |}]) {
  | "development" => Development
  | "production" => Production
  | _ => Development
  };
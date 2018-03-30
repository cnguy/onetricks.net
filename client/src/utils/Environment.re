type environment =
  | None
  | Development
  | Production;

let nodeEnv = () =>
  switch ([%bs.raw {| process.env.NODE_ENV |}]) {
  | "development" => Development
  | "production" => Production
  | _ => None
  };

let getNgrokURL = () : string => [%bs.raw {| process.env.NGROK_SERVER |}];
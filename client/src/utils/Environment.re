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

let ngrokURL = () : string => [%bs.raw {| process.env.REACT_APP_NGROK_URL |}];
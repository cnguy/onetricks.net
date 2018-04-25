type environment =
  | Development
  | Production;

let nodeEnv = () =>
  switch ([%bs.raw {| process.env.NODE_ENV |}]) {
  | "development" => Development
  | "production" => Production
  | _ => Development
  };

let ngrokURL = () : string => [%bs.raw {| process.env.REACT_APP_NGROK_URL |}];
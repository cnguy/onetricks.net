[%bs.raw {| require('babel-polyfill') |}];

[%bs.raw {| require('./index.css') |}];

ReactDOMRe.renderToElementWithId(<App />, "root");
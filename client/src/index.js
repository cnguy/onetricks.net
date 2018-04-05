'use strict';

var ReactDOMRe = require("reason-react/src/ReactDOMRe.js");
var ReasonReact = require("reason-react/src/ReasonReact.js");
var App$IntroduceReason = require("./App.js");

(( require('babel-polyfill') ));

(( require('./index.css') ));

ReactDOMRe.renderToElementWithId(ReasonReact.element(/* None */0, /* None */0, App$IntroduceReason.make(/* array */[])), "root");

/*  Not a pure module */

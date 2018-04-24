'use strict';

var Jest = require("@glennsl/bs-jest/src/jest.js");
var Curry = require("bs-platform/lib/js/curry.js");

describe("Expect", (function () {
        return Jest.test("toBe", (function () {
                      return Jest.Expect[/* toBe */2](3, Jest.Expect[/* expect */0](3));
                    }));
      }));

describe("Expect.Operators", (function () {
        return Jest.test("==", (function () {
                      return Curry._2(Jest.Expect[/* Operators */24][/* == */0], Jest.Expect[/* expect */0](3), 3);
                    }));
      }));

/*  Not a pure module */

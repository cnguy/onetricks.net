/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import {
  mergedSelector,
} from '../../../client/src/selectors';

const states = [
  {
    misc: {
      merged: true,
    },
  },
  {
    misc: {
      merged: false,
    },
  },
];

describe('selectors/misc', function () {
  describe('mergedSelector', function () {
    it('should select state/misc/merged=true', function () {
      assert.equal(mergedSelector(states[0]), true);
    });

    it('should select state/misc/merged=false', function () {
      assert.equal(mergedSelector(states[1]), false);
    });
  });
});

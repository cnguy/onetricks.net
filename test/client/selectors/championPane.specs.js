/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import {
  advancedFilterSelector,
} from '../../../client/src/selectors';

const states = [
  {
    championPane: {
      advFilter: true,
    },
  },
  {
    championPane: {
      advFilter: false,
    },
  },
  {
    championPane: {
      advFilter: false,
    },
  },
];

describe('selectors/championPane', function () {
  describe('advancedFilterSelector', function () {
    it('should select state/championPane/advFilter=true', function () {
      assert.equal(advancedFilterSelector(states[0]), true);
    });

    it('should select state/championPane/advFilter=false', function () {
      assert.equal(advancedFilterSelector(states[1]), false);
    });
  });
});

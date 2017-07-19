/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import {
  advancedFilterSelector,
  searchKeySelector,
} from '../../../client/src/selectors';

const states = [
  {
    championPane: {
      advFilter: true,
      searchKey: '',
    },
  },
  {
    championPane: {
      advFilter: false,
      searchKey: 'RIVEN',
    },
  },
  {
    championPane: {
      advFilter: false,
      searchKey: 'Kindred',
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

  describe('searchKeySelector', function () {
    it('should select state/championPane/searchKey=(empty string)', function () {
      assert.equal(searchKeySelector(states[0]), '');
    });

    it('should select state/championPane/advFilter=RIVEN', function () {
      assert.equal(searchKeySelector(states[1]), 'RIVEN');
    });

    it('should select state/championPane/advFilter=Kindred', function () {
      assert.equal(searchKeySelector(states[2]), 'Kindred');
    });
  });
});

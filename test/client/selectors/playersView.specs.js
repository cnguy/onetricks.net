/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import {
  sortKeySelector,
  sortReverseSelector,
} from '../../../client/src/selectors';

const states = [
  {
    playersView: {
      sortKey: 'NONE',
      sortReverse: true,
    },
  },
  {
    playersView: {
      sortKey: 'RANK',
      sortReverse: false,
    },
  },
];

describe('selectors/playersView', function () {
  describe('sortReverseSelector', function () {
    it('should select playersView/sortReverse/sortKey=NONE', function () {
      assert.equal(sortKeySelector(states[0]), 'NONE');
    });

    it('should select playersView/sortReverse/sortKey=RANK', function () {
      assert.equal(sortKeySelector(states[1]), 'RANK');
    });
  });

  describe('sortReverseSelector', function () {
    it('should select playersView/sortReverse/sortReverse=true', function () {
      assert.equal(sortReverseSelector(states[0]), true);
    });

    it('should select playersView/sortReverse/sortReverse=false', function () {
      assert.equal(sortReverseSelector(states[1]), false);
    });
  });
});

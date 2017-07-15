/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import {
  sortReverseSelector,
} from '../../../client/src/selectors';

const states = [
  {
    playersView: {
      sortReverse: true,
    },
  },
  {
    playersView: {
      sortReverse: false,
    },
  },
];

describe('selectors/playersView', function () {
  describe('sortReverseSelector', function () {
    it('should select playersView/sortReverse/sortReverse=true', function () {
      assert.equal(sortReverseSelector(states[0]), true);
    });

    it('should select playersView/sortReverse/sortReverse=false', function () {
      assert.equal(sortReverseSelector(states[1]), false);
    });
  });
});

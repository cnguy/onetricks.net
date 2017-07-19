/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import playersViewReducer from '../../../client/src/redux/playersView';
import {
  setSortKey,
  setSortReverse,
} from '../../../client/src/redux/playersView';

const states = {
  SORT_KEY: [
    {
      sortKey: 'NONE',
    },
    {
      sortKey: 'RANK',
    },
  ],
  SORT_REVERSE: [
    {
    sortReverse: true,
    },
    {
      sortReverse: false,
    },
  ]
};

describe('redux/playersView', function () {
  describe('state/playersView/sortKey', function () {
    it('should default to sortKey=NONE', function () {
      assert.equal(playersViewReducer().sortKey, 'NONE');
    });

    describe('setSortKey', function () {
      it('should set state/playersView/sortKey -> something else (e.g., RANK)', function () {
        expect(playersViewReducer(states.SORT_KEY[0], setSortKey('RANK'))).to.deep.equal({
          sortKey: 'RANK',
        });
      });

      it('should set state/playersView/sortKey -> something else (e.g, NONE)', function () {
        expect(playersViewReducer(states.SORT_KEY[1], setSortKey('NONE'))).to.deep.equal({
          sortKey: 'NONE',
        });
      });
    });
  });

  describe('sortReverse', function () {
    it('should default to sortReverse=false', function () {
        assert.equal(playersViewReducer().sortReverse, false);
    });

    describe('setSortReverse', function () {
      it('should set state/playersView/sortReverse -> false', function () {
        expect(playersViewReducer(states.SORT_REVERSE[0], setSortReverse(false))).to.deep.equal({
          sortReverse: false,
        });
      });

      it('should set state/playersView/sortReverse -> true', function () {
        expect(playersViewReducer(states.SORT_REVERSE[1], setSortReverse(true))).to.deep.equal({
          sortReverse: true,
        });
      });
    });
  });
});

/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import playersViewReducer from '../../../client/src/redux/playersView';
import {
  setSortKey,
  setSortReverse,
} from '../../../client/src/redux/playersView';

const states = [
  {
    sortKey: 'NONE',
    sortReverse: true,
  },
  {
    sortKey: 'RANK',
    sortReverse: false,
  },
];

describe('redux/playersView', function () {
  describe('setSortKey', function () {
    it('should default to sortKey=NONE', function () {
      assert.equal(playersViewReducer().sortKey, 'NONE');
    });

    it('should set state/playersView/sortKey -> something else (eg: RANK)', function () {
      expect(playersViewReducer(states[0], setSortKey('RANK'))).to.deep.equal({
        sortKey: 'RANK',
      });
    });

    it('should set state/playersView/sortKey -> something else (eg: NONE)', function () {
      expect(playersViewReducer(states[1], setSortKey('NONE'))).to.deep.equal({
        sortKey: 'NONE',
      });
    });
  });

  describe('setSortReverse', function () {
    it('should default to sortReverse=false', function () {
      assert.equal(playersViewReducer().sortReverse, false);
    });

    it('should set state/playersView/sortReverse -> false', function () {
      expect(playersViewReducer(states[0], setSortReverse(false))).to.deep.equal({
        sortReverse: false,
      });
    });

    it('should set state/playersView/sortReverse -> true', function () {
      expect(playersViewReducer(states[1], setSortReverse(true))).to.deep.equal({
        sortReverse: true,
      });
    });
  });
});

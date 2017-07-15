/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import playersViewReducer from '../../../client/src/redux/playersView';
import {
  setSortReverse,
} from '../../../client/src/redux/playersView';

const states = [
  {
    sortReverse: true,
  },
  {
    sortReverse: false,
  },
];

describe('redux/playersView', function () {
  describe('setSortReverse', function () {
    it('should default to sortReverse=false', function () {
      expect(playersViewReducer()).to.deep.equal({
        sortReverse: false,
      });
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

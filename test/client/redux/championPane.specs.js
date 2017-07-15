/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import championPaneReducer from '../../../client/src/redux/championPane';
import {
  setAdvFilter,
} from '../../../client/src/redux/championPane';

const states = {
  ADVANCED_FILTER: [
    {
      advFilter: true,
    },
    {
      advFilter: false,
    },
  ],
};

describe('redux/championPane', function () {
  describe('setAdvFilter', function () {
    it('should default to advFilte=FALSE', function () {
      assert.equal(championPaneReducer().advFilter, false);
    });

    it('should set state/championPane/advFilter -> true', function () {
      expect(championPaneReducer(states.ADVANCED_FILTER[0], setAdvFilter(false))).to.deep.equal({
        advFilter: false,
      });
    });

    it('should set state/championPane/advFilter -> false', function () {
      expect(championPaneReducer(states.ADVANCED_FILTER[1], setAdvFilter(true))).to.deep.equal({
        advFilter: true,
      });
    });
  });
});

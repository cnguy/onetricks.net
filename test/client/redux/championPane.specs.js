/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import championPaneReducer from '../../../client/src/redux/championPane';
import {
  toggleAdvancedFilter,
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
  describe('toggleAdvancedFilter', function () {
    it('should default to advFilte=FALSE', function () {
      assert.equal(championPaneReducer().advFilter, false);
    });

    it('should toggle state/championPane/advFilter from true -> false', function () {
      expect(championPaneReducer(states.ADVANCED_FILTER[0], toggleAdvancedFilter())).to.deep.equal({
        advFilter: false,
      });
    });

    it('should toggle state/championPane/advFilter from false -> true', function () {
      expect(championPaneReducer(states.ADVANCED_FILTER[1], toggleAdvancedFilter())).to.deep.equal({
        advFilter: true,
      });
    });
  });
});

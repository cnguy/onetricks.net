/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import championPaneReducer from '../../../client/src/redux/championPane';
import {
  resetSearchKey,
  setSearchKey,
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
  SEARCH_KEY: [
    {
      searchKey: 'garbage',
    },
  ],
};

describe('redux/championPane', function () {
  describe('state/championPane/searchKey', function () {
    it('should default to searchKey=(empty string)', function () {
      assert.equal(championPaneReducer().searchKey, '');
    });

    describe('resetSearchKey', function () {
      it('should clear state/championPane/searchKey', function () {
        expect(championPaneReducer(states.SEARCH_KEY[0], resetSearchKey())).to.deep.equal({
          searchKey: '',
        });
      });
    });

    describe('setSearchKey', function () {
      it('should set state/championPane/searchKey=(something else) (ex: Riven)', function () {
        expect(championPaneReducer(states.SEARCH_KEY[0], setSearchKey('Riven'))).to.deep.equal({
          searchKey: 'Riven',
        });
      });
    });
  });

  describe('advFilter', function () {
    it('should default to advFilter=false', function () {
        assert.equal(championPaneReducer().advFilter, false);
    });

    describe('toggleAdvancedFilter', function () {
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
});

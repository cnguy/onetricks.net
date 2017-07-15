/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import miscReducer from '../../../client/src/redux/misc';
import {
  toggleMerge,
} from '../../../client/src/redux/misc';

const states = [
  {
    merged: true,
  },
  {
    merged: false,
  },
];

describe('redux/misc', function () {
  describe('toggleMerge', function () {
    it('should default to merged=true', function () {
      expect(miscReducer()).to.deep.equal({
        merged: true,
      });
    });

    it('should toggle state/misc/merged from false -> true', function () {
      expect(miscReducer(states[0], toggleMerge())).to.deep.equal({
        merged: !states[0].merged,
      });
    });

    it('should toggle state/misc/merged from true -> false', function () {
      expect(miscReducer(states[1], toggleMerge())).to.deep.equal({
        merged: !states[1].merged,
      });
    });
  });
});

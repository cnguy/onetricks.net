import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import miscReducer from '../../../client/src/redux/misc';
import {
  toggleMerge,
} from '../../../client/src/redux/misc';
// const toggleMerge = require('../../../client/src/redux/misc');
// import miscReducer from '../../../client/src/redux/misc';
// import { toggleMerge } from '../../../client/src/redux/misc';

const states = [
  {
    merged: true,
  },
  {
    merged: false,
  },
];

describe('redux/misc', function() {
  describe('toggleMerge', function() {
    it('should work from true->false', function() {
      expect(miscReducer(states[0], toggleMerge())).to.deep.equal({
        merged: false,
      });
    });
  });
});

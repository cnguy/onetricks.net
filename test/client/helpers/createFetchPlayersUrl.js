/* eslint-disable */

import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

import createFetchPlayersUrl from '../../../client/src/helpers/createFetchPlayersUrl';

const mocks = [
  'all',
  'na',
  ['na'],
  ['na', 'kr'],
]

const expectedPrefix = 'all?region=';
const expectedSuffix = '&multiple=true';

describe('helpers/createFetchPlayersUrl', function () {
  it('should work with single region=all', function () {
    assert.equal(createFetchPlayersUrl(mocks[0]), `${expectedPrefix}${mocks[0]}`);
  });

  it('should work with single region=something else (eg: na)', function () {
    assert.equal(createFetchPlayersUrl(mocks[1]), `${expectedPrefix}${mocks[1]}`);
  });

  it('should work with single region in array', function () {
    assert.equal(createFetchPlayersUrl(mocks[2]), `${expectedPrefix}${mocks[2][0]}${expectedSuffix}`);
  });

  it('should work with multiple regions in array', function () {
    assert.equal(createFetchPlayersUrl(mocks[3].join(',')), `${expectedPrefix}${mocks[3]}`);
  });
});

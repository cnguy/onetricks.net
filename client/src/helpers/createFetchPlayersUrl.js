// @flow

import type {
  region as regionType,
} from '../constants/flowTypes.js';

const createFetchPlayersUrl = (args: regionType | Array<regionType>): string =>
  `all?region=${
    Array.isArray(args)
      ? `${args.join(',')}&multiple=true`
      : `${args}`
  }`;

export default createFetchPlayersUrl;

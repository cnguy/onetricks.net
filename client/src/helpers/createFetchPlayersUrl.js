// @flow

import type {
  region as regionType,
} from '../constants/flowTypes.js';

const createFetchPlayersUrl = (args: regionType | Array<regionType>): string =>
  `http://5e6fcf9e.ngrok.io/all?region=${
    Array.isArray(args)
      ? `${args.join(',')}&multiple=true`
      : `${args}`
  }`;

export default createFetchPlayersUrl;

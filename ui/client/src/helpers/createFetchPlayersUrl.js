// @flow
//https://stackoverflow.com/questions/36357302/error-making-http-request-across-linked-docker-containers
import type {
  region as regionType,
} from '../constants/flowTypes.js';

const createFetchPlayersUrl = (args: regionType | Array<regionType>): string =>
  `http://localhost:3001/all?region=${
    Array.isArray(args)
      ? `${args.join(',')}&multiple=true`
      : `${args}`
  }`;

export default createFetchPlayersUrl;

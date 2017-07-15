// @flow

import type {
  state as stateType,
} from '../constants/flowTypes.js';

export const mergedSelector = (state: stateType): boolean => state.misc.merged;

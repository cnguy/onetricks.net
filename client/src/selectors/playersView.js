// @flow

import type {
  state as stateType,
} from '../constants/flowTypes.js';

export const sortReverseSelector = (state: stateType): boolean => state.playersView.sortReverse;

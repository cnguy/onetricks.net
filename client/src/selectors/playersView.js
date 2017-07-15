// @flow

import type {
  sortReverse as sortReverseType,
  state as stateType,
} from '../constants/flowTypes.js';

export const sortReverseSelector = ({
  playersView: {
    sortReverse,
  },
}: stateType): sortReverseType => sortReverse;

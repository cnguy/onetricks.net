// @flow

import type {
  advFilter as advFilterType,
  state as stateType,
} from '../constants/flowTypes.js';

export const advancedFilterSelector = ({
  championPane: {
    advFilter,
  },
}: stateType): advFilterType => advFilter;

// @flow

import type {
    advFilter as advFilterType,
    searchKey as searchKeyType,
    state as stateType,
} from '../constants/flowTypes.js'

export const searchKeySelector = ({
    championPane: { searchKey },
}: stateType): searchKeyType => searchKey

export const advancedFilterSelector = ({
    championPane: { advFilter },
}: stateType): advFilterType => advFilter

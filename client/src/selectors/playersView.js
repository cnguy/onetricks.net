// @flow

import type {
    sortKey as sortKeyType,
    sortReverse as sortReverseType,
    state as stateType,
} from '../constants/flowTypes.js'

export const sortKeySelector = ({
    playersView: { sortKey },
}: stateType): sortKeyType => sortKey

export const sortReverseSelector = ({
    playersView: { sortReverse },
}: stateType): sortReverseType => sortReverse

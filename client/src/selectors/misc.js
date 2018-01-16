// @flow

import type {
    merged as mergedType,
    state as stateType,
} from '../constants/flowTypes.js'

export const mergedSelector = ({ misc: { merged } }: stateType): mergedType =>
    merged

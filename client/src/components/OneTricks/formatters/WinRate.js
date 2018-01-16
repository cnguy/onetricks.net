// @flow

import React from 'react'

import type { winRateStats as winRateStatsType } from '../../../constants/flowTypes'

import winRateColorize from '../../../helpers/winRateColorize'

const WinRate = ({ wins, losses }: winRateStatsType): React$Element<any> => (
    <span style={{ color: winRateColorize(wins / (wins + losses)) }}>
        {(wins / (wins + losses)).toLocaleString('en', {
            style: 'percent',
            minimumFractionDigits: 2,
        })}
    </span>
)

export default WinRate

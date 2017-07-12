import React from 'react';

import winRateColorize from '../../../helpers/winRateColorize';

const WinRate = ({ wins, losses }) =>
  <span style={{ color: winRateColorize(wins / (wins + losses)) }}>
    {
      (wins / (wins + losses)).toLocaleString('en', {
        style: 'percent',
        minimumFractionDigits: 2,
      })
    }
  </span>;

export default WinRate;

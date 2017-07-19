import winRateColors from '../constants/winRateColors';

const bisector = [50, 55, 60, 65];

const winRateColorize = (wr) => {
  const temp = wr * 100;
  if (temp < bisector[0]) return winRateColors.red;
  if (temp < bisector[1]) return winRateColors.white;
  if (temp < bisector[2]) return winRateColors.green;
  if (temp < bisector[3]) return winRateColors.blue;
  return winRateColors.orange;
};

export default winRateColorize;

import winRateColors from '../constants/winRateColors';

const bisector = [50, 55, 60, 65];

const winRateColorize = wr => {
  wr *= 100;
  if (wr < bisector[0]) return winRateColors['red'];
  if (wr < bisector[1]) return winRateColors['white'];
  if (wr < bisector[2]) return winRateColors['green'];
  if (wr < bisector[3]) return winRateColors['blue'];
  if (wr <= 100) return winRateColors['orange'];
};

export default winRateColorize;

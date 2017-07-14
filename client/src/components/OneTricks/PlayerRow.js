// @flow

import React from 'react';

import WinRate from './formatters/WinRate';

import RANKS from '../../constants/ranks';

import ChallengerIcon from '../../assets/rank-icons/challengers.png';
import MastersIcon from '../../assets/rank-icons/masters.png';

import type {
  player as playerType,
  rank as rankType,
  region as regionType,
} from '../../constants/flowTypes';

const generateLink = (name: string, region: regionType, opgg: boolean, id: number): string => (
  (opgg)
    ? `https://${region}.op.gg/summoner/userName=${name}`
    : `http://www.lolking.net/summoner/${region}/${id.toString()}/${name}`
);

const getRankIcon = (rank: rankType): any =>
  rank === RANKS.challenger
    ? ChallengerIcon
    : MastersIcon;

const getRankImage = rank => <img className="player-rank-icon" src={getRankIcon(rank)} alt="rank" />;

type PropTypes = {
  player: playerType
}

const PlayerRow = ({ player }: PropTypes): React$Element<any> =>
  <tr>
    <td>{player.region.toUpperCase()}</td>
    <td>
      {getRankImage(player.rank)}&nbsp;
      <a
        className="table-player-link"
        href={generateLink(player.name, player.region, true, player.id)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {player.name}
      </a>
    </td>
    <td style={{ color: '#98fb98' }}>{player.wins}</td>
    <td style={{ color: '#ff6961' }}>{player.losses}</td>
    <td>
      <WinRate wins={player.wins} losses={player.losses} />
    </td>
    <td>
      <a
        className="table-player-link"
        href={generateLink(player.name, player.region, true, player.id)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {player.region}
      </a>
    </td>
    <td>
      <a
        className="table-player-link"
        href={generateLink(player.name, player.region, false, player.id)}
        target="_blank"
        rel="noopener noreferrer"
      >
        go
      </a>
    </td>
  </tr>;

export default PlayerRow;

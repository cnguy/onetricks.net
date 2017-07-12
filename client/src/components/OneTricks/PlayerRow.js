import React from 'react';

import WinRate from './formatters/WinRate';

import RANKS from '../../constants/ranks';

import ChallengerIcon from '../../assets/rank-icons/challengers.png';
import MastersIcon from '../../assets/rank-icons/masters.png';

const generateLink = (name, region, opgg, id) => (
  (opgg)
  ? `https://${region}.op.gg/summoner/userName=${name}`
  : `http://www.lolking.net/summoner/${region}/${id}/${name}`
);

const getRankIcon = rank => (rank === RANKS.challenger) ? ChallengerIcon : MastersIcon;
const getRankImage = rank =>  <img className='player-rank-icon' src={getRankIcon(rank)} alt='rank' />;

const PlayerRow = ({ player }) =>
  <tr>
    <td>{player.region.toUpperCase()}</td>
    <td>{getRankImage(player.rank)}&nbsp;<a className='table-player-link' href={generateLink(player.name, player.region, true, player.id)} target='_blank'>{player.name}</a></td>
    <td style={{ color: '#98fb98' }}>{player.wins}</td>
    <td style={{ color: '#ff6961' }}>{player.losses}</td>
    <td>
      <WinRate wins={player.wins} losses={player.losses} />
    </td>
    <td>
      <a className='table-player-link' href={generateLink(player.name, player.region, true, player.id)} target='_blank'>
        {player.region}
      </a>
    </td>
    <td>
      <a className='table-player-link' href={generateLink(player.name, player.region, false, player.id)} target='_blank'>
        go
      </a>
    </td>
  </tr>;

export default PlayerRow;

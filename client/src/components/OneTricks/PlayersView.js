// @flow

import React from 'react';

import ChampIcon from './ChampIcon';
import PlayerRow from './PlayerRow';
import PlayersSort from './PlayersSort';
import Sorts from '../../helpers/sorts';
import WinRate from './formatters/WinRate';

import type {
  player as playerType,
  sortKey as sortKeyType,
  winRateStats as winRateStatsType,
} from '../../constants/flowTypes';

const getOverallWinRate = (players: Array<playerType>): winRateStatsType =>
  players.reduce((t, el) => ({
    wins: t.wins + el.wins,
    losses: t.losses + el.losses,
  }), { wins: 0, losses: 0 });

const renderOverallWinrate = ({ wins, losses }: winRateStatsType): React$Element<any> =>
  <WinRate wins={wins} losses={losses} />;

type PropTypes = {
  players: Array<playerType>,
  goBack: () => void,
  champ: string,
  show: boolean,
  onSort: (sortKey: sortKeyType) => void,
  sortKey: sortKeyType,
  sortReverse: boolean
}

const PlayersView = ({
  players,
  goBack,
  champ,
  show,
  onSort,
  sortKey,
  sortReverse,
}: PropTypes): (React$Element<any> | null) => {
  const sortedList = (sortReverse) ? Sorts[sortKey](players).reverse() : Sorts[sortKey](players);
  const scores = getOverallWinRate(players);

  return (show) ? (
    <div className="players-list-view fade-in">
      <a className="go-back flash" href="#" onClick={goBack}>
        &#60;&#60;&nbsp;Back to Champions
      </a>

      <div className="players-table-header flash">
        {
          players.length}&nbsp;<ChampIcon name={champ} mini handleImageLoad={null} />
          &nbsp;One Trick Ponies {renderOverallWinrate(scores)
        }
      </div>

      <table className="players-table">
        <thead>
          <tr>
            <th>
              <PlayersSort onSort={onSort} sortKey={'REGION'} activeSortKey={sortKey} reverse={sortReverse}>
                Region
              </PlayersSort>
            </th>
            <th>&nbsp;
              <PlayersSort onSort={onSort} sortKey={'RANK'} activeSortKey={sortKey} reverse={sortReverse}>
                R
              </PlayersSort>&nbsp;&nbsp;
              <PlayersSort onSort={onSort} sortKey={'NAME'} activeSortKey={sortKey} reverse={sortReverse}>
                Name
              </PlayersSort>
            </th>
            <th>
              <PlayersSort onSort={onSort} sortKey={'WINS'} activeSortKey={sortKey} reverse={sortReverse}>
                W
              </PlayersSort>
            </th>
            <th>
              <PlayersSort onSort={onSort} sortKey={'LOSSES'} activeSortKey={sortKey} reverse={sortReverse}>
                L
              </PlayersSort>
            </th>
            <th>
              <PlayersSort onSort={onSort} sortKey={'WINRATE'} activeSortKey={sortKey} reverse={sortReverse}>
                WR
              </PlayersSort>
            </th>
            <th>op.gg</th>
            <th>lolking</th>
          </tr>
        </thead>
        <tbody>
          {
            sortedList.map((item, index) => <PlayerRow player={item} key={index} />)
          }
        </tbody>
      </table>
    </div>
  ) : null;
};

export default PlayersView;

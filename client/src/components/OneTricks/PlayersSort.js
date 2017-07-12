import React from 'react';

import classNames from 'classnames';

function grabTri(sortKey, activeSortKey, reverse) {
  if (sortKey === activeSortKey && reverse)
    return <span className='sort-tri'>&#9650;</span>;
  else if (sortKey === activeSortKey && !reverse)
    return <span className='sort-tri'>&#9660;</span>;
  else
    return '';
}

const PlayersSort = ({ onSort, sortKey, activeSortKey, reverse, children }) => {
  const playerSortClass = classNames(
    'player-sort-link', 'flash',
    { 'active-sort': sortKey === activeSortKey },
  );

  return (
    <a className={playerSortClass} href='#' onClick={() => onSort(sortKey)}>
      {children}&nbsp;{grabTri(sortKey, activeSortKey, reverse)}
    </a>
  );
}

export default PlayersSort;

import React from 'react';

import classNames from 'classnames';

const FilterButton = ({ onClick, active, children }) => {
  const filterClass = classNames(
    'filter-rg-btn',
    { 'filter-btn-active': active.indexOf(children.toLowerCase()) !== -1 }
  );

  return (
    <button className={filterClass} onClick={onClick}>
      {children}
    </button>
  );
}

export default FilterButton;

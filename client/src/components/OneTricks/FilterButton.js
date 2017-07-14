// @flow

import React from 'react';

/* FlowFixMe */
import classNames from 'classnames';

import type {
  region as regionType,
} from '../../constants/flowTypes';

type PropTypes = {
  onClick: (region: regionType) => void,
  active: Array<regionType>,
  children: regionType
}

const FilterButton = ({ onClick, active, children }: PropTypes): React$Element<any> => {
  const filterClass = classNames(
    'filter-rg-btn',
    /* FlowFixMe EUNE -> eune is needed here */
    { 'filter-btn-active': active.indexOf(children.toLowerCase()) !== -1 },
  );

  return (
    <button className={filterClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default FilterButton;

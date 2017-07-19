// @flow

import React from 'react';

/* FlowFixMe */
import classNames from 'classnames';

import ChampIcon from './ChampIcon';

type PropTypes = {
  name: string,
  number: number,
  handleImageLoad: () => void,
}

const Champion = ({ name, number, handleImageLoad }: PropTypes): React$Element<any> => {
  const numberStyle = classNames(
    'number-text',
    (String(number).length === 1) ? 'one-digit' : 'two-digit',
  );

  return (
    <div className="champ-square">
      <div className="overlay">
        <span className={numberStyle}>
          {number}
        </span>
      </div>
      <ChampIcon name={name} mini={false} handleImageLoad={handleImageLoad} />
    </div>
  );
};

export default Champion;

// @flow

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import React from 'react';

const getIcon = (name: string) => { // $FlowFixMe disable require literal string
  try {
    return require(`../../assets/champ-icons/min/${name.toLowerCase()}square-min.png`);
  } catch (err) {
    return require('../../assets/champ-icons/min/questionmark.png');
  }
};

type PropTypes = {
  name: string,
  mini: boolean,
  handleImageLoad: (() => void) | null,
}

const ChampIcon = ({ name, mini, handleImageLoad }: PropTypes): React$Element<any> =>
  <img
    className={(mini) ? 'mini-champ-icon' : 'champ-icon'}
    src={getIcon(name)}
    onLoad={handleImageLoad}
    alt={`${name} One Trick Pony/Ponies`}
  />;

export default ChampIcon;

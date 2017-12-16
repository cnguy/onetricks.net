// @flow

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import React from 'react';

const getChampionNameFromOrigin = (name) =>
  document.origin.includes('localhost')
    ? name
    : name.toLowerCase().replace(/[^a-zA-Z]+/g, '');

const getIcon = (name: string) => { // $FlowFixMe disable require literal string
  console.log(getChampionNameFromOrigin(name));
  try {
    return require(`../../assets/champ-icons/min/${getChampionNameFromOrigin(name)}Square-min.png`);
  } catch (err) {
    return require('../../assets/champ-icons/min/questionmark.png');
  }
}

// const getIcon = (name: string) => // $FlowFixMe disable require literal string
//   require(`../../assets/champ-icons/min/${name.replace(/[^a-zA-Z]+/g, '')}Square-min.png`);

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

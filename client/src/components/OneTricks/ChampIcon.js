import React from 'react';

const getChampionNameFromOrigin = (name) =>
  document.origin.includes('localhost')
    ? name
    : name.toLowerCase().replace(/[^a-zA-Z]+/g, '');

const getIcon = name =>
  require(`../../assets/champ-icons/min/${getChampionNameFromOrigin(name)}Square-min.png`);

const ChampIcon = ({ name, mini, handleImageLoad }) =>
  <img
    className={(mini) ? 'mini-champ-icon' : 'champ-icon'}
    src={getIcon(name)}
    onLoad={(handleImageLoad) ? handleImageLoad : ''}
    alt={name + ' One Trick Pony/Ponies'}
  />;

export default ChampIcon;

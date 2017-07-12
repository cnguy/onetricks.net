import React from 'react';

const fixName = (name) =>
  document.origin.includes('localhost')
    ? name.replace(/[^a-zA-Z]+/g, '')
    : name.charAt(0).toLowerCase() + name.slice(1);

const getIcon = name =>
  require(`../../assets/champ-icons/min/${fixName(name)}Square-min.png`);

const ChampIcon = ({ name, mini, handleImageLoad }) =>
  <img
    className={(mini) ? 'mini-champ-icon' : 'champ-icon'}
    src={getIcon(name)}
    onLoad={(handleImageLoad) ? handleImageLoad : ''}
    alt={name + ' One Trick Pony/Ponies'}
  />;

export default ChampIcon;

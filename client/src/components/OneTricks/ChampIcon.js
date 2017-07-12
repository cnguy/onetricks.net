import React from 'react';

const getIcon = name =>
  require(`../../assets/champ-icons/min/${name.replace(/[^a-zA-Z]+/g, '')}Square-min.png`);

const ChampIcon = ({ name, mini, handleImageLoad }) =>
  <img
    className={(mini) ? 'mini-champ-icon' : 'champ-icon'}
    src={getIcon(name)}
    onLoad={(handleImageLoad) ? handleImageLoad : ''}
    alt={name + ' One Trick Pony/Ponies'}
  />;

export default ChampIcon;

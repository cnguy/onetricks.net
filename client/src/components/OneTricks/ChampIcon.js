import React from 'react';

const getIcon = name => {
  try {
    return require(`../../assets/champ-icons/min/${name}Square-min.png`);
  } catch (err) {
    return require('../../assets/champ-icons/min/questionmark.png');
  }
}

const ChampIcon = ({ name, mini, handleImageLoad }) =>
  <img
    className={(mini) ? 'mini-champ-icon' : 'champ-icon'}
    src={getIcon(name)}
    onLoad={(handleImageLoad) ? handleImageLoad : ''}
    alt={name + ' One Trick Pony/Ponies'}
  />;

export default ChampIcon;

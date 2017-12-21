// @flow

import React from 'react';

import FilterButton from './FilterButton';

import type {
  region as regionType,
} from '../../constants/flowTypes';

type PropTypes = {
  toggleRegion: (region: regionType) => void,
  toggleAdvFilter: () => void,
  regions: Array<regionType>,
}

const FilterRegion = ({ toggleRegion, toggleAdvFilter, regions }: PropTypes): React$Element<any> =>
  <div className="filter-bar">
    <div className="filter-row">
      <FilterButton onClick={() => toggleRegion('na')} active={regions}>NA</FilterButton>
      <FilterButton onClick={() => toggleRegion('kr')} active={regions}>KR</FilterButton>
      <FilterButton onClick={() => toggleRegion('euw')} active={regions}>EUW</FilterButton>
      <FilterButton onClick={() => toggleRegion('eune')} active={regions}>EUNE</FilterButton>
      <FilterButton onClick={() => toggleRegion('lan')} active={regions}>LAN</FilterButton>
      <FilterButton onClick={() => toggleRegion('las')} active={regions}>LAS</FilterButton>
    </div>
    <div className="filter-row">
      <FilterButton onClick={() => toggleRegion('br')} active={regions}>BR</FilterButton>
      <FilterButton onClick={() => toggleRegion('jp')} active={regions}>JP</FilterButton>
      <FilterButton onClick={() => toggleRegion('tr')} active={regions}>TR</FilterButton>
      <FilterButton onClick={() => toggleRegion('ru')} active={regions}>RU</FilterButton>
      <FilterButton onClick={() => toggleRegion('oce')} active={regions}>OCE</FilterButton>
      <button className="close-adv-filter" onClick={() => toggleAdvFilter()}>
        Close
      </button>
    </div>
  </div>;

export default FilterRegion;

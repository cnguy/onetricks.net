// @flow

import React from 'react'

import FilterBtn from './FilterBtn'

import type { region as regionType } from '../../constants/flowTypes'

type PropTypes = {
    toggleRegion: (region: regionType) => void,
    toggleAdvFilter: () => void,
    regions: Array<regionType>,
}

const FilterRegion = ({
    toggleRegion,
    toggleAdvFilter,
    regions,
}: PropTypes): React$Element<any> => (
    <div className="filter-bar">
        <div className="filter-row">
            <FilterBtn onClick={() => toggleRegion('na')} active={regions}>
                NA
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('kr')} active={regions}>
                KR
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('euw')} active={regions}>
                EUW
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('eune')} active={regions}>
                EUNE
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('lan')} active={regions}>
                LAN
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('las')} active={regions}>
                LAS
            </FilterBtn>
        </div>
        <div className="filter-row">
            <FilterBtn onClick={() => toggleRegion('br')} active={regions}>
                BR
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('jp')} active={regions}>
                JP
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('tr')} active={regions}>
                TR
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('ru')} active={regions}>
                RU
            </FilterBtn>
            <FilterBtn onClick={() => toggleRegion('oce')} active={regions}>
                OCE
            </FilterBtn>
            <button
                className="close-adv-filter"
                onClick={() => toggleAdvFilter()}
            >
                Close
            </button>
        </div>
    </div>
)

export default FilterRegion

// @flow
/* eslint-env browser */

import React from 'react';
/* FlowFixMe */
import { connect } from 'react-redux';
/* FlowFixMe */
import compose from 'recompose/compose';
/* FlowFixMe */
import withState from 'recompose/withState';
/* FlowFixMe */
import withHandlers from 'recompose/withHandlers';
/* FlowFixMe */
import lifecycle from 'recompose/lifecycle';
/* FlowFixMe */
import Perf from 'react-addons-perf'; // eslint-disable-line no-unused-vars
/* FlowFixMe */
import { cloneDeep } from 'lodash';

import { toggleMerge } from '../../redux/misc';
import {
  setSortKey,
  setSortReverse,
} from '../../redux/playersView';

import {
  mergedSelector,
  sortKeySelector,
  sortReverseSelector,
} from '../../selectors';

import Champion from './Champion';
import Copyright from './Copyright';
import FAQ from './FAQ';
import FilterRegion from './FilterRegion';
import Loader from './Loader';
import PlayersView from './PlayersView';

import DEFAULT_REGIONS from '../../constants/regions';
import FILTERS from '../../helpers/filters';
import RANKS from '../../constants/ranks';
import REGIONS_TEXT from '../../constants/regionsText';
import SORTS from '../../helpers/sorts';

import type {
  merged as mergedType,
  player as playerType,
  region as regionType,
  setSortKey as setSortKeyType,
  setSortReverse as setSortReverseType,
  sortKey as sortKeyType,
  sortReverse as sortReverseType,
  state as stateType,
  toggleMerge as toggleMergeType,
} from '../../constants/flowTypes';

let numOfImagesLeft = 0; // Performance :)

type AAAnyAlias = ?Array<Array<any>>
type PropTypes = {
  // state
  all: {
    [championName: string]: Array<playerType>
  },
  region: regionType,
  advFilter: boolean,
  regions: Array<regionType>,
  champ: string,
  players: Array<playerType>,
  searchKey: string,
  showChamps: boolean,
  // sortReverse: boolean,
  imagesLoaded: boolean,
  // state setters
  setAll: (A: Object, CB?: Function) => void,
  setRegion: (R: regionType) => void,
  setAdvFilter: (B: boolean) => void,
  setRegions: (R: Array<regionType>) => void,
  setChampionName: (S: string) => void,
  setPlayers: (P: Array<playerType>) => void,
  setSearchKey: (S: string) => void,
  setShowChamps: (B: boolean) => void,
  setImagesLoaded: (B: boolean) => void,
  // handlers
  makeCompact: (P: Array<playerType>) => void,
  setRegionFilter: () => void,
  addRegion: () => void,
  togglePane: () => void,
  toggleAdvFilter: () => void,
  onSort: (S: sortKeyType) => void,
  handleImageLoad: () => void,
  renderSpinner: () => void,
  renderEmptyResults: () => void,
  setDisplayValue: () => void,
  onChange: () => void,
  generateSelectMenu: () => void,
  fetchPlayers: (A: regionType | Array<regionType>) => void,
  getPlayers: (A: Array<Array<any>>, C: string) => void,
  generateChampPaneUtility: () => void,
  createChampPane: (P: Array<playerType>) => void,
  forcePlayersUpdate: (A: regionType | Array<regionType>) => void,
  createChampPanesHolder: (C: AAAnyAlias, M: AAAnyAlias, A: AAAnyAlias) => void,
  // redux
  merged: mergedType,
  toggleMerge: toggleMergeType,
  sortKey: sortKeyType,
  setSortKey: setSortKeyType,
  sortReverse: sortReverseType,
  setSortReverse: setSortReverseType,
}

const makeCompact = ({
  imagesLoaded,
  showChamps,
  setAll,
}: PropTypes) => (list: Array<playerType>) => {
  const compList: { [championName: string]: Array<playerType> } = {};

  for (const player of list) {
    compList[player.champ] = compList[player.champ]
      ? [...compList[player.champ], player]
      : [player];
  }

  if (!imagesLoaded && showChamps) {
    setAll(compList, () => {
      numOfImagesLeft = document
        .getElementsByClassName('content-pane')[0]
        .querySelectorAll('img').length;
    });
  } else if (showChamps && imagesLoaded) {
    setAll(compList);
  }
};

const togglePane = ({
  showChamps,
  setShowChamps,
  setSearchKey,
  setSortKey,
  setSortReverse,
}: PropTypes) => () => {
  setShowChamps(!showChamps);
  setSearchKey('');
  setSortKey('NONE');
  setSortReverse(false);
};

const onSort = ({
  sortKey,
  sortReverse,
  setSortKey,
  setSortReverse,
}: PropTypes) => (key: sortKeyType) => {
  setSortKey(key);
  setSortReverse(key === sortKey && !sortReverse);
};

const generateSelectMenu = ({
  advFilter,
  region,
  setRegionFilter,
}: PropTypes) => (): React$Element<any> | string =>
// This select menu shouldn't be created if multiple regions is enabled.
!advFilter ? (
  <select id="region" onChange={setRegionFilter} value={region}>
    <option value="all">All</option>
    {
      DEFAULT_REGIONS.map((item, index) =>
        <option value={item} key={index}>
          {item.toUpperCase()}
        </option>)
    }
  </select>
) : '';

const getPlayers = ({
  setPlayers,
  setChampionName,
  togglePane,
}: PropTypes) => (array: Array<playerType>, champion: string) => {
  togglePane();

  for (let i = 0; i < array.length; i += 1) {
    if (array[i][0] === champion) {
      setPlayers(array[i][1]);
      setChampionName(champion);
      break;
    }
  }
};

const generateChampPaneUtility = ({
  showChamps,
  merged,
  advFilter,
  searchKey,
  setSearchKey,
  regions,
  toggleMerge,
  onChange,
  addRegion,
  toggleAdvFilter,
  generateSelectMenu,
}: PropTypes) => () => (
  showChamps ? (
    <div className="champs-pane-utility">
      <div className="instructions flash">Click a Champ's Icon to Get Links to the One Trick Ponies' Profiles</div>
      <div className="merged-input">
        <button className="merge-sep-button" onClick={toggleMerge}>
          <span className="merge-sep-text">
            <span className="merge-sep-action">
              {merged ? 'Separate' : 'Combine'}
            </span>
          </span>
        </button>
        {generateSelectMenu()}
        <input
          className="filter-champs"
          type="text"
          onChange={onChange}
          value={searchKey}
          placeholder="champ name filter"
        />
        <span className="clear-input" onClick={() => setSearchKey('')}>
          &#10007;
        </span>
      </div>
      <div className="multiple-filter">
        {!advFilter ? (
          <div className="adv-filtering-open" onClick={toggleAdvFilter}>Multiple Regions</div>
        ) : (
          <FilterRegion
            toggleRegion={addRegion}
            toggleAdvFilter={toggleAdvFilter}
            regions={regions}
          />
        )}
      </div>
    </div>
  ) : ''
);

const createChampPane = ({
  getPlayers,
  handleImageLoad,
}: PropTypes) => (arr: Array<Array<any>>): React$Element<any> =>
  <div className="champs">
    {
      arr.map((item, index) =>
        <a
          className="champ-open-links fade-in"
          key={index} href="#"
          onClick={() => getPlayers(arr, item[0])}
        >
          <Champion
            name={item[0]}
            number={item[1].length}
            handleImageLoad={handleImageLoad}
            key={index}
          />
        </a>,
      )
    }
  </div>;

const forcePlayersUpdate = ({
  fetchPlayers,
}: PropTypes) => (args: regionType | Array<regionType>) =>
  fetchPlayers(args);

const createChampPanesHolder = ({
  advFilter,
  merged,
  regions,
  region,
  showChamps,
  setDisplayValue,
  renderEmptyResults,
  createChampPane,
}: PropTypes) => (challengers, masters, all) => {
  const regionDisplayText = REGIONS_TEXT[region];
  const mulRegionsDisplayText = regions.length === DEFAULT_REGIONS.length
    ? 'All Regions'
    : `${regions.join(', ').toUpperCase()} Server(s)`;

  return (
    <div style={{ display: setDisplayValue() }}>
      {advFilter && regions.length === 0 ? (<div className="empty-results">No region is selected.</div>) : ''}
      {showChamps ? ( // eslint-disable-line no-nested-ternary
        !merged ?
          (
            <div className="content-pane merged-pane">
              <div className="rank-pane challengers-pane">
                {challengers.length === 0 && masters.length === 0 ? renderEmptyResults() : ''}
                {challengers.length > 0 ? (<h5 className="rank-header">Challenger One Tricks\ Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : ''}
                {createChampPane(challengers)}
              </div>
              <div className="rank-pane masters-pane">
                {masters.length > 0 ? (<h5 className="rank-header">Masters One Trick Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : ''}
                {createChampPane(masters)}
              </div>
            </div>
          ) : (
            <div className="content-pane all-pane">
              <div className="rank-pane">
                {all.length > 0 ? (<h5 className="rank-header">Challenger/Master One Trick Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : renderEmptyResults()}
                {createChampPane(all)}
              </div>
            </div>
          )
      ) : (
          ''
        )
      }
    </div>
  );
};

const enhance = compose(
  connect(
    (state: stateType) => ({
      merged: mergedSelector(state),
      sortKey: sortKeySelector(state),
      sortReverse: sortReverseSelector(state),
    }), {
      setSortKey,
      setSortReverse,
      toggleMerge,
    },
  ),
  withState('all', 'setAll', {}),
  withState('region', 'setRegion', 'all'),
  withState('advFilter', 'setAdvFilter', false),
  withState('regions', 'setRegions', DEFAULT_REGIONS.slice()),
  withState('champ', 'setChampionName', ''),
  withState('players', 'setPlayers', []),
  withState('searchKey', 'setSearchKey', ''),
  withState('showChamps', 'setShowChamps', true),
  withState('imagesLoaded', 'setImagesLoaded', false),
  withHandlers({ // no dependencies
    makeCompact,
    setRegionFilter: ({ setRegion }: PropTypes) => e => setRegion(e.target.value),

    addRegion: ({ regions, setRegions }: PropTypes) => (region: regionType) => {
      const regionsTemp = regions.slice();

      let found = false;
      for (let i = 0; i < regionsTemp.length; i += 1) {
        // Toggle region logic.
        if (region === regionsTemp[i]) {
          const index = regionsTemp.indexOf(region);
          regionsTemp.splice(index, 1);
          setRegions(regionsTemp);
          found = true;
          break;
        }
      }

      if (!found) {
        setRegions([...regions, region]);
      }
    },

    togglePane,

    toggleAdvFilter: ({ advFilter, setAdvFilter, region, setRegions }: PropTypes) => () => {
      if (advFilter) {
        return setRegions([]);
      }

      if (region === 'all') {
        setRegions(DEFAULT_REGIONS.slice());
      } else {
        setRegions([region]);
      }

      return setAdvFilter(!advFilter);
    },

    onSort,

    handleImageLoad: ({ setImagesLoaded }: PropTypes) => () => {
      if (--numOfImagesLeft === 0) { // eslint-disable-line no-plusplus
        setImagesLoaded(true);
      }
    },

    renderSpinner: ({ imagesLoaded }: PropTypes) => () => {
      if (!imagesLoaded) {
        return <Loader />;
      }
      return null;
    },

    renderEmptyResults: ({ searchKey }: PropTypes) => () =>
      (searchKey) ? (
        <div className="empty-results">No champions found.</div>
      ) : null,

    setDisplayValue: ({ imagesLoaded }: PropTypes) => () => imagesLoaded ? 'inline' : 'none',

    onChange: ({ setSearchKey }: PropTypes) => e => setSearchKey(e.target.value.toLowerCase()),
  }),

  withHandlers({ generateSelectMenu }),

  withHandlers({

    fetchPlayers: ({ makeCompact }: PropTypes) => (args: regionType | Array<regionType>) => {
      // Perf.start();
      let url = 'all?region=';

      url += Array.isArray(args)
        ? `${args.join(',')}&multiple=true`
        : `${args}`;

      fetch(url)
        .then(r => r.json())
        .then(r => makeCompact(r));
    }, // uses makeCompact

    getPlayers,
    generateChampPaneUtility,
  }),

  withHandlers({ createChampPane }),

  withHandlers({
    forcePlayersUpdate, // uses fetchPlayers
    createChampPanesHolder, // uses renderEmptyResults
  }),
  lifecycle({
    componentDidMount() {
      const {
        advFilter,
        forcePlayersUpdate,
        regions,
        region,
      }: PropTypes = this.props;
      forcePlayersUpdate(advFilter ? regions : region);
    },
    componentDidUpdate(prevProps: PropTypes) {
      const {
        advFilter,
        forcePlayersUpdate,
        region,
        regions,
        showChamps,
      }: PropTypes = this.props;

      const equal = (
        prevProps.advFilter === advFilter &&
        prevProps.regions === regions &&
        prevProps.region === region &&
        prevProps.showChamps === showChamps
      );

      if (!equal) {
        forcePlayersUpdate(advFilter ? regions : region);
      }
      // Perf.stop();
      // Perf.printInclusive();
      // Perf.printWasted();
    },
  }),
);

const OneTricks = enhance(({
  all,
  merged,
  players,
  champ,
  searchKey,
  showChamps,
  sortKey,
  sortReverse,
  togglePane,
  generateChampPaneUtility,
  renderSpinner,
  createChampPanesHolder,
  onSort,
}: PropTypes) => {
  let sortedPlayers = new Map();

  for (const key of Object.keys(all)) {
    sortedPlayers.set(key, all[key]);
  }

  Object.keys(all).map(key => sortedPlayers.set(key, all[key]));
  sortedPlayers = new Map(SORTS.ONETRICKS([...sortedPlayers.entries()]));

  let _all = [];

  for (const [key, value] of sortedPlayers) {
    _all.push([key, value]);
  }

  let _challengers;
  let _masters;

  if (!merged) {
    // This can easily be refactored if we want to include Diamonds as well.
    _challengers = cloneDeep(_all);
    _masters = cloneDeep(_all);

    for (const [i, oneTricks] of _challengers.entries()) {
      oneTricks[1] = oneTricks[1].filter(FILTERS.rank(RANKS.challenger));
      if (oneTricks[1].length === 0) _challengers.splice(i, 1);
    }

    for (const [i, oneTricks] of _masters.entries()) {
      oneTricks[1] = oneTricks[1].filter(FILTERS.rank(RANKS.master));
      if (oneTricks[1].length === 0) _masters.splice(i, 1);
    }

    _challengers = SORTS.ONETRICKS(_challengers);
    _masters = SORTS.ONETRICKS(_masters);
  }

  if (searchKey) {
    if (merged) {
      _all = _all.filter(FILTERS.search(searchKey));
    } else {
      if (_challengers) {
        _challengers = _challengers.filter(FILTERS.search(searchKey));
      }
      if (_masters) {
        _masters = _masters.filter(FILTERS.search(searchKey));
      }
    }
  }

  if (sortedPlayers) {
    return (
      <div className="container">
        <div className="OneTricks">
          <h1 className="main-header">League of Legends One Trick Ponies</h1>
          <h2 className="caption">Jack of No Trades, Master of One</h2>
          <div className="table-view">
            <PlayersView
              players={players}
              goBack={togglePane}
              champ={champ}
              show={!showChamps}
              onSort={onSort}
              sortKey={sortKey}
              sortReverse={sortReverse}
            />
          </div>
          <div className="champs-pane fade-in">
            {generateChampPaneUtility()}
            {renderSpinner()}
            {createChampPanesHolder(_challengers, _masters, _all)}
          </div>
        </div>
        <FAQ />
        <Copyright />
      </div>
    );
  }

  return <div>something went horribly wrong</div>;
});

export default OneTricks;

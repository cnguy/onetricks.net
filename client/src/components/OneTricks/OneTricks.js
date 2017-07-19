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

import {
  resetSearchKey,
  setSearchKey,
  toggleAdvancedFilter,
} from '../../redux/championPane';
import { toggleMerge } from '../../redux/misc';
import {
  setSortKey,
  setSortReverse,
} from '../../redux/playersView';

import {
  advancedFilterSelector,
  mergedSelector,
  searchKeySelector,
  sortKeySelector,
  sortReverseSelector,
} from '../../selectors';

import ChampionPane from './ChampionPane';
import Copyright from './Copyright';
import FAQ from './FAQ';
import FilterRegion from './FilterRegion';
import Loader from './Loader';
import PlayersView from './PlayersView';

import FILTERS from '../../helpers/filters';
import SORTS from '../../helpers/sorts';
import {
  executeCollection,
  executeConditionalCollection,
} from '../../helpers/dispatchHelpers';
import renderOnCondition from '../../helpers/renderOnCondition';
import createFetchPlayersUrl from '../../helpers/createFetchPlayersUrl';

import DEFAULT_REGIONS from '../../constants/regions';
import RANKS from '../../constants/ranks';
import REGIONS_TEXT from '../../constants/regionsText';

import type {
  advFilter as advFilterType,
  merged as mergedType,
  players as playersType,
  region as regionType,
  resetSearchKey as resetSearchKeyType,
  searchKey as searchKeyType,
  setSearchKey as setSearchKeyType,
  setSortKey as setSortKeyType,
  setSortReverse as setSortReverseType,
  sortKey as sortKeyType,
  sortReverse as sortReverseType,
  state as stateType,
  toggleAdvancedFilter as toggleAdvancedFilterType,
  toggleMerge as toggleMergeType,
} from '../../constants/flowTypes';

let numOfImagesLeft = 0; // Performance :)

type AAAnyAlias = ?Array<Array<any>>
type PropTypes = {
  // state
  all: {
    [championName: string]: playersType
  },
  region: regionType,
  regions: Array<regionType>,
  champ: string,
  players: playersType,
  searchKey: string,
  showChamps: boolean,
  // sortReverse: boolean,
  imagesLoaded: boolean,
  // state setters
  setAll: (A: Object, CB?: Function) => void,
  setRegion: (R: regionType) => void,
  setRegions: (R: Array<regionType>) => void,
  setChampionName: (S: string) => void,
  setPlayers: (P: playersType) => void,
  setShowChamps: (B: boolean) => void,
  setImagesLoaded: (B: boolean) => void,
  // handlers
  makeCompact: (P: playersType) => void,
  setRegionFilter: () => void,
  addRegion: () => void,
  togglePane: () => void,
  handleToggleAdvancedFilter: () => void,
  onSort: (S: sortKeyType) => void,
  handleImageLoad: () => void,
  renderSpinner: () => void,
  renderEmptyResults: () => React$Element<any> | null,
  setDisplayValue: () => void,
  onChange: () => void,
  generateSelectMenu: () => void,
  fetchPlayers: (A: regionType | Array<regionType>) => void,
  getPlayers: (A: Array<Array<any>>, C: string) => void,
  generateChampPaneUtility: () => void,
  createChampPane: (P: playersType) => void,
  forcePlayersUpdate: (A: regionType | Array<regionType>) => void,
  createChampPanesHolder: (C: AAAnyAlias, M: AAAnyAlias, A: AAAnyAlias) => void,
  // redux
  advFilter: advFilterType,
  toggleAdvancedFilter: toggleAdvancedFilterType,
  merged: mergedType,
  toggleMerge: toggleMergeType,
  searchKey: searchKeyType,
  resetSearchKey: resetSearchKeyType,
  setSearchKey: setSearchKeyType,
  sortKey: sortKeyType,
  setSortKey: setSortKeyType,
  sortReverse: sortReverseType,
  setSortReverse: setSortReverseType,
}

const makeCompact = ({
  imagesLoaded,
  showChamps,
  setAll,
}: PropTypes) => (list: playersType) => {
  const compList: { [championName: string]: playersType } = {};

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

const setRegionFilter = ({ setRegion }: PropTypes) => e => setRegion(e.target.value);

const addRegion = ({ regions, setRegions }: PropTypes) => (region: regionType) => {
  const index = regions.indexOf(region);
  return index !== -1
    ? setRegions([...regions.slice(0, index), ...regions.slice(index + 1)])
    : setRegions([...regions, region]);
};

const togglePane = ({
  showChamps,
  setShowChamps,
  resetSearchKey,
  setSortKey,
  setSortReverse,
}: PropTypes) => () => executeCollection(
  () => setShowChamps(!showChamps),
  () => resetSearchKey(),
  () => setSortKey('NONE'),
  () => setSortReverse(false),
);

const handleToggleAdvancedFilter = ({
  advFilter,
  toggleAdvancedFilter,
  region,
  setRegions,
}: PropTypes) => () => executeConditionalCollection(
  {
    cond: advFilter,
    onTrue: () => setRegions([]),
  },
  {
    cond: region === 'all',
    onTrue: () => setRegions(DEFAULT_REGIONS.slice()),
    onFalse: () => setRegions([region]),
  },
  toggleAdvancedFilter(),
);

const onSort = ({
  sortKey,
  sortReverse,
  setSortKey,
  setSortReverse,
}: PropTypes) => (key: sortKeyType) => executeCollection(
  () => setSortKey(key),
  () => setSortReverse(key === sortKey && !sortReverse),
);

const handleImageLoad = ({ setImagesLoaded }: PropTypes) => () => {
  if (--numOfImagesLeft === 0) { // eslint-disable-line no-plusplus
    setImagesLoaded(true);
  }
};

const renderSpinner = ({ imagesLoaded }: PropTypes) => () =>
  renderOnCondition(!imagesLoaded, <Loader />);

const renderEmptyResults = ({ searchKey }: PropTypes) => (): React$Element<any> | null =>
  renderOnCondition(searchKey, <div className="empty-results">No champions found.</div>);

const setDisplayValue = ({ imagesLoaded }: PropTypes) => () => imagesLoaded ? 'inline' : 'none';

const onChange = ({ setSearchKey }: PropTypes) => e => setSearchKey(e.target.value.toLowerCase());

const generateSelectMenu = ({
  advFilter,
  region,
  setRegionFilter,
}: PropTypes) => (): React$Element<any> | null =>
// This select menu shouldn't be created if multiple regions is enabled.
  renderOnCondition(!advFilter,
    <select id="region" onChange={setRegionFilter} value={region}>
      <option value="all">All</option>
      {
        DEFAULT_REGIONS.map((item, index) =>
          <option value={item} key={index}>
            {item.toUpperCase()}
          </option>)
      }
    </select>,
  );

const fetchPlayers = ({ makeCompact }: PropTypes) => (args: regionType | Array<regionType>) =>
  // Perf.start();
  fetch(createFetchPlayersUrl(args))
    .then(r => r.json())
    .then(r => makeCompact(r));

const getPlayers = ({
  setPlayers,
  setChampionName,
  togglePane,
}: PropTypes) => (array: playersType, champion: string) => {
  togglePane();
  const target = array.filter(l => l[0] === champion);
  if (target.length === 1) {
    setPlayers(target[0][1]);
    setChampionName(champion);
  }
};

const generateChampPaneUtility = ({
  showChamps,
  merged,
  advFilter,
  searchKey,
  resetSearchKey,
  regions,
  toggleMerge,
  onChange,
  addRegion,
  handleToggleAdvancedFilter,
  generateSelectMenu,
}: PropTypes) => () =>
  renderOnCondition(showChamps,
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
        <span className="clear-input" onClick={resetSearchKey}>
          &#10007;
        </span>
      </div>
      <div className="multiple-filter">
        {!advFilter ? (
          <div className="adv-filtering-open" onClick={handleToggleAdvancedFilter}>Multiple Regions</div>
        ) : (
          <FilterRegion
            toggleRegion={addRegion}
            toggleAdvFilter={handleToggleAdvancedFilter}
            regions={regions}
          />
        )}
      </div>
    </div>,
  );

const createChampPane = ({
  getPlayers,
  handleImageLoad,
}: PropTypes) => (arr: Array<Array<any>>): React$Element<any> =>
  <ChampionPane
    champions={arr}
    getPlayers={getPlayers}
    handleImageLoad={handleImageLoad}
  />;

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
}: PropTypes) => (challengers: playersType, masters: playersType, all: playersType) => {
  const regionDisplayText = REGIONS_TEXT[region];
  const mulRegionsDisplayText = regions.length === DEFAULT_REGIONS.length
    ? 'All Regions'
    : `${regions.join(', ').toUpperCase()} Server(s)`;

  return (
    <div style={{ display: setDisplayValue() }}>
      {renderOnCondition(advFilter && regions.length === 0, <div className="empty-results">No region is selected.</div>)}
      {showChamps ? ( // eslint-disable-line no-nested-ternary
        !merged ?
          (
            <div className="content-pane merged-pane">
              <div className="rank-pane challengers-pane">
                {
                  renderOnCondition(
                    challengers.length === 0 && masters.length === 0,
                    renderEmptyResults(),
                  )
                }
                {
                  renderOnCondition(
                    challengers.length > 0,
                    <h5 className="rank-header">Challenger One Trick Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>,
                  )
                }
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
      advFilter: advancedFilterSelector(state),
      merged: mergedSelector(state),
      searchKey: searchKeySelector(state),
      sortKey: sortKeySelector(state),
      sortReverse: sortReverseSelector(state),
    }), {
      resetSearchKey,
      setSearchKey,
      setSortKey,
      setSortReverse,
      toggleAdvancedFilter,
      toggleMerge,
    },
  ),
  withState('all', 'setAll', {}),
  withState('region', 'setRegion', 'all'),
  withState('regions', 'setRegions', DEFAULT_REGIONS.slice()),
  withState('champ', 'setChampionName', ''),
  withState('players', 'setPlayers', []),
  withState('showChamps', 'setShowChamps', true),
  withState('imagesLoaded', 'setImagesLoaded', false),
  withHandlers({
    makeCompact,
    setRegionFilter,
    addRegion,
    togglePane,
    handleToggleAdvancedFilter,
    onSort,
    handleImageLoad,
    renderSpinner,
    renderEmptyResults,
    setDisplayValue,
    onChange,
  }),
  withHandlers({ generateSelectMenu }),
  withHandlers({ fetchPlayers, getPlayers, generateChampPaneUtility }),
  withHandlers({ createChampPane }),
  withHandlers({ forcePlayersUpdate, createChampPanesHolder }),
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

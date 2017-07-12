// @flow

import React, { Component } from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import lifecycle from 'recompose/lifecycle';
import Perf from 'react-addons-perf';

import { cloneDeep } from 'lodash';

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
let numOfImagesLeft = 0; // Performance :)

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
}) => () => (
  showChamps ? (
    <div className='champs-pane-utility'>
      <div className='instructions flash'>Click a Champ's Icon to Get Links to the One Trick Ponies' Profiles</div>
      <div className='merged-input'>
        <button className='merge-sep-button' onClick={toggleMerge}>
          <span className='merge-sep-text'>
            <span className='merge-sep-action'>
              {merged ? 'Separate' : 'Combine'}
            </span>
          </span>
        </button>
        {generateSelectMenu()}
        <input
          className='filter-champs'
          type='text'
          onChange={onChange}
          value={searchKey}
          placeholder='champ name filter'
        />
        <span className='clear-input' onClick={() => { setSearchKey('') }}>
          &#10007;
        </span>
      </div>
      <div className='multiple-filter'>
        {!advFilter ? (
          <div className='adv-filtering-open' onClick={toggleAdvFilter}>Multiple Regions</div>
        ) : (
          <FilterRegion toggleRegion={addRegion} toggleAdvFilter={toggleAdvFilter} regions={regions} />
        )}
      </div>
    </div>
  ) : ''
);

const createChampPanesHolder = ({
  advFilter,
  merged,
  regions,
  region,
  showChamps,
  setDisplayValue,
  renderEmptyResults,
  createChampPane,
}) => (challengers, masters, all) => {
  const regionDisplayText = REGIONS_TEXT[region];
  const mulRegionsDisplayText = (regions.length === DEFAULT_REGIONS.length) ? 'All Regions' : regions.join(', ').toUpperCase() + ' Server(s)';

  return (
    <div style={{ display: setDisplayValue() }}>
      {advFilter && regions.length == 0 ? (<div className='empty-results'>No region is selected.</div>) : ''}
      {showChamps ? (
        !merged ?
          (
            <div className='content-pane merged-pane'>
              <div className='rank-pane challengers-pane'>
                {challengers.length === 0 && masters.length === 0 ? renderEmptyResults() : ''}
                {challengers.length > 0 ? (<h5 className='rank-header'>Challenger One Tricks\ Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : ''}
                {createChampPane(challengers)}
              </div>
              <div className='rank-pane masters-pane'>
                {masters.length > 0 ? (<h5 className='rank-header'>Masters One Trick Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : ''}
                {createChampPane(masters)}
              </div>
            </div>
          ) : (
            <div className='content-pane all-pane'>
              <div className='rank-pane'>
                {all.length > 0 ? (<h5 className='rank-header'>Challenger/Master One Trick Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : renderEmptyResults()}
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
  withState('all', 'setAll', {}),
  withState('region', 'setRegion', 'all'),
  withState('advFilter', 'setAdvFilter', false),
  withState('regions', 'setRegions', DEFAULT_REGIONS.slice()),
  withState('champ', 'setChampionName', ''),
  withState('players', 'setPlayers', []),
  withState('merged', 'setMerged', true),
  withState('searchKey', 'setSearchKey', ''),
  withState('showChamps', 'setShowChamps', true),
  withState('sortKey', 'setSortKey', 'NONE'),
  withState('sortReverse', 'setSortReverse', false),
  withState('imagesLoaded', 'setImagesLoaded', false),
  withHandlers({ // no dependencies

    makeCompact: ({ imagesLoaded, showChamps, setAll }) => (list) => {
      const compList = {};

      for (const player of list)
        compList[player.champ] = (compList[player.champ]) ? [...compList[player.champ], player] : [player];

      if (!imagesLoaded && showChamps) {
        setAll(compList, () => {
          numOfImagesLeft = document
            .getElementsByClassName('content-pane')[0]
            .querySelectorAll('img').length;
        });
      } else if (showChamps && imagesLoaded) {
        setAll(compList);
      }
    },

    setRegion: ({ setRegion }) => (e) => setRegion(e.target.value),

    addRegion: ({ regions, setRegions }) => (region) => {
      const regionsTemp = regions.slice();

      let found = false;
      for (var i = 0; i < regionsTemp.length; ++i) {
        // Toggle region logic.
        if (region === regionsTemp[i]) {
          const index = regionsTemp.indexOf(region);
          regionsTemp.splice(index, 1);
          setRegions(regions);
          found = true;
          break;
        }
      }

      if (!found) {
        setRegions(prevState => ({ regions: [...prevState.regions, region] }));
      }
    },

    togglePane: ({ showChamps, setShowChamps, setSearchKey, setSortKey, setSortReverse }) => () => {
      setShowChamps(!showChamps);
      setSearchKey('');
      setSortKey('NONE');
      setSortReverse(false);
    },

    toggleAdvFilter: ({ advFilter, setAdvFilter, region, setRegions }) => () => {
      if (advFilter) {
        setRegions([]);
      } else {
        if (region === 'all') {
          setRegions(DEFAULT_REGIONS.slice());
        }
        else
          setRegions([this.state.region]);
      }

      setAdvFilter(!advFilter);
    },

    toggleMerge: ({ merged, setMerged }) => () => setMerged(!merged),

    onSort: ({ sortKey, sortReverse, setSortKey, setSortReverse }) => (sortKey) => {
      setSortKey(sortKey);
      setSortReverse(sortKey === sortKey && !sortReverse);
    },

    handleImageLoad: ({ setImagesLoaded }) => () => {
      if (--numOfImagesLeft === 0) {
        setImagesLoaded(true);
      }
    },

    renderSpinner: ({ imagesLoaded }) => () => {
      if (!imagesLoaded) {
        return <Loader />;
      }
      return null;
    },

    renderEmptyResults: ({ searchKey }) => () =>
      (searchKey) ? (
        <div className='empty-results'>No champions found.</div>
      ) : null,

    setDisplayValue: ({ imagesLoaded }) => () => imagesLoaded ? 'inline' : 'none',

    onChange: ({ setSearchKey }) => (e) => setSearchKey(e.target.value.toLowerCase()),
  }),

  withHandlers({

    generateSelectMenu: ({ advFilter, region, setRegion }) => () => {
       // This select menu shouldn't be created if multiple regions is enabled.
      return (
        !advFilter ? (
          <select id='region' onChange={setRegion} value={region}>
            <option value='all'>All</option>
            {
              DEFAULT_REGIONS.map((item, index) =>
                <option value={item} key={index}>
                  {item.toUpperCase()}
                </option>)
            }
          </select>
        ) : ''
      );
    }, // uses setRegion

  }),

  withHandlers({

    fetchPlayers: ({ makeCompact }) => (args) => {
      // Perf.start();
      let url = 'all?region=';

      url += (Array.isArray(args)) ? `${args.join(',')}&multiple=true` : `${args}`

      fetch(url)
        .then(r => r.json())
        .then(r => makeCompact(r));
    }, // uses makeCompact

    getPlayers: ({ setPlayers, setChampionName, togglePane }) => (array, champion) => {
      togglePane();

      for (var i = 0; i < array.length; ++i) {
        if (array[i][0] === champion) {
          setPlayers(array[i][1]);
          setChampionName(champion);
          break;
        }
      }
    }, // uses togglePane

    generateChampPaneUtility,
  }),

  withHandlers({
    createChampPane: ({ getPlayers, handleImageLoad }) => (arr) =>
      <div className='champs'>
        {
          arr.map((item, index) => {
            return <a className='champ-open-links fade-in'
              key={index} href='#'
              onClick={() => getPlayers(arr, item[0])}>
              <Champion name={item[0]}
                number={item[1].length}
                handleImageLoad={handleImageLoad}
                key={index} />
            </a>
          })
        }
      </div>
  }),

  withHandlers({
    forcePlayersUpdate: ({ fetchPlayers }) => (args) => fetchPlayers(args), // uses fetchPlayers
    createChampPanesHolder, // uses renderEmptyResults
  }),
  lifecycle({
    componentDidMount() {
      this.props.forcePlayersUpdate((this.props.advFilter) ? this.props.regions : this.props.region);
    },
    componentDidUpdate(prevProps) {
      const equal = (
        prevProps.advFilter === this.props.advFilter &&
        prevProps.regions === this.props.regions &&
        prevProps.region === this.props.region &&
        prevProps.showChamps === this.props.showChamps
      )

      if (!equal)
        this.props.forcePlayersUpdate((this.props.advFilter) ? this.props.regions : this.props.region);
      // Perf.stop();
      // Perf.printInclusive();
      // Perf.printWasted();
    }
  }),
);

const OneTricks = enhance(({
  advFilter,
  all,
  merged,
  players,
  champ,
  searchKey,
  showChamps,
  sortKey,
  sortReverse,
  imagesLoaded,
  togglePane,
  generateChampPaneUtility,
  renderSpinner,
  createChampPanesHolder,
  onSort,
}) => {
    let sortedPlayers = new Map();

    for (const key of Object.keys(all))
      sortedPlayers.set(key, all[key]);

    sortedPlayers = new Map(SORTS['ONETRICKS']([...sortedPlayers.entries()]));

    let _all = [];

    for (const [key, value] of sortedPlayers)
      _all.push([key, value]);

    let _challengers;
    let _masters;

    if (!merged) {
      // This can easily be refactored if we want to include Diamonds as well.
      _challengers = cloneDeep(_all);
      _masters = cloneDeep(_all);

      for (let [i, oneTricks] of _challengers.entries()) {
        oneTricks[1] = oneTricks[1].filter(FILTERS.rank(RANKS.challenger));
        if (oneTricks[1].length === 0) _challengers.splice(i, 1)
      }

      for (let [i, oneTricks] of _masters.entries()) {
        oneTricks[1] = oneTricks[1].filter(FILTERS.rank(RANKS.master));
        if (oneTricks[1].length === 0) _masters.splice(i, 1);
      }

      _challengers = SORTS['ONETRICKS'](_challengers);
      _masters = SORTS['ONETRICKS'](_masters);
    }

    if (searchKey) {
      if (merged) {
        _all = _all.filter(FILTERS.search(searchKey));
      } else {
        _challengers = _challengers.filter(FILTERS.search(searchKey));
        _masters = _masters.filter(FILTERS.search(searchKey));
      }
    }

    if (sortedPlayers) {
      return (
        <div className='container'>
          <div className='OneTricks'>
            <h1 className='main-header'>League of Legends One Trick Ponies</h1>
            <h2 className='caption'>Jack of No Trades, Master of One</h2>
            <div className='table-view'>
              <PlayersView players={players} goBack={togglePane} champ={champ} show={!showChamps} onSort={onSort} sortKey={sortKey} sortReverse={sortReverse} />
            </div>
            <div className='champs-pane fade-in'>
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
  }
);
// class OneTricks extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       all: {},
//       region: 'all',
//       advFilter: false,
//       regions: DEFAULT_REGIONS.slice(),
//       champ: null,
//       players: [],
//       merged: true,
//       searchKey: '',
//       showChamps: true,
//       sortKey: 'NONE',
//       sortReverse: false,
//       imagesLoaded: false,
//     };

//     this.fetchPlayers = this.fetchPlayers.bind(this);
//     this.makeCompact = this.makeCompact.bind(this);
//     this.setRegion = this.setRegion.bind(this);
//     this.addRegion = this.addRegion.bind(this);
//     this.getPlayers = this.getPlayers.bind(this);
//     this.toggleAdvFilter = this.toggleAdvFilter.bind(this);
//     this.toggleMerge = this.toggleMerge.bind(this);
//     this.togglePane = this.togglePane.bind(this);
//     this.onChange = this.onChange.bind(this);
//     this.onSort = this.onSort.bind(this);
//     this.handleImageLoad = this.handleImageLoad.bind(this);

//     // Generic Helper functions
//     this.forcePlayersUpdate = this.forcePlayersUpdate.bind(this);

//     // Helper JSX functions
//     this.createChampPanesHolder = this.createChampPanesHolder.bind(this)
//     this.createChampPane = this.createChampPane.bind(this);
//     this.generateSelectMenu = this.generateSelectMenu.bind(this);
//     this.generateChampPaneUtility = this.generateChampPaneUtility.bind(this);

//     this.renderSpinner = this.renderSpinner.bind(this);
//     this.renderEmptyResults = this.renderEmptyResults.bind(this);
//     this.setDisplayValue = this.setDisplayValue.bind(this);
//   }

//   makeCompact(list, rank) {
//     const compList = {};

//     for (const player of list)
//       compList[player.champ] = (compList[player.champ]) ? [...compList[player.champ], player] : [player];

//     if (!this.state.imagesLoaded && this.state.showChamps) {
//       this.setState({ [rank]: compList }, () => {
//         numOfImagesLeft = document
//           .getElementsByClassName('content-pane')[0]
//           .querySelectorAll('img').length;
//       });
//     } else if (this.state.showChamps && this.state.imagesLoaded) {
//       this.setState({ [rank]: compList })
//     }
//   }

//   fetchPlayers(args) {
//     // Perf.start();
//     let url = 'all?region=';

//     url += (Array.isArray(args)) ? `${args.join(',')}&multiple=true` : `${args}`

//     fetch(url)
//       .then(r => r.json())
//       .then(r => this.makeCompact(r, 'all'));
//   }

//   setRegion(e) {
//     this.setState({ region: e.target.value });
//   }

//   addRegion(region) {
//     const regions = this.state.regions.slice();

//     let found = false;
//     for (var i = 0; i < regions.length; ++i) {
//       // Toggle region logic.
//       if (region === regions[i]) {
//         const index = regions.indexOf(region);
//         regions.splice(index, 1);
//         this.setState({ regions });
//         found = true;
//         break;
//       }
//     }

//     if (!found) {
//       this.setState(prevState => ({
//         regions: [...prevState.regions, region]
//       }));
//     }
//   }

//   toggleMerge() {
//     this.setState({ merged: !this.state.merged });
//   }

//   componentDidMount() {
//     this.forcePlayersUpdate((this.state.advFilter) ? this.state.regions : this.state.region);
//   }

//   componentDidUpdate(prevProps, prevState) {
//     const equal = (
//       prevState.advFilter === this.state.advFilter &&
//       prevState.regions === this.state.regions &&
//       prevState.region === this.state.region &&
//       prevState.showChamps === this.state.showChamps
//     )

//     if (!equal)
//       this.forcePlayersUpdate((this.state.advFilter) ? this.state.regions : this.state.region);
//     // Perf.stop();
//     // Perf.printInclusive();
//     // Perf.printWasted();
//   }

//   getPlayers(array, champion) {
//     this.togglePane();

//     for (var i = 0; i < array.length; ++i) {
//       if (array[i][0] === champion) {
//         this.setState({ players: array[i][1], champ: champion });
//         break;
//       }
//     }
//   }

//   onChange(e) {
//     this.setState({ searchKey: e.target.value.toLowerCase() });
//   }

//   togglePane() {
//     this.setState({
//       showChamps: !this.state.showChamps,
//       searchKey: '',
//       sortKey: 'NONE',
//       sortReverse: false,
//     });
//   }

//   toggleAdvFilter() {
//     if (this.state.advFilter) {
//       this.setState({ regions: [] });
//     } else {
//       if (this.state.region === 'all')
//         this.setState({ regions: DEFAULT_REGIONS.slice() });
//       else
//         this.setState({ regions: [this.state.region] });
//     }

//     this.setState({ advFilter: !this.state.advFilter });
//   }

//   forcePlayersUpdate(args) {
//     this.fetchPlayers(args);
//   }

//   onSort(sortKey) {
//     const sortReverse = this.state.sortKey === sortKey && !this.state.sortReverse;
//     this.setState({ sortKey, sortReverse });
//   }

//   handleImageLoad() {
//     // Only handles the initial render.
//     if (--numOfImagesLeft === 0) {
//       this.setState({
//         imagesLoaded: true
//       });
//     }
//   }

//   createChampPanesHolder(challengers, masters, all) {
//     const { advFilter, merged, regions, region } = this.state

//     const regionDisplayText = REGIONS_TEXT[region];
//     const mulRegionsDisplayText = (regions.length === DEFAULT_REGIONS.length) ? 'All Regions' : regions.join(', ').toUpperCase() + ' Server(s)';

//     return (
//       <div style={{ display: this.setDisplayValue() }}>
//         {advFilter && regions.length == 0 ? (<div className='empty-results'>No region is selected.</div>) : ''}
//         {this.state.showChamps ? (
//           !merged ?
//             (
//               <div className='content-pane merged-pane'>
//                 <div className='rank-pane challengers-pane'>
//                   {challengers.length === 0 && masters.length === 0 ? this.renderEmptyResults() : ''}
//                   {challengers.length > 0 ? (<h5 className='rank-header'>Challenger One Tricks\ Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : ''}
//                   {this.createChampPane(challengers)}
//                 </div>
//                 <div className='rank-pane masters-pane'>
//                   {masters.length > 0 ? (<h5 className='rank-header'>Masters One Trick Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : ''}
//                   {this.createChampPane(masters)}
//                 </div>
//               </div>
//             ) : (
//               <div className='content-pane all-pane'>
//                 <div className='rank-pane'>
//                   {all.length > 0 ? (<h5 className='rank-header'>Challenger/Master One Trick Ponies in {advFilter ? mulRegionsDisplayText : regionDisplayText}</h5>) : this.renderEmptyResults()}
//                   {this.createChampPane(all)}
//                 </div>
//               </div>
//             )
//         ) : (
//             ''
//           )
//         }
//       </div>
//     )
//   }

//   createChampPane(arr) {
//     return (
//       <div className='champs'>
//         {
//           arr.map((item, index) => {
//             return <a className='champ-open-links fade-in'
//               key={index} href='#'
//               onClick={() => this.getPlayers(arr, item[0])}>
//               <Champion name={item[0]}
//                 number={item[1].length}
//                 handleImageLoad={this.handleImageLoad}
//                 key={index} />
//             </a>
//           })
//         }
//       </div>
//     );
//   }

//   renderSpinner() {
//     if (!this.state.imagesLoaded) return <Loader />;
//     else return null;
//   }

//   renderEmptyResults() {
//     return (this.state.searchKey) ? (
//       <div className='empty-results'>No champions found.</div>
//     ) : null;
//   }

//   setDisplayValue() {
//     return (this.state.imagesLoaded) ? 'inline' : 'none';
//   }

//   generateSelectMenu() {
//     // This select menu shouldn't be created if multiple regions is enabled.
//     return (
//       !this.state.advFilter ? (
//         <select id='region' onChange={this.setRegion} value={this.state.region}>
//           <option value='all'>All</option>
//           {
//             DEFAULT_REGIONS.map((item, index) =>
//               <option value={item} key={index}>
//                 {item.toUpperCase()}
//               </option>)
//           }
//         </select>
//       ) : ''
//     )
//   }

//   generateChampPaneUtility() {
//     return (
//       this.state.showChamps ? (
//         <div className='champs-pane-utility'>
//           <div className='instructions flash'>Click a Champ's Icon to Get Links to the One Trick Ponies' Profiles</div>
//           <div className='merged-input'>
//             <button className='merge-sep-button' onClick={this.toggleMerge}>
//               <span className='merge-sep-text'>
//                 <span className='merge-sep-action'>
//                   {this.state.merged ? 'Separate' : 'Combine'}
//                 </span>
//               </span>
//             </button>
//             {this.generateSelectMenu()}
//             <input
//               className='filter-champs'
//               type='text'
//               onChange={this.onChange}
//               value={this.state.searchKey}
//               placeholder='champ name filter'
//             />
//             <span className='clear-input' onClick={() => { this.setState({ searchKey: '' }) }}>
//               &#10007;
//                     </span>
//           </div>
//           <div className='multiple-filter'>
//             {!this.state.advFilter ? (
//               <div className='adv-filtering-open' onClick={this.toggleAdvFilter}>Multiple Regions</div>
//             ) : (
//                 <FilterRegion toggleRegion={this.addRegion} toggleAdvFilter={this.toggleAdvFilter} regions={this.state.regions} />
//               )}
//           </div>
//         </div>
//       ) : ''
//     )
//   }

//   render() {
//     const {
//       advFilter, all, merged,
//       players, champ, searchKey,
//       showChamps, sortKey, sortReverse,
//       imagesLoaded
//     } = this.state;

//     let sortedPlayers = new Map();

//     for (const key of Object.keys(all))
//       sortedPlayers.set(key, all[key]);

//     sortedPlayers = new Map(SORTS['ONETRICKS']([...sortedPlayers.entries()]));

//     let _all = [];

//     for (const [key, value] of sortedPlayers)
//       _all.push([key, value]);

//     let _challengers;
//     let _masters;

//     if (!merged) {
//       // This can easily be refactored if we want to include Diamonds as well.
//       _challengers = cloneDeep(_all);
//       _masters = cloneDeep(_all);

//       for (let [i, oneTricks] of _challengers.entries()) {
//         oneTricks[1] = oneTricks[1].filter(FILTERS.rank(RANKS.challenger));
//         if (oneTricks[1].length === 0) _challengers.splice(i, 1)
//       }

//       for (let [i, oneTricks] of _masters.entries()) {
//         oneTricks[1] = oneTricks[1].filter(FILTERS.rank(RANKS.master));
//         if (oneTricks[1].length === 0) _masters.splice(i, 1);
//       }

//       _challengers = SORTS['ONETRICKS'](_challengers);
//       _masters = SORTS['ONETRICKS'](_masters);
//     }

//     if (searchKey) {
//       if (merged) {
//         _all = _all.filter(FILTERS.search(searchKey));
//       } else {
//         _challengers = _challengers.filter(FILTERS.search(searchKey));
//         _masters = _masters.filter(FILTERS.search(searchKey));
//       }
//     }

//     if (sortedPlayers) {
//       return (
//         <div className='container'>
//           <div className='OneTricks'>
//             <h1 className='main-header'>League of Legends One Trick Ponies</h1>
//             <h2 className='caption'>Jack of No Trades, Master of One</h2>
//             <div className='table-view'>
//               <PlayersView players={players} goBack={this.togglePane} champ={champ} show={!showChamps} onSort={this.onSort} sortKey={sortKey} sortReverse={sortReverse} />
//             </div>
//             <div className='champs-pane fade-in'>
//               {this.generateChampPaneUtility()}
//               {this.renderSpinner()}
//               {this.createChampPanesHolder(_challengers, _masters, _all)}
//             </div>
//           </div>
//           <FAQ />
//           <Copyright />
//         </div>
//       );
//     }
//   }
// }

export default OneTricks;

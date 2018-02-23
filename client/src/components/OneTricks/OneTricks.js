/* eslint-env browser */

import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import lifecycle from 'recompose/lifecycle'
import Perf from 'react-addons-perf' // eslint-disable-line no-unused-vars
import { cloneDeep } from 'lodash'

import {
    resetSearchKey,
    setSearchKey,
    toggleAdvancedFilter,
} from '../../redux/championPane'
import { toggleMerge } from '../../redux/misc'
import { setSortKey, setSortReverse } from '../../redux/playersView'

import {
    advancedFilterSelector,
    mergedSelector,
    searchKeySelector,
    sortKeySelector,
    sortReverseSelector,
} from '../../selectors'

import ContentPane from './ContentPane.bs'
import ChampionPaneUtilities from './ChampionPaneUtilities.bs'
import Copyright from './Copyright.bs'
import FAQ from './FAQ.bs'
import Header from './Header.bs'
import Loader from './Loader.bs'
import PlayersView from './PlayersView.bs'

import OneTricksRe from './OneTricksRe.bs'

import FILTERS from '../../helpers/filters'
import SORTS from '../../helpers/sorts'
import {
    executeCollection,
    executeConditionalCollection,
} from '../../helpers/dispatchHelpers'
import renderOnCondition from '../../helpers/renderOnCondition'
import createFetchPlayersUrl from '../../helpers/createFetchPlayersUrl'

import DEFAULT_REGIONS from '../../constants/regions'
import RANKS from '../../constants/ranks'
import REGIONS_TEXT from '../../constants/regionsText'

let numOfImagesLeft = 0 // Performance :)

const makeCompact = ({ imagesLoaded, showChamps, setAll }) => list => {
    const compList = {}

    for (const player of list) {
        compList[player.champ] = compList[player.champ]
            ? [...compList[player.champ], player]
            : [player]
    }

    if (!imagesLoaded && showChamps) {
        setAll(compList, () => {
            numOfImagesLeft = document
                .getElementsByClassName('content-pane')[0]
                .querySelectorAll('img').length
        })
    }
}

const setRegionFilter = ({ setRegion }) => e => setRegion(e.target.value)

const addRegion = ({ regions, setRegions }) => region => {
    const index = regions.indexOf(region)
    return index !== -1
        ? setRegions([...regions.slice(0, index), ...regions.slice(index + 1)])
        : setRegions([...regions, region])
}

const togglePane = ({
    showChamps,
    setShowChamps,
    resetSearchKey,
    setSortKey,
    setSortReverse,
}) => () =>
    executeCollection(
        () => setShowChamps(!showChamps),
        () => resetSearchKey(),
        () => setSortKey('WINRATE'),
        () => setSortReverse(false),
    )

const handleToggleAdvancedFilter = ({
    advFilter,
    toggleAdvancedFilter,
    region,
    setRegions,
}) => () =>
    executeConditionalCollection(
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
    )

const onSort = ({ sortKey, sortReverse, setSortKey, setSortReverse }) => key =>
    executeCollection(
        () => setSortKey(key),
        () => setSortReverse(key === sortKey && !sortReverse),
    )

const handleImageLoad = ({ setImagesLoaded }) => () => {
    if (--numOfImagesLeft === 0) {
        // eslint-disable-line no-plusplus
        setImagesLoaded(true)
    }
}

const renderSpinner = ({ imagesLoaded }) => () =>
    renderOnCondition(!imagesLoaded, <Loader />)

const renderEmptyResults = ({ searchKey }) => () =>
    renderOnCondition(
        searchKey,
        <div className="empty-results">No champions found.</div>,
    )

const setDisplayValue = ({ imagesLoaded }) => () =>
    imagesLoaded ? 'inline' : 'none'

const onChange = ({ setSearchKey }) => e =>
    setSearchKey(e.target.value.toLowerCase())

const fetchPlayers = ({ makeCompact }) => args =>
    // Perf.start();
    fetch(createFetchPlayersUrl(args))
        .then(r => r.json())
        .then(r => makeCompact(r))

const getPlayers = ({ setPlayers, setChampionName, togglePane }) => tuple => {
    togglePane()
    const [array, champion] = tuple
    const target = array.filter(l => l[0] === champion)
    if (target.length === 1) {
        setPlayers(target[0][1])
        setChampionName(champion)
    }
}

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
    region,
    setRegionFilter,
}) => () => (
    <ChampionPaneUtilities
        showChamps={showChamps}
        merged={merged}
        advFilter={advFilter}
        searchKey={searchKey}
        regions={regions}
        toggleMerge={toggleMerge}
        onChange={onChange}
        addRegion={addRegion}
        handleToggleAdvancedFilter={handleToggleAdvancedFilter}
        region={region}
        setRegionFilter={setRegionFilter}
    />
)

const forcePlayersUpdate = ({ fetchPlayers }) => args => fetchPlayers(args)

const createChampPanesHolder = ({
    advFilter,
    merged,
    regions,
    region,
    showChamps,
    setDisplayValue,
    renderEmptyResults,
    handleImageLoad,
    getPlayers,
}) => (challengers, masters, all) => {
    const regionDisplayText = REGIONS_TEXT[region]
    const mulRegionsDisplayText =
        regions.length === DEFAULT_REGIONS.length
            ? 'All Regions'
            : `${regions.join(', ').toUpperCase()} Server(s)`
    const regionInfoText = advFilter ? mulRegionsDisplayText : regionDisplayText

    return (
        <ContentPane
            isMultipleRegionsFilterOn={advFilter}
            regions={regions}
            all={all}
            challengers={challengers || []}
            masters={masters || []}
            regionInfoText={regionInfoText}
            showChamps={showChamps}
            merged={merged}
            handleImageLoad={handleImageLoad}
            getPlayers={getPlayers}
            renderEmptyResults={renderEmptyResults} // TODO: temp
            setDisplayValue={setDisplayValue}
        />
    )
}

const enhance = compose(
    connect(
        state => ({
            advFilter: advancedFilterSelector(state),
            merged: mergedSelector(state),
            searchKey: searchKeySelector(state),
            sortKey: sortKeySelector(state),
            sortReverse: sortReverseSelector(state),
        }),
        {
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
    withHandlers({ fetchPlayers, getPlayers, generateChampPaneUtility }),
    withHandlers({ forcePlayersUpdate, createChampPanesHolder }),
    lifecycle({
        componentDidMount() {
            const {
                advFilter,
                forcePlayersUpdate,
                regions,
                region,
            } = this.props
            forcePlayersUpdate(advFilter ? regions : region)
        },
    }),
)

const OneTricks = enhance(
    ({
        all,
        advFilter,
        merged,
        players,
        champ,
        region,
        regions,
        searchKey,
        showChamps,
        sortKey,
        sortReverse,
        togglePane,
        generateChampPaneUtility,
        renderSpinner,
        createChampPanesHolder,
        onSort,
        getPlayers,
        ...props
    }) => {
        let tmp = { ...all }
        const keys = Object.keys(tmp)
        if (advFilter) {
            // regions
            keys.forEach(key => {
                tmp[key] = tmp[key].filter(
                    el => regions.indexOf(el.region) !== -1,
                )
            })
        } else {
            // region
            keys.forEach(key => {
                if (region !== 'all')
                    tmp[key] = tmp[key].filter(el => el.region === region)
            })
        }
        keys.forEach(key => {
            if (tmp[key].length === 0) {
                delete tmp[key]
            }
        })

        let sortedPlayers = new Map()

        for (const key of Object.keys(tmp)) {
            sortedPlayers.set(key, tmp[key])
        }

        Object.keys(tmp).map(key => sortedPlayers.set(key, tmp[key]))
        sortedPlayers = new Map(SORTS.ONETRICKS([...sortedPlayers.entries()]))

        let _all = []

        for (const [key, value] of sortedPlayers) {
            _all.push([key, value])
        }

        let _challengers
        let _masters

        if (!merged) {
            // This can easily be refactored if we want to include Diamonds as well.
            _challengers = cloneDeep(_all)
            _masters = cloneDeep(_all)

            for (let i = 0; i < _challengers.length; ++i) {
                _challengers[i][1] = _challengers[i][1].filter(
                    FILTERS.rank(RANKS.challenger),
                )
                if (_challengers[i][1].length === 0) _challengers.splice(i--, 1)
            }
            for (let i = 0; i < _masters.length; ++i) {
                _masters[i][1] = _masters[i][1].filter(
                    FILTERS.rank(RANKS.master),
                )
                if (_masters[i][1].length === 0) _masters.splice(i--, 1)
            }

            _challengers = SORTS.ONETRICKS(_challengers)
            _masters = SORTS.ONETRICKS(_masters)
        }

        if (searchKey) {
            if (merged) {
                _all = _all.filter(FILTERS.search(searchKey))
            } else {
                if (_challengers) {
                    _challengers = _challengers.filter(
                        FILTERS.search(searchKey),
                    )
                }
                if (_masters) {
                    _masters = _masters.filter(FILTERS.search(searchKey))
                }
            }
        }

        // ReasonML lists/arrays must have the same type, so _all breaks because it is of type [string, Types.player].
        // Parse it for now. :)
        const reasonableAll = _all.map(([championName, playersArray]) => {
            return {
                champion: championName,
                players: playersArray,
            };
        });

        return (
            <div className="container">
                <OneTricksRe
                    areImagesLoaded={props.imagesLoaded}
                    allOneTricks={reasonableAll}
                    getPlayers={getPlayers}
                />
                <div className="OneTricks">
                    <Header />
                    <PlayersView
                        players={players}
                        goBack={togglePane}
                        champ={champ}
                        show={!showChamps}
                        onSort={onSort}
                        sortKey={sortKey}
                        sortReverse={sortReverse}
                    />
                    <div className="champs-pane fade-in">
                        {generateChampPaneUtility()}
                        {renderSpinner()}
                        {createChampPanesHolder(_challengers, _masters, _all)}
                    </div>
                </div>
                <FAQ />
                <Copyright />
            </div>
        )
    },
)

export default OneTricks

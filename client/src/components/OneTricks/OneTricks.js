// @flow
/* eslint-env browser */

import React from 'react'
/* FlowFixMe */
import { connect } from 'react-redux'
/* FlowFixMe */
import compose from 'recompose/compose'
/* FlowFixMe */
import withState from 'recompose/withState'
/* FlowFixMe */
import withHandlers from 'recompose/withHandlers'
/* FlowFixMe */
import lifecycle from 'recompose/lifecycle'
/* FlowFixMe */
import Perf from 'react-addons-perf' // eslint-disable-line no-unused-vars
/* FlowFixMe */
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

import ChampionPane from './ChampionPane.bs'
import ChampionPaneUtilities from './ChampionPaneUtilities.bs'
import Copyright from './Copyright.bs'
import FAQ from './FAQ.bs'
import Header from './Header.bs'
import Loader from './Loader.bs'
import PlayersView from './PlayersView.bs'

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
} from '../../constants/flowTypes'

let numOfImagesLeft = 0 // Performance :)

type AAAnyAlias = ?Array<Array<any>>
type PropTypes = {
    // state
    all: {
        [championName: string]: playersType,
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
    fetchPlayers: (A: regionType | Array<regionType>) => void,
    getPlayers: (A: Array<Array<any>>, C: string) => void,
    generateChampPaneUtility: () => void,
    createChampPane: (P: playersType) => void,
    forcePlayersUpdate: (A: regionType | Array<regionType>) => void,
    createChampPanesHolder: (
        C: AAAnyAlias,
        M: AAAnyAlias,
        A: AAAnyAlias,
    ) => void,
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

const makeCompact = ({ imagesLoaded, showChamps, setAll }: PropTypes) => (
    list: playersType,
) => {
    const compList: { [championName: string]: playersType } = {}

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
    } else if (showChamps && imagesLoaded) {
        setAll(compList)
    }
}

const setRegionFilter = ({ setRegion }: PropTypes) => e =>
    setRegion(e.target.value)

const addRegion = ({ regions, setRegions }: PropTypes) => (
    region: regionType,
) => {
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
}: PropTypes) => () =>
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
}: PropTypes) => () =>
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

const onSort = ({
    sortKey,
    sortReverse,
    setSortKey,
    setSortReverse,
}: PropTypes) => (key: sortKeyType) =>
    executeCollection(
        () => setSortKey(key),
        () => setSortReverse(key === sortKey && !sortReverse),
    )

const handleImageLoad = ({ setImagesLoaded }: PropTypes) => () => {
    if (--numOfImagesLeft === 0) {
        // eslint-disable-line no-plusplus
        setImagesLoaded(true)
    }
}

const renderSpinner = ({ imagesLoaded }: PropTypes) => () =>
    renderOnCondition(!imagesLoaded, <Loader />)

const renderEmptyResults = ({ searchKey }: PropTypes) => (): React$Element<
    any,
> | null =>
    renderOnCondition(
        searchKey,
        <div className="empty-results">No champions found.</div>,
    )

const setDisplayValue = ({ imagesLoaded }: PropTypes) => () =>
    imagesLoaded ? 'inline' : 'none'

const onChange = ({ setSearchKey }: PropTypes) => e =>
    setSearchKey(e.target.value.toLowerCase())

const fetchPlayers = ({ makeCompact }: PropTypes) => (
    args: regionType | Array<regionType>,
) =>
    // Perf.start();
    fetch(createFetchPlayersUrl(args))
        .then(r => r.json())
        .then(r => makeCompact(r))

const getPlayers = ({ setPlayers, setChampionName, togglePane }: PropTypes) => (
    tuple: Array<Array<playersType, string>>,
) => {
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
}: PropTypes) => () => (
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

const createChampPane = ({ getPlayers, handleImageLoad }: PropTypes) => (
    arr: Array<Array<any>>,
): React$Element<any> => (
    <ChampionPane
        champions={arr}
        getPlayers={getPlayers}
        handleImageLoad={handleImageLoad}
    />
)

const forcePlayersUpdate = ({ fetchPlayers }: PropTypes) => (
    args: regionType | Array<regionType>,
) => fetchPlayers(args)

const createChampPanesHolder = ({
    advFilter,
    merged,
    regions,
    region,
    showChamps,
    setDisplayValue,
    renderEmptyResults,
    createChampPane,
}: PropTypes) => (
    challengers: playersType,
    masters: playersType,
    all: playersType,
) => {
    const regionDisplayText = REGIONS_TEXT[region]
    const mulRegionsDisplayText =
        regions.length === DEFAULT_REGIONS.length
            ? 'All Regions'
            : `${regions.join(', ').toUpperCase()} Server(s)`

    return (
        <div style={{ display: setDisplayValue() }}>
            {renderOnCondition(
                advFilter && regions.length === 0,
                <div className="empty-results">No region is selected.</div>,
            )}
            {showChamps ? ( // eslint-disable-line no-nested-ternary
                !merged ? (
                    <div className="content-pane merged-pane">
                        <div className="rank-pane challengers-pane">
                            {renderOnCondition(
                                challengers.length === 0 &&
                                    masters.length === 0,
                                renderEmptyResults(),
                            )}
                            {renderOnCondition(
                                challengers.length > 0,
                                <h5 className="rank-header">
                                    Challenger One Trick Ponies in{' '}
                                    {advFilter
                                        ? mulRegionsDisplayText
                                        : regionDisplayText}
                                </h5>,
                            )}
                            {createChampPane(challengers)}
                        </div>
                        <div className="rank-pane masters-pane">
                            {masters.length > 0 ? (
                                <h5 className="rank-header">
                                    Masters One Trick Ponies in{' '}
                                    {advFilter
                                        ? mulRegionsDisplayText
                                        : regionDisplayText}
                                </h5>
                            ) : (
                                ''
                            )}
                            {createChampPane(masters)}
                        </div>
                    </div>
                ) : (
                    <div className="content-pane all-pane">
                        <div className="rank-pane">
                            {all.length > 0 ? (
                                <h5 className="rank-header">
                                    Challenger/Master One Trick Ponies in{' '}
                                    {advFilter
                                        ? mulRegionsDisplayText
                                        : regionDisplayText}
                                </h5>
                            ) : (
                                renderEmptyResults()
                            )}
                            {createChampPane(all)}
                        </div>
                    </div>
                )
            ) : (
                ''
            )}
        </div>
    )
}

const enhance = compose(
    connect(
        (state: stateType) => ({
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
    withHandlers({ createChampPane }),
    withHandlers({ forcePlayersUpdate, createChampPanesHolder }),
    lifecycle({
        componentDidMount() {
            const {
                advFilter,
                forcePlayersUpdate,
                regions,
                region,
            }: PropTypes = this.props
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
    }: PropTypes) => {
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

        return (
            <div className="container">
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

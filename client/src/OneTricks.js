/* eslint-env browser */

import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import lifecycle from 'recompose/lifecycle'
import Perf from 'react-addons-perf' // eslint-disable-line no-unused-vars

import {
    resetSearchKey,
    setSearchKey,
    toggleAdvancedFilter,
} from './redux/championPane'
import { toggleMerge } from './redux/misc'
import { setSortKey, setSortReverse } from './redux/playersView'

import {
    advancedFilterSelector,
    mergedSelector,
    searchKeySelector,
    sortKeySelector,
    sortReverseSelector,
} from './selectors'

import Loader from './components/Loader.bs'

import OneTricksRe from './OneTricksRe.bs'

import FILTERS from './helpers/filters'
import SORTS from './helpers/sorts'
import {
    executeCollection,
    executeConditionalCollection,
} from './helpers/dispatchHelpers'
import renderOnCondition from './helpers/renderOnCondition'

import DEFAULT_REGIONS from './constants/regions'
import RANKS from './constants/ranks'
import FETCH_PLAYERS_URL from './helpers/fetchPlayersUrl'

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

const handleImageLoad = ({ setImagesLoaded }) => () => {
    if (--numOfImagesLeft === 0) {
        // eslint-disable-line no-plusplus
        setImagesLoaded(true)
    }
}
const renderSpinner = ({ imagesLoaded }) => () =>
    renderOnCondition(!imagesLoaded, <Loader />)

const setDisplayValue = ({ imagesLoaded }) => () =>
    imagesLoaded ? 'inline' : 'none'

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
        handleImageLoad,
        renderSpinner,
        setDisplayValue,
    }),
    lifecycle({
        async componentDidMount() {
            const { makeCompact } = this.props
            const res = await fetch(FETCH_PLAYERS_URL)
            const json = await res.json()
            makeCompact(json)
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
        renderSpinner,
        ...props
    }) => {
        let tmp = { ...all }
        const keys = Object.keys(tmp)
        keys.forEach(key => {
            if (advFilter) {
                tmp[key] = tmp[key].filter(
                    el => regions.indexOf(el.region) !== -1,
                )
            } else {
                if (region !== 'all')
                    tmp[key] = tmp[key].filter(el => el.region === region)
            }
            if (tmp[key].length === 0) delete tmp[key]
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

        // ReasonML lists/arrays must have the same type, so _all breaks because it is of type [string, Types.player].
        // Parse it for now. :)
        const reasonableAll = _all.map(([championName, playersArray]) => ({
            champion: championName,
            players: playersArray,
        }))

        return (
            <div className="container">
                <OneTricksRe
                    areImagesLoaded={props.imagesLoaded}
                    allOneTricks={reasonableAll}
                />>
            </div>
        )
    },
)

export default OneTricks

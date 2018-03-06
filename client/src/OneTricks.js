/* eslint-env browser */

import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import lifecycle from 'recompose/lifecycle'
import Perf from 'react-addons-perf' // eslint-disable-line no-unused-vars

import Loader from './components/Loader.bs'

import OneTricksRe from './OneTricksRe.bs'

import FILTERS from './helpers/filters'
import SORTS from './helpers/sorts'

import FETCH_PLAYERS_URL from './helpers/fetchPlayersUrl'

let numOfImagesLeft = 0 // Performance :)

const makeCompact = ({ imagesLoaded, showChamps, setAll }) => list => {
    const compList = {}

    for (const player of list) {
        compList[player.champ] = compList[player.champ]
            ? [...compList[player.champ], player]
            : [player]
    }

    if (!imagesLoaded) {
        setAll(compList, () => {
            numOfImagesLeft = document.getElementsByClassName('content-pane')

            if (numOfImagesLeft.length > 0)
                numOfImagesLeft[0].querySelectorAll('img').length
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
    !imagesLoaded ? <Loader /> : null

const setDisplayValue = ({ imagesLoaded }) => () =>
    imagesLoaded ? 'inline' : 'none'

const enhance = compose(
    withState('all', 'setAll', {}),
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

const OneTricks = enhance(({ all, renderSpinner, ...props }) => {
    // Sort by number of one tricks per icon. TODO: Clean this up later.

    let tmp = { ...all }
    const keys = Object.keys(tmp)

    let sortedPlayers = new Map()

    for (const key of keys) sortedPlayers.set(key, tmp[key])

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

    console.log('reasonableAll:', reasonableAll)

    return (
        <div className="container">
            <OneTricksRe
                areImagesLoaded={props.imagesLoaded}
                allOneTricks={reasonableAll}
            />>
        </div>
    )
})

export default OneTricks

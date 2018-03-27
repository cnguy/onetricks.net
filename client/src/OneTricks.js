/* eslint-env browser */

import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import lifecycle from 'recompose/lifecycle'
import Perf from 'react-addons-perf' // eslint-disable-line no-unused-vars

import Loader from './components/Loader.bs'

import OneTricksRe from './OneTricksRe.bs'

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
            let json
            try {
                const res = await fetch(FETCH_PLAYERS_URL)
                json = await res.json()
            } catch (exception) {
                try {
                    const res = await fetch(
                        'https://media.onetricks.net/api/fallback-3-26-2018.json',
                    )
                    json = await res.json()
                } catch (fallbackFailed) {
                    console.log('fallback failed :/', fallbackFailed)
                }
            }
            makeCompact(json)
        },
    }),
)

const OneTricks = enhance(({ all, renderSpinner, ...props }) => {
    const keys = Object.keys(all)
    const reasonableAll = keys.map(key => ({
        champion: key,
        players: all[key],
    }))

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

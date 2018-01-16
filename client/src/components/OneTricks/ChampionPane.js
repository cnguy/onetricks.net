// @flow

import React from 'react'

import Champion from './Champion'

type PropTypes = {
    champions: Array<Array<any>>,
    getPlayers: (A: Array<Array<any>>, C: string) => void,
    handleImageLoad: () => void,
}

const ChampionPane = ({
    champions,
    getPlayers,
    handleImageLoad,
}: PropTypes): React$Element<any> => (
    <div className="champs">
        {champions.map((item, index) => (
            <a
                className="champ-open-links fade-in"
                key={index}
                href="#"
                onClick={() => getPlayers(champions, item[0])}
            >
                <Champion
                    name={item[0]}
                    number={item[1].length}
                    handleImageLoad={handleImageLoad}
                    key={index}
                />
            </a>
        ))}
    </div>
)

export default ChampionPane

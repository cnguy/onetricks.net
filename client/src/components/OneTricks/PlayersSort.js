// @flow

import React from 'react'

/* FlowFixMe */
import classNames from 'classnames'

import type { sortKey as sortKeyType } from '../../constants/flowTypes'

function grabTri(
    sortKey: sortKeyType,
    activeSortKey: sortKeyType,
    reverse: boolean,
) {
    if (sortKey === activeSortKey && reverse) {
        return <span className="sort-tri">&#9650;</span>
    }
    if (sortKey === activeSortKey && !reverse) {
        return <span className="sort-tri">&#9660;</span>
    }
    return ''
}

type PropTypes = {
    onSort: (sortKey: sortKeyType) => void,
    sortKey: sortKeyType,
    activeSortKey: sortKeyType,
    reverse: boolean,
    children: string | React$Element<any>,
}

const PlayersSort = ({
    onSort,
    sortKey,
    activeSortKey,
    reverse,
    children,
}: PropTypes): React$Element<any> => {
    const playerSortClass = classNames('player-sort-link', 'flash', {
        'active-sort': sortKey === activeSortKey,
    })

    return (
        <a className={playerSortClass} href="#" onClick={() => onSort(sortKey)}>
            {children}&nbsp;{grabTri(sortKey, activeSortKey, reverse)}
        </a>
    )
}

export default PlayersSort

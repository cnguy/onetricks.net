import { sortBy } from 'lodash'

const SORTS = {
    NONE: list => list,
    RANK: list => sortBy(list, ['rank', 'name']),
    REGION: list => sortBy(list, ['region', 'rank']),
    NAME: list =>
        sortBy(list, [l => l.name.toLowerCase().replace(/\s+/g, '')], ['name']),
    WINS: list => sortBy(list, ['wins', 'rank', 'name']),
    LOSSES: list => sortBy(list, ['losses', 'rank', 'name']),
    // Structure-specific sort method
    WINRATE: list =>
        list.sort(
            (a, b) =>
                a.wins / (a.wins + a.losses) - b.wins / (b.wins + b.losses),
        ),
    ONETRICKS: list =>
        list.sort((a, b) => {
            if (a[1].length > b[1].length) return -1
            if (a[1].length < b[1].length) return 1

            if (a[0] > b[0]) return 1
            if (a[0] < b[0]) return -1
            return 0
        }),
}

export default SORTS

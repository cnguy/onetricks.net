const RESET_SEARCH_KEY = 'one-tricks/championPane/RESET_SEARCH_KEY'
const SET_SEARCH_KEY = 'one-tricks/championPane/SET_SEARCH_KEY'

const TOGGLE_ADVANCED_FILTER = 'one-tricks/championPane/TOGGLE_ADVANCED_FILTER'

export default function reducer(
    state = {
        advFilter: false,
        searchKey: '',
    },
    action = {},
) {
    switch (action.type) {
        case RESET_SEARCH_KEY:
            return {
                ...state,
                searchKey: '',
            }
        case SET_SEARCH_KEY:
            return {
                ...state,
                searchKey: action.searchKey,
            }
        case TOGGLE_ADVANCED_FILTER:
            return {
                ...state,
                advFilter: !state.advFilter,
            }
        default:
            return state
    }
}

export function resetSearchKey() {
    return { type: RESET_SEARCH_KEY }
}

export function setSearchKey(searchKey) {
    return { type: SET_SEARCH_KEY, searchKey }
}

export function toggleAdvancedFilter() {
    return { type: TOGGLE_ADVANCED_FILTER }
}

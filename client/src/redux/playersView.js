const SET_SORT_KEY = 'one-tricks/playersView/SET_SORT_KEY';
const SET_SORT_REVERSE = 'one-tricks/playersView/SET_SORT_REVERSE';

export default function reducer(state = {
  sortKey: 'NONE',
  sortReverse: false,
}, action = {}) {
  switch (action.type) {
    case SET_SORT_KEY:
      return {
        ...state,
        sortKey: action.sortKey,
      };
    case SET_SORT_REVERSE:
      return {
        ...state,
        sortReverse: action.sortReverse,
      };
    default:
      return state;
  }
}

export function setSortKey(sortKey) {
  return { type: SET_SORT_KEY, sortKey };
}

export function setSortReverse(sortReverse) {
  return { type: SET_SORT_REVERSE, sortReverse };
}

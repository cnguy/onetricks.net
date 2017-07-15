const SET_SORT_REVERSE = 'one-tricks/playersView/SET_SORT_REVERSE';

export default function reducer(state = {
  sortReverse: false,
}, action = {}) {
  switch (action.type) {
    case SET_SORT_REVERSE:
      return {
        sortReverse: action.sortReverse,
      };
    default:
      return state;
  }
}

export function setSortReverse(reverse) {
  return { type: SET_SORT_REVERSE, sortReverse: reverse };
}

const SET_ADVANCED_FILTER = 'one-tricks/championPane/SET_ADVANCED_FILTER';

export default function reducer(state = {
  advFilter: false,
}, action = {}) {
  switch (action.type) {
    case SET_ADVANCED_FILTER:
      return {
        ...state,
        advFilter: action.advFilter,
      };
    default:
      return state;
  }
}

export function setAdvFilter(advFilter) {
  return { type: SET_ADVANCED_FILTER, advFilter };
}

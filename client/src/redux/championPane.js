const TOGGLE_ADVANCED_FILTER = 'one-tricks/championPane/TOGGLE_ADVANCED_FILTER';

export default function reducer(state = {
  advFilter: false,
}, action = {}) {
  switch (action.type) {
    case TOGGLE_ADVANCED_FILTER:
      return {
        ...state,
        advFilter: !state.advFilter,
      };
    default:
      return state;
  }
}

export function toggleAdvancedFilter() {
  return { type: TOGGLE_ADVANCED_FILTER };
}

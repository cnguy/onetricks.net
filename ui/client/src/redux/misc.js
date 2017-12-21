const TOGGLE_MERGE = 'one-tricks/misc/TOGGLE_MERGE';

export default function reducer(state = {
  merged: true,
}, action = {}) {
  switch (action.type) {
    case TOGGLE_MERGE:
      return {
        ...state,
        merged: !state.merged,
      };
    default:
      return state;
  }
}

export function toggleMerge() {
  return { type: TOGGLE_MERGE };
}

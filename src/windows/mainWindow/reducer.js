export default (state={
  stateReceived: false
}, action) => {
  switch(action.type) {
    case 'HANDLE_INITIAL_STATE_GET': {
      return {
        ...state,
        stateReceived: true,
        ...action.payload
      }
    }

    default:
      return state;
  }
}
export default (state = {
  connected: false
}, action) => {
  
  switch(action.type) {
    case 'HANDLE_CONNECTION': {
      const { arg1, arg2 } = action.payload;
      return {
        ...state,
        arg1,
        arg2
      }
    }

    default:
      return state;
  }
}


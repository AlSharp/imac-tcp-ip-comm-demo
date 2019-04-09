import {combineReducers} from 'redux';

const local = (state = {
  stateReceived: false
}, action) => {

  switch(action.type) {
    case 'HANDLE_INITIAL_STATE_GET': {
      return {
        ...state,
        stateReceived: true
      }
    }

    default:
      return state;
  }
}

const shared = (state = {
  isConnected: false,
  connectionError: '',
  port: '',
  ip: ''
}, action) => {

  switch(action.type) {
    case 'HANDLE_INITIAL_STATE_GET': {
      return {
        ...state,
        ...action.payload
      }
    }

    default:
      return state;
  }
}

const reducer = combineReducers(
  {
    local,
    shared
  }
)

export default reducer;

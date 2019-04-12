import {combineReducers} from 'redux';

const local = (state = {
  stateReceived: false,
  ASCIICommand: ''
}, action) => {
  
  switch(action.type) {
    case 'HANDLE_INITIAL_STATE_GET': {
      return {
        ...state,
        stateReceived: true
      }
    }
    case 'HANDLE_ASCII_COMMAND_CHANGE': {
      return {
        ...state,
        ASCIICommand: action.payload
      }
    }

    default:
      return state;
  }
}

const shared = (state = {
  isConnected: false,
  port: '',
  ip: '',
  isMotorEnabled: false,
  isJogActivated: false,
}, action) => {

  switch(action.type) {
    case 'HANDLE_INITIAL_STATE_GET': {
      return {
        ...state,
        ...action.payload
      }
    }
    case 'HANDLE_SHARED_STATE_UPDATE': {
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
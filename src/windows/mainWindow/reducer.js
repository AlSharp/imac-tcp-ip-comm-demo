import {combineReducers} from 'redux';

const local = (state = {
  stateReceived: false,
  ASCIICommand: '',
  distance: '',
  distanceError: undefined,
  velocity: '',
  velocityError: undefined,
  jogVelocity: '',
  jogVelocityError: undefined,
  acceleration: '',
  accelerationError: undefined,
  deceleration: '',
  decelerationError: undefined,
  sequenceNumber: 1
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
    case 'HANDLE_PARAMETER_VALUE_CHANGE': {
      const {parameterName, validationError} = action;
      return {
        ...state,
        [parameterName]: action.payload,
        [`${parameterName}Error`]: validationError,
      }
    }
    case 'HANDLE_SEQUENCE_SELECT': {
      return {
        ...state,
        sequenceNumber: action.payload
      }
    }

    default:
      return state;
  }
}

const shared = (state = {
  isConnected: false,
  connectionType: '',
  connectionError: '',
  comPorts: [],
  comPort: '',
  port: '',
  ip: '',
  axis: '',
  axes: [],
  motorResponse: '',
  status: '',
  inSequenceExecution: false
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
    case 'HANDLE_PORT_CHANGE': {
      return {
        ...state,
        port: action.payload
      }
    }
    case 'HANDLE_IP_CHANGE': {
      return {
        ...state,
        ip: action.payload
      }
    }
    case 'HANDLE_COM_PORT_SELECT': {
      return {
        ...state,
        comPort: action.payload
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
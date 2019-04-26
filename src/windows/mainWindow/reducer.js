import {combineReducers} from 'redux';

const local = (state = {
  stateReceived: false,
  ASCIICommand: '',
  velocity: '',
  velocityError: undefined,
  acceleration: '',
  accelerationError: undefined,
  deceleration: '',
  decelerationError: undefined,
  areJogParamsUpdated: false,
  distance: '',
  distanceError: undefined
}, action) => {
  
  switch(action.type) {
    case 'HANDLE_INITIAL_STATE_GET': {
      return {
        ...state,
        stateReceived: true
      }
    }
    case 'HANDLE_MOTOR_ENABLE': {
      return {
        ...state,
        areJogParamsUpdated: true
      }
    }
    case 'HANDLE_JOG_ACTIVATE': {
      return {
        ...state,
        areJogParamsUpdated: true
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
        areJogParamsUpdated: parameterName !== 'distance' ? 
          true :
          state.areJogParamsUpdated,
        
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
  isJogging: false,
  motorResponse: '',
  baudRate: '9600',
  status: ''
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
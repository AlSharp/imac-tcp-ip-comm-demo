module.exports = (state = {
  isConnected: false,
  connectionError: '',
  port: '',
  ip: '',
  isMotorEnabled: false,
  isJogActivated: false,
  isJogging: false,
  isMoving: false,
  motorResponse: ''
}, action) => {

  switch(action.type) {
    case 'HANDLE_CONNECTION_CREATE_SUCCEED': {
      return {
        ...state,
        isConnected: true,
        connectionError: '',
        port: action.payload.port,
        ip: action.payload.ip
      };
    }
    
    case 'HANDLE_CONNECTION_CREATE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionError: action.payload.error,
        port: action.payload.port,
        ip: action.payload.ip
      }
    }
    case 'HANDLE_CONNECTION_CLOSE_SUCCEED': {
      return {
        ...state,
        isConnected: false
      }
    }
    case 'HANDLE_CONNECTION_CLOSE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionError: action.payload
      }
    }
    case 'HANDLE_MOTOR_ENABLE_SUCCEED': {
      return {
        ...state,
        isMotorEnabled: action.payload,
        isJogActivated: state.isJogActivated && action.payload,
        motorResponse: ''
      }
    }
    case 'HANDLE_MOTOR_ENABLE_REJECTED': {
      return state;
    }
    case 'HANDLE_ASCII_COMMAND_SUBMIT_SUCCEED': {
      return {
        ...state,
        motorResponse: action.payload
      }
    }
    case 'HANDLE_ASCII_COMMAND_SUBMIT_REJECTED': {
      return {
        ...state,
        motorResponse: action.payload
      }
    }
    case 'HANDLE_DISTANCE_MOVE_EXECUTE_SUCCEED': {
      return {
        ...false,
        isMoving: true
      }
    }
    case 'HANDLE_DISTANCE_MOVE_EXECUTE_REJECTED': {
      return {
        ...state,
        isMoving: false
      }
    }
    case 'HANDLE_MOVE_ABORT_SUCCEED': {
      return {
        ...state,
        isMoving: false,
        isJogging: false
      }
    }
    case 'HANDLE_MOVE_ABORT_REJECTED': {
      return state;
    }
    case 'HANDLE_JOG_SUCCEED': {
      return {
        ...state,
        isJogging: true
      }
    }
    case 'HANDLE_JOG_REJECTED': {
      return state;
    }
    case 'HANDLE_JOG_ACTIVATE': {
      return {
        ...state,
        isJogActivated: action.payload
      }
    }
    default:
      return state;
  }
}
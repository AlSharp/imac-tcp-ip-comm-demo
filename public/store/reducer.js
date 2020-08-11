module.exports = (state = {
  isConnected: false,
  connectionType: '',
  connectionError: '',
  comPorts: [],
  comPort: '',
  port: '',
  ip: '',
  isMotorEnabled: [],
  isJogActivated: [],
  isJogging: false,
  isMoving: false,
  motorResponse: '',
  baudRate: '9600',
  status: '',
  axis: '0'
}, action) => {

  switch(action.type) {
    case 'HANDLE_IP_CONNECTION_CREATE_SUCCEED': {
      return {
        ...state,
        isConnected: true,
        connectionType: 'ethernet',
        connectionError: '',
        port: action.payload.port,
        ip: action.payload.ip,
        status: `Connected to ${action.payload.ip}:${action.payload.port}`
      };
    }
    
    case 'HANDLE_IP_CONNECTION_CREATE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionError: action.payload.error,
        port: action.payload.port,
        ip: action.payload.ip,
        status: 'Disconnected'
      }
    }
    case 'HANDLE_IP_CONNECTION_CLOSE_SUCCEED': {
      return {
        ...state,
        isConnected: false,
        connectionType: '',
        status: 'Disconnected'
      }
    }
    case 'HANDLE_IP_CONNECTION_CLOSE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionType: '',
        connectionError: action.payload,
        status: 'Disconnected'
      }
    }
    case 'HANDLE_USB_SERIAL_REFRESH_SUCCEED': {
      return {
        ...state,
        comPorts: action.payload
      }
    }
    case 'HANDLE_MOTOR_ENABLE_SUCCEED': {
      return {
        ...state,
        isMotorEnabled: action.payload.enabled ?
          state.isMotorEnabled.concat(action.payload.axis) :
          state.isMotorEnabled.filter(axis => axis !== action.payload.axis),
        isJogActivated: state.isJogActivated.includes(action.payload.axis) && action.payload.enabled ?
        state.isJogActivated.concat(action.payload.axis) :
        state.isJogActivated.filter(axis => axis !== action.payload.axis),
        motorResponse: '',
        status: action.payload ? 'Motor enabled' : 'Motor disabled'
      }
    }
    case 'HANDLE_MOTOR_ENABLE_REJECTED': {
      return {
        ...state,
        status: 'Enabling motor failed. Try again'
      }
    }
    case 'HANDLE_ASCII_COMMAND_SUBMIT_SUCCEED': {
      return {
        ...state,
        motorResponse: action.payload,
        status: 'ASCII command: Ok'
      }
    }
    case 'HANDLE_ASCII_COMMAND_SUBMIT_REJECTED': {
      return {
        ...state,
        motorResponse: action.payload,
        status: 'ASCII command: Error'
      }
    }
    case 'HANDLE_DISTANCE_MOVE_EXECUTE_SUCCEED': {
      return {
        ...state,
        isMoving: true,
        status: 'Moving'
      }
    }
    case 'HANDLE_DISTANCE_MOVE_EXECUTE_REJECTED': {
      return {
        ...state,
        isMoving: false,
        status: 'Move failed'
      }
    }
    case 'HANDLE_MOVE_ABORT_SUCCEED': {
      return {
        ...state,
        isMoving: false,
        isJogging: false,
        status: 'Move aborted'
      }
    }
    case 'HANDLE_MOVE_ABORT_REJECTED': {
      return {
        ...state,
        status: 'Abort failed'
      }
    }
    case 'HANDLE_JOG_SUCCEED': {
      return {
        ...state,
        isJogging: true,
        status: 'Jogging'
      }
    }
    case 'HANDLE_JOG_REJECTED': {
      return {
        ...state,
        status: 'Jog failed'
      }
    }
    case 'HANDLE_JOG_ACTIVATE': {
      return {
        ...state,
        isJogActivated: action.payload.activated ?
        state.isJogActivated.concat(action.payload.axis) :
        state.isJogActivated.filter(axis => axis !== action.payload.axis),
        status: 'Ok'
      }
    }
    case 'HANDLE_BAUD_RATE_CHANGE_SUCCEED': {
      return {
        ...state,
        baudRate: action.payload.baudRate,
        status: 'Baud rate has been changed'
      }
    }
    case 'HANDLE_MOTOR_DRIVER_BAUD_RATE_SET_REJECTED': {
      return {
        ...state,
        status: 'Could not change baud rate. Error code: '
      }
    }
    case 'HANDLE_COMMAND_PORT_INIT_REJECTED': {
      return {
        ...state,
        status: 'Could not initialize command port. Error code: '
      }
    }
    case 'HANDLE_COMMAND_PORT_OPEN_REJECTED': {
      return {
        ...state,
        status: 'Could not open command port. Error code: '
      }
    }
    case 'HANDLE_SERIAL_SERVER_BAUD_RATE_SET_REJECTED': {
      return {
        ...state,
        status: 'Could not set motion server baud rate. Error code: '
      }
    }
    case 'HANDLE_COMMAND_PORT_CLOSE_REJECTED': {
      return {
        ...state,
        status: 'Could not close command port. Error code: '
      }
    }
    case 'HANDLE_COMMAND_PORT_END_REJECTED': {
      return {
        ...state,
        status: 'Could not dispose command port. Error code: '
      }
    }
    case 'HANDLE_TEST_MSG_AFTER_BAUD_RATE_CHANGE_REJECTED': {
      return state;
    }
    case 'HANDLE_BREAK_COMMAND_SEND_SUCCEED': {
      return {
        ...state,
        baudRate: '9600',
        status: 'Line has been reset'
      }
    }
    case 'HANDLE_SERIAL_SERVER_BREAK_REJECTED': {
      return {
        ...state,
        status: 'Could not send break command. Error code: '
      }
    }
    case 'HANDLE_TEST_MSG_AFTER_BREAK_COMMAND_SEND_REJECTED': {
      return state;
    }
    case 'HANDLE_AXIS_CHANGE': {
      return {
        ...state,
        axis: action.payload
      }
    }
    default:
      return state;
  }
}
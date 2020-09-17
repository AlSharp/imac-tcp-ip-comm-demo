module.exports = (state = {
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
    case 'HANDLE_IP_CONNECTION_CREATE_SUCCEED': {
      const {ip, port} = action.payload;
      return {
        ...state,
        isConnected: true,
        connectionType: 'ethernet',
        connectionError: '',
        port,
        ip,
        status: `Connected to ${ip}:${port}`
      };
    }
    
    case 'HANDLE_IP_CONNECTION_CREATE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionType: '',
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
        status: 'Disconnected',
        axes: [],
        axis: ''
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
    case 'HANDLE_USB_SERIAL_CONNECTION_CREATE_SUCCEED': {
      const {comPort} = action.payload;
      return {
        ...state,
        isConnected: true,
        connectionType: 'usbserial',
        connectionError: '',
        comPort: comPort,
        status: `Connected to ${comPort}`
      }
    }
    case 'HANDLE_USB_SERIAL_CONNECTION_CREATE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionType: '',
        connectionError: action.payload.error,
        status: 'Disconnected'
      }
    }
    case 'HANDLE_USB_SERIAL_CONNECTION_CLOSE_SUCCEED': {
      return {
        ...state,
        isConnected: false,
        comPort: '',
        connectionType: '',
        status: 'Disconnected',
        axes: [],
        axis: ''
      }
    }
    case 'HANDLE_USB_SERIAL_CONNECTION_CLOSE_REJECTED': {
      return {
        ...state,
        isConnected: false,
        connectionType: '',
        connectionError: action.payload,
        status: 'Disconnected'
      }
    }
    case 'HANDLE_AXES_ADD': {
      const {axes} = action.payload;
      return {
        ...state,
        axes: axes.map(axis => (
          {
            number: axis,
            isMotorEnabled: false,
            isJogActivated: false,
            inMotion: false,
            motorType: '',
            position: 0,
            negLimit: false,
            negSWLimit: false,
            posLimit: false,
            posSWLimit: false
          }
        )),
        axis: axes[0] || null
      }
    }
    case 'HANDLE_MOTOR_ENABLE_SUCCEED': {
      return {
        ...state,
        axes: state.axes.map(axis =>
          axis.number === action.payload.axis ?
          {
            ...axis,
            isMotorEnabled: action.payload.enabled
          } :
          axis
        ),
        motorResponse: '',
        status: action.payload.enabled ? 'Motor enabled' : 'Motor disabled'
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
        motorResponse: action.payload.hwErrorCode,
        status: 'ASCII command: Error'
      }
    }
    case 'HANDLE_DISTANCE_MOVE_EXECUTE_SUCCEED': {
      return state;
    }
    case 'HANDLE_DISTANCE_MOVE_EXECUTE_REJECTED': {
      return {
        ...state,
        status: 'Move failed'
      }
    }
    case 'HANDLE_HOME_SUCCEED': {
      return {
        ...state,
        status: 'Homing'
      }
    }
    case 'HANDLE_HOME_REJECTED': {
      return {
        ...state,
        status: 'Home failed'
      }
    }
    case 'HANDLE_MOVE_ABORT_SUCCEED': {
      return {
        ...state,
        status: 'Move is aborted'
      }
    }
    case 'HANDLE_MOVE_ABORT_REJECTED': {
      return {
        ...state,
        status: 'Abort failed'
      }
    }
    case 'HANDLE_JOG_SUCCEED': {
      return state;
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
        axes: state.axes.map(axis =>
          axis.number === action.payload.axis ?
          {
            ...axis,
            isJogActivated: action.payload.activated
          } :
          axis
        ),
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

    case 'HANDLE_IN_MOTION_BIT_SET': {
      const {axis, bitValue} = action.payload;
      return {
        ...state,
        axes: state.axes.map(axs =>
          axs.number === axis ?
          {
            ...axs,
            inMotion: bitValue
          } :
          axs
        ),
        status: bitValue ?
          state.status === 'Homing' ? state.status : 'Moving' :
          state.status === 'Homing' ? 'Homing is completed' : 'Motion is completed' 
      }
    }

    case 'HANDLE_POSITION_CHANGE': {
      const {axis, value} = action.payload;
      return {
        ...state,
        axes: state.axes.map(axs =>
          axs.number === axis ?
          {
            ...axs,
            position: value
          } :
          axs
        )
      }
    }

    case 'HANDLE_NEG_LIMIT_CHANGE': {
      const {axis, bitValue} = action.payload;
      return {
        ...state,
        axes: state.axes.map(axs =>
          axs.number === axis ?
          {
            ...axs,
            negLimit: bitValue
          } :
          axs
        )
      }
    }

    case 'HANDLE_NEG_SW_LIMIT_CHANGE': {
      const {axis, bitValue} = action.payload;
      return {
        ...state,
        axes: state.axes.map(axs =>
          axs.number === axis ?
          {
            ...axs,
            negSWLimit: bitValue
          } :
          axs
        )
      }
    }

    case 'HANDLE_POS_LIMIT_CHANGE': {
      const {axis, bitValue} = action.payload;
      return {
        ...state,
        axes: state.axes.map(axs =>
          axs.number === axis ?
          {
            ...axs,
            posLimit: bitValue
          } :
          axs
        )
      }
    }

    case 'HANDLE_POS_SW_LIMIT_CHANGE': {
      const {axis, bitValue} = action.payload;
      return {
        ...state,
        axes: state.axes.map(axs =>
          axs.number === axis ?
          {
            ...axs,
            posSWLimit: bitValue
          } :
          axs
        )
      }
    }

    case 'HANDLE_IN_SEQUENCE_EXECUTION_BIT_SET': {
      const {bitValue} = action.payload;
      return {
        ...state,
        inSequenceExecution: bitValue,
        status: bitValue ? 'Running sequence' : 'Sequence is completed'
      }
    }
    case 'HANDLE_MOTOR_TYPE_CHANGE': {
      const {axis, motorType} = action.payload;
      return {
        ...state,
        axes: state.axes.map(axs =>
          axs.number === axis ?
          {
            ...axs,
            motorType
          } :
          axs
        )
      }
    }
    default:
      return state;
  }
}
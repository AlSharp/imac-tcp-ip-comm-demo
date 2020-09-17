const {
  handleMotorEnable,
  handleASCIICommandSend,
  handleDistanceMoveExecute,
  handleJog,
  handleMoveAbort,
  handleHome,
  handleAxisParameterChange,
  handleSequenceRun,
  handleSequenceStop
} = require('./usbSerialAsyncActions');

module.exports = usbSerial => store => next => action => {
  if (action.connectionType === 'usbserial') {
    switch(action.type) {
      case 'HANDLE_MOTOR_ENABLE': {
        handleMotorEnable(usbSerial, action)
          .then(response => {
            action.type = 'HANDLE_MOTOR_ENABLE_SUCCEED';
            next(action);
          })
          .catch(error => {
            // Do I need to show dialog message box with an error?
            // dialog.showErrorBox(title, content) 
            action.type = 'HANDLE_MOTOR_ENABLE_REJECTED';
            next(action);
          })
        break;
      }
      case 'HANDLE_ASCII_COMMAND_SUBMIT': {
        handleASCIICommandSend(usbSerial, action)
          .then(response => {
            action.type = 'HANDLE_ASCII_COMMAND_SUBMIT_SUCCEED';
            action.payload = response;
            next(action);
          })
          .catch(error => {
            action.type = 'HANDLE_ASCII_COMMAND_SUBMIT_REJECTED';
            action.payload = error;
            next(action);
          })
        break;
      }
      case 'HANDLE_DISTANCE_MOVE_EXECUTE': {
        handleDistanceMoveExecute(usbSerial, action)
          .then(response => {
            action.type = 'HANDLE_DISTANCE_MOVE_EXECUTE_SUCCEED';
            next(action);
          })
          .catch(error => {
            action.type = 'HANDLE_DISTANCE_MOVE_EXECUTE_REJECTED';
            next(action);
          })
        break;
      }
      case 'HANDLE_JOG': {
        handleJog(usbSerial, action)
          .then(response => {
            action.type = 'HANDLE_JOG_SUCCEED';
            next(action);
          })
          .catch(error => {
            action.type = 'HANDLE_JOG_REJECTED';
            next(action);
          })
        break;
      }
      case 'HANDLE_MOVE_ABORT': {
        const axis = action.payload;
        if (usbSerial.axesState[axis].isPolling) {
          usbSerial.clientActions.push(
            () => handleMoveAbort(usbSerial, action)
              .catch(error => {
                action.type = 'HANDLE_MOVE_ABORT_REJECTED';
                next(action);
              })
          )
        } else {
          handleMoveAbort(usbSerial, action)
            .catch(error => {
              action.type = 'HANDLE_MOVE_ABORT_REJECTED';
              next(action);
            })
        }
        break;
      }
      case 'HANDLE_JOG_ABORT': {
        handleMoveAbort(usbSerial, action)
          .then(response => {
            action.type = 'HANDLE_JOG_ABORT_SUCCEED';
            next(action);
          })
          .catch(error => {
            action.type = 'HANDLE_JOG_ABORT_REJECTED';
            next(action);
          })
        break;
      }
      case 'HANDLE_HOME': {
        handleHome(usbSerial, action)
          .then(response => {
            action.type = 'HANDLE_HOME_SUCCEED';
            next(action);
          })
          .catch(error => {
            action.type = 'HANDLE_HOME_REJECTED';
            next(action);
          })
        break;
      }
      case 'HANDLE_AXIS_PARAMETER_CHANGE': {
        handleAxisParameterChange(usbSerial, action)
          .catch(error => {
            action.type = 'HANDLE_MESSAGE_SHOW';
            action.payload = error;
            next(action);
          })
        break;
      }
      case 'HANDLE_SEQUENCE_RUN': {
        handleSequenceRun(usbSerial, action)
          .catch(error => {
            action.type = 'HANDLE_MESSAGE_SHOW';
            action.payload = error;
          })
        break;
      }
      case 'HANDLE_SEQUENCE_STOP': {
        usbSerial.clientActions.push(
          () => handleSequenceStop(usbSerial, action)
            .catch(error => {
              action.type = 'HANDLE_MESSAGE_SHOW';
              action.payload = error;
            })
        )
        break;
      }

      default:
        next(action);
    }
  } else {
    next(action);
  }
}
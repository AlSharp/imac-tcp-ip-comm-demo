const {
  handleMotorEnable,
  handleASCIICommandSend,
  handleDistanceMoveExecute,
  handleJog,
  handleMoveAbort,
  handleHome
} = require('./tcpSocketAsyncActions');

module.exports = ipSerial => store => next => action => {
  if (action.connectionType === 'ethernet') {
    switch(action.type) {
      case 'HANDLE_MOTOR_ENABLE': {
        handleMotorEnable(ipSerial, action)
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
        handleASCIICommandSend(ipSerial, action)
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
        handleDistanceMoveExecute(ipSerial, action)
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
        handleJog(ipSerial, action)
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
        if (ipSerial.axesState[axis].isPolling) {
          ipSerial.clientActions.push(
            () => handleMoveAbort(ipSerial, action)
              .then(response => {
                action.type = 'HANDLE_MOVE_ABORT_SUCCEED';
                next(action);
              })
              .catch(error => {
                action.type = 'HANDLE_MOVE_ABORT_REJECTED';
                next(action);
              })
          )
        } else {
          handleMoveAbort(ipSerial, action)
            .then(response => {
              action.type = 'HANDLE_MOVE_ABORT_SUCCEED';
              next(action);
            })
            .catch(error => {
              action.type = 'HANDLE_MOVE_ABORT_REJECTED';
              next(action);
            })
        }
        break;
      }
      case 'HANDLE_JOG_ABORT': {
        handleMoveAbort(ipSerial, action)
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
        handleHome(ipSerial, action)
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
  
      default:
        next(action);
    }
  } else {
    next(action);
  }
}
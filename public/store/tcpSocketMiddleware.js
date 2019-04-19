const {
  handleConnectionCreate,
  handleConnectionClose,
  handleMotorEnable,
  handleASCIICommandSend,
  handleDistanceMoveExecute,
  handleJog,
  handleMoveAbort
} = require('./tcpSocketAsyncActions');
const {showMeListeners} = require('./utils');

module.exports = socket => store => next => action => {
  switch(action.type) {
    case 'HANDLE_CONNECTION_CREATE': {
      handleConnectionCreate(socket, action)
        .then(data => {
          showMeListeners(socket, 'error');
          showMeListeners(socket, 'close');
          showMeListeners(socket, 'ready');
          action.type = 'HANDLE_CONNECTION_CREATE_SUCCEED';
          next(action);
        })
        .catch(error => {
          showMeListeners(socket, 'error');
          showMeListeners(socket, 'close');
          showMeListeners(socket, 'ready');
          action.type = 'HANDLE_CONNECTION_CREATE_REJECTED';
          action.payload.error = error.code;
          next(action);
        })
      break;
    }
    case 'HANDLE_CONNECTION_CLOSE': {
      handleConnectionClose(socket)
        .then(data => {
          showMeListeners(socket, 'error');
          showMeListeners(socket, 'close');
          action.type = 'HANDLE_CONNECTION_CLOSE_SUCCEED';
          next(action);
        })
        .catch(error => {
          showMeListeners(socket, 'error');
          showMeListeners(socket, 'close');
          action.type = 'HANDLE_CONNECTION_CLOSE_REJECTED';
          action.payload = error.code;
          next(action);
        })
      break;
    }
    case 'HANDLE_MOTOR_ENABLE': {
      handleMotorEnable(socket, action)
        .then(response => {
          showMeListeners(socket, 'data');
          action.type = 'HANDLE_MOTOR_ENABLE_SUCCEED';
          next(action);
        })
        .catch(error => {
          showMeListeners(socket, 'data');
          // Do I need to show dialog message box with an error?
          // dialog.showErrorBox(title, content) 
          action.type = 'HANDLE_MOTOR_ENABLE_REJECTED';
          next(action);
        })
      break;
    }
    case 'HANDLE_ASCII_COMMAND_SUBMIT': {
      handleASCIICommandSend(socket, action)
        .then(response => {
          showMeListeners(socket, 'data');
          action.type = 'HANDLE_ASCII_COMMAND_SUBMIT_SUCCEED';
          action.payload = response;
          next(action);
        })
        .catch(error => {
          showMeListeners(socket, 'data');
          action.type = 'HANDLE_ASCII_COMMAND_SUBMIT_REJECTED';
          action.payload = error;
          next(action);
        })
      break;
    }
    case 'HANDLE_DISTANCE_MOVE_EXECUTE': {
      handleDistanceMoveExecute(socket, action)
      .then(response => {
        showMeListeners(socket, 'data');
        action.type = 'HANDLE_DISTANCE_MOVE_EXECUTE_SUCCEED';
        next(action);
      })
      .catch(error => {
        showMeListeners(socket, 'data');
        action.type = 'HANDLE_DISTANCE_MOVE_EXECUTE_REJECTED';
        next(action);
      })
      break;
    }
    case 'HANDLE_JOG': {
      handleJog(socket, action)
      .then(response => {
        showMeListeners(socket, 'data');
        action.type = 'HANDLE_JOG_SUCCEED';
        next(action);
      })
      .catch(error => {
        showMeListeners(socket, 'data');
        action.type = 'HANDLE_JOG_REJECTED';
        next(action);
      })
      break;
    }
    case 'HANDLE_MOVE_ABORT': {
      handleMoveAbort(socket, action)
      .then(response => {
        showMeListeners(socket, 'data');
        action.type = 'HANDLE_MOVE_ABORT_SUCCEED';
        next(action);
      })
      .catch(error => {
        showMeListeners(socket, 'data');
        action.type = 'HANDLE_MOVE_ABORT_REJECTED';
        next(action);
      })
      break;
    }
    case 'HANDLE_JOG_ABORT': {
      handleMoveAbort(socket, action)
      .then(response => {
        showMeListeners(socket, 'data');
        action.type = 'HANDLE_JOG_ABORT_SUCCEED';
        next(action);
      })
      .catch(error => {
        showMeListeners(socket, 'data');
        action.type = 'HANDLE_JOG_ABORT_REJECTED';
        next(action);
      })
      break;
    }


    default:
      next(action);
  }
}
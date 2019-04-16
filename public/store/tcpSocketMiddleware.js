const {handleTCPConnectionError} = require('./actions')

const {showMeListeners} = require('./utils');

const writeOne = (socket, command) => {
  return new Promise((resolve, reject) => {
    let timeout;
    let errorHandler, responseHandler;
    errorHandler = error => {
      socket.removeListener('data', responseHandler);
      reject(error);
      return;
    }
    responseHandler = res => {
      socket.removeListener('error', errorHandler);
      let response = res.toString('utf8');
      console.log('RESPONSE: ', response);
      clearTimeout(timeout);
      if (response.slice(0, 1) === 'v') {
        resolve(response.slice(2));
        return;
      } else if (response.slice(0, 1) === 'e') {
        reject(response);
        return;
      } else {
        resolve(response);
        return;
      }
    }
    timeout = setTimeout(() => {
      socket.removeListener('data', responseHandler);
      socket.removeListener('error', errorHandler);
      reject('WRITE TIMEOUT');
      return;
    }, 300);
    socket.write(command + '\r', 'ascii');
    socket.once('error', errorHandler);
    socket.once('data', responseHandler);
  })
}

const write = async (socket, commands) => {
  for (let i = 0; i < commands.length; i++) {
    await writeOne(socket, commands[i]);
    showMeListeners(socket, 'data');
    showMeListeners(socket, 'error');
  }
}

const handleConnectionCreate = (socket, action) => {
  return new Promise((resolve, reject) => {
    const {ip, port} = action.payload;

    let timer, err;

    const timeout = 1000;
    let closeByTimeout = false;

    const errorHandler = error => {
      clearTimeout(timer);
      err = error.code;
    }

    const closeHandler = hadError => {
      clearTimeout(timer);
      if (hadError) {
        socket.removeListener('ready', readyHandler);
        reject(err);
        return;
      }
      if (closeByTimeout) {
        socket.removeListener('error', errorHandler);
        socket.removeListener('ready', readyHandler);
        reject({code: 'ETIMEDOUT'});
        return;
      }
    }

    const readyHandler = () => {
      socket.removeListener('error', errorHandler);
      socket.removeListener('close', closeHandler);

      // attach listener for error event which
      // can happen any time while program works
      // maybe we don't need this
      // better to do this differently
      socket.once('error', handleTCPConnectionError);

      resolve();
      return;
    }

    socket.connect(port, ip, () => {
      clearTimeout(timer);
    });

    socket.once('error', errorHandler);

    socket.once('close', closeHandler);

    socket.once('ready', readyHandler);

    timer = setTimeout(() => {
      closeByTimeout = true;
      socket.destroy();
    }, timeout);
  })
}

handleConnectionClose = (socket, action) => {
  return new Promise((resolve, reject) => {
    // remove handleTCPConnectionError listener, so we can add
    // error event listener appropriate for connection closing routine
    socket.removeListener('error', handleTCPConnectionError);

    let err;

    const errorHandler = error => {
      err = error;
    }

    const closeHandler = hadError => {
      if (hadError) {
        reject(err);
        return;
      }
      socket.removeListener('error', errorHandler)
      resolve();
      return;
    }

    socket.once('error', errorHandler);
    socket.once('close', closeHandler);

    socket.destroy();
  })
}

const handleMotorEnable = (socket, action) => {
  let command = action.payload ?
    's r0x70 2 0' :
    's r0x70 258 0';
  // let command = action.payload ?
  //   's r0x70 258 0\r' :
  //   's r0x70 2 0\r';
  return writeOne(socket, command);
}

const handleASCIICommandSend = (socket, action) =>
  writeOne(socket, action.payload);

const handleDistanceMoveExecute = (socket, action) => {
  let commands = ['s r0xc8 256', `s r0xca ${action.payload}`, 't 1'];
  return write(socket, commands);
}

const handleJog = (socket, action) => {
  let commands;
  if(action.payload) {
    commands = [
      's r0xc8 2',
      `s r0xca ${action.direction === 'positive' ? '1' : '-1'}`,
      `s r0xcb ${action.payload.velocity}`,
      `s r0xcc ${action.payload.acceleration}`,
      `s r0xcd ${action.payload.deceleration}`,
      `s r0xcf ${action.payload.deceleration}`,
      't 1'
    ]
  } else {
    commands = ['t 1'];
  }
  return write(socket, commands);
}

const handleMoveAbort = (socket, action) =>
  writeOne(socket, 't 0');

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
      handleConnectionClose(socket, action)
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
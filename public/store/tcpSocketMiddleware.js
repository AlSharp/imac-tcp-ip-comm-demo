const {handleTCPConnectionError} = require('./actions')

const {showMeListeners} = require('./utils');

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


    default:
      next(action);
  }
}
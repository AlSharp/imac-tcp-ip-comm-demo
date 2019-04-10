const {handleTCPConnectionError} = require('./actions')

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
        reject(err);
        return;
      }
      if (closeByTimeout) {
        reject({code: 'ETIMEDOUT'});
        return;
      }
    }

    const readyHandler = () => {
      socket.removeListener('error', errorHandler);
      socket.removeListener('close', closeHandler);
      socket.prependOnceListener('error', handleTCPConnectionError);
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

module.exports = socket => store => next => action => {
  switch(action.type) {
    case 'HANDLE_CONNECTION_CREATE': {
      handleConnectionCreate(socket, action)
        .then(data => {
          action.type = 'HANDLE_CONNECTION_CREATE_SUCCEED';
          next(action);
        })
        .catch(error => {
          action.type = 'HANDLE_CONNECTION_CREATE_REJECTED';
          action.error = error.code;
          next(action);
        })
      break;
    }
    default:
      next(action);
  }
}
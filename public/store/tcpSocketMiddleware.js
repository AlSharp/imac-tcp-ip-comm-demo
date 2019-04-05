const handleConnectionCreate = (socket, action) => {
  return new Promise((resolve, reject) => {
    const {ip, port} = action.payload;

    const errorHandler = error => {
      reject(error);
      return;
    }

    const responseHandler = response => {
      resolve(response);
      return;
    }

    socket.connect(port, ip, () => {
      console.log('connected');

      socket.on('error', errorHandler);

      socket.write('t 2\r', 'ascii', () => {
        'command t2 has been written over the LAN'
      });
      socket.once('data', responseHandler);
    })
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
          action.error = error;
          next(action);
        })
    }
  }
  next(action);
}
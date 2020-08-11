const {showMeListeners, log} = require('./utils');

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
      log.info('RESPONSE: ', response);
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
      err = error;
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
      // socket.once('error', handleTCPConnectionError);

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

handleConnectionClose = (socket) => {
  return new Promise((resolve, reject) => {
    // remove handleTCPConnectionError listener, so we can add
    // error event listener appropriate for connection closing routine
    // socket.removeListener('error', handleTCPConnectionError);

    let err;

    const endHandler = () => {
      log.info('SOCKET END');
      log.info('AMOUNT OF BYTES WRITTEN ON END: ', socket.bytesWritten);
    }

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

    socket.once('end', endHandler);
    socket.once('error', errorHandler);
    socket.once('close', closeHandler);

    socket.destroy();
  })
}

const handleMotorEnable = (socket, action) => {
  let command = action.payload.enabled ?
    `${action.payload.axis} s r0x70 2 0` :
    `${action.payload.axis} s r0x70 258 0`;
  // let command = action.payload ?
  //   's r0x70 258 0\r' :
  //   's r0x70 2 0\r';
  return writeOne(socket, command);
}

const handleASCIICommandSend = (socket, action) =>
  writeOne(socket, action.payload);

const handleDistanceMoveExecute = (socket, action) => {
  const {axis, distance} = action.payload;
  let commands = [
    `${axis} s r0xc8 256`,
    `${axis} s r0xca ${distance}`,
    `${axis} t 1`
  ];
  return write(socket, commands);
}

const handleJog = (socket, action) => {
  let commands;
  if(action.payload) {
    const {
      axis,
      direction,
      payload: {velocity, acceleration, deceleration} 
    } = action;
    commands = [
      `${axis} s r0xc8 2`,
      `${axis} s r0xca ${direction === 'positive' ? '1' : '-1'}`,
      `${axis} s r0xcb ${velocity}`,
      `${axis} s r0xcc ${acceleration}`,
      `${axis} s r0xcd ${deceleration}`,
      `${axis} s r0xcf ${deceleration}`,
      `${axis} t 1`
    ]
  } else {
    commands = [` ${action.axis} t 1`];
  }
  return write(socket, commands);
}

const handleMoveAbort = (socket, action) =>
  writeOne(socket, `${action.payload} t 0`);


module.exports ={
  writeOne,
  handleConnectionCreate,
  handleConnectionClose,
  handleMotorEnable,
  handleASCIICommandSend,
  handleDistanceMoveExecute,
  handleJog,
  handleMoveAbort
}
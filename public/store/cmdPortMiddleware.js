const {
  handleConnectionCreate,
  handleConnectionClose,
  writeOne
} = require('./tcpSocketAsyncActions');

const {showMeListeners} = require('./utils');

const handleBaudRateChange = (commandPort, socket, action) => {
  const setBaudRate = action => new Promise((resolve, reject) => {
    let code;
    code = commandPort.nsio_init();
    if(code < 0) {
      reject(
        {
          type: 'HANDLE_COMMAND_PORT_INIT_REJECTED',
          payload: code
        }
      );
      return;
    }
    const portId = commandPort.nsio_open(action.payload.ip, 1, 3000);
    if (portId < 0) {
      reject(
        {
          type: 'HANDLE_COMMAND_PORT_OPEN_REJECTED',
          payload: portId
        }
      );
      return;
    }
    code = commandPort.nsio_baud(
      parseInt(action.payload.baudRate),
      100
    );
    if (code < 0) {
      reject(
        {
          type: 'HANDLE_SERIAL_SERVER_BAUD_RATE_SET_REJECTED',
          payload: code
        }
      );
      return;
    }
    code = commandPort.nsio_close(portId);
    if (code < 0) {
      reject(
        {
          type: 'HANDLE_COMMAND_PORT_CLOSE_REJECTED',
          payload: code
        }
      );
      return;
    }
    code = commandPort.nsio_end();
    if (code < 0) {
      reject(
        {
          type: 'HANDLE_COMMAND_PORT_END_REJECTED',
          payload: code
        }
      );
      return;
    }
    resolve();
    return;
  })

  return new Promise(async (resolve, reject) => {
    let errors = [];
    let res;
    // set motor driver baud rate
    res = await writeOne(socket, `s r0x90 ${action.payload.baudRate}`).catch(error => {
      errors.push(
        {
          type: 'HANDLE_MOTOR_DRIVER_BAUD_RATE_SET_REJECTED',
          payload: error
        }
      );
    })
    if (errors.length > 0) {
      console.log('ERRORS: ', errors.length);
      console.log('ERRORS: ', errors);
      reject(errors);
      return;
    }

    res = await handleConnectionClose(socket)
                  .catch(error => {
                    errors.push(
                      {
                        type: 'HANDLE_CONNECTION_CLOSE_REJECTED',
                        payload: error
                      }
                    );
                    return reject(errors);
                  });
    // set serial server baud rate
    res = await setBaudRate(action).catch(error => errors.push(error));
    // work with command port
    res = await handleConnectionCreate(socket, action)
                  .catch(error => {
                    errors.push(
                      {
                        type: 'HANDLE_CONNECTION_CREATE_REJECTED',
                        payload: {
                          ip: action.payload.ip,
                          port: action.payload.port,
                          error}
                      }
                    );
                  })
    if (errors.length === 0) {
      return resolve();
    }
    console.log('ERRORS: ', errors.length);
    console.log('ERRORS: ', errors);
    return reject(errors);
  })
}

module.exports = (commandPort, socket) => store =>
  next => action => {
    switch(action.type) {
      case 'HANDLE_BAUD_RATE_CHANGE': {
        handleBaudRateChange(commandPort, socket, action)
          .then(() => {
            action.type = 'HANDLE_BAUD_RATE_CHANGE_SUCCEED';
            next(action);
          })
          .catch(errors => {
            errors.forEach(error => next(error));
          })
        break;
      }
      default:
        next(action);
    }
  }
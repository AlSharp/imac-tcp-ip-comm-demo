const {
  writeOne
} = require('./tcpSocketAsyncActions');

const nsio = (commandPort, func) => action => new Promise((resolve, reject) => {
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
  if (func === 'break') {
    code = commandPort.nsio_break(portId, 200);
    if (code < 0) {
      reject(
        {
          type: 'HANDLE_SERIAL_SERVER_BREAK_REJECTED',
          payload: code
        }
      );
      return;
    }
  }
  code = commandPort.nsio_baud(
    portId,
    func === 'baud' ? parseInt(action.payload.baudRate) : 9600
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

const handleBaudRateChange = (commandPort, socket, action) => {
  const setBaudRate = nsio(commandPort, 'baud');
  return new Promise(async (resolve, reject) => {
    // set motor driver baud rate
    await writeOne(socket, `s r0x90 ${action.payload.baudRate}`)
                  .catch(error => {
                    if (error !== 'WRITE TIMEOUT') {
                      return reject(
                        {
                          type: 'HANDLE_MOTOR_DRIVER_BAUD_RATE_SET_REJECTED',
                          payload: error
                        }
                      );
                    }
                  });

    // set serial server baud rate
    await setBaudRate(action)
            .catch(error => {
              return reject(error)
            });
    await writeOne(socket, 'g r0x90')
            .catch(error => {
              return reject(
                {
                  type: 'HANDLE_TEST_MSG_AFTER_BAUD_RATE_CHANGE_REJECTED',
                  payload: error
                }
              )
            })
    return resolve();
  })
}

handleBreakCommandSend = (commandPort, socket, action) => {
  const breakCommandSend = nsio(commandPort, 'break');
  return new Promise(async (resolve, reject) => {
    await breakCommandSend(action)
            .catch(error => reject(error))
    await writeOne(socket, 'g r0x90')
            .catch(error => reject(
              {
                type: 'HANDLE_TEST_MSG_AFTER_BREAK_COMMAND_SEND_REJECTED',
                payload: error
              }
            ))
    return resolve();
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
          .catch(error => next(error));
        break;
      }
      case 'HANDLE_BREAK_COMMAND_SEND': {
        handleBreakCommandSend(commandPort, socket, action)
          .then(() => {
            action.type = 'HANDLE_BREAK_COMMAND_SEND_SUCCEED';
            next(action);
          })
          .catch(error => next(error))
        break;
      }
      default:
        next(action);
    }
  }
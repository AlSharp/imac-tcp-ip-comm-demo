const {
  handleConnectionCreate,
  handleConnectionClose,
  writeOne
} = require('./tcpSocketAsyncActions');

const {showMeListeners} = require('./utils');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const handleBaudRateChange = (commandPort, socket, action) => {
  const setBaudRate = action => new Promise(async (resolve, reject) => {
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
    console.log('NSIO INIT OK');
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
    console.log('NSIO OPEN OK');
    // let baud;
    // const rate = parseInt(action.payload.baudRate, 10);
    // console.log('RATE: ', rate);
    // switch(rate) {
    //   case 9600: {
    //     baud = 12;
    //     break;
    //   }
    //   case 19200: {
    //     baud = 13;
    //     break;
    //   }
    //   case 38400: {
    //     baud = 14;
    //     break;
    //   }
    //   case 57600: {
    //     baud = 15;
    //     break;
    //   }
    //   default:
    //     baud = 16;
    // }
    // console.log('BAUD: ', baud);
    // code = commandPort.nsio_ioctl(
    //   portId,
    //   baud,
    //   3
    // );
    // if (code < 0) {
    //   reject(
    //     {
    //       type: 'HANDLE_SERIAL_SERVER_BAUD_RATE_SET_REJECTED',
    //       payload: code
    //     }
    //   );
    //   return;
    // }
    // console.log('NSIO IOCTL OK');
    code = commandPort.nsio_baud(
      portId,
      parseInt(action.payload.baudRate, 10),
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
    console.log('NSIO BAUD OK');
    await wait(1000);
    // const buf = Buffer.alloc(255);
    // code = commandPort.nsio_read(portId, buf, 200);
    // console.log('READ LENGTH: ', code);
    // console.log('BUFFER 255: ', buf.toString());
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
    console.log('NSIO CLOSE OK');
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
    console.log('NSIO END OK');
    resolve();
    return;
  })

  return new Promise(async (resolve, reject) => {
    let errors = [];
    // set motor driver baud rate
    console.log('SET MOTOR BAUD RATE TO ', action.payload.baudRate);
    console.log('LENGTH: ', action.payload.baudRate.length);
    console.log(`s r0x90 ${action.payload.baudRate}`);
    await writeOne(socket, `s r0x90 ${action.payload.baudRate}`).catch(error => {
      // timeout is good sign, because drive will response with an 'ok'
      // at new baud rate. We can not receive it.
      if (error !== 'WRITE TIMEOUT') {
        errors.push(
          {
            type: 'HANDLE_MOTOR_DRIVER_BAUD_RATE_SET_REJECTED',
            payload: error
          }
        );
      }
    })
    if (errors.length > 0) {
      reject(errors);
      return;
    }
    console.log('CLOSE DATA PORT...');
    console.log('AMOUNT OF BYTES WRITTEN BEFORE: ', socket.bytesWritten);
    await handleConnectionClose(socket)
                  .catch(error => {
                    errors.push(
                      {
                        type: 'HANDLE_CONNECTION_CLOSE_REJECTED',
                        payload: error
                      }
                    );
                  });
    console.log('AMOUNT OF BYTES WRITTEN AFTER: ', socket.bytesWritten);
    if (errors.length > 0) {
      reject(errors);
      return;
    }
    // set serial server baud rate
    console.log('SET SERIAL SERVER BAUD RATE...');
    await setBaudRate(action).catch(error => errors.push(error));
    // work with command port
    console.log('OPEN DATA PORT...');
    await handleConnectionCreate(socket, action)
                  .catch(error => {
                    errors.push(
                      {
                        type: 'HANDLE_CONNECTION_CREATE_REJECTED',
                        payload: {
                          ip: action.payload.ip,
                          port: action.payload.port,
                          error: error.code}
                      }
                    );
                  })
    if (errors.length === 0) {
      console.log('GOOD!!!');
      resolve();
      return;
    }
    console.log('ERRORS: ', errors.length);
    console.log('ERRORS: ', errors);
    reject(errors);
    return;
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
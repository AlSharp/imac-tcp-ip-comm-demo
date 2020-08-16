const {
  handleIPConnectionCreate,
  handleIPConnectionClose,
} = require('./tcpSocketAsyncActions');
const {
  handleUSBSerialRefresh,
  handleUSBSerialConnectionCreate,
  handleUSBSerialConnectionClose
} = require('./usbSerialAsyncActions');

module.exports = (ipSerial, usbSerial) => store => next => action => {
  switch(action.type) {
    case 'HANDLE_IP_CONNECTION_CREATE': {
      handleIPConnectionCreate(ipSerial, action)
        .then(() => ipSerial.getAxes())
        .then(axes => {
          action.type = 'HANDLE_IP_CONNECTION_CREATE_SUCCEED';
          action.payload = {...action.payload, axes}
          next(action);
        })
        .catch(error => {
          action.type = 'HANDLE_IP_CONNECTION_CREATE_REJECTED';
          action.payload.error = error.code;
          next(action);
        })
      break;
    }
    case 'HANDLE_IP_CONNECTION_CLOSE': {
      handleIPConnectionClose(ipSerial)
        .then(data => {
          action.type = 'HANDLE_IP_CONNECTION_CLOSE_SUCCEED';
          next(action);
        })
        .catch(error => {
          action.type = 'HANDLE_IP_CONNECTION_CLOSE_REJECTED';
          action.payload = error.code;
          next(action);
        })
      break;
    }
    case 'HANDLE_USB_SERIAL_REFRESH': {
      handleUSBSerialRefresh(usbSerial)
        .then(data => {
          action.type = 'HANDLE_USB_SERIAL_REFRESH_SUCCEED';
          action.payload = data;
          next(action);
        })
        .catch(error => {
          action.type = 'HANDLE_USB_SERIAL_REFRESH_REJECTED';
          action.payload = error;
          next(action);
        })
      break;
    }
    case 'HANDLE_USB_SERIAL_CONNECTION_CREATE': {
      handleUSBSerialConnectionCreate(usbSerial, action)
        .then(() => usbSerial.getAxes())
        .then(axes => usbSerial.initAxesState(axes))
        .then(axes => {
          action.type = 'HANDLE_USB_SERIAL_CONNECTION_CREATE_SUCCEED';
          action.payload = {...action.payload, axes};
          next(action);
        })
        .catch(error => {
          action.type = 'HANDLE_USB_SERIAL_CONNECTION_CREATE_REJECTED';
          action.payload = error;
          next(action);
        })
      break;
    }
    case 'HANDLE_USB_SERIAL_CONNECTION_CLOSE': {
      handleUSBSerialConnectionClose(usbSerial)
        .then(data => {
          action.type = 'HANDLE_USB_SERIAL_CONNECTION_CLOSE_SUCCEED';
          next(action);
        })
        .catch(error => {
          action.type = 'HANDLE_USB_SERIAL_CONNECTION_CLOSE_REJECTED';
          action.payload = error;
          next(action);
        })
      break;
    }

    default:
      next(action);
  }
}
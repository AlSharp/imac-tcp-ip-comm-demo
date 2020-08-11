const {
  handleConnectionCreate,
  handleConnectionClose,
} = require('./tcpSocketAsyncActions');
const {
  handleUSBSerialRefresh
} = require('./usbSerialAsyncActions');
const {showMeListeners} = require('./utils');

module.exports = (socket, usbSerial) => store => next => action => {
  switch(action.type) {
    case 'HANDLE_IP_CONNECTION_CREATE': {
      handleConnectionCreate(socket, action)
        .then(data => {
          showMeListeners(socket, 'error');
          showMeListeners(socket, 'close');
          showMeListeners(socket, 'ready');
          action.type = 'HANDLE_IP_CONNECTION_CREATE_SUCCEED';
          next(action);
        })
        .catch(error => {
          showMeListeners(socket, 'error');
          showMeListeners(socket, 'close');
          showMeListeners(socket, 'ready');
          action.type = 'HANDLE_IP_CONNECTION_CREATE_REJECTED';
          action.payload.error = error.code;
          next(action);
        })
      break;
    }
    case 'HANDLE_IP_CONNECTION_CLOSE': {
      handleConnectionClose(socket)
        .then(data => {
          showMeListeners(socket, 'error');
          showMeListeners(socket, 'close');
          action.type = 'HANDLE_IP_CONNECTION_CLOSE_SUCCEED';
          next(action);
        })
        .catch(error => {
          showMeListeners(socket, 'error');
          showMeListeners(socket, 'close');
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

    default:
      next(action);
  }
}
const {createStore, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
const electronMiddleware = require('./electron-main-middleware');
const reducer = require('./reducer');

const isDev = require('electron-is-dev');

module.exports = ipcMain => {
  let middlewares = [thunk, electronMiddleware(ipcMain)];
  if (isDev) {
    const logger = require('redux-logger').createLogger();
    middlewares = [...middlewares, logger];
  }
  const store = createStore(reducer, applyMiddleware(...middlewares));

  ipcMain.on('window::req', (e, info) => {
    const {action, windowId} = info;
    switch(action.type) {
      case 'HANDLE_INITIAL_STATE_GET': {
        const initState = store.getState();
        e.sender.send(`${windowId}::res`, initState);
        break;
      }
      // case 'HANDLE_CONNECT_BUTTON_CLICK'
      default:
        console.log('main default')
        e.sender.send(`${windowId}::res`, {actionError: 'Action unregistered'});
    }
  })

  return store;
}
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
  return createStore(reducer, applyMiddleware(...middlewares));
}
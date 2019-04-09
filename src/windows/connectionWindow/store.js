import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import electronMiddleware from '../middlewares/electron-renderer-middleware';
import reducer from './reducer';
const isDev = window.require('electron-is-dev');

const windowName = 'connectionWindow';

const store = ipcRenderer => {
  let middlewares = [thunk, electronMiddleware(ipcRenderer, windowName)];
  if (isDev) {
    const logger = require('redux-logger').createLogger();
    middlewares = [...middlewares, logger];
  }
  return createStore(reducer, applyMiddleware(...middlewares));
}

export default store;
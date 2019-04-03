import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import electronMiddleware from '../middlewares/electron-middleware';
import reducer from './reducer';
const isDev = window.require('electron-is-dev');

const store = ipcRenderer => {
  let middlewares = [thunk, electronMiddleware(ipcRenderer)];
  if (isDev) {
    import('redux-logger')
      .then(module => {
        const logger = module.createLogger();
        middlewares = [...middlewares, logger];
      })
  }
  return createStore(reducer, applyMiddleware(...middlewares));
}

export default store;
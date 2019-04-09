const {createStore, applyMiddleware, compose} = require('redux');
const thunk = require('redux-thunk').default;
const tcpSocketMiddleware = require('./tcpSocketMiddleware');
const electronReduxNotifier = require('./electronReduxNotifier');
const reducer = require('./reducer');

const {pick} = require('./utils');

const isDev = require('electron-is-dev');

module.exports = (socket, ipcMain, windows) => {
  let middlewareEnhancer;

  if (isDev) {
    const logger = require('redux-logger').createLogger();
    middlewareEnhancer = applyMiddleware(
      thunk,
      tcpSocketMiddleware(socket),
      logger
    );
  } else {
    middlewareEnhancer = applyMiddleware(
      thunk,
      tcpSocketMiddleware(socket)
    )
  }

  store = createStore(
    reducer,
    undefined,
    compose(middlewareEnhancer, electronReduxNotifier(ipcMain, windows))
  )

  store.registerWindow = (windowName, windowStateKeys) => {
    windows = windows.map(window =>
      window.name === windowName ?
      {...window, windowStateKeys} :
      window
    )
    console.log('WINDOWS: ', windows);
  }

  store.unregisterWindow = windowName => {
    windows = windows.filter(window => window.name !== windowName)
    console.log('WINDOWS: ', windows);
  }

  ipcMain.on('window::req', (e, action) => {
    if (action.beingDispatchedFurther) {
      store.dispatch(action);
    } else {
      switch(action.type) {
        case 'HANDLE_INITIAL_STATE_GET': {
          store.registerWindow(action.windowName, action.payload);
          const initState = pick(store.getState(), action.payload);
          e.sender.send(`${action.windowName}::res`, initState);
          break;
        }
        // send other actions through the redux of main process
        default:
          
      }
    }
  })

  return store;
}
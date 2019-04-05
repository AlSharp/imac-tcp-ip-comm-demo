const {createStore, applyMiddleware, compose} = require('redux');
const thunk = require('redux-thunk').default;
const tcpSocketMiddleware = require('./tcpSocketMiddleware');
const electronReduxNotifier = require('./electronReduxNotifier');
const reducer = require('./reducer');

const isDev = require('electron-is-dev');

module.exports = (socket, ipcMain) => {
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
    compose(middlewareEnhancer, electronReduxNotifier(ipcMain))
  )

  ipcMain.on('window::req', (e, action) => {
    if (action.beingDispatchedFurther) {
      store.dispatch(action);
    } else {
      switch(action.type) {
        case 'HANDLE_INITIAL_STATE_GET': {
          const initState = store.getState();
          e.sender.send(`${action.windowId}::res`, initState);
          break;
        }
        // send other actions through the redux of main process
        default:
          
      }
    }
  })

  return store;
}
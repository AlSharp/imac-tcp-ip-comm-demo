const {createStore, applyMiddleware, compose} = require('redux');
const thunk = require('redux-thunk').default;
const cmdPortMiddleware = require('./cmdPortMiddleware');
const tcpSocketMiddleware = require('./tcpSocketMiddleware');
const electronReduxNotifier = require('./electronReduxNotifier');
const reducer = require('./reducer');

const {pick} = require('./utils');

const isDev = require('electron-is-dev');

module.exports = (socket, commandPort, ipcMain, windowStore) => {
  let middlewareEnhancer;

  if (isDev) {
    const logger = require('redux-logger').createLogger();
    middlewareEnhancer = applyMiddleware(
      thunk,
      cmdPortMiddleware(commandPort),
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
    compose(middlewareEnhancer, electronReduxNotifier(ipcMain, windowStore))
  )

  // sends each opened window its piece of redux store 
  ipcMain.on('window::req', (e, action) => {
    if (action.beingDispatchedFurther) {
      store.dispatch(action);
    } else {
      switch(action.type) {
        case 'HANDLE_INITIAL_STATE_GET': {
          windowStore.dispatch(
            {
              type: 'WINDOW_KEYS_AND_WEBCONTENT_ADD',
              payload: {
                windowName: action.windowName,
                windowStateKeys: action.payload,
                webContents: e.sender
              }
            }
          )
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
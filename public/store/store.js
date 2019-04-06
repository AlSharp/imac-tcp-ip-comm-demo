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

  store.windows = {};

  store.registerWindow = (windowId, windowStateKeys) => {
    store.windows = {...store.windows, [windowId]: windowStateKeys}
  }

  store.unregisterWindow = windowId => {
    let {[windowId]: unreg, ...res} = store.windows;
    store.windows = res;
  }

  const pick = (state, windowStateKeys) => {
    return windowStateKeys
              .map(key => key in state ? {[key]: state[key]} : {})
              .reduce((res, o) => Object.assign(res, o), {});
  }

  ipcMain.on('window::req', (e, action) => {
    if (action.beingDispatchedFurther) {
      store.dispatch(action);
    } else {
      switch(action.type) {
        case 'HANDLE_INITIAL_STATE_GET': {
          store.registerWindow(action.windowId, action.payload);
          console.log('WINDOWS: ', store.windows);
          const initState = pick(store.getState(), action.payload);
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
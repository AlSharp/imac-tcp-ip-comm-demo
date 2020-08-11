const asyncAction = (ipcRenderer, action) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('window::req', action);
    ipcRenderer.once(`${action.windowName}::res`, (e, res) => {
      if (res.actionError) {
        return reject(res);
      }
      return resolve(res);
    })
  })
}

const electronMiddleware = (ipcRenderer, windowName) => store => next => action => {
  if (action.local) {
    // local action; can update local and shared parts
    // store: {local: {}, shared: {}}
    next(action);
  } else {
    if (action.beingDispatchedFurther) {
      // this action will be unlinked, reduxNotifier will notifies us of any changes.
      // see window.js files. We listen to changes in componentDidMount() and dispatch action from there to update local redux store
      ipcRenderer.send('window::req', action);
      next(action);
    } else {
      switch(action.type) {
        case 'HANDLE_INITIAL_STATE_GET': {
          action.windowName = windowName;
          action.payload = Object.keys(store.getState().shared);
          asyncAction(ipcRenderer, action)
            .then(data => {
              action.payload = data;
              next(action);
            })
            .catch(error => {
              action.error = error;
              next(action);
            })
          break;
        }

        default:
          next(action);
      }
    }
  }
}

export default electronMiddleware;
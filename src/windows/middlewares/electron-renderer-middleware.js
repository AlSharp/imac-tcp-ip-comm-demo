const asyncAction = (ipcRenderer, action) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('window::req', action);
    ipcRenderer.once(`${action.windowId}::res`, (e, res) => {
      console.log('res: ', res);
      if (res.actionError) {
        return reject(res);
      }
      return resolve(res);
    })
  })
}

const electronMiddleware = (ipcRenderer, windowId) => store => next => action => {
  if (action.local) {
    // only local state - store: {local: {}, shared: {}}
    next(action);
  } else {
    if (action.beingDispatchedFurther) {
      // unref
      ipcRenderer.send('window::req', action);
      next(action);
    } else {
      switch(action.type) {
        case 'HANDLE_INITIAL_STATE_GET': {
          action.windowId = windowId;
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
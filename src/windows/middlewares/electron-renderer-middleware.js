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
      ipcRenderer.send('window::req', action);
      next(action);
    } else {
      action.windowId = windowId;
      asyncAction(ipcRenderer, action)
        .then(data => {
          action.payload = data;
          next(action);
        })
        .catch(error => {
          action.error = error;
          next(action);
        })
    }
  }
}

export default electronMiddleware;
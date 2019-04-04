const asyncAction = (ipcRenderer, windowId, action) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('window::req', {windowId, action});
    ipcRenderer.once(`${windowId}::res`, (e, res) => {
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
    next(action);
  } else {
    asyncAction(ipcRenderer, windowId, action)
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

export default electronMiddleware;
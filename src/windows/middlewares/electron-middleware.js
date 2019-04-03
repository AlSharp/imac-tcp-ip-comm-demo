const electronMiddleware = ipcRenderer => store => next => action => {
  next(action);
}

export default electronMiddleware;
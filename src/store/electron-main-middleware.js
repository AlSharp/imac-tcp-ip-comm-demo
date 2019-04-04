module.exports = ipcMain => store => next => action => {
  next(action);
}
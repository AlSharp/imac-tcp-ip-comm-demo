// notifies windows of changes
const BrowserWindow = require('electron').BrowserWindow;
const {pick} = require('./utils');

module.exports = (ipcMain, windowStore) => createStore => (
  reducer,
  initialState,
  enhancer
) => {
  const processedReducer = (state, action) => {
    const newState = reducer(state, action);
    const windows = windowStore.getWindows();
    for (let i = 0; i < windows.length; i++) {
      const windowSharedState = pick(newState, windows[i].windowStateKeys);
      windows[i].webContents.send('shared::update', windowSharedState);
    }
    return newState;
  }
  return createStore(processedReducer, initialState, enhancer)
}
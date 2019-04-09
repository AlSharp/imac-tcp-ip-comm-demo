const BrowserWindow = require('electron').BrowserWindow;
const {pick} = require('./utils');

module.exports = (ipcMain, windows) => createStore => (
  reducer,
  initialState,
  enhancer
) => {
  const processedReducer = (state, action) => {
    const newState = reducer(state, action);
    console.log('Browser Windows: ', BrowserWindow.getAllWindows());
    return newState;
  }
  return createStore(processedReducer, initialState, enhancer)
}
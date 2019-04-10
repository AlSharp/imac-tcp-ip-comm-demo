const BrowserWindow = require('electron').BrowserWindow;
const {pick} = require('./utils');

module.exports = (ipcMain, windowStore) => createStore => (
  reducer,
  initialState,
  enhancer
) => {
  const processedReducer = (state, action) => {
    const newState = reducer(state, action);
    console.log('WINDOWS: ', windowStore.getWindows());
    return newState;
  }
  return createStore(processedReducer, initialState, enhancer)
}
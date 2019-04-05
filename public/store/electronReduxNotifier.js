module.exports = ipcMain => createStore => (
  reducer,
  initialState,
  enhancer
) => {
  const processedReducer = (state, action) => {
    const newState = reducer(state, action);
    // actions
    console.log('ELECTRON REDUX NOTIFIES');
    return newState;
  }
  return createStore(processedReducer, initialState, enhancer)
}
const reducer = (windows, action) => {

  switch(action.type) {
    case 'WINDOW_ADD': {
      const {id, name, webContents} = action.payload;
      return [...windows, {id, name, webContents}]
    }
    case 'WINDOW_REMOVE': {
      return windows.filter(window => window.name !== action.payload)
    }
    case 'WINDOW_KEYS_ADD': {
      const {windowName, windowStateKeys} = action.payload;
      return windows.map(window =>
        window.name === windowName ?
        {...window, windowStateKeys} :
        window  
      )
    }
    default:
      return windows;
  }
}

const createStore = reducer => {
  let windows = [];

  const getWindows = () => windows;

  const dispatch = action => {
    windows = reducer(windows, action);
  }

  return {getWindows, dispatch};
}

module.exports = createStore(reducer);


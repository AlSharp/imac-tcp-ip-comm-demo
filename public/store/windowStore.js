const reducer = (windows, action) => {

  switch(action.type) {
    case 'WINDOW_ADD': {
      const {id, name, webContents} = action.payload;
      return [...windows, {id, name, webContents}]
    }
    case 'WINDOW_REMOVE': {
      return windows.filter(window => window.name !== action.payload)
    }
    case 'WINDOW_KEYS_AND_WEBCONTENT_ADD': {
      const {windowName, webContents, windowStateKeys} = action.payload;
      return windows.map(window =>
        window.name === windowName ?
        {...window, webContents, windowStateKeys} :
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
    let windowNames = windows.map(window => window.name);
    console.log(windowNames);
  }

  return {getWindows, dispatch};
}

module.exports = createStore(reducer);


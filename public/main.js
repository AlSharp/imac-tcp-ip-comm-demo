const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let connectionWindow;

app.on('ready', () => {
  // Initialize redux store
  const store = require('../src/store/store')(ipcMain);

  ipcMain.on('window::req', (e, info) => {
    const {action, windowId} = info;
    switch(action.type) {
      case 'HANDLE_INITIAL_STATE_GET': {
        const initState = store.getState();
        e.sender.send(`${windowId}::res`, initState);
        break;
      }
      default:
        console.log('main default')
        e.sender.send(`${windowId}::res`, {actionError: 'Action unregistered'});
    }
  })

  // Create main window
  mainWindow = new BrowserWindow(
    {
      title: 'IMAC TCP Client',
      webPreferences: {
        nodeIntegration: true
      }
    }
  );

  // Load html into window
  mainWindow.loadURL(isDev ?
    'http://localhost:3000?main' :
    `file://${path.join(__dirname, '../build/index.html?main')}`
  );

  // Quit app when closed
  mainWindow.on('closed', () => app.quit());

  // Prevent title from changing
  mainWindow.on('page-title-updated', e => e.preventDefault());

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
})

// handle create connection window

const handleConnectionWindowOpen = () => {
  connectionWindow = new BrowserWindow(
    {
      parent: mainWindow,
      modal: true,
      resizable: true,
      minimizable: false,
      maximizable: false,
      skipTaskbar: true,
      width: 245,
      height: 161,
      title: 'Establish TCP connection',
      webPreferences: {
        nodeIntegration: true
      }
    }
  );

  // remove menu
  // connectionWindow.setMenu(null);

  // Load html into window
  connectionWindow.loadURL(isDev ?
    'http://localhost:3000?connectionWindow' :
    `file://${path.join(__dirname, '../build/index.html?connectionWindow')}`
  );

  // Prevent title from changing
  connectionWindow.on('page-title-updated', e => e.preventDefault());

  // Garbage collection handle
  connectionWindow.on('close', () => {
    connectionWindow = null;
  })
}

// Catch connection:port:ip
ipcMain.on('connection:port:ip', (e, host) => {
  console.log(e);
  console.log(host);
})

// Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Connect',
        click: () => handleConnectionWindowOpen()
      },
      {
        label: 'Disconnect'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click: () => app.quit()
      }
    ]
  }
];

// If MAC, add empty object to menu
if(process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools
if(isDev) {
  mainMenuTemplate.push(
    {
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
          click: (item, focusedWindow) => focusedWindow.toggleDevTools()
        },
        {
          role: 'reload'
        }
      ]
    }
  );
}
const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const net = require('net');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let connectionWindow;

let socket = new net.Socket();

let windows = [];

// Initialize redux store
// store has registerWindow() and unregisterWindow() methods.
const store = require('./store/store')(socket, ipcMain, windows);

app.on('ready', () => {

  // Create main window
  mainWindow = new BrowserWindow(
    {
      title: 'IMAC TCP Client',
      webPreferences: {
        nodeIntegration: true
      },
      name: 'mainWindow'
    }
  );

  // Load html into window
  mainWindow.loadURL(isDev ?
    'http://localhost:3000?main' :
    `file://${path.join(__dirname, '../build/index.html?main')}`
  );

  mainWindow.on('show', () => {
    console.log('MAIN WINDOW SHOW');
    windows = windows.concat(
      {
        id: mainWindow.id,
        name: mainWindow.webContents.browserWindowOptions.name,
        webContents: mainWindow.webContents
      }
    )
    console.log('WINDOWS ON SHOW: ', windows);
  })

  mainWindow.show();

  // Prevent title from changing
  mainWindow.on('page-title-updated', e => e.preventDefault());

  // Quit app when closed
  mainWindow.on('closed', () => app.quit());

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
      },
      name: 'connectionWindow'
    }
  );

  // remove menu
  // connectionWindow.setMenu(null);

  // Load html into window
  connectionWindow.loadURL(isDev ?
    'http://localhost:3000?connectionWindow' :
    `file://${path.join(__dirname, '../build/index.html?connectionWindow')}`
  );

  connectionWindow.on('show', () => {
    console.log('CONNECTION WINDOW SHOW');
    windows = windows.concat(
      {
        id: connectionWindow.id,
        name: connectionWindow.webContents.browserWindowOptions.name,
        webContents: connectionWindow.webContents
      }
    )
  })

  // Prevent title from changing
  connectionWindow.on('page-title-updated', e => e.preventDefault());

  // Garbage collection handle
  connectionWindow.on('close', () => {
    store.unregisterWindow('connectionWindow');
    connectionWindow = null;
  })
}

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
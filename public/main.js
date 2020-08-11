const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const net = require('net');
// const commandPort = require('./ipserial/cmdport')();
const UsbSerial = require('./usbserial');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

// socket passed to redux middleware, but can be used here as well.
let socket = new net.Socket();

const usbSerial = new UsbSerial();

// stores windows
const windowStore = require('./store/windowStore');

// Initialize redux store
require('./store/store')(socket, null, usbSerial, ipcMain, windowStore);

app.on('ready', () => {

  // Create main window
  mainWindow = new BrowserWindow(
    {
      title: 'IMAC Motion Server Client',
      resizable: true,
      width: 474,
      height: 462,
      backgroundColor: '#F0F0F0',
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
    windowStore.dispatch(
      {
        type: 'WINDOW_ADD',
        payload: {
          id: mainWindow.id,
          name: mainWindow.webContents.browserWindowOptions.name
        }
      }
    )
  })

  // triggers show event
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

// Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
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
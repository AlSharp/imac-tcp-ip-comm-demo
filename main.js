const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let connectionWindow;

app.on('ready', () => {
  // Create main window
  mainWindow = new BrowserWindow(
    {
      webPreferences: {
        nodeIntegration: true
      }
    }
  );

  // Load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file',
    slashes: true
  }));

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
      width: 300,
      height: 200,
      title: 'Establish TCP connection',
      webPreferences: {
        nodeIntegration: true
      }
    }
  );

  // Load html into window
  connectionWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'connectionWindow.html'),
    protocol: 'file',
    slashes: true
  }));

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
if(process.env.NODE_ENV !== 'production') {
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
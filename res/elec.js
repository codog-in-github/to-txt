const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { preloadJs, templateDir, distDir } = require('./filePath');
const os = require('os');
const path = require('path');
const fs = require('fs');
const tra = require('./tra');
const allowMac = require('./mac');

const vals =  Object.values(
  os.networkInterfaces()
);
if(!vals.some(
  item => item.some(
    item => allowMac.includes(
      item.mac.toLocaleUpperCase()
    )
  )
)) {
  throw new Error('HELLO :-)');
}

function createWin () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadJs,
    }
  });
  Menu.setApplicationMenu(null);

  ipcMain.handle('transform', async (_, tpl, extra) => {
    return tra(tpl, extra);
  });

  ipcMain.handle('getTemplate', async () => {
    return fs.readdirSync(templateDir)
      .filter(name => /\.txt$/.test(name));
  });

  if(app.isPackaged) {
    win.loadFile(path.resolve(distDir, 'index.html'));
  } else {
    win.loadURL('http://localhost:8080');
    win.webContents.openDevTools({ mode: 'undocked' });
  }
}
app.whenReady().then(createWin);
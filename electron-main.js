const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    frame: true, // Set to false if implementing custom title bar
    backgroundColor: '#0A0E27',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For demo purposes; use preload in production
      webSecurity: false
    },
    title: 'OnePlus 7 Pro // crDroid Flasher'
  });

  // Load React app
  // In development:
  // win.loadURL('http://localhost:3000');
  // In production:
  win.loadFile(path.join(__dirname, 'build/index.html'));
  
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for ADB
ipcMain.handle('adb-command', async (event, command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.warn(`exec error: ${error}`);
        // ADB often returns exit code 1 even on partial success or specific states, 
        // so we resolve stdout/stderr anyway, but might want to flag it.
      }
      resolve(stdout ? stdout : stderr);
    });
  });
});
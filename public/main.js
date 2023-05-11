const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('path');
const axios = require('axios');
//const isDev = require('electron-is-dev');
const isDev = app.isPackaged ? false : require('electron-is-dev');
const Store = require('electron-store');

const store = new Store();
const fs = require('fs');

let win;

ipcMain.handle('get-file-data', async (event, filePath) => {
    const data = fs.readFileSync(filePath);
    return data;
});

if (isDev) {
    // eslint-disable-next-line global-require
    require('electron-reloader')(module, {
        watchRenderer: true,
    });
}

ipcMain.handle('open-file-dialog', async (event, options) => {
    const result = await dialog.showOpenDialog(options);
    return result.filePaths;
});

ipcMain.handle('getStore', () => {
    // Return the Electron store instance to the renderer process
    return store;
});

ipcMain.handle('getUsername', () => {
    // Return only the username from the Electron store instance
    return store.get('username');
});

ipcMain.handle('getId', () => {
    // Return only the username from the Electron store instance
    return store.get('userId');
});

ipcMain.handle('getToken', () => {
    // Return only the username from the Electron store instance
    return store.get('token');
});

ipcMain.handle('setCredentials', async (event, { token, userId, username }) => {
    if (token !== null && token !== undefined) {
        store.set('token', token);
    } else {
        store.delete('token');
    }

    if (userId !== null && userId !== undefined) {
        store.set('userId', userId);
    } else {
        store.delete('userId');
    }

    if (username !== null && username !== undefined) {
        store.set('username', username);
    } else {
        store.delete('username');
    }
});


ipcMain.handle('getCredentials', async () => {
    const token = store.get('token');
    const userId = store.get('userId');
    const userName = store.get('username');

    return { token, userId, userName };
});

ipcMain.handle('clearCredentials', async () => {
    store.delete('token');
    store.delete('userId');
    store.delete('username');
});

ipcMain.handle('logout', async () => {
    console.log("Logout called in main process");
    store.delete('token');
    store.delete('userId');
    store.delete('username');
    return "Logged out";
});

ipcMain.handle('get-window-size', (event) => {
    return win.getSize();
});


function createWindow() {
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    // Calculate the initial window size based on the screen size
    const windowWidth = Math.round(screenWidth * 0.8); // Set width to 80% of the screen width
    const windowHeight = Math.round(screenHeight * 0.8); // Set height to 80% of the screen height


    win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight, // Adjust height as needed
        minWidth: 1300, // Set minimum width (optional)
        minHeight: 800, // Set minimum height (optional)
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            //preload: path.join(app.getAppPath(), 'public', 'preload.js'), //devdeyken çalışan
            //preload: path.join(app.getAppPath(), 'build', 'preload.js'), // winde setupla çalışan
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false
        },
    });
    win.webContents.openDevTools();

    const url = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    win.on('resize', () => {
        win.webContents.send('window-resize', win.getSize());
    });

    win.loadURL(url);
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
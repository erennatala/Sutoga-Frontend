const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

const store = new Store();

if (isDev) {
    // eslint-disable-next-line global-require
    require('electron-reloader')(module, {
        watchRenderer: true,
    });
}

ipcMain.handle('setCredentials', async (event, { token, userId, userName }) => {
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

    if (userName !== null && userName !== undefined) {
        store.set('userName', userName);
    } else {
        store.delete('userName');
    }
});


ipcMain.handle('getCredentials', async () => {
    const token = store.get('token');
    const userId = store.get('userId');
    const userName = store.get('userName');

    return { token, userId, userName };
});

ipcMain.handle('clearCredentials', async () => {
    store.delete('token');
    store.delete('userId');
    store.delete('userName');
});

ipcMain.handle('logout', async () => {
    console.log("Logout called in main process");
    store.delete('token');
    store.delete('userId');
    store.delete('userName');
    return "Logged out";
});



function createWindow() {
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    // Calculate the initial window size based on the screen size
    const windowWidth = Math.round(screenWidth * 0.8); // Set width to 80% of the screen width
    const windowHeight = Math.round(screenHeight * 0.8); // Set height to 80% of the screen height


    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight, // Adjust height as needed
        minWidth: 1300, // Set minimum width (optional)
        minHeight: 800, // Set minimum height (optional)
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(app.getAppPath(), 'public', 'preload.js'),
        },
    });
    win.webContents.openDevTools();

    const url = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`;

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
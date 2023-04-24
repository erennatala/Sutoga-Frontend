const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

if (isDev) {
    require('electron-reloader')(module, {
        watchRenderer: true,
    });
}

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
            contextIsolation: false,
        },
    });

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

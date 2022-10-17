import { app, BrowserWindow, ipcMain, session } from 'electron';
import { fetchPosts } from './api/Instagram';
import settings from './settings.json';
import { processLog } from './api/log';

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}


const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
        fullscreen: !!app.isPackaged,
        frame: !app.isPackaged,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    const startFetchLoop = () => {
        fetchPosts()
            .then((data) => mainWindow.webContents.send('listenToData', data.data))
            .catch((error) => {
                processLog.error('fetch loop error', error)
            })
            .finally(() => setInterval(startFetchLoop, settings.updateIntervalInSeconds * 100));
    };

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then(startFetchLoop);

    // Open the DevTools.
    !app.isPackaged && mainWindow.webContents.openDevTools();

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ["script-src 'self' 'unsafe-eval' 'unsafe-inline'", "img-src 'self' * data: "]
            }
        })
    })

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('action-bar', (event, arg) => {
    if (arg === 'close') {
        app.quit();
    }
    if (arg === 'minimalize') {
        app.focus();
    }

});


app.setLoginItemSettings({
    openAtLogin: true,
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

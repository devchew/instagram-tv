import { BrowserWindow, session } from 'electron';
import secrets from '../../secrets';

const appId = secrets.INSTAGRAM_APP_ID;
const redirectUri = 'https://localhost/auth'

export const InstagramAuthWindow: () => Promise<string> = () => new Promise((resolve, reject) => {

    let code = '';

    let authWindow = new BrowserWindow({
        width: 600,
        height: 800,
        show: false,
        alwaysOnTop: true,
        center: true,
        modal: true,
        skipTaskbar: true,
        titleBarStyle: 'hidden',

    });

    authWindow.focus()
    const focusInterval = setInterval(() => authWindow.focus(), 5000);
    // This is just an example url - follow the guide for whatever service you are using
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ["script-src 'self' 'unsafe-eval' 'unsafe-inline'", "img-src 'self' * data: "]
            }
        })
    })

    authWindow.loadURL(authUrl);
    authWindow.show();
    // 'will-navigate' is an event emitted when the window.location changes
    // newUrl should contain the tokens you need
    authWindow.webContents.on('will-navigate', function (event, newUrl) {
        const url = new URL(newUrl);
        if (url.host === 'localhost' && url.pathname === '/auth' && url.searchParams.get('code')) {
            code = url.searchParams.get('code');
            resolve(code);
            authWindow.close();
        }
    });

    authWindow.on('closed', function() {
        authWindow = null;
        clearInterval(focusInterval)
        if (code) {
            resolve(code)
        }
        reject()
    });
})


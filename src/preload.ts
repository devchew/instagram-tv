const { ipcRenderer, contextBridge } = require('electron');

export type Bridge = typeof api

const api = {
  api: {
    close: () => ipcRenderer.send('action-bar', 'close'),
    listenToData: (calback: (value: any[]) => void) => ipcRenderer.on('listenToData', (event, value) => calback(value)),
  }
}

contextBridge.exposeInMainWorld('electron', api);

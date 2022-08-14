const { ipcRenderer, contextBridge } = require('electron');

export type Bridge = typeof api

const api = {
  api: {
    close: () => ipcRenderer.send('action-bar', 'close')
  }
}

contextBridge.exposeInMainWorld('electron', api);

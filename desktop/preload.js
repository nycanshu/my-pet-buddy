const { contextBridge, ipcRenderer } = require('electron');

// Minimal, allow-listed API surface (Facade). No raw ipcRenderer in renderers.
contextBridge.exposeInMainWorld('petBuddy', {
  settings: {
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    get: (key) => ipcRenderer.invoke('settings:get', key),
    set: (key, value) => ipcRenderer.invoke('settings:set', { key, value }),
    onChange: (cb) => ipcRenderer.on('settings:changed', (_e, payload) => cb(payload)),
  },
  overlay: {
    setInteractive: (bool) => ipcRenderer.send('overlay:setInteractive', bool),
  },
  ui: {
    openSettings: () => ipcRenderer.send('ui:openSettings'),
    togglePet: () => ipcRenderer.send('ui:togglePet'),
  },
});

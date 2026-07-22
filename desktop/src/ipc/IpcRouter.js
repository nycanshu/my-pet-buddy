const { ipcMain } = require('electron');

// One place to see the whole main<->renderer contract.
class IpcRouter {
  constructor({ store, overlayManager, onOpenSettings, onTogglePet }) {
    this.store = store;
    this.overlayManager = overlayManager;
    this.onOpenSettings = onOpenSettings;
    this.onTogglePet = onTogglePet;
  }

  register() {
    ipcMain.handle('settings:getAll', () => this.store.getAll());
    ipcMain.handle('settings:get', (_e, key) => this.store.get(key));
    ipcMain.handle('settings:set', (_e, { key, value }) => {
      this.store.set(key, value);
      return true;
    });
    ipcMain.on('overlay:setInteractive', (_e, bool) => this.overlayManager.setInteractive(bool));
    ipcMain.on('ui:openSettings', () => this.onOpenSettings());
    ipcMain.on('ui:togglePet', () => this.onTogglePet());
  }
}

module.exports = { IpcRouter };

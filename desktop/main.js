const { app, BrowserWindow, nativeTheme } = require('electron');
const { SettingsStore } = require('./src/store/SettingsStore');
const { createElectronStoreBackend } = require('./src/store/electronStoreBackend');
const { DEFAULTS } = require('./src/store/defaults');
const { OverlayWindowManager } = require('./src/windows/OverlayWindowManager');
const { SettingsWindowManager } = require('./src/windows/SettingsWindowManager');
const { IpcRouter } = require('./src/ipc/IpcRouter');
const { TrayController } = require('./src/tray/TrayController');
const { LaunchAgent } = require('./src/system/LaunchAgent');
const { UpdaterService } = require('./src/update/UpdaterService');

class AppController {
  constructor() {
    this.store = new SettingsStore(createElectronStoreBackend(), DEFAULTS);
    this.overlay = new OverlayWindowManager();
    this.settingsWindow = new SettingsWindowManager();
    this.launchAgent = new LaunchAgent();
    this.updater = new UpdaterService();
  }

  start() {
    const gotLock = app.requestSingleInstanceLock();
    if (!gotLock) { app.quit(); return; }

    app.whenReady().then(() => {
      if (process.platform === 'darwin' && app.dock) app.dock.hide();

      this.overlay.create();

      // Broadcast store changes to the overlay renderer.
      this.store.on('change', (payload) => {
        if (this.overlay.win && !this.overlay.win.isDestroyed()) {
          this.overlay.win.webContents.send('settings:changed', payload);
        }
      });

      const router = new IpcRouter({
        store: this.store,
        overlayManager: this.overlay,
        onOpenSettings: () => this.settingsWindow.open(),
        onTogglePet: () => this._togglePet(),
      });
      router.register();

      this.tray = new TrayController({
        store: this.store,
        onToggle: () => this._togglePet(),
        onOpenSettings: () => this.settingsWindow.open(),
        onToggleLaunch: (checked) => this.store.set('launchOnLogin', checked),
        onQuit: () => app.quit(),
      });
      this.tray.build();

      this.launchAgent.set(this.store.get('launchOnLogin'));
      this.store.on('change', ({ key, value }) => {
        if (key === 'launchOnLogin') this.launchAgent.set(value);
      });

      if (app.isPackaged) this.updater.start();
    });

    app.on('window-all-closed', () => {}); // tray-resident; never auto-quit
  }

  _togglePet() {
    const enabled = !this.store.get('enabled');
    this.store.set('enabled', enabled);
    enabled ? this.overlay.show() : this.overlay.hide();
  }
}

new AppController().start();

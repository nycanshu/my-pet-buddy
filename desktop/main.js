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
      this.settingsWindow.create(); // pre-create the popover so it opens instantly & flicker-free

      // Single source of truth for reacting to setting changes.
      this.store.on('change', (payload) => {
        const { key, value } = payload;
        // 1) forward every change to the overlay renderer
        if (this.overlay.win && !this.overlay.win.isDestroyed()) {
          this.overlay.win.webContents.send('settings:changed', payload);
        }
        // 2) 'enabled' consistently shows/hides the pet — no matter whether it
        //    was toggled from the tray menu or the popover's header switch.
        if (key === 'enabled') {
          value ? this.overlay.show() : this.overlay.hide();
        }
        // 3) launch-at-login reflects to the OS
        if (key === 'launchOnLogin') {
          this.launchAgent.set(value);
        }
      });

      const router = new IpcRouter({
        store: this.store,
        overlayManager: this.overlay,
        onOpenSettings: () => this.settingsWindow.toggle(),
        onTogglePet: () => this._togglePet(),
      });
      router.register();

      this.tray = new TrayController({
        store: this.store,
        onToggle: () => this._togglePet(),
        onOpenPanel: (bounds) => this.settingsWindow.toggle(bounds),
        onToggleLaunch: (checked) => this.store.set('launchOnLogin', checked),
        onQuit: () => app.quit(),
      });
      this.tray.build();

      // Reflect persisted enabled/launch state on startup.
      this.launchAgent.set(this.store.get('launchOnLogin'));
      if (this.store.get('enabled')) this.overlay.show(); else this.overlay.hide();

      if (app.isPackaged) this.updater.start();
    });

    app.on('window-all-closed', () => {}); // tray-resident; never auto-quit
  }

  _togglePet() {
    // Just flip the flag — the store 'change' handler does the show/hide,
    // so tray and popover toggles behave identically.
    this.store.set('enabled', !this.store.get('enabled'));
  }
}

new AppController().start();

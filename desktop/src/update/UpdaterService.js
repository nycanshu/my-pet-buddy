const { autoUpdater } = require('electron-updater');

// Thin wrapper over electron-updater targeting GitHub Releases.
// Failures are logged and swallowed — updates must never block the pet.
class UpdaterService {
  constructor() {
    this._interval = null;
    this.CHECK_EVERY_MS = 6 * 60 * 60 * 1000; // every 6 hours
  }

  start() {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.on('error', (err) => {
      console.error('[updater]', err && err.message ? err.message : err);
    });
    this._check();
    this._interval = setInterval(() => this._check(), this.CHECK_EVERY_MS);
  }

  _check() {
    try {
      autoUpdater.checkForUpdates();
    } catch (err) {
      console.error('[updater] check failed', err && err.message);
    }
  }
}

module.exports = { UpdaterService };

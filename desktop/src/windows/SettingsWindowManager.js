const { BrowserWindow } = require('electron');
const path = require('path');

class SettingsWindowManager {
  constructor() { this.win = null; }

  open() {
    if (this.win && !this.win.isDestroyed()) { this.win.focus(); return; }
    const isMac = process.platform === 'darwin';
    this.win = new BrowserWindow({
      width: 400, height: 560, resizable: false, show: false,
      title: 'My Pet Buddy',
      titleBarStyle: isMac ? 'hiddenInset' : 'default',
      vibrancy: isMac ? 'sidebar' : undefined,
      backgroundColor: isMac ? '#00000000' : '#f8f9fa',
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload.js'),
        contextIsolation: true, nodeIntegration: false,
      },
    });
    this.win.loadFile(path.join(__dirname, '..', '..', 'settings', 'popup.html'));
    this.win.once('ready-to-show', () => this.win.show());
  }

  close() { if (this.win && !this.win.isDestroyed()) this.win.close(); }
}

module.exports = { SettingsWindowManager };

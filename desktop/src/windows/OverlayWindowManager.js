const { BrowserWindow, screen } = require('electron');
const path = require('path');

class OverlayWindowManager {
  constructor() { this.win = null; }

  create() {
    const { workArea } = screen.getPrimaryDisplay();
    this.win = new BrowserWindow({
      x: workArea.x, y: workArea.y, width: workArea.width, height: workArea.height,
      transparent: true, frame: false, resizable: false, movable: false,
      focusable: false, skipTaskbar: true, hasShadow: false, alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload.js'),
        contextIsolation: true, nodeIntegration: false,
      },
    });
    this.win.setIgnoreMouseEvents(true, { forward: true });
    this.win.setAlwaysOnTop(true, 'screen-saver');
    if (process.platform === 'darwin') {
      this.win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }
    this.win.loadFile(path.join(__dirname, '..', '..', 'overlay', 'overlay.html'));

    // Keep the overlay fitted to the primary display on ANY display change:
    // resolution/scaling change, or a monitor being plugged in / unplugged.
    const refit = () => this.applyDisplayBounds();
    screen.on('display-metrics-changed', refit);
    screen.on('display-added', refit);
    screen.on('display-removed', refit);
    return this.win;
  }

  applyDisplayBounds() {
    if (!this.win) return;
    const { workArea } = screen.getPrimaryDisplay();
    this.win.setBounds(workArea);
  }

  setInteractive(bool) {
    if (this.win) this.win.setIgnoreMouseEvents(!bool, { forward: true });
  }

  show() { if (this.win) this.win.showInactive(); }
  hide() { if (this.win) this.win.hide(); }
}

module.exports = { OverlayWindowManager };

const { BrowserWindow, screen, nativeTheme } = require('electron');
const path = require('path');

// A macOS-style menu-bar popover panel.
//
// Instead of opening a separate app window (which flickers because it is
// re-created and re-laid-out each time), this is a single frameless window
// created ONCE at startup and simply shown/hidden. It anchors under the tray
// icon and hides on blur — exactly like native menu-bar utilities.
class SettingsWindowManager {
  constructor() {
    this.win = null;
    this._hiddenAt = 0;
  }

  create() {
    if (this.win && !this.win.isDestroyed()) return this.win;
    const isMac = process.platform === 'darwin';
    this.win = new BrowserWindow({
      width: 400,
      height: 600,
      show: false,
      frame: false,
      resizable: false,
      movable: false,
      skipTaskbar: true,
      fullscreenable: false,
      alwaysOnTop: true,
      roundedCorners: true,
      hasShadow: true,
      // Paint an on-theme background so the very first open has no white flash.
      backgroundColor: nativeTheme.shouldUseDarkColors ? '#1e2733' : '#f8f9fa',
      vibrancy: isMac ? 'menu' : undefined,
      visualEffectState: 'active',
      webPreferences: {
        preload: path.join(__dirname, '..', '..', 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    // Sit above the pet overlay (which uses the 'screen-saver' level).
    this.win.setAlwaysOnTop(true, 'screen-saver');
    // Appear on the CURRENT Space — including when another app is fullscreen —
    // instead of yanking the user back to the desktop Space where the window lives.
    if (isMac) {
      this.win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }
    this.win.loadFile(path.join(__dirname, '..', '..', 'settings', 'popup.html'));
    // Native popover behaviour: dismiss when the user clicks away.
    this.win.on('blur', () => this.hide());
    return this.win;
  }

  toggle(anchorBounds) {
    if (!this.win || this.win.isDestroyed()) this.create();
    if (this.win.isVisible()) {
      this.hide();
      return;
    }
    // If the icon click just caused a blur-hide (<300ms ago), treat this click
    // as "close" and don't immediately reopen.
    if (Date.now() - this._hiddenAt < 300) return;
    this.show(anchorBounds);
  }

  show(anchorBounds) {
    if (!this.win || this.win.isDestroyed()) this.create();
    this._position(anchorBounds);
    this.win.show();
    this.win.focus();
  }

  hide() {
    if (this.win && !this.win.isDestroyed() && this.win.isVisible()) {
      this._hiddenAt = Date.now();
      this.win.hide();
    }
  }

  // Anchor the panel to the menu-bar icon: horizontally centered under it,
  // vertically FLUSH against the menu bar (no gap) — like a native popover.
  _position(anchorBounds) {
    const { width, height } = this.win.getBounds();
    const hasBounds = anchorBounds && anchorBounds.width;
    const cursor = screen.getCursorScreenPoint();
    // Horizontal anchor: icon center if we have real bounds, else the cursor
    // (the click landed on the icon, so cursor.x ≈ icon center).
    const anchorX = hasBounds ? anchorBounds.x + anchorBounds.width / 2 : cursor.x;
    const refPoint = hasBounds ? { x: anchorBounds.x, y: anchorBounds.y } : cursor;
    const disp = screen.getDisplayNearestPoint(refPoint).workArea;

    let x = Math.round(anchorX - width / 2);
    x = Math.max(disp.x + 8, Math.min(x, disp.x + disp.width - width - 8));

    // workArea starts just below the menu bar, so disp.y = flush under it (mac).
    // On Windows the taskbar is at the bottom, so sit just above it.
    const nearTop = refPoint.y < disp.y + disp.height / 2;
    const y = nearTop ? disp.y : disp.y + disp.height - height;

    this.win.setPosition(x, y, false);
  }
}

module.exports = { SettingsWindowManager };

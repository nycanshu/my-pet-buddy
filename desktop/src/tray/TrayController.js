const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

class TrayController {
  constructor({ store, onToggle, onOpenSettings, onToggleLaunch, onQuit }) {
    this.store = store;
    this.onToggle = onToggle;
    this.onOpenSettings = onOpenSettings;
    this.onToggleLaunch = onToggleLaunch;
    this.onQuit = onQuit;
    this.tray = null;
  }

  build() {
    const icon = nativeImage.createFromPath(
      path.join(__dirname, '..', '..', 'assets', 'icons', 'icon32.png')
    ).resize({ width: 18, height: 18 });
    if (process.platform === 'darwin') icon.setTemplateImage(true);

    this.tray = new Tray(icon);
    this.tray.setToolTip('My Pet Buddy');
    this.refreshMenu();
    this.store.on('change', ({ key }) => {
      if (key === 'enabled' || key === 'launchOnLogin') this.refreshMenu();
    });
  }

  refreshMenu() {
    const enabled = this.store.get('enabled');
    const menu = Menu.buildFromTemplate([
      { label: enabled ? 'Hide Pet' : 'Show Pet', click: () => this.onToggle() },
      { label: 'Settings…', click: () => this.onOpenSettings() },
      { type: 'separator' },
      { label: 'Launch at Login', type: 'checkbox',
        checked: this.store.get('launchOnLogin'),
        click: (item) => this.onToggleLaunch(item.checked) },
      { type: 'separator' },
      { label: 'Quit My Pet Buddy', click: () => this.onQuit() },
    ]);
    this.tray.setContextMenu(menu);
  }
}

module.exports = { TrayController };

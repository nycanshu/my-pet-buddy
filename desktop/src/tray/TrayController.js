const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

// Menu-bar / system-tray controller.
// Left-click  -> toggle the popover panel (anchored under the icon).
// Right-click -> quick context menu (Show/Hide, Settings, Launch at Login, Quit).
// The icon itself is the currently selected pet, so it reads well on light and
// dark menu bars and reflects the user's choice.
class TrayController {
  constructor({ store, onToggle, onOpenPanel, onToggleLaunch, onQuit }) {
    this.store = store;
    this.onToggle = onToggle;
    this.onOpenPanel = onOpenPanel;
    this.onToggleLaunch = onToggleLaunch;
    this.onQuit = onQuit;
    this.tray = null;
  }

  build() {
    this.tray = new Tray(this._petIcon());
    this.tray.setToolTip('My Pet Buddy');

    // NOTE: deliberately no setContextMenu() — that would hijack left-click.
    this.tray.on('click', () => this.onOpenPanel(this.tray.getBounds()));
    this.tray.on('right-click', () => this.tray.popUpContextMenu(this._contextMenu()));

    this.store.on('change', ({ key }) => {
      if (key === 'species' || key === 'variant') this.tray.setImage(this._petIcon());
    });
  }

  _petIcon() {
    const species = this.store.get('species');
    const variant = this.store.get('variant');
    const petPath = path.join(__dirname, '..', '..', 'assets', 'pets', `${species}-${variant}.png`);
    let img = nativeImage.createFromPath(petPath);
    if (img.isEmpty()) {
      img = nativeImage.createFromPath(path.join(__dirname, '..', '..', 'assets', 'icons', 'icon32.png'));
    }
    img = img.resize({ width: 20, height: 20 });
    img.setTemplateImage(false); // keep the pet's colors (reads on both light & dark bars)
    return img;
  }

  _contextMenu() {
    const enabled = this.store.get('enabled');
    return Menu.buildFromTemplate([
      { label: enabled ? 'Hide Pet' : 'Show Pet', click: () => this.onToggle() },
      { label: 'Settings…', click: () => this.onOpenPanel(this.tray.getBounds()) },
      { type: 'separator' },
      {
        label: 'Launch at Login',
        type: 'checkbox',
        checked: this.store.get('launchOnLogin'),
        click: (item) => this.onToggleLaunch(item.checked),
      },
      { type: 'separator' },
      { label: 'Quit My Pet Buddy', click: () => this.onQuit() },
    ]);
  }
}

module.exports = { TrayController };

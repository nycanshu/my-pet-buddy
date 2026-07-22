const { app } = require('electron');

// Cross-platform launch-at-login wrapper.
class LaunchAgent {
  set(enabled) {
    app.setLoginItemSettings({ openAtLogin: !!enabled, openAsHidden: true });
  }
  get() {
    return app.getLoginItemSettings().openAtLogin;
  }
}

module.exports = { LaunchAgent };

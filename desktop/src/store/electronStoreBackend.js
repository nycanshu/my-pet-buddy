const Store = require('electron-store');
const { DEFAULTS } = require('./defaults');

// Production backend: persists to a JSON file in userData.
// Returns an object matching the SettingsStore backend contract.
function createElectronStoreBackend() {
  const store = new Store({ name: 'settings', defaults: DEFAULTS });
  return {
    get: (key) => store.get(key),
    set: (key, value) => store.set(key, value),
  };
}

module.exports = { createElectronStoreBackend };

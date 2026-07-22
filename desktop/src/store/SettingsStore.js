const { EventEmitter } = require('node:events');

// Observable settings facade over an injected backend (DI for testability).
// backend contract: get(key) -> value|undefined, set(key, value) -> void
class SettingsStore extends EventEmitter {
  constructor(backend, defaults) {
    super();
    this._backend = backend;
    this._defaults = defaults;
  }

  get(key) {
    const v = this._backend.get(key);
    return v === undefined ? this._defaults[key] : v;
  }

  set(key, value) {
    // No-op if unchanged: avoids redundant writes and a storm of 'change'
    // broadcasts when the settings UI re-saves every key on each interaction.
    if (this.get(key) === value) return;
    this._backend.set(key, value);
    this.emit('change', { key, value });
  }

  getAll() {
    const out = { ...this._defaults };
    for (const key of Object.keys(this._defaults)) {
      const v = this._backend.get(key);
      if (v !== undefined) out[key] = v;
    }
    return out;
  }
}

module.exports = { SettingsStore };

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

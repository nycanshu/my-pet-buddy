const test = require('node:test');
const assert = require('node:assert');
const { SettingsStore } = require('../src/store/SettingsStore');
const { DEFAULTS } = require('../src/store/defaults');

// In-memory backend fake implementing the backend contract: get/set.
function fakeBackend(initial = {}) {
  const data = { ...initial };
  return {
    get: (k) => data[k],
    set: (k, v) => { data[k] = v; },
    _data: data,
  };
}

test('get returns default when unset', () => {
  const store = new SettingsStore(fakeBackend(), DEFAULTS);
  assert.strictEqual(store.get('species'), 'cat');
  assert.strictEqual(store.get('enabled'), true);
});

test('get returns stored value over default', () => {
  const store = new SettingsStore(fakeBackend({ species: 'dog' }), DEFAULTS);
  assert.strictEqual(store.get('species'), 'dog');
});

test('set persists and emits change', () => {
  const backend = fakeBackend();
  const store = new SettingsStore(backend, DEFAULTS);
  const events = [];
  store.on('change', (e) => events.push(e));
  store.set('variant', 4);
  assert.strictEqual(backend._data.variant, 4);
  assert.deepStrictEqual(events, [{ key: 'variant', value: 4 }]);
});

test('getAll merges defaults with stored', () => {
  const store = new SettingsStore(fakeBackend({ theme: 'dark' }), DEFAULTS);
  const all = store.getAll();
  assert.strictEqual(all.theme, 'dark');
  assert.strictEqual(all.species, 'cat');
});

test('set is a no-op (no emit) when the value is unchanged', () => {
  const store = new SettingsStore(fakeBackend({ species: 'dog' }), DEFAULTS);
  const events = [];
  store.on('change', (e) => events.push(e));
  store.set('species', 'dog');   // same as stored
  store.set('enabled', true);    // same as default
  assert.deepStrictEqual(events, []);
  store.set('species', 'cat');   // real change
  assert.deepStrictEqual(events, [{ key: 'species', value: 'cat' }]);
});

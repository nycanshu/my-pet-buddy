const test = require('node:test');
const assert = require('node:assert');
const { nextStep } = require('../src/walker/pacing');

test('moves right by speed when heading right', () => {
  const s = nextStep({ x: 100, dir: 1, min: 0, max: 500, speed: 10 });
  assert.deepStrictEqual(s, { x: 110, dir: 1 });
});

test('flips direction at the right edge and stays in bounds', () => {
  const s = nextStep({ x: 495, dir: 1, min: 0, max: 500, speed: 10 });
  assert.strictEqual(s.dir, -1);
  assert.ok(s.x <= 500, 'x must not exceed max');
});

test('flips direction at the left edge and stays in bounds', () => {
  const s = nextStep({ x: 3, dir: -1, min: 0, max: 500, speed: 10 });
  assert.strictEqual(s.dir, 1);
  assert.ok(s.x >= 0, 'x must not go below min');
});

test('moves left by speed when heading left', () => {
  const s = nextStep({ x: 100, dir: -1, min: 0, max: 500, speed: 10 });
  assert.deepStrictEqual(s, { x: 90, dir: -1 });
});

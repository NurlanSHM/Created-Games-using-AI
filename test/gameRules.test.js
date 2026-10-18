import assert from 'node:assert/strict';
import test from 'node:test';

import { isUpgradeAffordable } from '../src/gameRules.js';

test('an upgrade is affordable when the balance exactly covers its cost', () => {
  assert.equal(isUpgradeAffordable(200, 200), true);
});

test('an upgrade is not affordable when the balance is below its cost', () => {
  assert.equal(isUpgradeAffordable(199, 200), false);
});

test('an upgrade is affordable when the balance exceeds its cost', () => {
  assert.equal(isUpgradeAffordable(250, 200), true);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserModules } = require('./helpers');

function course(lessons = {}) {
  return loadBrowserModules(['data/lessons.js'], { App: { state: { lessons } } });
}

test('the ordered path remains locked until the previous knowledge check passes', () => {
  const context = course();
  assert.equal(context.Path.phaseUnlocked(1), true);
  assert.equal(context.Path.phaseUnlocked(2), false);
  context.App.state.lessons['gate:phase-1'] = true;
  assert.equal(context.Path.phaseUnlocked(2), true);
});

test('path progress counts only the phase items and exposes capability outcomes', () => {
  const context = course({ 'phonics:p1-vowels': true, 'scenario:extra': true });
  const progress = context.Path.phaseProgress(1);
  assert.equal(progress.done, 1);
  assert.equal(progress.total, 8);
  assert.equal(context.PHASES.length, 8);
  assert.equal(context.PHASES.filter(phase => !phase.final).length, 7);
  assert.ok(context.PHASES.every(phase => Array.isArray(phase.canDo) && phase.canDo.length >= 2));
});

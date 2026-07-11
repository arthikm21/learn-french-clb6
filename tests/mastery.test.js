const test = require('node:test');
const assert = require('node:assert/strict');
const { createLocalStorage, loadBrowserModules } = require('./helpers');

function mastery() {
  const localStorage = createLocalStorage({ fr_current_user_v2: 'learner' });
  const context = loadBrowserModules(['modules/storage.js', 'modules/mastery.js'], { localStorage });
  return context.Mastery;
}

test('assessed attempts preserve the best result and only master at threshold', () => {
  const Mastery = mastery();
  let record = Mastery.recordAttempt('listen:daily', { score: 52, threshold: 70 });
  assert.equal(record.status, 'building');
  assert.equal(record.attempts, 1);
  record = Mastery.recordAttempt('listen:daily', { score: 78, threshold: 70 });
  assert.equal(record.status, 'mastered');
  assert.equal(record.best, 78);
  record = Mastery.recordAttempt('listen:daily', { score: 60, threshold: 70 });
  assert.equal(record.status, 'mastered');
  assert.equal(record.best, 78);
  assert.equal(record.last, 60);
  assert.equal(record.attempts, 3);
});

test('ungraded work is recorded as practice without inventing a score', () => {
  const Mastery = mastery();
  const record = Mastery.recordPractice('speak:greetings', { kind: 'self-rated-shadowing' });
  assert.equal(record.status, 'practiced');
  assert.equal(record.history[0].score, null);
  assert.equal(record.history[0].kind, 'self-rated-shadowing');
});

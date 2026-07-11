const test = require('node:test');
const assert = require('node:assert/strict');
const { createLocalStorage, loadBrowserModule } = require('./helpers');

function loadStorage(entries = {}) {
  const localStorage = createLocalStorage(entries);
  const context = loadBrowserModule('modules/storage.js', { localStorage });
  return { Storage: context.window.Storage, localStorage };
}

test('overlapping legacy usernames migrate into isolated namespaces', () => {
  const { Storage, localStorage } = loadStorage({
    fr_users_v2: JSON.stringify(['john', 'john_doe']),
    fr_current_user_v2: 'john',
    fr_migrated_v2: '1',
    fr_u_john_done_a: 'one',
    fr_u_john_doe_done_b: 'two',
  });

  Storage.migrateLegacy();
  assert.equal(Storage.getItem('done_a'), 'one');
  assert.equal(Storage.getItem('done_b'), null);
  Storage.setCurrentUser('john_doe');
  assert.equal(Storage.getItem('done_b'), 'two');
  assert.equal(Storage.getItem('done_a'), null);
  assert.equal(localStorage.fr_u_john_done_a, undefined);
  assert.equal(localStorage.fr_u_john_doe_done_b, undefined);
});

test('reset and deletion never cross user boundaries', () => {
  const { Storage } = loadStorage();
  Storage.addUser('john');
  Storage.addUser('john_doe');
  Storage.setCurrentUser('john');
  Storage.setItem('state', 'john-state');
  Storage.setCurrentUser('john_doe');
  Storage.setItem('state', 'john-doe-state');

  Storage.setCurrentUser('john');
  Storage.resetCurrentUserProgress();
  assert.equal(Storage.getItem('state'), null);
  Storage.setCurrentUser('john_doe');
  assert.equal(Storage.getItem('state'), 'john-doe-state');

  Storage.removeUser('john');
  assert.equal(Storage.getItem('state'), 'john-doe-state');
});

test('backup restore is exact and rejects malformed payloads', () => {
  const { Storage } = loadStorage();
  Storage.setCurrentUser('learner');
  Storage.setItem('state', 'saved');
  const backup = Storage.exportData();
  Storage.setItem('stale-draft', 'remove me');

  assert.equal(Storage.importData(backup), 1);
  assert.equal(Storage.getItem('state'), 'saved');
  assert.equal(Storage.getItem('stale-draft'), null);
  assert.equal(Storage.importData({ app: 'bonjour-frenchclb6', data: [] }), -1);
  assert.equal(Storage.importData({ app: 'another-app', data: {} }), -1);
});

test('many similar and unicode usernames remain fully isolated', () => {
  const { Storage } = loadStorage();
  const users = ['a', 'a_', 'a-b', 'a b', 'école', '用户', 'name.with.dot'];
  users.forEach((user, index) => {
    Storage.addUser(user);
    Storage.setCurrentUser(user);
    Storage.setItem('state', `state-${index}`);
    Storage.setItem('draft_shared', `draft-${index}`);
  });
  users.forEach((user, index) => {
    Storage.setCurrentUser(user);
    assert.equal(Storage.getItem('state'), `state-${index}`);
    assert.equal(Storage.getItem('draft_shared'), `draft-${index}`);
  });
});

test('restore filters dangerous keys and clears stale data', () => {
  const { Storage } = loadStorage();
  Storage.setCurrentUser('learner');
  Storage.setItem('stale', 'gone');
  const tooLong = 'x'.repeat(129);
  const count = Storage.importData({
    app: 'bonjour-frenchclb6',
    data: { good: 'yes', [tooLong]: 'no', 'bad\u0000key': 'no', nonString: 42 },
  });
  assert.equal(count, 1);
  assert.equal(Storage.getItem('good'), 'yes');
  assert.equal(Storage.getItem('stale'), null);
});

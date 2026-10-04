const test = require('node:test');
const assert = require('node:assert/strict');
const { createLocalStorage, loadBrowserModules } = require('./helpers');

// Small DOM adapter for the real vocabulary renderer's controls. No progress
// rules are duplicated here: App, Storage, Mastery, SRS and VocabModule run as-is.
function element() {
  return {
    innerHTML: '', textContent: '', style: {}, dataset: {}, children: [],
    appendChild(child) { this.children.push(child); },
    classList: { toggle() {}, contains() { return true; } },
  };
}

function container() {
  const host = element();
  let html = '';
  let nodes = {};
  let ratings = [];
  Object.defineProperty(host, 'innerHTML', {
    get() { return html; },
    set(value) {
      html = value;
      nodes = {};
      for (const match of value.matchAll(/id="([^"]+)"/g)) nodes['#' + match[1]] = element();
      ratings = [...value.matchAll(/data-q="(\d+)"/g)].map(match => ({
        ...element(), dataset: { q: match[1] },
      }));
    },
  });
  host.querySelector = selector => nodes[selector] || null;
  host.querySelectorAll = selector => selector === '[data-q]' ? ratings : [];
  return host;
}

function course(localStorage = createLocalStorage({ fr_current_user_v2: 'learner' })) {
  const notices = [];
  const finishes = [];
  const events = {};
  const context = loadBrowserModules([
    'modules/storage.js', 'modules/mastery.js', 'modules/srs.js',
    'app.js', 'modules/vocab.js',
  ], {
    localStorage,
    addEventListener(type, listener) { events[type] = listener; },
    document: {
      currentScript: { src: 'http://localhost/app.js?v=test' },
      addEventListener() {},
      createElement: element,
    },
    location: { hash: '#vocab' },
    console: { warn() {} },
    Toast: { info(message) { notices.push(message); } },
    TTS: { speak() {}, speakSoon() {} },
    Support: { winNudge() { return ''; } },
    Chrome: {
      render() { return ''; },
      finishScreen(options) { finishes.push(options); return '<h1>Finished</h1>'; },
    },
    VOCAB: {
      greetings: {
        name: 'Greetings', icon: 'Hello',
        cards: [{ fr: 'bonjour', en: 'hello' }, { fr: 'merci', en: 'thank you' }],
      },
    },
    // No timers should stand between a rating and a durable progress write.
    setTimeout() { throw new Error('Unexpected deferred progress write'); },
  });
  context.App.reloadForUser();
  return { context, localStorage, notices, finishes, events };
}

function rate(host, quality) {
  const button = host.querySelectorAll('[data-q]').find(b => b.dataset.q === String(quality));
  assert.ok(button, 'a card is ready to rate');
  button.onclick();
}

test('vocabulary completes on the first full session and stays complete after reload', () => {
  const { context, localStorage, finishes } = course();
  const host = container();
  context.VocabModule.render(host, { deck: 'greetings' });
  rate(host, 4);
  rate(host, 4);
  assert.equal(finishes.length, 1);
  assert.equal(context.App.state.lessons['vocab:greetings'], true);
  assert.equal(JSON.parse(context.Storage.getItem('state')).lessons['vocab:greetings'], true);
  // One session completes coverage even though spaced recall still needs reps.
  assert.equal(context.SRS.progress('vocab:greetings', context.VOCAB.greetings.cards).learned, 0);

  const fresh = course(localStorage).context;
  fresh.VocabModule.render(host, {});
  assert.match(host.querySelector('#deck-grid').children[0].innerHTML, /✓ Complete/);
  assert.match(host.querySelector('#vocab-count').textContent, /1 of 1 decks complete/);
  assert.match(host.querySelector('#deck-grid').children[0].innerHTML, /0\/2 learned through spaced review/);
  assert.equal(fresh.SRS.getCard('vocab:greetings', 'merci').reps, 1);
});

test('honest Again ratings complete the deck without claiming spaced recall mastery', () => {
  const { context, finishes } = course();
  const host = container();
  context.VocabModule.render(host, { deck: 'greetings' });
  for (let rating = 0; rating < 6; rating++) rate(host, 0);
  assert.equal(finishes.length, 1);
  assert.equal(context.App.state.lessons['vocab:greetings'], true);
  assert.equal(context.SRS.progress('vocab:greetings', context.VOCAB.greetings.cards).learned, 0);
});

test('an unfinished deck does not get a completion badge', () => {
  const { context, localStorage } = course();
  const host = container();
  context.VocabModule.render(host, { deck: 'greetings' });
  rate(host, 4);
  assert.equal(context.App.state.lessons['vocab:greetings'], undefined);
  const fresh = course(localStorage).context;
  fresh.VocabModule.render(host, {});
  assert.doesNotMatch(host.querySelector('#deck-grid').children[0].innerHTML, /✓ Complete/);
  assert.match(host.querySelector('#vocab-count').textContent, /0 of 1 decks complete/);
});

test('duplicate rating events do not skip the next vocabulary card', () => {
  const { context, finishes } = course();
  const host = container();
  context.VocabModule.render(host, { deck: 'greetings' });
  const firstGood = host.querySelectorAll('[data-q]').find(b => b.dataset.q === '4');
  firstGood.onclick();
  firstGood.onclick();
  assert.equal(finishes.length, 0);
  assert.equal(context.App.state.lessons['vocab:greetings'], undefined);
  rate(host, 4);
  assert.equal(finishes.length, 1);
});

test('SRS ratings are immediately available to reloads, backups and profile switches', () => {
  const { context, localStorage } = course();
  context.SRS.review('vocab:greetings', 'bonjour', 4);
  const backup = context.Storage.exportData();
  assert.equal(Object.values(JSON.parse(backup.data.srs))[0].reps, 1);
  context.Storage.setCurrentUser('second');
  context.location.hash = '#vocab';
  context.App.reloadForUser();
  assert.equal(context.SRS.getCard('vocab:greetings', 'bonjour').reps, 0);
  context.SRS.review('vocab:greetings', 'bonjour', 5);
  context.Storage.setCurrentUser('learner');
  context.location.hash = '#vocab';
  context.App.reloadForUser();
  assert.equal(context.SRS.getCard('vocab:greetings', 'bonjour').reps, 1);
  assert.equal(course(localStorage).context.SRS.getCard('vocab:greetings', 'bonjour').reps, 1);
});

test('same-profile reset and restore refresh SRS along with completion state', () => {
  const { context } = course();
  context.SRS.review('vocab:greetings', 'bonjour', 4);
  context.App.markLessonDone('vocab:greetings');
  const backup = context.Storage.exportData();
  context.Storage.resetCurrentUserProgress();
  context.location.hash = '#vocab';
  context.App.reloadForUser();
  assert.equal(context.SRS.getCard('vocab:greetings', 'bonjour').reps, 0);
  assert.equal(context.App.state.lessons['vocab:greetings'], undefined);
  assert.ok(context.Storage.importData(backup) > 0);
  context.location.hash = '#vocab';
  context.App.reloadForUser();
  assert.equal(context.SRS.getCard('vocab:greetings', 'bonjour').reps, 1);
  assert.equal(context.App.state.lessons['vocab:greetings'], true);
});

test('shared completion saves survive reload for different module namespaces', () => {
  const { context, localStorage } = course();
  const keys = ['phonics:p1-vowels', 'grammar:g1-articles', 'listen:daily', 'read:r1', 'write:w1', 'scenario:rent-call'];
  for (const key of keys) assert.equal(context.App.markLessonDone(key), true);
  const fresh = course(localStorage).context;
  for (const key of keys) assert.equal(fresh.App.state.lessons[key], true);
});

test('failed completion writes warn and retry on pagehide without repeating the lesson', () => {
  const { context, notices, events } = course();
  const write = context.Storage.setItem;
  context.Storage.setItem = (key, value) => key === 'state' ? false : write(key, value);
  assert.equal(context.App.markLessonDone('vocab:greetings'), false);
  assert.equal(context.App.state.lessons['vocab:greetings'], true);
  assert.equal(context.Storage.getItem('state'), null);
  assert.match(notices[0], /Completion could not be saved/);
  context.Storage.setItem = write;
  events.pagehide();
  assert.equal(JSON.parse(context.Storage.getItem('state')).lessons['vocab:greetings'], true);
});

test('a pending completion write cannot cross profile boundaries', () => {
  const { context, events } = course();
  const write = context.Storage.setItem;
  context.Storage.setItem = (key, value) => key === 'state' ? false : write(key, value);
  context.App.markLessonDone('vocab:greetings');
  context.Storage.setItem = write;
  context.Storage.setCurrentUser('second');
  events.pagehide();
  assert.equal(context.Storage.getItem('state'), null);
});

test('failed SRS writes are reported instead of silently discarded', () => {
  const { context, notices } = course();
  const write = context.Storage.setItem;
  context.Storage.setItem = (key, value) => key === 'srs' ? false : write(key, value);
  context.SRS.review('vocab:greetings', 'bonjour', 4);
  assert.match(notices[0], /Review progress could not be saved/);
});

test('assessed work still requires its pass score and a later retry cannot erase a pass', () => {
  const { context, localStorage } = course();
  context.App.recordAttempt('grammar:g1-articles', 50, 70);
  assert.equal(context.App.state.lessons['grammar:g1-articles'], undefined);
  context.App.recordAttempt('grammar:g1-articles', 80, 70);
  context.App.recordAttempt('grammar:g1-articles', 40, 70);
  assert.equal(course(localStorage).context.App.state.lessons['grammar:g1-articles'], true);
});

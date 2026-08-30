// Every practice segment must tell the learner when it is over.
//
// Chrome.finishScreen() is the one component that emits the whole completion
// package — the "✓ Session complete" kicker, the fanfare, confetti, the cheer
// figure and the "Next on your path" strip. Modules that hand-roll their ending
// drift: they lose the kicker, or the sound, or both, and the learner finishes a
// session with no acknowledgement at all. That is exactly how eleven flows ended
// up silent before this guard existed.
//
// These tests fail when a NEW segment module records progress without rendering
// a finish screen, and when the shared component loses a piece of the package.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const MODULES = 'modules';

// Modules that legitimately end without Chrome.finishScreen. Each one needs a
// reason — adding a name here is the deliberate act of opting out.
const EXEMPT = {
  'phasegate.js': 'Custom gate result screen; emits the milestone package itself in finish().',
  'mock.js': 'Four-skill report reads as a document; plays its own completion sound in renderReport().',
};

function read(name) {
  return fs.readFileSync(path.join(MODULES, name), 'utf8');
}

function segmentModules() {
  // A "segment" is any module that writes learner progress — if it records an
  // attempt or marks a lesson done, a session just ended in it. Some modules
  // reach past App and call Mastery directly (mock, diagnostic), so match both
  // spellings; mastery.js itself is the definition site, not a segment.
  return fs.readdirSync(MODULES)
    .filter(name => name.endsWith('.js') && name !== 'mastery.js')
    .filter(name => {
      const src = read(name);
      return /(?:App|Mastery)\.(markLessonDone|recordAttempt|recordPractice)\s*\(/.test(src);
    });
}

test('every module that records progress renders a finish screen', () => {
  const silent = segmentModules().filter(name => {
    if (EXEMPT[name]) return false;
    return !read(name).includes('Chrome.finishScreen(');
  });
  assert.deepEqual(
    silent, [],
    'These modules record progress but never render Chrome.finishScreen(), so a ' +
    'learner finishes with no completion signal. Use Chrome.finishScreen() — or ' +
    'add the module to EXEMPT above with the reason it ends differently.'
  );
});

test('exemptions name a module that still exists and still records progress', () => {
  const segments = new Set(segmentModules());
  const stale = Object.keys(EXEMPT).filter(name => !segments.has(name));
  assert.deepEqual(stale, [], 'Stale entries in EXEMPT — remove them.');
});

test('no segment leaves its graded report injected into a live page', () => {
  // The TCF task modules used to append their report into a <div> on the still
  // running task page, so the session never visibly ended. Any module holding a
  // "#…report" host again is regressing to that shape.
  const offenders = segmentModules().filter(name =>
    /querySelector\(['"]#[\w-]*report[\w-]*['"]\)\s*\.innerHTML\s*=/.test(read(name))
  );
  assert.deepEqual(
    offenders, [],
    'Graded reports must render through Chrome.finishScreen({ body }), not be ' +
    'injected into the running task page.'
  );
});

test('finishScreen still emits the full completion package', () => {
  const chrome = read('chrome.js');
  const finish = chrome.slice(chrome.indexOf('function finishScreen'));
  assert.match(finish, /Session complete/, 'lost the completion kicker');
  assert.match(finish, /Sounds\.play\(/, 'lost the completion sound');
  assert.match(finish, /Celebrate\.confetti\(/, 'lost the confetti burst');
  assert.match(finish, /CheerSquad\.renderInline\(/, 'lost the cheer figure');
  assert.match(finish, /App\.continueNext\(\)/, 'lost the "Next on your path" strip');
  assert.match(finish, /Record\.stopAll/, 'lost the recorder teardown');
});

test('finishScreen kicker renders even when the caller overrides it', () => {
  const chrome = read('chrome.js');
  const finish = chrome.slice(chrome.indexOf('function finishScreen'));
  // A below-target run gets the warn tone, never a missing kicker.
  assert.match(finish, /opts\.kicker\s*\|\|\s*['"]✓ Session complete['"]/);
  assert.match(finish, /kickerTone\s*===\s*['"]warn['"]/);
});

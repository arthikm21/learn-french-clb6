const test = require('node:test');
const assert = require('node:assert/strict');
const { loadBrowserModule } = require('./helpers');

test('cheer events map to the approved characters and messages', () => {
  const context = loadBrowserModule('modules/cheersquad.js');
  const CheerSquad = context.window.CheerSquad;

  assert.deepEqual(
    JSON.parse(JSON.stringify(CheerSquad.select('pronunciation'))),
    {
      event: 'pronunciation',
      character: 'echo',
      name: 'Écho',
      message: 'Say it out loud.',
      pose: 'listen',
      placement: 'inline',
      unsolicited: false,
      cooldown: 45000,
    }
  );
  assert.equal(CheerSquad.select('retry').character, 'violette');
  assert.equal(CheerSquad.select('milestone').character, 'lumi');
  assert.equal(CheerSquad.select('complete').character, 'coco');
});

test('cheer renderer escapes custom copy and keeps the character semantic', () => {
  const context = loadBrowserModule('modules/cheersquad.js');
  const html = context.window.CheerSquad.render({
    character: 'bleu',
    message: '<Keep going>',
    placement: 'finish',
  });

  assert.match(html, /cheer-bleu/);
  assert.match(html, /cheer-place-finish/);
  assert.match(html, /role="group"/);
  assert.match(html, /class="sr-only"/);
  assert.match(html, /&lt;Keep going&gt;/);
  assert.doesNotMatch(html, /<Keep going>/);
});

test('temporary cheer policy caps frequency and respects cooldowns', () => {
  const context = loadBrowserModule('modules/cheersquad.js');
  const policy = context.window.CheerSquad._policyAllows;

  assert.equal(policy('streak', { unsolicitedCount: 2 }, { now: 600000 }), false);
  assert.equal(policy('streak', { lastGlobalAt: 580000 }, { now: 600000 }), false);
  assert.equal(policy('streak', { lastEventAt: { streak: 400000 } }, { now: 600000 }), false);
  assert.equal(policy('streak', { lastEventAt: { streak: 200000 } }, { now: 600000 }), true);
  assert.equal(policy('streak', { unsolicitedCount: 9 }, { now: 600000, force: true }), true);
});

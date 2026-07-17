const test = require('node:test');
const assert = require('node:assert/strict');
const { createLocalStorage, loadBrowserModule } = require('./helpers');

test('premium click sound is on by default and default volume is restrained', () => {
  const localStorage = createLocalStorage();
  const context = loadBrowserModule('modules/settings.js', { localStorage });
  const Settings = context.window.Settings;
  // Buttons play a sample-based tap out of the box (see modules/sounds.js);
  // the toggle can still silence all routine tap feedback.
  assert.equal(Settings.isClickSoundOn(), true);
  assert.equal(Settings.getMasterVolume(), 0.5);

  Settings.setClickSound(true);
  Settings.setMasterVolume(0.8);
  Settings.setCheerSquad(false);
  assert.equal(localStorage.fr_setting_clicks_v1, '1');
  assert.equal(Settings.getMasterVolume(), 0.8);
  assert.equal(Settings.isCheerSquadOn(), false);
  assert.equal(Settings.isMascotOn(), false);
});

test('sound classifier ignores blank cards and playback controls', () => {
  const document = {
    readyState: 'loading',
    visibilityState: 'visible',
    addEventListener() {},
  };
  const context = loadBrowserModule('modules/sounds.js', {
    document,
    navigator: { maxTouchPoints: 0 },
  });
  const classify = context.window.Sounds.classifyTarget;

  function target(matches, cardIsInteractive = false) {
    const card = {
      hasAttribute: name => name === 'onclick' && cardIsInteractive,
      onclick: cardIsInteractive ? () => {} : null,
    };
    return {
      nodeType: 1,
      closest(selectorList) {
        for (const selector of selectorList.split(',').map(value => value.trim())) {
          if (!matches.has(selector)) continue;
          return selector === '.card' || selector === '.spotlight' ? card : this;
        }
        return null;
      },
    };
  }

  assert.equal(classify(target(new Set(['.card']))), null);
  assert.equal(classify(target(new Set(['.card']), true)), 'nav');
  assert.equal(classify(target(new Set(['#play', '.btn']))), null);
  assert.equal(classify(target(new Set(['.btn']))), 'click');
});

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { createLocalStorage, loadBrowserModule } = require('./helpers');

test('restrained click sound is on by default and default volume is bounded', () => {
  const localStorage = createLocalStorage();
  const context = loadBrowserModule('modules/settings.js', { localStorage });
  const Settings = context.window.Settings;
  // Buttons play a quiet sample-based tap out of the box (see modules/sounds.js);
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
  assert.equal(classify(target(new Set(['input']))), null);
  assert.equal(classify(target(new Set(['input.toggle[type="checkbox"]']))), 'toggleOn');
  assert.equal(classify(target(new Set(['.btn']))), 'click');
});

test('tap samples stay short, mono, low-peak, and locally available', () => {
  const packs = ['soft', 'default', 'mechanical'];
  const names = packs.flatMap(pack => [
    ...[1, 2, 3, 4].map(index => `${pack}-click-${index}.wav`),
    `${pack}-nav.wav`,
  ]);

  for (const name of names) {
    const file = fs.readFileSync(path.join(__dirname, '..', 'audio', 'ui', name));
    assert.equal(file.toString('ascii', 0, 4), 'RIFF', `${name} is a WAV file`);
    assert.equal(file.readUInt16LE(22), 1, `${name} is mono`);
    assert.equal(file.readUInt32LE(24), 44100, `${name} uses the expected sample rate`);
    assert.equal(file.readUInt16LE(34), 16, `${name} is 16-bit PCM`);

    const dataBytes = file.readUInt32LE(40);
    assert.ok(dataBytes / 2 / 44100 <= 0.12, `${name} remains under 120 ms`);
    let peak = 0;
    for (let offset = 44; offset + 1 < file.length; offset += 2) {
      peak = Math.max(peak, Math.abs(file.readInt16LE(offset)));
    }
    assert.ok(peak <= 16384, `${name} leaves sample-level headroom`);
  }
});

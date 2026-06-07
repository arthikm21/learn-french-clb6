// User profiles + namespaced storage. No backend, no password.
// Multiple users share same browser, each with own progress.

window.Storage = (function () {
  const CUR = 'fr_current_user_v2';
  const USERS = 'fr_users_v2';

  function getCurrentUser() {
    return localStorage.getItem(CUR) || '';
  }
  function setCurrentUser(name) {
    if (name) localStorage.setItem(CUR, name);
    else localStorage.removeItem(CUR);
  }
  function listUsers() {
    try { return JSON.parse(localStorage.getItem(USERS)) || []; } catch { return []; }
  }
  function saveUsers(list) {
    localStorage.setItem(USERS, JSON.stringify(list));
  }
  function addUser(name) {
    const u = listUsers();
    if (!u.includes(name)) { u.push(name); saveUsers(u); }
  }
  function removeUser(name) {
    const u = listUsers().filter(x => x !== name);
    saveUsers(u);
    // Wipe all data for this user
    const prefix = `fr_u_${name}_`;
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(prefix)) localStorage.removeItem(k);
    });
    if (getCurrentUser() === name) setCurrentUser('');
  }
  function prefixedKey(key) {
    const u = getCurrentUser();
    return u ? `fr_u_${u}_${key}` : `fr_anon_${key}`;
  }
  function getItem(key) {
    return localStorage.getItem(prefixedKey(key));
  }
  function setItem(key, val) {
    localStorage.setItem(prefixedKey(key), val);
  }
  function removeItem(key) {
    localStorage.removeItem(prefixedKey(key));
  }
  function resetCurrentUserProgress() {
    const u = getCurrentUser();
    if (!u) return;
    const prefix = `fr_u_${u}_`;
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(prefix)) localStorage.removeItem(k);
    });
  }

  // One-time migration from old un-namespaced keys → "Guest" user.
  function migrateLegacy() {
    if (localStorage.getItem('fr_migrated_v2') === '1') return;
    const legacyKeys = ['fr_app_state_v1', 'fr_srs_v1', 'fr_mistakes_v1'];
    const draftKeys = Object.keys(localStorage).filter(k => k.startsWith('fr_draft_'));
    const hasLegacy = legacyKeys.some(k => localStorage.getItem(k)) || draftKeys.length > 0;
    if (hasLegacy) {
      addUser('Guest');
      setCurrentUser('Guest');
      const remap = {
        'fr_app_state_v1': 'state',
        'fr_srs_v1': 'srs',
        'fr_mistakes_v1': 'mistakes',
      };
      for (const [oldK, newK] of Object.entries(remap)) {
        const v = localStorage.getItem(oldK);
        if (v) {
          localStorage.setItem(`fr_u_Guest_${newK}`, v);
          localStorage.removeItem(oldK);
        }
      }
      for (const dk of draftKeys) {
        const v = localStorage.getItem(dk);
        const newK = dk.replace(/^fr_draft_/, 'draft_');
        localStorage.setItem(`fr_u_Guest_${newK}`, v);
        localStorage.removeItem(dk);
      }
    }
    localStorage.setItem('fr_migrated_v2', '1');
  }

  return {
    getCurrentUser, setCurrentUser,
    listUsers, addUser, removeUser,
    getItem, setItem, removeItem,
    resetCurrentUserProgress,
    migrateLegacy,
  };
})();

window.ProfileModule = (function () {
  function sanitize(name) {
    return String(name || '').trim().replace(/[^a-zA-Z0-9_\- ]/g, '').slice(0, 24);
  }

  function adjustFontSize(delta) {
    const sizes = [14, 15, 16, 17, 18, 20];
    let cur = parseInt(localStorage.getItem('fr_fontsize_v1') || '16');
    let idx = sizes.indexOf(cur);
    if (idx < 0) idx = 2;
    idx = Math.max(0, Math.min(sizes.length - 1, idx + delta));
    cur = sizes[idx];
    localStorage.setItem('fr_fontsize_v1', String(cur));
    document.documentElement.style.setProperty('font-size', cur + 'px');
    Toast.info('Text size: ' + cur + 'px');
  }
  function applySavedFontSize() {
    const s = localStorage.getItem('fr_fontsize_v1');
    if (s) document.documentElement.style.setProperty('font-size', s + 'px');
  }
  applySavedFontSize();

  function renderWelcome(container) {
    const existing = Storage.listUsers();
    container.innerHTML = `
      <section class="hero accent">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h" style="color:rgba(255,255,255,.7)">Bienvenue</p>
        <h1>Free.<br/>No signup.<br/>Just French.</h1>
        <p style="margin-top:var(--sp-5);max-width:560px">Pick a username to save your progress. No password. No email. Everything stays in this browser.</p>
      </section>

      <div class="spotlight" style="grid-template-columns:1fr">
        <div>
          <p class="eyebrow">Step 1 — Choose a username</p>
          <h2>Letters, numbers, spaces. Max 24 chars.</h2>
          <div class="spacer"></div>
          <input class="input" id="uname" placeholder="e.g. alex, marie123, mon-nom" autocomplete="off" autocapitalize="off" style="font-size:var(--fs-19);padding:var(--sp-4) var(--sp-5)" />
          <div id="err" style="color:var(--bad);margin-top:var(--sp-2);font-size:var(--fs-14);font-weight:var(--fw-semi)"></div>
          <div class="spacer"></div>
          <button class="btn primary big" id="start">Start learning<span class="arr">→</span></button>
        </div>
      </div>

      ${existing.length > 0 ? `
      <div class="card" style="cursor:default;background:var(--surface);margin-top:var(--sp-5)">
        <p class="eyebrow" style="text-transform:uppercase;letter-spacing:var(--ls-wide);font-size:var(--fs-12);font-weight:var(--fw-semi);color:var(--mute);margin-bottom:var(--sp-3)">Continue as existing user</p>
        <div class="row" style="gap:var(--sp-2);flex-wrap:wrap">
          ${existing.map(u => `<button class="btn secondary" data-u="${escapeAttr(u)}">👤 ${escapeHTML(u)}</button>`).join('')}
        </div>
      </div>` : ''}

      <p style="text-align:center;color:var(--mute);font-size:var(--fs-13);margin-top:var(--sp-7)">
        No tracking · No accounts · No data leaves this browser
      </p>`;
    const inp = container.querySelector('#uname');
    const err = container.querySelector('#err');
    inp.focus();
    const start = () => {
      const name = sanitize(inp.value);
      if (!name) { err.textContent = 'Please type a username.'; return; }
      if (name.length < 2) { err.textContent = 'Username must be at least 2 characters.'; return; }
      const existing = Storage.listUsers().includes(name);
      if (existing) {
        if (!confirm(`A profile named "${name}" already exists on this browser. Continue as that profile?\n\nClick OK to load the existing profile, or Cancel to pick a different name.`)) return;
      }
      Storage.addUser(name);
      Storage.setCurrentUser(name);
      App.reloadForUser();
    };
    container.querySelector('#start').onclick = start;
    inp.onkeydown = e => { if (e.key === 'Enter') start(); };
    container.querySelectorAll('[data-u]').forEach(b => {
      b.onclick = () => {
        Storage.setCurrentUser(b.dataset.u);
        App.reloadForUser();
      };
    });
  }

  function renderProfile(container) {
    const cur = Storage.getCurrentUser();
    const users = Storage.listUsers();
    const lessonsDone = Object.keys(App.state.lessons || {}).length;
    const pct = Math.round((lessonsDone / LESSON_PATH.length) * 100);
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Profile'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Profile</p>
        <h1>👤 ${escapeHTML(cur || 'Guest')}</h1>
        <p style="margin-top:var(--sp-4)">${lessonsDone} of ${LESSON_PATH.length} milestones complete · ${pct}%</p>
      </section>

      <div class="grammar-box">
        <h3>Appearance</h3>
        <p style="color:var(--ink-2);font-size:var(--fs-14)">Theme and text size. Saved on this device.</p>
        <div class="spacer"></div>
        <div class="row">
          <button class="btn secondary" id="theme-toggle">Toggle dark mode</button>
          <button class="btn secondary" id="font-up">A+</button>
          <button class="btn secondary" id="font-down">A−</button>
        </div>
      </div>

      <div class="grammar-box">
        <h3>🔊 Sound</h3>
        <p style="color:var(--ink-2);font-size:var(--fs-14);margin-bottom:var(--sp-3)">Tactile click + reward sounds. Tune the mix to taste.</p>
        <div class="toggle-row">
          <div class="info">
            <h4>UI click sounds</h4>
            <p>A tactile clack when you tap buttons, options, cards.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-clicks" ${Settings.isClickSoundOn() ? 'checked' : ''} aria-label="UI click sounds"/>
        </div>
        <div class="toggle-row">
          <div class="info">
            <h4>Click style</h4>
            <p>Soft = thin, Default = layered clack, Mechanical = MX-blue-style.</p>
          </div>
          <select class="input" id="set-click-style" style="max-width:160px">
            <option value="soft"${Settings.getClickStyle() === 'soft' ? ' selected' : ''}>Soft</option>
            <option value="default"${Settings.getClickStyle() === 'default' ? ' selected' : ''}>Default</option>
            <option value="mechanical"${Settings.getClickStyle() === 'mechanical' ? ' selected' : ''}>Mechanical</option>
          </select>
        </div>
        <div class="toggle-row">
          <div class="info">
            <h4>Master volume</h4>
            <p>Controls all UI sounds. Doesn't affect TTS / pronunciation playback.</p>
          </div>
          <input type="range" id="set-volume" min="0" max="100" step="5" value="${Math.round(Settings.getMasterVolume() * 100)}" aria-label="Master volume" style="width:160px"/>
        </div>
        <div class="toggle-row">
          <div class="info">
            <h4>Celebration sounds</h4>
            <p>Chime on right answer, soft bonk on wrong, fanfare on lesson + gate.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-celebrations" ${Settings.isCelebrationsOn() ? 'checked' : ''} aria-label="Celebration sounds"/>
        </div>
        <div class="toggle-row">
          <div class="info">
            <h4>Tap-to-pronounce French words</h4>
            <p>Click any French word in lessons to hear it spoken in Canadian French.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-pron" ${Settings.isPronounceOn() ? 'checked' : ''} aria-label="Tap to pronounce"/>
        </div>
        <div class="toggle-row">
          <div class="info">
            <h4>Show English translations</h4>
            <p>Display the English meaning under French sentences in dialogues, shadow lines, and clips. Turn off once you're comfortable reading French directly.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-gloss" ${Settings.isShowGloss() ? 'checked' : ''} aria-label="Show English translations"/>
        </div>
      </div>

      <div class="grammar-box">
        <h3>🎬 Motion</h3>
        <p style="color:var(--ink-2);font-size:var(--fs-14);margin-bottom:var(--sp-3)">Animations bring the app alive. Turn down if it feels too busy.</p>
        <div class="toggle-row">
          <div class="info">
            <h4>Animation level</h4>
            <p>Off = instant. Subtle = fades only. Full = springs + sparkles. Auto-detects "Reduce motion" in your OS.</p>
          </div>
          <select class="input" id="set-anim-level" style="max-width:160px">
            <option value="off"${Settings.getAnimLevel() === 'off' ? ' selected' : ''}>Off</option>
            <option value="subtle"${Settings.getAnimLevel() === 'subtle' ? ' selected' : ''}>Subtle</option>
            <option value="full"${Settings.getAnimLevel() === 'full' ? ' selected' : ''}>Full</option>
          </select>
        </div>
        <div class="toggle-row">
          <div class="info">
            <h4>Confetti on milestones</h4>
            <p>Burst when you complete a lesson, pass a gate, or hit a streak.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-confetti" ${Settings.isConfettiOn() ? 'checked' : ''} aria-label="Confetti on milestones"/>
        </div>
        <div class="toggle-row">
          <div class="info">
            <h4>Mascot animations</h4>
            <p>Tiny life signals on the 🐓 logo — bobs idle, flaps on wins.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-mascot" ${Settings.isMascotOn() ? 'checked' : ''} aria-label="Mascot animations"/>
        </div>
      </div>

      <div class="grammar-box">
        <h3>Switch user</h3>
        <p style="color:var(--ink-2);font-size:var(--fs-14)">Use a different profile on this browser.</p>
        <div class="row" style="gap:var(--sp-2);margin-top:var(--sp-3);flex-wrap:wrap">
          ${users.filter(u => u !== cur).map(u => `<button class="btn secondary" data-switch="${escapeAttr(u)}">👤 ${escapeHTML(u)}</button>`).join('')}
          <button class="btn ghost" id="new-user">+ Add user</button>
        </div>
        ${users.filter(u => u !== cur).length === 0 ? '<p style="color:var(--mute);font-size:var(--fs-14);margin-top:var(--sp-3)">No other users on this browser.</p>' : ''}
      </div>

      <div class="grammar-box" style="border-left-color:var(--warn)">
        <h3>⚠️ Reset my progress</h3>
        <p style="color:var(--ink-2)">Wipes all lessons, SRS, weak spots, and writing drafts. Username stays. Cannot be undone.</p>
        <div class="spacer"></div>
        <button class="btn" id="reset" style="background:var(--warn);color:var(--gray-900)">Reset progress</button>
      </div>

      <div class="grammar-box" style="border-left-color:var(--bad)">
        <h3>🗑️ Delete my profile</h3>
        <p style="color:var(--ink-2)">Removes username <b>${escapeHTML(cur)}</b> and all its data from this browser. Cannot be undone.</p>
        <div class="spacer"></div>
        <button class="btn danger" id="delete">Delete this profile</button>
      </div>`;

    container.querySelector('#theme-toggle').onclick = () => {
      const dark = App.toggleTheme();
      Toast.info(dark ? 'Dark mode on' : 'Light mode on');
    };
    container.querySelector('#font-up').onclick = () => adjustFontSize(1);
    container.querySelector('#font-down').onclick = () => adjustFontSize(-1);

    const clicks = container.querySelector('#set-clicks');
    if (clicks) clicks.onchange = (e) => {
      Settings.setClickSound(e.target.checked);
      if (e.target.checked && window.Sounds) Sounds.play('click');
      Toast.info(e.target.checked ? 'Click sounds on' : 'Click sounds off');
    };
    const clickStyle = container.querySelector('#set-click-style');
    if (clickStyle) clickStyle.onchange = (e) => {
      Settings.setClickStyle(e.target.value);
      if (window.Sounds) Sounds.play('click');
      Toast.info('Click style: ' + e.target.value);
    };
    const volume = container.querySelector('#set-volume');
    if (volume) volume.oninput = (e) => {
      Settings.setMasterVolume(parseInt(e.target.value, 10) / 100);
      if (window.Sounds) Sounds.play('click');
    };
    const celeb = container.querySelector('#set-celebrations');
    if (celeb) celeb.onchange = (e) => {
      Settings.setCelebrations(e.target.checked);
      if (e.target.checked && window.Sounds) Sounds.play('correct');
      Toast.info(e.target.checked ? 'Celebration sounds on' : 'Celebration sounds off');
    };
    const pron = container.querySelector('#set-pron');
    if (pron) pron.onchange = (e) => {
      Settings.setPronounce(e.target.checked);
      Toast.info(e.target.checked ? 'Tap-to-pronounce on' : 'Tap-to-pronounce off');
    };
    const gloss = container.querySelector('#set-gloss');
    if (gloss) gloss.onchange = (e) => {
      Settings.setShowGloss(e.target.checked);
      Toast.info(e.target.checked ? 'English translations on' : 'English translations off');
    };
    const animLevel = container.querySelector('#set-anim-level');
    if (animLevel) animLevel.onchange = (e) => {
      Settings.setAnimLevel(e.target.value);
      Toast.info('Animation: ' + e.target.value);
    };
    const confetti = container.querySelector('#set-confetti');
    if (confetti) confetti.onchange = (e) => {
      Settings.setConfetti(e.target.checked);
      Toast.info(e.target.checked ? 'Confetti on' : 'Confetti off');
    };
    const mascot = container.querySelector('#set-mascot');
    if (mascot) mascot.onchange = (e) => {
      Settings.setMascot(e.target.checked);
      Toast.info(e.target.checked ? 'Mascot animations on' : 'Mascot animations off');
    };

    container.querySelectorAll('[data-switch]').forEach(b => {
      b.onclick = () => {
        Storage.setCurrentUser(b.dataset.switch);
        App.reloadForUser();
      };
    });
    container.querySelector('#new-user').onclick = () => {
      Storage.setCurrentUser('');
      App.reloadForUser();
    };
    container.querySelector('#reset').onclick = () => {
      if (confirm(`Reset ALL progress for "${cur}"?\n\nThis cannot be undone.`)) {
        Storage.resetCurrentUserProgress();
        App.reloadForUser();
      }
    };
    container.querySelector('#delete').onclick = () => {
      if (confirm(`Delete profile "${cur}" and all its data?\n\nThis cannot be undone.`)) {
        Storage.removeUser(cur);
        App.reloadForUser();
      }
    };
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(s) {
    return String(s).replace(/["'<>&]/g, c => ({'&':'&amp;','"':'&quot;',"'":'&#39;','<':'&lt;','>':'&gt;'}[c]));
  }

  return { renderWelcome, renderProfile };
})();

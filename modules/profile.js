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
      <div class="hero" style="background:linear-gradient(135deg,#0055A4,#1e40af,#EF4135)">
        <div class="flag-stripes"></div>
        <h1>Bienvenue ! 🇨🇦🇫🇷</h1>
        <p>Pick a username to save your progress under. No password, no email, no signup. Progress stays in this browser only.</p>
      </div>
      <div class="lesson">
        <h2>👤 Choose a username</h2>
        <p style="color:var(--mute);font-size:14px;margin-top:6px">Letters, numbers, dashes, underscores, spaces. Max 24 chars.</p>
        <div class="spacer"></div>
        <input class="input" id="uname" placeholder="e.g. alex, marie123, mon-nom" autocomplete="off" autocapitalize="off"/>
        <div id="err" style="color:var(--bad);margin-top:6px;font-size:14px"></div>
        <div class="spacer"></div>
        <button class="btn big" id="start">Start Learning →</button>
        ${existing.length > 0 ? `
          <div class="spacer"></div>
          <div class="grammar-box" style="background:#f9fafb">
            <h3>Or continue as an existing user on this browser:</h3>
            <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap">
              ${existing.map(u => `<button class="btn secondary" data-u="${escapeAttr(u)}">👤 ${escapeHTML(u)}</button>`).join('')}
            </div>
          </div>` : ''}
      </div>`;
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
    container.innerHTML = `
      <div class="hero"><div class="flag-stripes"></div>
        <h1>👤 ${escapeHTML(cur || 'Guest')}</h1>
        <p>Your profile, your progress, your data. Stored in this browser only.</p>
      </div>

      <div class="grammar-box">
        <h3>📊 Your stats</h3>
        <p><b>${lessonsDone}</b> / ${LESSON_PATH.length} milestones complete.</p>
        <p style="color:var(--mute);margin-top:6px">Username: <b>${escapeHTML(cur)}</b></p>
      </div>

      <div class="grammar-box" style="background:#f9fafb">
        <h3>🌗 Appearance</h3>
        <p style="color:var(--mute);font-size:14px">Toggle dark mode. Preference is saved on this device.</p>
        <div class="spacer"></div>
        <button class="btn secondary" id="theme-toggle">Toggle dark mode</button>
        <button class="btn secondary" id="font-up" style="margin-left:6px">A+</button>
        <button class="btn secondary" id="font-down">A−</button>
      </div>

      <div class="grammar-box">
        <h3>🔄 Switch user</h3>
        <p style="color:var(--mute);font-size:14px">Use a different profile on this browser.</p>
        <div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap">
          ${users.filter(u => u !== cur).map(u => `<button class="btn secondary" data-switch="${escapeAttr(u)}">👤 ${escapeHTML(u)}</button>`).join('')}
          <button class="btn ghost" id="new-user">➕ Add user</button>
        </div>
        ${users.filter(u => u !== cur).length === 0 ? '<p style="color:var(--mute);font-size:14px;margin-top:8px">No other users on this browser.</p>' : ''}
      </div>

      <div class="grammar-box" style="background:#fef3c7;border-left-color:var(--warn)">
        <h3>⚠️ Reset my progress</h3>
        <p>Wipes all your lessons, SRS, weak spots, and writing drafts. Username stays. Cannot be undone.</p>
        <div class="spacer"></div>
        <button class="btn" id="reset" style="background:var(--warn)">Reset progress</button>
      </div>

      <div class="grammar-box" style="background:#fee2e2;border-left-color:var(--bad)">
        <h3>🗑️ Delete my profile</h3>
        <p>Removes username <b>${escapeHTML(cur)}</b> and all its data from this browser. Cannot be undone.</p>
        <div class="spacer"></div>
        <button class="btn danger" id="delete">Delete this profile</button>
      </div>

      <div class="center" style="margin-top:24px">
        <button class="btn ghost" onclick="App.go('home')">← Home</button>
      </div>`;

    container.querySelector('#theme-toggle').onclick = () => {
      const dark = App.toggleTheme();
      Toast.info(dark ? 'Dark mode on' : 'Light mode on');
    };
    container.querySelector('#font-up').onclick = () => adjustFontSize(1);
    container.querySelector('#font-down').onclick = () => adjustFontSize(-1);

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

// Profile screens only. Persistence lives in storage.js so it can evolve and
// be regression-tested without the DOM-heavy account UI.
window.ProfileModule = (function () {
  const FONT_SIZES = [14, 15, 16, 17, 18, 20];
  function savedFontSize() {
    try {
      const n = parseInt(localStorage.getItem('fr_fontsize_v1') || '16', 10);
      return FONT_SIZES.includes(n) ? n : 16;
    } catch { return 16; }
  }
  function sanitize(name) {
    return String(name || '').trim().replace(/[^a-zA-Z0-9_\- ]/g, '').slice(0, 24);
  }

  function adjustFontSize(delta) {
    const sizes = FONT_SIZES;
    let cur = savedFontSize();
    let idx = sizes.indexOf(cur);
    if (idx < 0) idx = 2;
    idx = Math.max(0, Math.min(sizes.length - 1, idx + delta));
    cur = sizes[idx];
    try { localStorage.setItem('fr_fontsize_v1', String(cur)); } catch {}
    document.documentElement.style.setProperty('font-size', cur + 'px');
    Toast.info('Text size: ' + cur + 'px');
  }
  function applySavedFontSize() {
    document.documentElement.style.setProperty('font-size', savedFontSize() + 'px');
  }
  applySavedFontSize();

  function renderWelcome(container) {
    const existing = Storage.listUsers();
    container.innerHTML = `
      <div class="welcome-shell">
        <section class="welcome-stage">
          <div class="welcome-copy">
            <p class="welcome-kicker">Canadian French · TCF preparation</p>
            <h1>French for the life <em>you’re building</em> in Canada.</h1>
            <p class="welcome-lede">A guided path to NCLC 6 through real conversations, Canadian French audio, and focused practice for the moments that matter.</p>
            <div class="welcome-proof" aria-label="Course highlights">
              <div><strong>92</strong><span>guided milestones</span></div>
              <div><strong>50</strong><span>real-life scenarios</span></div>
              <div><strong>4</strong><span>exam skills trained</span></div>
            </div>
          </div>

          <aside class="welcome-profile" aria-labelledby="welcome-profile-title">
            <p class="welcome-step">01 / Start here</p>
            <h2 id="welcome-profile-title">Choose how we should greet you.</h2>
            <p>This creates a private learning profile on this device. No account, password, or email.</p>
            <div class="welcome-form">
              <label for="uname">Your first name or nickname</label>
              <input class="input" id="uname" placeholder="e.g. Marie" maxlength="24" autocomplete="off" autocapitalize="off" aria-describedby="err welcome-private" />
              <div id="err" role="alert" style="color:#F1A0A6;margin-top:8px;font-size:13px;font-weight:600"></div>
              <button class="btn big" id="start">Begin my path<span class="arr">→</span></button>
            </div>
            <p class="welcome-private" id="welcome-private">Your progress stays in this browser and never leaves this device.</p>
          </aside>
        </section>

        <section class="lesson-preview" aria-label="Example French lesson">
          <div>
            <div class="preview-meta">A taste of your first lesson</div>
            <div class="preview-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </div>
          <div>
            <p class="preview-phrase" lang="fr">Je voudrais prendre rendez-vous.</p>
            <p class="preview-translation">I would like to make an appointment.</p>
          </div>
          <div class="preview-flow" aria-label="Learning sequence"><span>Listen</span><i></i><span>Repeat</span><i></i><span>Use it</span></div>
        </section>

      ${existing.length > 0 ? `
      <div class="welcome-existing">
        <p class="eyebrow" style="margin-bottom:12px">Continue as an existing learner</p>
        <div class="row" style="gap:var(--sp-2);flex-wrap:wrap">
          ${existing.map(u => `<button class="btn secondary" data-u="${escapeAttr(u)}">${escapeHTML(u)}</button>`).join('')}
        </div>
      </div>` : ''}

        <p class="welcome-trust">Free to use · No tracking · No account · Canadian French audio</p>
      </div>`;
    const inp = container.querySelector('#uname');
    const err = container.querySelector('#err');
    inp.focus();
    const start = () => {
      const raw = String(inp.value || '').trim();
      const name = sanitize(raw);
      if (!name) { err.textContent = 'Please type a username.'; return; }
      if (name !== raw) {
        err.textContent = 'Use only letters, numbers, spaces, hyphens, or underscores.';
        inp.setAttribute('aria-invalid', 'true');
        return;
      }
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
    inp.oninput = () => { err.textContent = ''; inp.removeAttribute('aria-invalid'); };
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
    const lessonsDone = App.pathDoneCount();
    const pct = Math.round((lessonsDone / LESSON_PATH.length) * 100);
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Profile'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Profile</p>
        <h1>${escapeHTML(cur || 'Guest')}</h1>
        <p style="margin-top:var(--sp-4)">${lessonsDone} of ${LESSON_PATH.length} milestones complete · ${pct}%</p>
      </section>

      <div class="grammar-box">
        <h3>Appearance</h3>
        <p style="color:var(--ink-2);font-size:var(--fs-14)">Theme and text size. Saved on this device.</p>
        <div class="spacer"></div>
        <div id="theme-seg" role="group" aria-label="Theme" style="display:inline-flex;gap:var(--sp-2);flex-wrap:wrap;margin-bottom:var(--sp-3)">
          <button class="btn secondary" data-theme-mode="system">System</button>
          <button class="btn secondary" data-theme-mode="light">Light</button>
          <button class="btn secondary" data-theme-mode="dark">Dark</button>
        </div>
        <div class="row">
          <button class="btn secondary" id="font-up">A+</button>
          <button class="btn secondary" id="font-down">A−</button>
        </div>
      </div>

      <div class="grammar-box">
        <h3>Sound</h3>
        <p style="color:var(--ink-2);font-size:var(--fs-14);margin-bottom:var(--sp-3)">Learning feedback is on by default. Routine interface sounds are optional.</p>
        <div class="toggle-row">
          <div class="info">
            <h4>Extra interface sounds</h4>
            <p>Optional taps for navigation, buttons, options, and controls. Blank space is always silent.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-clicks" ${Settings.isClickSoundOn() ? 'checked' : ''} aria-label="Extra interface sounds"/>
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
            <p>Burst when you complete a lesson or pass a knowledge check.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-confetti" ${Settings.isConfettiOn() ? 'checked' : ''} aria-label="Confetti on milestones"/>
        </div>
        <div class="toggle-row">
          <div class="info">
            <h4>Cheer squad</h4>
            <p>Colorful encouragement at useful learning moments. Never shown during timed exam work.</p>
          </div>
          <input type="checkbox" class="toggle" id="set-cheer-squad" ${Settings.isCheerSquadOn() ? 'checked' : ''} aria-label="Cheer squad"/>
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

      <div class="grammar-box" style="border-left-color:var(--good)">
        <h3>Backup &amp; restore</h3>
        <p style="color:var(--ink-2)">Your progress lives only in this browser — clearing browser data erases it. Download a backup file to keep it safe, or restore one here (works across devices and usernames).</p>
        <div class="spacer"></div>
        <div class="row" style="gap:var(--sp-2);flex-wrap:wrap">
          <button class="btn secondary" id="backup-dl">⬇️ Download backup</button>
          <button class="btn ghost" id="backup-restore">Restore from file…</button>
          <input type="file" id="backup-file" accept=".json,application/json" style="display:none" aria-hidden="true" />
        </div>
      </div>

      <div class="grammar-box" style="border-left-color:var(--warn)">
        <h3>⚠️ Reset my progress</h3>
        <p style="color:var(--ink-2)">Wipes all lessons, SRS, weak spots, and writing drafts. Username stays. Cannot be undone.</p>
        <div class="spacer"></div>
        <button class="btn" id="reset" style="background:var(--warn);color:var(--gray-900)">Reset progress</button>
      </div>

      <div class="grammar-box" style="border-left-color:var(--bad)">
        <h3>Delete my profile</h3>
        <p style="color:var(--ink-2)">Removes username <b>${escapeHTML(cur)}</b> and all its data from this browser. Cannot be undone.</p>
        <div class="spacer"></div>
        <button class="btn danger" id="delete">Delete this profile</button>
      </div>`;

    const themeSeg = container.querySelector('#theme-seg');
    const paintThemeSeg = () => {
      const cur = App.currentThemeMode();
      themeSeg.querySelectorAll('[data-theme-mode]').forEach(b => {
        const on = b.dataset.themeMode === cur;
        b.classList.toggle('primary', on);
        b.classList.toggle('secondary', !on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    };
    paintThemeSeg();
    themeSeg.querySelectorAll('[data-theme-mode]').forEach(b => {
      b.onclick = () => {
        App.setTheme(b.dataset.themeMode);
        paintThemeSeg();
        Toast.info('Theme: ' + b.dataset.themeMode);
      };
    });
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
    const cheerSquad = container.querySelector('#set-cheer-squad');
    if (cheerSquad) cheerSquad.onchange = (e) => {
      Settings.setCheerSquad(e.target.checked);
      if (!e.target.checked && window.CheerSquad) CheerSquad.dismiss();
      Toast.info(e.target.checked ? 'Cheer squad on' : 'Cheer squad off');
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
    // ---- Backup & restore ----
    container.querySelector('#backup-dl').onclick = () => {
      const payload = Storage.exportData();
      if (!payload) { Toast.info('Nothing to back up yet.'); return; }
      const count = Object.keys(payload.data).length;
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bonjour-backup-${cur}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      Toast.good(`Backup downloaded (${count} item${count === 1 ? '' : 's'}). Keep it somewhere safe.`);
    };
    const fileInput = container.querySelector('#backup-file');
    container.querySelector('#backup-restore').onclick = () => fileInput.click();
    fileInput.onchange = () => {
      const f = fileInput.files && fileInput.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        let obj = null;
        try { obj = JSON.parse(reader.result); } catch {}
        if (!obj || obj.app !== 'bonjour-frenchclb6') {
          Toast.info('That file is not a Bonjour! backup.');
          fileInput.value = '';
          return;
        }
        const n = Object.keys(obj.data || {}).length;
        const when = obj.exportedAt ? new Date(obj.exportedAt).toLocaleDateString() : 'unknown date';
        if (!confirm(`Restore backup of "${obj.user || 'unknown'}" (${n} items, saved ${when}) into profile "${cur}"?\n\nThis OVERWRITES the current progress of "${cur}".`)) {
          fileInput.value = '';
          return;
        }
        const restored = Storage.importData(obj);
        fileInput.value = '';
        if (restored < 0) { Toast.info('Could not read that backup.'); return; }
        Toast.good(`Restored ${restored} item${restored === 1 ? '' : 's'}. Welcome back!`);
        App.reloadForUser();
      };
      reader.readAsText(f);
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

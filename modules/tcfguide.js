// TCF Canada strategy guide, conversion table, test-day checklist.
// All static content. Three sub-routes accessible via /tcfguide.
window.TCFGuideModule = (function () {

  function render(container, params) {
    const sub = (params && params.sub) || 'overview';
    if (sub === 'strategy') return renderStrategy(container);
    if (sub === 'conversion') return renderConversion(container);
    if (sub === 'checklist') return renderChecklist(container);
    if (sub === 'history') return renderHistory(container);
    return renderOverview(container);
  }

  function renderOverview(container) {
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>🎯 TCF Canada Prep Guide</h1>
        <p>Current format, score references, strategy, and test-day preparation for an NCLC 6 target.</p>
      </div>
      <div class="grid">
        <div class="card" onclick="App.go('tcfguide', {sub:'strategy'})"><div class="icon">📋</div><h3>Strategy Guide</h3><p>Time-per-question, what to skip, register expectations, common traps.</p></div>
        <div class="card" onclick="App.go('tcfguide', {sub:'conversion'})"><div class="icon">📊</div><h3>Score Conversion Table</h3><p>TCF Canada 0-699 / 0-20 → CLB band. Official IRCC chart.</p></div>
        <div class="card" onclick="App.go('tcfguide', {sub:'checklist'})"><div class="icon">📅</div><h3>Test-Day Checklist</h3><p>What to bring, when to arrive, what to expect at the exam center.</p></div>
        <div class="card" onclick="App.go('tcfguide', {sub:'history'})"><div class="icon">📈</div><h3>My Practice History</h3><p>Your past four-skill simulations and raw practice evidence.</p></div>
      </div>
      <div class="spacer"></div>
      <div class="grammar-box">
        <h3>📚 What is the TCF Canada?</h3>
        <p>The <b>TCF Canada</b> (Test de connaissance du français) is a French proficiency test accepted by IRCC for Canadian economic immigration applications. It is one of the French tests listed by IRCC alongside TEF Canada.</p>
        <p style="margin-top:8px">Structure: 4 sections — <b>Compréhension orale (CO)</b>, <b>Compréhension écrite (CE)</b>, <b>Expression écrite (EE)</b>, <b>Expression orale (EO)</b>. Total test time is approximately 2h47.</p>
        <p style="margin-top:8px">CO and CE are 39 multiple-choice each, scored on the <b>0-699 scale</b>. EE and EO are graded by certified raters on a <b>0-20 scale</b>.</p>
        <p style="margin-top:8px"><b>For CLB 6 (Express Entry minimum for French points)</b>: you need CO ≥ 398, CE ≥ 406, EE ≥ 7/20, EO ≥ 7/20.</p>
      </div>
      ${Support.kitStrip()}
      <div class="center" style="margin-top:24px">
        <button class="btn ghost" onclick="App.go('home')">← Home</button>
      </div>`;
  }

  function renderStrategy(container) {
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>📋 TCF Strategy Guide</h1>
        <p>Tactical tips for each section. Read once, apply on test day.</p>
      </div>

      <div class="grammar-box">
        <h3>🎧 Compréhension orale (CO) — 35 min for 39 questions</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li><b>Audio plays ONCE.</b> No replay. This is the biggest mental shift from typical practice.</li>
          <li><b>Time per question: ~50 seconds.</b> Move fast.</li>
          <li><b>Read questions BEFORE the audio plays.</b> Each segment shows the question on screen first. Skim the options to predict what to listen for.</li>
          <li><b>If unsure, eliminate then guess.</b> Wrong answers don't penalize — every blank is a wasted opportunity.</li>
          <li>Common traps: numbers that sound alike (treize/seize, soixante/septante isn't used here but soixante-dix/quatre-vingt are tricky), distracting fillers, false-friend cognates.</li>
          <li>Difficulty climbs: Qs 1-15 easy, Qs 16-30 medium, Qs 31-39 hard. Don't burn time on Q 38 if you're shaky on Q 25.</li>
        </ul>
      </div>

      <div class="grammar-box">
        <h3>📖 Compréhension écrite (CE) — 60 min for 39 questions</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li><b>Time per question: ~90 seconds.</b> Tight but doable.</li>
          <li><b>Skim before reading carefully.</b> 5-second scan of text + questions, then read selectively.</li>
          <li><b>Scan for keywords.</b> Numbers, dates, names, capitalized words — usually the answer hooks.</li>
          <li>Question types: factual (~50%), inference (~20%), vocabulary in context (~15%), main idea (~15%).</li>
          <li><b>Vocabulary in context</b>: don't pick the dictionary meaning if context demands a different shade.</li>
          <li>Don't get stuck. Flag and move on. Return at the end.</li>
        </ul>
      </div>

      <div class="grammar-box">
        <h3>✍️ Expression écrite (EE) — 60 min for 3 tasks</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li><b>Task 1</b> (~10 min): short formal email/message, 60-120 words. <b>Always include</b> greeting (Madame, Monsieur,), reason, polite closing (Cordialement,).</li>
          <li><b>Task 2</b> (~20 min): descriptive article OR letter requesting info, 120-150 words. Structure: introduction, 2-3 body points, conclusion.</li>
          <li><b>Task 3</b> (~25 min): compare 2 opinion texts + give your own view, 120-180 words. <b>Critical structure</b>: 1) summarize both opinions (1-2 sentences each), 2) take YOUR position clearly, 3) give 2 reasons, 4) provide 1 concrete example.</li>
          <li><b>Use connectors</b>: cependant, par conséquent, d'une part... d'autre part, en revanche, par ailleurs. Markers raise scores significantly.</li>
          <li><b>Register</b>: Task 1 formal (vous), Task 3 can be slightly less formal but still polished.</li>
          <li><b>Save 5 minutes at the end</b> for proofreading: gender, verb agreement, accents, elisions.</li>
        </ul>
      </div>

      <div class="grammar-box">
        <h3>🎙️ Expression orale (EO) — 15 min for 3 tasks</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li><b>Task 1</b> (~3 min): self-intro + describe daily routine. <b>Prepare</b>: name, age, profession, family, hobbies, hometown, why you're learning French.</li>
          <li><b>Task 2</b> (~3-4 min): ask the examiner questions. <b>You're the interviewer</b>. Use varied structures: est-ce que, où, quand, comment, pourquoi, combien, quel(le), avez-vous, pourriez-vous...</li>
          <li><b>Task 3</b> (~5 min): argumentative monologue. Take a clear position. 3 reasons. 1 example. 1 counter-argument addressed ("Certes... cependant...").</li>
          <li><b>Speak slowly and clearly.</b> Better to say less well than to rush and make errors.</li>
          <li><b>Use the 30-second prep time</b> to outline (mental list of points). Don't write full sentences.</li>
          <li><b>Connectors aloud</b>: d'abord, ensuite, enfin, par conséquent, par exemple. Use them naturally to make the organization of your response easier to follow.</li>
          <li><b>Don't apologize for errors mid-flow.</b> Just keep going. Self-correction is fine, panic isn't.</li>
        </ul>
      </div>

      <div class="grammar-box" style="border-left-color:var(--warn)">
        <h3>⚠️ The 5 most common TCF Canada mistakes</h3>
        <ol style="margin-left:20px;line-height:1.8">
          <li><b>Replaying mentally</b> during CO. Once the audio ends, focus on the question — don't keep "rewinding" in your head.</li>
          <li><b>Skipping Task 3</b> on EE because of time. Even a rushed Task 3 scores more than a missing one.</li>
          <li><b>Speaking too fast</b> on EO Task 2/3. Pace builds confidence in the rater.</li>
          <li><b>Mixing tu/vous</b> on formal tasks. Default to vous always unless the prompt explicitly says otherwise.</li>
          <li><b>Forgetting accents</b> in writing. é/è/à/ç count. Train your fingers on the French keyboard before exam day.</li>
        </ol>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn ghost" onclick="App.go('tcfguide')">← Guide</button>
      </div>`;
  }

  function renderConversion(container) {
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>📊 TCF Canada → CLB Conversion</h1>
        <p>Official IRCC equivalency chart. Use this to set your target score before booking the exam.</p>
      </div>

      <table class="conj-table">
        <thead><tr><th>CLB</th><th>CO (Listening)</th><th>CE (Reading)</th><th>EE (Writing) /20</th><th>EO (Speaking) /20</th></tr></thead>
        <tbody>
          <tr><td><b>10</b></td><td>549-699</td><td>549-699</td><td>16-20</td><td>16-20</td></tr>
          <tr><td>9</td><td>523-548</td><td>524-548</td><td>14-15</td><td>14-15</td></tr>
          <tr><td>8</td><td>503-522</td><td>499-523</td><td>12-13</td><td>12-13</td></tr>
          <tr><td>7</td><td>458-502</td><td>453-498</td><td>10-11</td><td>10-11</td></tr>
          <tr style="background:rgba(52,199,89,.12)"><td><b>6</b></td><td><b>398-457</b></td><td><b>406-452</b></td><td><b>7-9</b></td><td><b>7-9</b></td></tr>
          <tr><td>5</td><td>369-397</td><td>375-405</td><td>6</td><td>6</td></tr>
          <tr><td>4</td><td>331-368</td><td>342-374</td><td>4-5</td><td>4-5</td></tr>
        </tbody>
      </table>

      <div class="grammar-box">
        <h3>📖 How to read this</h3>
        <p>To meet an all-skills NCLC 6 target, every TCF Canada result must reach the green row. IRCC assesses each language ability separately, so one stronger ability does not compensate for another below the program requirement.</p>
        <p style="margin-top:8px">Immigration eligibility and points rules depend on the program and can change. Confirm your exact requirements with IRCC before booking or submitting results.</p>
      </div>

      <div class="grammar-box" style="background:rgba(0,85,164,.08)">
        <h3>🔗 Official source</h3>
        <p>Conversion table from IRCC: <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-requirements/test-equivalency-charts.html" target="_blank" rel="noopener" style="color:var(--bleu)">canada.ca — language test equivalency charts</a></p>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn ghost" onclick="App.go('tcfguide')">← Guide</button>
      </div>`;
  }

  function renderChecklist(container) {
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>📅 TCF Test-Day Checklist</h1>
        <p>What to bring, when to arrive, what to expect.</p>
      </div>

      <div class="grammar-box">
        <h3>📅 Before the exam (1 week ahead)</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li>Confirm the test centre address, check-in time, and local instructions. The four test sections total approximately 2h47, excluding centre procedures.</li>
          <li>Practice typing in French on a French AZERTY keyboard if your exam uses one. Some centers offer QWERTY.</li>
          <li>Run 1–2 timed four-skill simulations, then use official sample material for final format rehearsal.</li>
          <li>Sleep 8+ hours the night before. No new content the day before.</li>
        </ul>
      </div>

      <div class="grammar-box">
        <h3>🎒 What to bring</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li><b>Photo ID</b>: passport (preferred) or government-issued ID exactly matching your registration.</li>
          <li><b>Test confirmation email/printout</b>.</li>
          <li><b>Water bottle</b> (clear, label removed at most centers).</li>
          <li><b>Snack</b> for the break (if your center allows one).</li>
          <li><b>Tissues</b>.</li>
          <li><b>Warm layer</b> — exam rooms are often air-conditioned.</li>
        </ul>
      </div>

      <div class="grammar-box" style="border-left-color:var(--bad)">
        <h3>🚫 What NOT to bring (will be confiscated or you'll be refused entry)</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li>Mobile phone, smartwatch, fitness tracker — all electronics.</li>
          <li>Dictionaries, notes, textbooks of any kind.</li>
          <li>Bags / backpacks (most centers provide lockers).</li>
          <li>Hats / hooded sweaters with hood up (you'll be asked to remove).</li>
        </ul>
      </div>

      <div class="grammar-box">
        <h3>🕐 At the center</h3>
        <ul style="margin-left:20px;line-height:1.8">
          <li><b>Arrive 30 minutes early.</b> Late arrivals are typically refused — money lost.</li>
          <li>Check-in: ID verification, biometric (photo, sometimes signature).</li>
          <li>Lockers for personal items. Wallet goes in too — keep ID separate.</li>
          <li>Restroom break BEFORE entering the exam room.</li>
          <li>Headphones provided. Test them in the warm-up section.</li>
        </ul>
      </div>

      <div class="grammar-box">
        <h3>⏱ Section order (typical)</h3>
        <ol style="margin-left:20px;line-height:1.8">
          <li><b>Compréhension orale</b> (35 min) — headphones, audio plays once</li>
          <li><b>Compréhension écrite</b> (60 min) — on screen, scratch paper allowed</li>
          <li><b>Expression écrite</b> (60 min) — 3 tasks, typed on screen</li>
          <li>Short break (some centers)</li>
          <li><b>Expression orale</b> (15 min, separate room) — face-to-face with examiner, recorded</li>
        </ol>
      </div>

      ${Support.kitCard('sheets')}
      <div class="grammar-box">
        <h3>📬 Results</h3>
        <p>France Éducation international transmits TCF Canada results to the test centre within <b>15 working days</b> after receiving the session materials. Your centre provides the official certificate, which is valid for <b>2 years</b>.</p>
        <p style="margin-top:8px">If you need a retake, wait at least <b>20 days</b> between TCF Canada sittings and confirm scheduling with your test centre.</p>
      </div>
      <div class="center" style="margin-top:24px">
        <button class="btn ghost" onclick="App.go('tcfguide')">← Guide</button>
      </div>`;
  }

  function renderHistory(container) {
    let history = [];
    try { history = JSON.parse(window.Storage.getItem('mockHistory') || '[]'); } catch {}
    container.innerHTML = `
      <div class="hero">
        <div class="flag-stripes"></div>
        <h1>📈 My Practice History</h1>
        <p>Your past four-skill simulations. ${history.length} attempt${history.length === 1 ? '' : 's'} recorded.</p>
      </div>
      ${history.length === 0 ? `
      <div class="empty">
        <div class="big-icon">🎯</div>
        <h2>No simulation attempts yet</h2>
        <p style="color:var(--mute)">Run the TCF Canada practice simulation to track your raw practice evidence here.</p>
        <div class="spacer"></div>
        <button class="btn big" onclick="App.go('mock')">Start practice simulation</button>
      </div>
      ` : renderHistoryList(history)}
      <div class="center" style="margin-top:24px">
        <button class="btn ghost" onclick="App.go('tcfguide')">← Guide</button>
      </div>`;
  }

  function renderHistoryList(history) {
    const fmt = (ts) => {
      const d = new Date(ts);
      return d.toLocaleDateString('fr-CA') + ' ' + d.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
    };
    return history.map((h, i) => {
      return `
        <div class="grammar-box">
          <h3>Attempt ${i + 1} · ${fmt(h.when)}</h3>
          <div class="row" style="margin-top:8px;flex-wrap:wrap">
            ${h.skills.map(s => {
              const result = typeof s.pct === 'number' && s.score === undefined
                ? `${s.pct}% practice${s.status ? ' · ' + s.status : ''}`
                : `${s.score}${typeof s.score === 'number' && s.score > 100 ? '' : '/20'} (CLB ${s.clb})`;
              return `<span class="tag" style="font-size:13px;padding:5px 12px">${iconFor(s.skill)} ${labelFor(s.skill)}: ${Chrome.escapeHTML(result)}</span>`;
            }).join('')}
          </div>
        </div>`;
    }).join('');
  }
  function iconFor(skill) { return { listen: '🎧', read: '📖', write: '✍️', speak: '🎙️' }[skill] || '📊'; }
  function labelFor(skill) { return { listen: 'CO', read: 'CE', write: 'EE', speak: 'EO' }[skill] || skill; }

  return { render };
})();

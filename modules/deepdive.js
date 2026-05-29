// Deep-dive pages — visual decision trees and side-by-side comparisons
// for the 4 grammar concepts that trip up CLB 6 candidates most.
//
// Routes:
//   #deepdive             → list of all deep-dives
//   #deepdive?topic=yen   → y vs en decision tree
//   #deepdive?topic=order → object pronoun order diagram
//   #deepdive?topic=si    → si-clauses 3 types side-by-side
//   #deepdive?topic=rel   → qui/que/dont/où flowchart

window.DeepDiveModule = (function () {
  const TOPICS = [
    {
      id: 'yen',
      icon: '🎯',
      title: 'y vs en',
      tag: 'CLB 6 trap',
      summary: 'Two tiny pronouns that replace huge phrases. Decide instantly with a 2-question tree.',
    },
    {
      id: 'order',
      icon: '🧩',
      title: 'Object pronoun order',
      tag: 'CLB 6 trap',
      summary: 'When you have two pronouns before the verb, the order is fixed. Visual table.',
    },
    {
      id: 'si',
      icon: '🔀',
      title: 'Si-clauses, 3 types',
      tag: 'CLB 6 trap',
      summary: 'Real, hypothetical now, regret past. Tenses must match — side-by-side.',
    },
    {
      id: 'rel',
      icon: '🔗',
      title: 'qui · que · dont · où',
      tag: 'CLB 6 trap',
      summary: 'Pick the right relative pronoun. Flowchart from the missing role.',
    },
  ];

  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ───────────────── LIST ─────────────────
  function renderList(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'home', crumbs: ['Home', 'Deep dives'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">Deep dives</p>
        <h1>The four traps.<br/>Solved visually.</h1>
        <p style="margin-top:var(--sp-4)">The grammar points that decide CLB 5 vs CLB 6 graded outputs. Decision trees, not memorization.</p>
      </section>
      <div class="grid">
        ${TOPICS.map(t => `
          <div class="card" data-topic="${t.id}">
            <div class="icon">${t.icon}</div>
            <h3>${escapeHTML(t.title)} <span class="tag verb">${escapeHTML(t.tag)}</span></h3>
            <p>${escapeHTML(t.summary)}</p>
          </div>`).join('')}
      </div>
      <div class="spacer lg"></div>
      <div class="grammar-box">
        <h3>Why these four?</h3>
        <p>These topics aren't separately graded on the TCF, but mistakes here are <b>the most reliable signal</b> that a writer/speaker is below CLB 6. Native graders catch them in seconds. Master these and you cross the threshold.</p>
      </div>
    `;
    container.querySelectorAll('[data-topic]').forEach(el => {
      el.onclick = () => App.go('deepdive', { topic: el.dataset.topic });
    });
  }

  // ───────────────── y vs en ─────────────────
  function renderYen(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'deepdive', crumbs: ['Deep dives', 'y vs en'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">🎯 Decision tree</p>
        <h1>y vs en</h1>
        <p style="margin-top:var(--sp-4)">What word introduces the thing you're replacing? <b>à</b> or place → y. <b>de</b> or quantity → en. Two questions, done.</p>
      </section>

      <div class="grammar-box">
        <h3>The two questions</h3>
        <p><b>Q1.</b> Is what I'm replacing introduced by <b>à</b> (or refers to a <b>location</b>)? → <b>y</b></p>
        <p><b>Q2.</b> Is what I'm replacing introduced by <b>de</b> (or a <b>quantity</b> like du / des / un peu de / trois)? → <b>en</b></p>
        <p style="margin-top:var(--sp-3);color:var(--mute);font-size:var(--fs-14)">If neither: it's probably a regular object pronoun (le, la, les, lui, leur) — not y/en.</p>
      </div>

      <h2 class="section-h">Y — examples by trigger</h2>
      <div class="card" style="cursor:default">
        <table class="conj-table"><thead><tr><th>Trigger</th><th>Full sentence</th><th>With y</th></tr></thead><tbody>
          <tr><td>à + place</td><td>Je vais à Paris.</td><td>J'<b>y</b> vais.</td></tr>
          <tr><td>en + place</td><td>Il habite en France.</td><td>Il <b>y</b> habite.</td></tr>
          <tr><td>dans + place</td><td>Elle est dans le jardin.</td><td>Elle <b>y</b> est.</td></tr>
          <tr><td>à + idea (penser à)</td><td>Je pense à mon travail.</td><td>J'<b>y</b> pense.</td></tr>
          <tr><td>à + idea (réfléchir à)</td><td>Tu réfléchis à la question.</td><td>Tu <b>y</b> réfléchis.</td></tr>
        </tbody></table>
      </div>

      <h2 class="section-h">En — examples by trigger</h2>
      <div class="card" style="cursor:default">
        <table class="conj-table"><thead><tr><th>Trigger</th><th>Full sentence</th><th>With en</th></tr></thead><tbody>
          <tr><td>de + thing (parler de)</td><td>Elle parle de son livre.</td><td>Elle <b>en</b> parle.</td></tr>
          <tr><td>de + place (origin)</td><td>Je viens de Paris.</td><td>J'<b>en</b> viens.</td></tr>
          <tr><td>partitive du/de la/des</td><td>Je mange du pain.</td><td>J'<b>en</b> mange.</td></tr>
          <tr><td>quantity (number)</td><td>Nous avons trois enfants.</td><td>Nous <b>en</b> avons trois.</td></tr>
          <tr><td>quantity (un peu de)</td><td>Je veux un peu de café.</td><td>J'<b>en</b> veux un peu.</td></tr>
        </tbody></table>
      </div>

      <h2 class="section-h">The 4 verbs that always trip people up</h2>
      <div class="grammar-box">
        <p><b>penser</b> can take both. <i>Penser à</i> = think about (→ y). <i>Penser de</i> = have an opinion on (→ en).</p>
        <div class="example">Je pense à mes vacances. → J'<b>y</b> pense souvent. (about)</div>
        <div class="example">Que penses-tu de mon idée ? → Qu'en penses-<b>en</b>-tu ? — actually: Qu'<b>en</b> penses-tu ? (opinion of)</div>
        <p style="margin-top:var(--sp-3)"><b>parler</b> uses de → en for the topic, à → indirect object pronoun (lui/leur) for the person.</p>
        <div class="example">Je parle de mon travail. → J'<b>en</b> parle.</div>
        <div class="example">Je parle à Marie. → Je <b>lui</b> parle. (not y)</div>
      </div>

      <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
        <button class="btn primary big" onclick="App.go('grammar', { unit: 'g14-y-en' })">Practice quiz<span class="arr">→</span></button>
        <button class="btn ghost big" onclick="App.go('deepdive')">Other deep dives</button>
      </div>
    `;
  }

  // ───────────────── Object pronoun order ─────────────────
  function renderOrder(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'deepdive', crumbs: ['Deep dives', 'Pronoun order'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">🧩 Visual table</p>
        <h1>Two pronouns?<br/>Fixed order.</h1>
        <p style="margin-top:var(--sp-4)">When two object pronouns stack before the verb, the order is not your choice. Memorize this table.</p>
      </section>

      <div class="grammar-box">
        <h3>The order — left to right, before the verb</h3>
        <div class="card" style="cursor:default;margin-top:var(--sp-3);overflow-x:auto">
          <table class="conj-table">
            <thead><tr>
              <th style="background:rgba(94,92,230,.15)">1</th>
              <th style="background:rgba(94,92,230,.15)">2</th>
              <th style="background:rgba(94,92,230,.15)">3</th>
              <th style="background:rgba(94,92,230,.15)">4</th>
              <th style="background:rgba(94,92,230,.15)">5</th>
              <th>VERB</th>
            </tr></thead>
            <tbody>
              <tr>
                <td><b>me<br/>te<br/>se<br/>nous<br/>vous</b></td>
                <td><b>le<br/>la<br/>les</b></td>
                <td><b>lui<br/>leur</b></td>
                <td><b>y</b></td>
                <td><b>en</b></td>
                <td style="color:var(--mute)">verb here</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="margin-top:var(--sp-3);color:var(--mute);font-size:var(--fs-14)">Note: columns 1 and 3 are mutually exclusive. You can have me+le but never me+lui — French uses a workaround ("à moi").</p>
      </div>

      <h2 class="section-h">Worked examples</h2>
      <div class="card" style="cursor:default">
        <table class="conj-table"><thead><tr><th>English</th><th>Step by step</th><th>Final</th></tr></thead><tbody>
          <tr><td>He gives the book to Marie.</td><td>Il donne <b>le livre</b> (le) <b>à Marie</b> (lui).</td><td>Il <b>le lui</b> donne.</td></tr>
          <tr><td>I give you (sg) some bread.</td><td>Je donne <b>du pain</b> (en) <b>à toi</b> (te).</td><td>Je <b>t'en</b> donne.</td></tr>
          <tr><td>She brings them to us.</td><td>Elle apporte <b>les choses</b> (les) <b>à nous</b> (nous).</td><td>Elle <b>nous les</b> apporte.</td></tr>
          <tr><td>I send the letter there (to the office).</td><td>J'envoie <b>la lettre</b> (la) <b>au bureau</b> (y).</td><td>Je <b>l'y</b> envoie.</td></tr>
          <tr><td>He gives some to them.</td><td>Il donne <b>du pain</b> (en) <b>à eux</b> (leur).</td><td>Il <b>leur en</b> donne.</td></tr>
        </tbody></table>
      </div>

      <h2 class="section-h">Negative + passé composé wrapper</h2>
      <div class="grammar-box">
        <p>The pronouns still stick together right before the auxiliary. Negation wraps the whole pronoun-auxiliary block.</p>
        <div class="example">Il ne <b>me l'</b>a pas donné. (He didn't give it to me.)</div>
        <div class="example">Je ne <b>leur en</b> ai jamais parlé. (I never spoke to them about it.)</div>
      </div>

      <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
        <button class="btn primary big" onclick="App.go('grammar', { unit: 'g11-pronouns' })">Practice quiz<span class="arr">→</span></button>
        <button class="btn ghost big" onclick="App.go('deepdive')">Other deep dives</button>
      </div>
    `;
  }

  // ───────────────── Si-clauses ─────────────────
  function renderSi(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'deepdive', crumbs: ['Deep dives', 'Si-clauses'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">🔀 Three types, side-by-side</p>
        <h1>Si + what?<br/>And then what?</h1>
        <p style="margin-top:var(--sp-4)">Three si-clause types. Each has a strict tense pairing. Never conditional after si.</p>
      </section>

      <div class="grammar-box" style="border-left-color:var(--good)">
        <h3>Type 1 — Real / likely</h3>
        <p><b>Formula:</b> si + <b>présent</b> → <b>présent</b> or <b>futur</b></p>
        <div class="example">Si tu <b>veux</b>, on <b>sort</b>. (If you want, we go out.)</div>
        <div class="example">S'il <b>fait</b> beau demain, je <b>partirai</b> tôt. (If it's nice tomorrow, I'll leave early.)</div>
        <p style="color:var(--mute);font-size:var(--fs-14);margin-top:var(--sp-3)">Use this when the condition is genuinely possible right now or in the near future.</p>
      </div>

      <div class="grammar-box" style="border-left-color:var(--warn)">
        <h3>Type 2 — Hypothetical now / unreal present</h3>
        <p><b>Formula:</b> si + <b>imparfait</b> → <b>conditionnel</b></p>
        <div class="example">Si j'<b>avais</b> de l'argent, je <b>voyagerais</b>. (If I had money, I would travel.)</div>
        <div class="example">Si tu <b>voulais</b>, tu <b>pourrais</b>. (If you wanted, you could.)</div>
        <p style="color:var(--mute);font-size:var(--fs-14);margin-top:var(--sp-3)">Use when the condition is unlikely or imagined. English uses "would" — French uses conditionnel.</p>
      </div>

      <div class="grammar-box" style="border-left-color:var(--bad)">
        <h3>Type 3 — Regret about the past / unreal past</h3>
        <p><b>Formula:</b> si + <b>plus-que-parfait</b> → <b>conditionnel passé</b></p>
        <div class="example">Si j'<b>avais étudié</b>, j'<b>aurais réussi</b>. (If I had studied, I would have succeeded.)</div>
        <div class="example">Si tu <b>étais venu</b>, on <b>serait sortis</b>. (If you had come, we would have gone out.)</div>
        <p style="color:var(--mute);font-size:var(--fs-14);margin-top:var(--sp-3)">Use to talk about an unchangeable past — regret, missed opportunity. Sounds CLB 6 by itself.</p>
      </div>

      <h2 class="section-h">Side-by-side cheat sheet</h2>
      <div class="card" style="cursor:default;overflow-x:auto">
        <table class="conj-table">
          <thead><tr>
            <th>Type</th><th>If-clause</th><th>Main clause</th><th>Meaning</th>
          </tr></thead>
          <tbody>
            <tr><td><b>1 Real</b></td><td>si + présent</td><td>présent / futur</td><td>Possible now</td></tr>
            <tr><td><b>2 Unreal now</b></td><td>si + imparfait</td><td>conditionnel</td><td>Hypothetical</td></tr>
            <tr><td><b>3 Unreal past</b></td><td>si + plus-que-parfait</td><td>conditionnel passé</td><td>Regret about past</td></tr>
          </tbody>
        </table>
      </div>

      <div class="grammar-box" style="border-left-color:var(--bad)">
        <h3>⚠️ The #1 mistake</h3>
        <p><b>Never</b> put conditionnel after <b>si</b>. Ever.</p>
        <div class="example" style="color:var(--bad);text-decoration:line-through">Si je voudrais, je sortirais.</div>
        <div class="example" style="color:var(--good)">Si je voulais, je sortirais.</div>
        <p>The si-clause itself uses présent / imparfait / plus-que-parfait. The conditional sits in the main clause, never inside the si.</p>
      </div>

      <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
        <button class="btn primary big" onclick="App.go('grammar', { unit: 'g18-si' })">Practice quiz<span class="arr">→</span></button>
        <button class="btn ghost big" onclick="App.go('deepdive')">Other deep dives</button>
      </div>
    `;
  }

  // ───────────────── Relative pronouns ─────────────────
  function renderRel(container) {
    container.innerHTML = `
      ${Chrome.render({ back: 'deepdive', crumbs: ['Deep dives', 'qui · que · dont · où'] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">🔗 Flowchart</p>
        <h1>Pick the<br/>missing role.</h1>
        <p style="margin-top:var(--sp-4)">Find what role the missing piece plays in the second clause. The role tells you the pronoun.</p>
      </section>

      <div class="grammar-box">
        <h3>The 4-step decision</h3>
        <p><b>Step 1.</b> Cover the relative pronoun. Read the second clause as a stand-alone sentence with a blank.</p>
        <p><b>Step 2.</b> What role does the blank play?</p>
        <ul style="margin-left:20px;margin-top:var(--sp-2);line-height:var(--lh-loose)">
          <li>Subject of the verb → <b>qui</b></li>
          <li>Direct object of the verb → <b>que</b></li>
          <li>Tied to <b>de</b> (parler de, parler des, fier de, etc.) → <b>dont</b></li>
          <li>Place or time → <b>où</b></li>
          <li>Tied to <b>à</b> or other preposition + person → <b>à qui</b>, <b>pour qui</b>, etc.</li>
        </ul>
      </div>

      <h2 class="section-h">Worked examples</h2>
      <div class="card" style="cursor:default;overflow-x:auto">
        <table class="conj-table"><thead><tr><th>Sentence</th><th>Test</th><th>Pronoun</th></tr></thead><tbody>
          <tr>
            <td>La femme <b>___</b> parle est ma sœur.</td>
            <td>"___ parle" — blank is the SUBJECT of parle.</td>
            <td><b>qui</b></td>
          </tr>
          <tr>
            <td>Le livre <b>___</b> je lis est intéressant.</td>
            <td>"je lis ___" — blank is the OBJECT of lis.</td>
            <td><b>que</b></td>
          </tr>
          <tr>
            <td>L'homme <b>___</b> je parle est gentil.</td>
            <td>"je parle de ___" — tied to de.</td>
            <td><b>dont</b></td>
          </tr>
          <tr>
            <td>La ville <b>___</b> j'habite est belle.</td>
            <td>habiter à + place → place.</td>
            <td><b>où</b></td>
          </tr>
          <tr>
            <td>L'ami <b>___</b> j'écris habite à Paris.</td>
            <td>"j'écris à ___" — tied to à + person.</td>
            <td><b>à qui</b></td>
          </tr>
          <tr>
            <td>Le jour <b>___</b> on s'est rencontrés…</td>
            <td>"___" is a TIME marker.</td>
            <td><b>où</b></td>
          </tr>
        </tbody></table>
      </div>

      <h2 class="section-h">Dont — the deceptively powerful one</h2>
      <div class="grammar-box">
        <p><b>dont</b> = "of which" / "whose." It replaces <b>de + noun</b> in the second clause. Use it whenever the verb takes <b>de</b> or there's a "of" relationship.</p>
        <div class="example">Le livre <b>dont</b> je parle. (parler <b>de</b>)</div>
        <div class="example">L'homme <b>dont</b> la voiture est rouge. (la voiture <b>de</b> cet homme)</div>
        <div class="example">Le projet <b>dont</b> je suis fier. (fier <b>de</b>)</div>
        <p style="margin-top:var(--sp-3)">Using <b>dont</b> correctly is a major CLB 6 marker. Most learners avoid it. Practice using it on purpose.</p>
      </div>

      <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
        <button class="btn primary big" onclick="App.go('grammar', { unit: 'g15-relative' })">Practice quiz<span class="arr">→</span></button>
        <button class="btn ghost big" onclick="App.go('deepdive')">Other deep dives</button>
      </div>
    `;
  }

  return {
    render(container, params) {
      const topic = params && params.topic;
      if (topic === 'yen')   return renderYen(container);
      if (topic === 'order') return renderOrder(container);
      if (topic === 'si')    return renderSi(container);
      if (topic === 'rel')   return renderRel(container);
      return renderList(container);
    }
  };
})();

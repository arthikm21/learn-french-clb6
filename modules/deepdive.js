// Deep-dive pages — visual decision trees and side-by-side comparisons for
// the 4 grammar concepts that trip up CLB 6 candidates most.
//
// The four topics share a fixed page shape: hero + N content sections +
// footer buttons. So each topic is declared as data (hero copy + sections),
// and a single `renderTopic` walks the structure. Adding a 5th deep-dive
// = appending one entry to TOPICS.
//
// Section shapes accepted in topic.sections:
//   { kind: 'box',    border, heading, html }
//   { kind: 'table',  heading, columns, rows }     // wrapped in .card
//   { kind: 'h2',     text }                       // section heading
//
// Routes:
//   #deepdive                → list of topics
//   #deepdive?topic=<id>     → topic page

window.DeepDiveModule = (function () {
  const escapeHTML = Chrome.escapeHTML;

  // Shared border colors for the box sections by intent
  const BORDER = {
    info: 'var(--line)',
    accent: 'var(--accent)',
    good: 'var(--good)',
    warn: 'var(--warn)',
    bad: 'var(--bad)',
    blue: 'var(--bleu)',
  };

  // ───────────────── Topic data ─────────────────
  const TOPICS = [
    // ---------- y vs en ----------
    {
      id: 'yen', icon: '🎯', title: 'y vs en', tag: 'CLB 6 trap',
      summary: 'Two tiny pronouns that replace huge phrases. Decide instantly with a 2-question tree.',
      eyebrow: '🎯 Decision tree',
      heroTitle: 'y vs en',
      heroLede: "What word introduces the thing you're replacing? <b>à</b> or place → y. <b>de</b> or quantity → en. Two questions, done.",
      practiceUnit: 'g14-y-en',
      sections: [
        { kind: 'box', border: BORDER.info, heading: 'The two questions', html: `
          <p><b>Q1.</b> Is what I'm replacing introduced by <b>à</b> (or refers to a <b>location</b>)? → <b>y</b></p>
          <p><b>Q2.</b> Is what I'm replacing introduced by <b>de</b> (or a <b>quantity</b> like du / des / un peu de / trois)? → <b>en</b></p>
          <p style="margin-top:var(--sp-3);color:var(--mute);font-size:var(--fs-14)">If neither: it's probably a regular object pronoun (le, la, les, lui, leur) — not y/en.</p>` },
        { kind: 'h2', text: 'Y — examples by trigger' },
        { kind: 'table', columns: ['Trigger', 'Full sentence', 'With y'], rows: [
          ['à + place', 'Je vais à Paris.', "J'<b>y</b> vais."],
          ['en + place', 'Il habite en France.', 'Il <b>y</b> habite.'],
          ['dans + place', 'Elle est dans le jardin.', 'Elle <b>y</b> est.'],
          ['à + idea (penser à)', 'Je pense à mon travail.', "J'<b>y</b> pense."],
          ['à + idea (réfléchir à)', 'Tu réfléchis à la question.', 'Tu <b>y</b> réfléchis.'],
        ] },
        { kind: 'h2', text: 'En — examples by trigger' },
        { kind: 'table', columns: ['Trigger', 'Full sentence', 'With en'], rows: [
          ['de + thing (parler de)', 'Elle parle de son livre.', 'Elle <b>en</b> parle.'],
          ['de + place (origin)', 'Je viens de Paris.', "J'<b>en</b> viens."],
          ['partitive du/de la/des', 'Je mange du pain.', "J'<b>en</b> mange."],
          ['quantity (number)', 'Nous avons trois enfants.', 'Nous <b>en</b> avons trois.'],
          ['quantity (un peu de)', 'Je veux un peu de café.', "J'<b>en</b> veux un peu."],
        ] },
        { kind: 'h2', text: 'The 4 verbs that always trip people up' },
        { kind: 'box', border: BORDER.info, heading: '', html: `
          <p><b>penser</b> can take both. <i>Penser à</i> = think about (→ y). <i>Penser de</i> = have an opinion on (→ en).</p>
          <div class="example">Je pense à mes vacances. → J'<b>y</b> pense souvent. (about)</div>
          <div class="example">Que penses-tu de mon idée ? → Qu'<b>en</b> penses-tu ? (opinion of)</div>
          <p style="margin-top:var(--sp-3)"><b>parler</b> uses de → en for the topic, à → indirect object pronoun (lui/leur) for the person.</p>
          <div class="example">Je parle de mon travail. → J'<b>en</b> parle.</div>
          <div class="example">Je parle à Marie. → Je <b>lui</b> parle. (not y)</div>` },
      ],
    },

    // ---------- Object pronoun order ----------
    {
      id: 'order', icon: '🧩', title: 'Object pronoun order', tag: 'CLB 6 trap',
      summary: 'When you have two pronouns before the verb, the order is fixed. Visual table.',
      eyebrow: '🧩 Visual table',
      heroTitle: 'Two pronouns?<br/>Fixed order.',
      heroLede: 'When two object pronouns stack before the verb, the order is not your choice. Memorize this table.',
      practiceUnit: 'g11-pronouns',
      sections: [
        { kind: 'box', border: BORDER.info, heading: 'The order — left to right, before the verb', html: `
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
          <p style="margin-top:var(--sp-3);color:var(--mute);font-size:var(--fs-14)">Note: columns 1 and 3 are mutually exclusive. You can have me+le but never me+lui — French uses a workaround ("à moi").</p>` },
        { kind: 'h2', text: 'Worked examples' },
        { kind: 'table', columns: ['English', 'Step by step', 'Final'], rows: [
          ['He gives the book to Marie.', 'Il donne <b>le livre</b> (le) <b>à Marie</b> (lui).', 'Il <b>le lui</b> donne.'],
          ['I give you (sg) some bread.', 'Je donne <b>du pain</b> (en) <b>à toi</b> (te).', "Je <b>t'en</b> donne."],
          ['She brings them to us.', 'Elle apporte <b>les choses</b> (les) <b>à nous</b> (nous).', 'Elle <b>nous les</b> apporte.'],
          ['I send the letter there (to the office).', "J'envoie <b>la lettre</b> (la) <b>au bureau</b> (y).", "Je <b>l'y</b> envoie."],
          ['He gives some to them.', 'Il donne <b>du pain</b> (en) <b>à eux</b> (leur).', 'Il <b>leur en</b> donne.'],
        ] },
        { kind: 'h2', text: 'Negative + passé composé wrapper' },
        { kind: 'box', border: BORDER.info, heading: '', html: `
          <p>The pronouns still stick together right before the auxiliary. Negation wraps the whole pronoun-auxiliary block.</p>
          <div class="example">Il ne <b>me l'</b>a pas donné. (He didn't give it to me.)</div>
          <div class="example">Je ne <b>leur en</b> ai jamais parlé. (I never spoke to them about it.)</div>` },
      ],
    },

    // ---------- Si-clauses ----------
    {
      id: 'si', icon: '🔀', title: 'Si-clauses, 3 types', tag: 'CLB 6 trap',
      summary: 'Real, hypothetical now, regret past. Tenses must match — side-by-side.',
      eyebrow: '🔀 Three types, side-by-side',
      heroTitle: 'Si + what?<br/>And then what?',
      heroLede: 'Three si-clause types. Each has a strict tense pairing. Never conditional after si.',
      practiceUnit: 'g18-si',
      sections: [
        { kind: 'box', border: BORDER.good, heading: 'Type 1 — Real / likely', html: `
          <p><b>Formula:</b> si + <b>présent</b> → <b>présent</b> or <b>futur</b></p>
          <div class="example">Si tu <b>veux</b>, on <b>sort</b>. (If you want, we go out.)</div>
          <div class="example">S'il <b>fait</b> beau demain, je <b>partirai</b> tôt. (If it's nice tomorrow, I'll leave early.)</div>
          <p style="color:var(--mute);font-size:var(--fs-14);margin-top:var(--sp-3)">Use this when the condition is genuinely possible right now or in the near future.</p>` },
        { kind: 'box', border: BORDER.warn, heading: 'Type 2 — Hypothetical now / unreal present', html: `
          <p><b>Formula:</b> si + <b>imparfait</b> → <b>conditionnel</b></p>
          <div class="example">Si j'<b>avais</b> de l'argent, je <b>voyagerais</b>. (If I had money, I would travel.)</div>
          <div class="example">Si tu <b>voulais</b>, tu <b>pourrais</b>. (If you wanted, you could.)</div>
          <p style="color:var(--mute);font-size:var(--fs-14);margin-top:var(--sp-3)">Use when the condition is unlikely or imagined. English uses "would" — French uses conditionnel.</p>` },
        { kind: 'box', border: BORDER.bad, heading: 'Type 3 — Regret about the past / unreal past', html: `
          <p><b>Formula:</b> si + <b>plus-que-parfait</b> → <b>conditionnel passé</b></p>
          <div class="example">Si j'<b>avais étudié</b>, j'<b>aurais réussi</b>. (If I had studied, I would have succeeded.)</div>
          <div class="example">Si tu <b>étais venu</b>, on <b>serait sortis</b>. (If you had come, we would have gone out.)</div>
          <p style="color:var(--mute);font-size:var(--fs-14);margin-top:var(--sp-3)">Use to talk about an unchangeable past — regret, missed opportunity. Sounds CLB 6 by itself.</p>` },
        { kind: 'h2', text: 'Side-by-side cheat sheet' },
        { kind: 'table', columns: ['Type', 'If-clause', 'Main clause', 'Meaning'], rows: [
          ['<b>1 Real</b>', 'si + présent', 'présent / futur', 'Possible now'],
          ['<b>2 Unreal now</b>', 'si + imparfait', 'conditionnel', 'Hypothetical'],
          ['<b>3 Unreal past</b>', 'si + plus-que-parfait', 'conditionnel passé', 'Regret about past'],
        ] },
        { kind: 'box', border: BORDER.bad, heading: '⚠️ The #1 mistake', html: `
          <p><b>Never</b> put conditionnel after <b>si</b>. Ever.</p>
          <div class="example" style="color:var(--bad);text-decoration:line-through">Si je voudrais, je sortirais.</div>
          <div class="example" style="color:var(--good)">Si je voulais, je sortirais.</div>
          <p>The si-clause itself uses présent / imparfait / plus-que-parfait. The conditional sits in the main clause, never inside the si.</p>` },
      ],
    },

    // ---------- Relative pronouns ----------
    {
      id: 'rel', icon: '🔗', title: 'qui · que · dont · où', tag: 'CLB 6 trap',
      summary: 'Pick the right relative pronoun. Flowchart from the missing role.',
      eyebrow: '🔗 Flowchart',
      heroTitle: 'Pick the<br/>missing role.',
      heroLede: 'Find what role the missing piece plays in the second clause. The role tells you the pronoun.',
      practiceUnit: 'g15-relative',
      sections: [
        { kind: 'box', border: BORDER.info, heading: 'The 4-step decision', html: `
          <p><b>Step 1.</b> Cover the relative pronoun. Read the second clause as a stand-alone sentence with a blank.</p>
          <p><b>Step 2.</b> What role does the blank play?</p>
          <ul style="margin-left:20px;margin-top:var(--sp-2);line-height:var(--lh-loose)">
            <li>Subject of the verb → <b>qui</b></li>
            <li>Direct object of the verb → <b>que</b></li>
            <li>Tied to <b>de</b> (parler de, parler des, fier de, etc.) → <b>dont</b></li>
            <li>Place or time → <b>où</b></li>
            <li>Tied to <b>à</b> or other preposition + person → <b>à qui</b>, <b>pour qui</b>, etc.</li>
          </ul>` },
        { kind: 'h2', text: 'Worked examples' },
        { kind: 'table', columns: ['Sentence', 'Test', 'Pronoun'], rows: [
          ['La femme <b>___</b> parle est ma sœur.', '"___ parle" — blank is the SUBJECT of parle.', '<b>qui</b>'],
          ['Le livre <b>___</b> je lis est intéressant.', '"je lis ___" — blank is the OBJECT of lis.', '<b>que</b>'],
          ["L'homme <b>___</b> je parle est gentil.", '"je parle de ___" — tied to de.', '<b>dont</b>'],
          ["La ville <b>___</b> j'habite est belle.", 'habiter à + place → place.', '<b>où</b>'],
          ["L'ami <b>___</b> j'écris habite à Paris.", "\"j'écris à ___\" — tied to à + person.", '<b>à qui</b>'],
          ["Le jour <b>___</b> on s'est rencontrés…", '"___" is a TIME marker.', '<b>où</b>'],
        ] },
        { kind: 'h2', text: 'Dont — the deceptively powerful one' },
        { kind: 'box', border: BORDER.info, heading: '', html: `
          <p><b>dont</b> = "of which" / "whose." It replaces <b>de + noun</b> in the second clause. Use it whenever the verb takes <b>de</b> or there's a "of" relationship.</p>
          <div class="example">Le livre <b>dont</b> je parle. (parler <b>de</b>)</div>
          <div class="example">L'homme <b>dont</b> la voiture est rouge. (la voiture <b>de</b> cet homme)</div>
          <div class="example">Le projet <b>dont</b> je suis fier. (fier <b>de</b>)</div>
          <p style="margin-top:var(--sp-3)">Using <b>dont</b> correctly is a major CLB 6 marker. Most learners avoid it. Practice using it on purpose.</p>` },
      ],
    },
  ];

  // ───────────────── Section renderers ─────────────────
  function sectionHTML(s) {
    if (s.kind === 'h2') {
      return `<h2 class="section-h">${s.text}</h2>`;
    }
    if (s.kind === 'box') {
      const border = s.border ? `style="border-left-color:${s.border}"` : '';
      const heading = s.heading ? `<h3>${s.heading}</h3>` : '';
      return `<div class="grammar-box" ${border}>${heading}${s.html}</div>`;
    }
    if (s.kind === 'table') {
      const head = s.columns.map(c => `<th>${c}</th>`).join('');
      const body = s.rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
      return `<div class="card" style="cursor:default;overflow-x:auto">
        <table class="conj-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
      </div>`;
    }
    return '';
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

  // ───────────────── TOPIC ─────────────────
  function renderTopic(container, t) {
    container.innerHTML = `
      ${Chrome.render({ back: 'deepdive', crumbs: ['Deep dives', t.title] })}
      <section class="hero">
        <div class="flag-stripes"></div>
        <p class="eyebrow-h">${t.eyebrow}</p>
        <h1>${t.heroTitle}</h1>
        <p style="margin-top:var(--sp-4)">${t.heroLede}</p>
      </section>
      ${t.sections.map(sectionHTML).join('')}
      <div class="row" style="justify-content:center;margin-top:var(--sp-7);gap:var(--sp-3)">
        <button class="btn primary big" onclick="App.go('grammar', { unit: '${t.practiceUnit}' })">Practice quiz<span class="arr">→</span></button>
        <button class="btn ghost big" onclick="App.go('deepdive')">Other deep dives</button>
      </div>
    `;
  }

  return {
    render(container, params) {
      const id = params && params.topic;
      const t = id && TOPICS.find(x => x.id === id);
      return t ? renderTopic(container, t) : renderList(container);
    }
  };
})();

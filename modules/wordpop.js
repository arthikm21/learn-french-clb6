// Tap-any-French-word: click a French word anywhere → hear pronunciation + see English meaning.
// Looks up word in VOCAB data; falls back to TTS only if no entry.
window.WordPop = (function () {
  let lookup = null;
  let popup = null;

  function buildLookup() {
    if (lookup) return lookup;
    lookup = {};
    if (window.VOCAB) {
      for (const k of Object.keys(window.VOCAB)) {
        for (const c of (window.VOCAB[k].cards || [])) {
          // index by lowercase fr (strip article)
          const fr = String(c.fr).toLowerCase();
          lookup[fr] = c;
          // also bare noun (without le/la/l'/un/une/des)
          const bare = fr.replace(/^(le |la |l'|les |un |une |des |de la |du |de l')/, '');
          if (bare !== fr) lookup[bare] = c;
        }
      }
    }
    return lookup;
  }

  function ensurePopup() {
    if (popup && document.body.contains(popup)) return popup;
    popup = document.createElement('div');
    popup.id = 'wordpop';
    document.body.appendChild(popup);
    document.addEventListener('click', (e) => {
      if (popup && !popup.contains(e.target)) hide();
    }, true);
    return popup;
  }

  function hide() { if (popup) popup.classList.remove('open'); }

  function show(word, anchor) {
    const p = ensurePopup();
    const map = buildLookup();
    // Try exact, lowercase, and strip-accents lookups
    const w = String(word).toLowerCase().replace(/[.,!?;:"]/g, '').trim();
    const card = map[w] || map[w.normalize('NFD').replace(/[̀-ͯ]/g, '')];
    const meaning = card ? card.en : '<i>no dictionary entry</i>';
    const fr = card ? card.fr : word;
    const example = card && card.ex ? `<div style="font-style:italic;color:var(--mute);margin-top:6px;font-size:13px">${escapeHTML(card.ex)}</div>` : '';
    p.innerHTML = `
      <div class="wp-head">
        <span class="wp-fr">${escapeHTML(fr)}</span>
        <button class="wp-play" aria-label="Play">🔊</button>
        <button class="wp-close" aria-label="Close">×</button>
      </div>
      <div class="wp-en">${meaning}</div>
      ${example}`;
    const rect = anchor.getBoundingClientRect();
    const popH = 100;
    let top = rect.bottom + 8 + window.scrollY;
    if (rect.bottom + popH > window.innerHeight) top = rect.top - popH - 8 + window.scrollY;
    let left = rect.left + window.scrollX;
    const popW = 280;
    if (left + popW > window.innerWidth) left = window.innerWidth - popW - 12;
    if (left < 8) left = 8;
    p.style.top = top + 'px';
    p.style.left = left + 'px';
    p.classList.add('open');
    p.querySelector('.wp-play').onclick = (e) => { e.stopPropagation(); TTS.speak(fr); };
    p.querySelector('.wp-close').onclick = hide;
    TTS.speak(fr);
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Global click handler: detect French content text.
  function setup() {
    const FR_HINT = /^[a-zà-ÿA-ZÀ-Ÿ'\-]+$/;
    document.addEventListener('click', (e) => {
      // Honor user pronunciation toggle — fully bypass if off.
      if (window.Settings && !Settings.isPronounceOn()) return;
      // Skip clicks inside inputs/buttons/already-popup
      const tgt = e.target;
      if (!tgt || tgt.nodeType !== 1) return;
      if (tgt.closest('input, textarea, button, a, .btn, .option, .token, .mem-card, #wordpop')) return;
      // Only act on text nodes inside text-content containers
      const container = tgt.closest('.grammar-box .example, .reading-text, .hero p, p, h1, h2, h3, h4, li, .conj-table td, .flashcard .example');
      if (!container) return;
      // Get the clicked word using selection or caret
      const selection = window.getSelection();
      let word = '';
      if (selection && selection.toString().trim()) {
        word = selection.toString().trim().split(/\s+/)[0];
      } else {
        // Use caret position from event
        const range = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : null;
        if (!range) return;
        const node = range.startContainer;
        if (!node || node.nodeType !== 3) return;
        const text = node.nodeValue || '';
        const offset = range.startOffset;
        // Find word boundaries around offset
        let start = offset, end = offset;
        while (start > 0 && /[a-zà-ÿ'A-ZÀ-Ÿ\-]/.test(text[start - 1])) start--;
        while (end < text.length && /[a-zà-ÿ'A-ZÀ-Ÿ\-]/.test(text[end])) end++;
        word = text.slice(start, end);
      }
      if (!word || word.length < 2) return;
      if (!FR_HINT.test(word)) return;
      // Don't show popup for purely-English words (unless they're in lookup)
      const map = buildLookup();
      const w = word.toLowerCase().replace(/[.,!?;:"]/g, '').trim();
      const bareW = w.replace(/^(le |la |l'|les |un |une |des )/, '');
      // Show if it's in our lookup OR has French accent
      const hasFrenchAccent = /[àâäéèêëîïôöùûüç]/i.test(word);
      if (map[w] || map[bareW] || hasFrenchAccent) {
        e.preventDefault();
        e.stopPropagation();
        show(word, tgt);
      }
    });
  }

  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
  }

  return { show, hide };
})();

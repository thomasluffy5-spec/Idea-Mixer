/* =====================================================================
   GÉNÉRATEUR — logique pure, sans DOM
   - tirage pondéré par univers
   - analyse du « point de départ » (texte libre → sujet + éléments)
   - construction de la phrase finale
   Exposé sous window.IM_GEN
   ===================================================================== */
(() => {
  const { GENRES, CATS, SUBJECTS, DIRECTION, UNEXPECTED } = window.IM_DATA;

  const items = c => (c === 'genre' ? GENRES : CATS[c]);
  const subject = id => SUBJECTS.find(s => s.id === id) || SUBJECTS[0];
  // Mots-clés : 4e colonne pour les univers, 5e pour les autres critères
  const keywordsOf = (c, it) => (c === 'genre' ? it[3] : it[4]) || '';

  /* Tous les critères possibles d'un sujet, dans l'ordre d'affichage */
  const allCats = s => [...subject(s).cats, ...DIRECTION];

  /* ---------- Tirage ---------- */
  // Compatible avec l'univers : ×3, universel : ×1, hors univers : presque jamais
  function weight(it, g) {
    if (!g) return 1;
    const tags = it[3].split(' ');
    if (tags.includes('*')) return 1;
    return tags.includes(g) ? 3 : UNEXPECTED;
  }

  function pick(c, g) {
    const list = items(c);
    if (c === 'genre') return list[Math.floor(Math.random() * list.length)][0];
    const w = list.map(it => weight(it, g));
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < list.length; i++) {
      r -= w[i];
      if (r <= 0) return list[i][0];
    }
    return list[list.length - 1][0];
  }

  /**
   * Complète une sélection.
   * @param sel     sélection actuelle {critère: id}
   * @param cats    critères actifs (le genre en premier s'il est présent)
   * @param locked  critères à ne pas toucher
   * @param mode    'all' (relance tout sauf verrouillés) | 'missing' (remplit les trous) | nom d'un critère
   */
  function generate(sel, cats, locked, mode = 'all') {
    const next = { ...sel };
    const genre = () => (cats.includes('genre') ? next.genre : null);
    for (const c of cats) {
      if (mode === 'missing' && next[c]) continue;
      if (mode === 'all' && locked.has(c) && next[c]) continue;
      if (mode !== 'all' && mode !== 'missing' && mode !== c) continue;
      next[c] = pick(c, genre());
    }
    return next;
  }

  /* ---------- Analyse du texte libre ---------- */
  const norm = s => ' ' + s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’'`]/g, ' ')
    .replace(/[^a-z0-9&/-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() + ' ';

  const regexCache = new Map();
  function kwRegex(kw) {
    if (!regexCache.has(kw)) {
      const k = norm(kw).trim().replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
      // accepte aussi le féminin / pluriel simple : « déterminée », « forêts »…
      regexCache.set(kw, new RegExp(`(?:^|[^a-z0-9])${k}(?:e?s|x|e)?(?=$|[^a-z0-9])`));
    }
    return regexCache.get(kw);
  }

  // Longueur du mot-clé le plus long trouvé (0 si aucun)
  function score(text, kwString) {
    let best = 0;
    for (const kw of kwString.split('|')) {
      if (kw && kw.length > best && kwRegex(kw).test(text)) best = kw.length;
    }
    return best;
  }

  // Quels critères trahissent quel type de sujet
  const HINTS = {
    char: ['species', 'feature', 'hair', 'outfit', 'expression', 'personality', 'holding'],
    creature: ['base', 'fusion', 'ctrait', 'temper', 'size'],
    place: ['landmark', 'weather', 'timeofday', 'season'],
    object: ['objtype', 'material', 'condition', 'objdetail'],
    scene: ['second', 'event']
  };

  function bestItem(text, c) {
    let best = null, bestScore = 0;
    for (const it of items(c)) {
      const sc = score(text, keywordsOf(c, it));
      if (sc > bestScore) { best = it[0]; bestScore = sc; }
    }
    return best;
  }

  /**
   * Analyse un texte libre.
   * @returns {subject: id|null, picks: {critère: id}}
   */
  function analyse(raw, fallbackSubject) {
    const text = norm(raw);
    if (!text.trim()) return { subject: null, picks: {} };

    // 1. Sujets nommés explicitement (« personnage », « paysage »…)
    const explicit = SUBJECTS.filter(s => score(text, s.kw)).map(s => s.id);
    if (bestItem(text, 'archetype')) explicit.push('char');

    // 2. Indices indirects (une coiffure → personnage, une météo → décor…)
    //    chaque type de sujet reçoit la force du mot-clé le plus précis trouvé
    const hintScore = {};
    for (const [s, cats] of Object.entries(HINTS)) {
      for (const c of cats) {
        for (const it of items(c)) hintScore[s] = Math.max(hintScore[s] || 0, score(text, keywordsOf(c, it)));
      }
    }
    if (bestItem(text, 'setting')) hintScore.place = Math.max(hintScore.place || 0, 1);
    const hinted = Object.keys(hintScore).filter(s => hintScore[s] > 0)
      .sort((a, b) => hintScore[b] - hintScore[a]);

    const visual = ['char', 'creature', 'place'];
    const explicitVisual = [...new Set(explicit.filter(s => visual.includes(s)))];
    let subj = null;
    if (explicit.includes('scene') || explicitVisual.length >= 2) subj = 'scene';
    else if (explicit.length) subj = explicit.includes('object') && !explicitVisual.length ? 'object' : explicitVisual[0] || explicit[0];
    else if (hinted[0] === 'object') subj = 'object';
    else if (hinted.includes('scene') || (hinted.includes('char') && hinted.includes('place'))) subj = 'scene';
    else if (hinted.length) subj = hinted[0];

    // 3. Éléments reconnus parmi les critères du sujet retenu
    const target = subj || fallbackSubject;
    const picks = {};
    for (const c of allCats(target)) {
      const id = bestItem(text, c);
      if (id) picks[c] = id;
    }
    return { subject: subj, picks };
  }

  /* ---------- Phrase finale ---------- */
  // Fragments qui suivent la tête de phrase, par sujet
  const TAIL = {
    char: ['feature', 'hair', 'outfit', 'pose', 'expression', 'holding', 'personality', 'event', 'setting', 'timeofday', 'weather'],
    creature: ['fusion', 'size', 'ctrait', 'temper', 'pose', 'setting', 'timeofday', 'weather'],
    place: ['landmark', 'timeofday', 'weather', 'season'],
    object: ['condition', 'objdetail', 'setting'],
    scene: ['second', 'event', 'setting', 'timeofday', 'weather']
  };
  // Mots accolés à la tête sans virgule (« un chevalier au sang elfique », « une boussole en laiton »)
  const HEAD = {
    char: ['archetype', 'species'],
    creature: ['base'],
    place: ['setting'],
    object: ['objtype', 'material'],
    scene: ['archetype', 'species']
  };
  const LINES = [
    ['lineStaging', ['shot', 'angle']],
    ['lineLight', ['lighting', 'mood']],
    ['lineColor', ['harmony', 'palette']],
    ['lineStyle', ['style']],
    ['lineChallenge', ['challenge']]
  ];

  function label(c, id, lang) {
    const it = items(c).find(i => i[0] === id);
    return it ? it[lang === 'fr' ? 2 : 1] : '';
  }

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  /**
   * @param view {subject, sel, cats}
   * @param t    fonction de traduction
   * @returns {main, lines: [[cléLibellé, texte]], text} ou null si incomplet
   */
  function describe(view, lang, t) {
    const { subject: s, sel, cats } = view;
    if (!cats.length || !cats.every(c => sel[c])) return null;
    const L = c => (cats.includes(c) ? label(c, sel[c], lang) : '');

    const head = HEAD[s].map(L).filter(Boolean).join(' ');
    const tail = TAIL[s].filter(c => !HEAD[s].includes(c)).map(L).filter(Boolean);
    const main = `${t('draw')} ${t('head' + s)} ${head}${tail.length ? ', ' + tail.join(', ') : ''}.`;

    const lines = LINES.map(([key, list]) => {
      const parts = list.map(c => {
        const v = L(c);
        if (!v || c !== 'palette') return v;
        return lang === 'fr' ? `palette ${v}` : `${v} palette`;
      }).filter(Boolean);
      return parts.length ? [key, cap(parts.join(', '))] : null;
    }).filter(Boolean);

    const sep = lang === 'fr' ? ' : ' : ': ';
    const text = [main, ...lines.map(([k, v]) => t(k) + sep + v)].join('\n');
    return { main, lines, text };
  }

  window.IM_GEN = { items, subject, allCats, generate, analyse, describe, label };
})();

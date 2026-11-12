/* =====================================================================
   APPLICATION — état, rendu, événements
   1. État + stockage local      4. Rendu du résultat
   2. Critères actifs            5. Actions (générer, analyser…)
   3. Construction des cartes    6. Événements
   ===================================================================== */
(() => {
  const { SUBJECTS, DIRECTION } = window.IM_DATA;
  const G = window.IM_GEN;
  const V = window.IM_VOICE;
  const T = window.IM_I18N;
  const $ = s => document.querySelector(s);

  /* ---------- 1. ÉTAT + STOCKAGE ---------- */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } }
  };

  let lang = store.get('lang') || (navigator.language || 'en').slice(0, 2);
  if (!T[lang]) lang = 'en';
  const t = k => T[lang][k] || k;

  const state = {
    subject: SUBJECTS.some(s => s.id === store.get('subject')) ? store.get('subject') : 'char',
    active: {},            // {sujet: [critères actifs]}
    sel: {},               // {critère: id}
    locked: new Set(),
    premise: '',
    understood: null,      // [[critère, id]] reconnus dans le texte, ou [] si rien
    currentId: null,       // id de l'idée en cours dans l'historique
    open: null,            // critère dont la liste de choix est ouverte
    addOpen: null          // groupe dont la liste « ajouter un critère » est ouverte
  };
  let history = Array.isArray(store.get('ideas')) ? store.get('ideas').filter(h => h && h.subject) : [];

  /* ---------- 2. CRITÈRES ACTIFS ---------- */
  const subj = () => G.subject(state.subject);
  const presets = s => {
    const S = G.subject(s);
    return {
      simple: S.simple,
      standard: [...S.def, ...S.dir],
      detailed: G.allCats(s)
    };
  };
  const savedActive = store.get('active') || {};
  for (const S of SUBJECTS) {
    const ok = Array.isArray(savedActive[S.id]) ? savedActive[S.id].filter(c => G.allCats(S.id).includes(c)) : null;
    state.active[S.id] = ok && ok.includes(S.head) ? ok : presets(S.id).standard;
  }

  // Critères actifs du sujet courant, dans l'ordre d'affichage
  const activeCats = () => G.allCats(state.subject).filter(c => state.active[state.subject].includes(c));
  const groupOf = c => (DIRECTION.includes(c) ? 'direction' : 'subject');
  const view = () => ({ subject: state.subject, sel: state.sel, cats: activeCats() });

  function setActive(list) {
    state.active[state.subject] = G.allCats(state.subject).filter(c => list.includes(c));
    store.set('active', state.active);
  }
  const currentLevel = () => {
    const cur = activeCats().join();
    return Object.entries(presets(state.subject)).find(([, l]) => G.allCats(state.subject).filter(c => l.includes(c)).join() === cur)?.[0];
  };

  /* ---------- 3. CARTES ---------- */
  const ICON = {
    dice: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.4"/><circle cx="15.5" cy="15.5" r="1.4"/><circle cx="15.5" cy="8.5" r="1.4"/><circle cx="8.5" cy="15.5" r="1.4"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9.5" rx="2"/><path class="shackle" d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>'
  };
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const itemLabel = it => it[lang === 'fr' ? 2 : 1];

  function tileHTML(c) {
    const removable = c !== subj().head;
    return `
      <div class="tile" id="tile-${c}" data-c="${c}">
        <div class="tile-head">
          <span class="tile-label">${esc(t(c))}</span>
          <span class="tile-actions">
            <button class="icon" type="button" data-act="roll" title="${esc(t('rand'))}" aria-label="${esc(t('rand'))} : ${esc(t(c))}">${ICON.dice}</button>
            <button class="icon lock" type="button" data-act="lock" aria-pressed="false">${ICON.lock}</button>
            ${removable ? `<button class="icon" type="button" data-act="remove" title="${esc(t('remove'))}" aria-label="${esc(t('remove'))} : ${esc(t(c))}">${ICON.close}</button>` : ''}
          </span>
        </div>
        <button class="tile-value" type="button" data-act="open" aria-expanded="false" aria-controls="chips-${c}"></button>
        <div class="chips" id="chips-${c}" role="group" aria-label="${esc(t('choose'))} : ${esc(t(c))}" hidden>
          <button class="chip auto" type="button" data-act="auto">${esc(t('auto'))}</button>
          ${G.items(c).map(i => `<button class="chip" type="button" data-act="pick" data-id="${i[0]}" aria-pressed="false">${esc(itemLabel(i))}</button>`).join('')}
        </div>
      </div>`;
  }

  function addTileHTML(group) {
    const missing = G.allCats(state.subject).filter(c => groupOf(c) === group && !state.active[state.subject].includes(c));
    if (!missing.length) return '';
    return `
      <div class="tile add" data-add="${group}">
        <button class="add-btn" type="button" data-act="addopen" aria-expanded="false" aria-controls="add-${group}">+ ${esc(t('addCrit'))}</button>
        <div class="chips" id="add-${group}" hidden>
          ${missing.map(c => `<button class="chip" type="button" data-act="add" data-c="${c}">+ ${esc(t(c))}</button>`).join('')}
        </div>
      </div>`;
  }

  function buildControls() {
    $('#subjects').innerHTML = SUBJECTS.map(S =>
      `<button type="button" data-subject="${S.id}" aria-pressed="false">${esc(S[lang] || S.en)}</button>`).join('');
    $('#levels').innerHTML = ['simple', 'standard', 'detailed'].map(l =>
      `<button type="button" data-level="${l}" aria-pressed="false">${esc(t(l))}</button>`).join('');
  }

  function buildTiles() {
    const cats = activeCats();
    for (const group of ['subject', 'direction']) {
      $(`#tiles-${group}`).innerHTML =
        cats.filter(c => groupOf(c) === group).map(tileHTML).join('') + addTileHTML(group);
    }
    state.open = null;
    state.addOpen = null;
  }

  function toggleChips(c) {
    state.open = state.open === c ? null : c;
    state.addOpen = null;
    syncOpen();
  }
  function syncOpen() {
    document.querySelectorAll('.tile[data-c]').forEach(tile => {
      const isOpen = tile.dataset.c === state.open;
      tile.classList.toggle('open', isOpen);
      tile.querySelector('.chips').hidden = !isOpen;
      tile.querySelector('.tile-value').setAttribute('aria-expanded', isOpen);
    });
    document.querySelectorAll('.tile.add').forEach(tile => {
      const isOpen = tile.dataset.add === state.addOpen;
      tile.classList.toggle('open', isOpen);
      tile.querySelector('.chips').hidden = !isOpen;
      tile.querySelector('.add-btn').setAttribute('aria-expanded', isOpen);
    });
  }

  /* ---------- 4. RENDU ---------- */
  function renderStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach(e => { e.textContent = t(e.dataset.t); });
    document.querySelectorAll('[data-t-ph]').forEach(e => { e.placeholder = t(e.dataset.tPh); });
    $('#lang').textContent = lang === 'fr' ? 'EN' : 'FR';
    $('#lang').setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
    $('#mic').hidden = !V.supported;
    $('#micInfo').hidden = !V.supported;
    // le choix du moteur n'a de sens que si les deux sont possibles
    $('#micEngine').hidden = !(V.nativeAvailable && V.localAvailable);
    micIdle();
    renderMic();
  }

  function renderMic() {
    const on = V.isListening();
    const busy = V.isBusy();
    $('#mic').setAttribute('aria-pressed', on);
    $('#mic').classList.toggle('rec', on);
    $('#mic').disabled = busy;
    $('#micText').textContent = busy ? t('micBusy') : on ? t('micStop') : t('micStart');
    document.querySelectorAll('[data-engine]').forEach(b => b.setAttribute('aria-pressed', b.dataset.engine === V.engine()));
  }

  function render(changed = []) {
    const cats = activeCats();

    // Sujet + niveau
    document.querySelectorAll('[data-subject]').forEach(b => b.setAttribute('aria-pressed', b.dataset.subject === state.subject));
    const level = currentLevel();
    document.querySelectorAll('[data-level]').forEach(b => b.setAttribute('aria-pressed', b.dataset.level === level));

    // Cartes
    for (const c of cats) {
      const tile = $('#tile-' + c);
      if (!tile) continue;
      const locked = state.locked.has(c);
      tile.querySelector('.tile-value').textContent = state.sel[c] ? G.label(c, state.sel[c], lang) : '—';
      tile.classList.toggle('locked', locked);
      const lockBtn = tile.querySelector('[data-act="lock"]');
      lockBtn.setAttribute('aria-pressed', locked);
      lockBtn.title = locked ? t('unlock') : t('lock');
      lockBtn.setAttribute('aria-label', `${locked ? t('unlock') : t('lock')} : ${t(c)}`);
      tile.querySelectorAll('.chip[data-id]').forEach(ch => ch.setAttribute('aria-pressed', ch.dataset.id === state.sel[c]));
      if (changed.includes(c)) {
        tile.classList.remove('flash');
        void tile.offsetWidth; // relance l'animation
        tile.classList.add('flash');
      }
    }

    // Résultat
    const d = G.describe(view(), lang, t);
    $('#out').classList.toggle('ready', !!d);
    $('#sentence').textContent = d ? d.main : t('empty');
    $('#lines').replaceChildren(...(d ? d.lines : []).map(([k, v]) => {
      const div = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = t(k);
      dd.textContent = v;
      div.append(dt, dd);
      return div;
    }));
    $('#subjectTag').textContent = d ? subj()[lang] : '';
    $('#genreTag').textContent = d && cats.includes('genre') ? G.label('genre', state.sel.genre, lang) : '';
    // Thème « Auto » : suit l'univers de l'idée en cours
    window.IM_SKIN?.follow(d && cats.includes('genre') ? state.sel.genre : null);
    $('#copy').hidden = !d;
    // Lien vers les pantins 3D : modèle, pose et angle repris de l'idée
    const rig = { char: 'human', scene: 'human', creature: 'quad' }[state.subject];
    $('#poseLink').hidden = !d || !rig;
    if (d && rig) {
      const q = new URLSearchParams({ model: rig });
      if (cats.includes('pose')) q.set('pose', state.sel.pose);
      if (cats.includes('angle')) q.set('angle', state.sel.angle);
      $('#poseLink').href = 'pose.html?' + q;
    }
    $('#unlock').hidden = state.locked.size === 0;
    renderUnderstood();
    renderHistory();
  }

  function renderUnderstood() {
    const box = $('#understood');
    box.replaceChildren();
    if (!state.understood) return;
    const p = document.createElement('p');
    if (!state.understood.length) {
      p.className = 'note';
      p.textContent = t('nothingFound');
      box.append(p);
      return;
    }
    p.textContent = t('understood');
    const ul = document.createElement('ul');
    ul.className = 'found';
    for (const [c, id] of state.understood) {
      const li = document.createElement('li');
      li.textContent = c === 'subject' ? G.subject(id)[lang] : `${t(c)} · ${G.label(c, id, lang)}`;
      ul.append(li);
    }
    box.append(p, ul);
  }

  function renderHistory() {
    $('#hEmpty').hidden = history.length > 0;
    $('#hClear').hidden = history.length === 0;
    $('#hList').replaceChildren(...history.map((h, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.h = i;
      const tags = document.createElement('span');
      tags.className = 'hist-tags';
      for (const txt of [G.subject(h.subject)[lang], h.sel.genre ? G.label('genre', h.sel.genre, lang) : '']) {
        if (!txt) continue;
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = txt;
        tags.append(tag);
      }
      const d = G.describe({ subject: h.subject, sel: h.sel, cats: Object.keys(h.sel) }, lang, t);
      const main = document.createElement('span');
      main.textContent = d ? d.main : '';
      b.append(tags, main);
      if (h.premise) {
        const q = document.createElement('span');
        q.className = 'hist-premise';
        q.textContent = `« ${h.premise} »`;
        b.append(q);
      }
      li.append(b);
      return li;
    }));
  }

  /* ---------- 5. ACTIONS ---------- */
  // 'new' = nouvelle idée dans l'historique ; 'update' = retouche de l'idée en cours
  function saveHistory(mode = 'update') {
    const cats = activeCats();
    if (!cats.every(c => state.sel[c])) return;
    const sel = Object.fromEntries(cats.map(c => [c, state.sel[c]]));
    const entry = { subject: state.subject, sel, premise: state.premise };
    const same = h => JSON.stringify([h.subject, h.sel, h.premise]) === JSON.stringify([entry.subject, entry.sel, entry.premise]);
    if (mode === 'update' && history[0] && history[0].id === state.currentId) {
      history[0] = { ...entry, id: state.currentId };
    } else {
      state.currentId = Date.now();
      history = [{ ...entry, id: state.currentId }, ...history.filter(h => !same(h))].slice(0, 30);
    }
    store.set('ideas', history);
  }

  // Applique une nouvelle sélection et signale les cartes modifiées
  function apply(next, { save = 'update' } = {}) {
    const changed = activeCats().filter(c => next[c] !== state.sel[c]);
    state.sel = next;
    if (save) saveHistory(save);
    render(changed);
  }

  const fillMissing = () => apply(G.generate(state.sel, activeCats(), state.locked, 'missing'));
  const baseSel = () => (activeCats().every(c => state.sel[c]) ? state.sel : G.generate(state.sel, activeCats(), state.locked, 'missing'));

  function setSubject(id) {
    if (id === state.subject) return;
    state.subject = id;
    store.set('subject', id);
    buildTiles();
    fillMissing();
  }

  function setLevel(level) {
    const list = presets(state.subject)[level];
    // on garde les critères verrouillés même s'ils sortent du préréglage
    setActive([...list, ...activeCats().filter(c => state.locked.has(c))]);
    buildTiles();
    fillMissing();
  }

  function newIdea() {
    state.open = null;
    syncOpen();
    apply(G.generate(state.sel, activeCats(), state.locked, 'all'), { save: 'new' });
  }

  function surprise() {
    // Tout au hasard, y compris le sujet ; on oublie le texte et les verrous
    state.premise = '';
    $('#premise').value = '';
    state.understood = null;
    state.locked.clear();
    state.subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)].id;
    store.set('subject', state.subject);
    buildTiles();
    apply(G.generate({}, activeCats(), state.locked, 'all'), { save: 'new' });
  }

  function expand() {
    const text = $('#premise').value.trim();
    if (!text) { newIdea(); return; }
    state.premise = text;
    const res = G.analyse(text, state.subject);
    const found = Object.entries(res.picks);
    state.understood = [...(res.subject ? [['subject', res.subject]] : []), ...found];

    if (res.subject && res.subject !== state.subject) {
      state.subject = res.subject;
      store.set('subject', res.subject);
    }
    // Ce qui est reconnu devient actif et verrouillé ; le reste est tiré au sort
    state.locked = new Set(found.map(([c]) => c));
    setActive([...activeCats(), ...found.map(([c]) => c)]);
    buildTiles();
    apply(G.generate({ ...state.sel, ...res.picks }, activeCats(), state.locked, 'all'), { save: 'new' });
  }

  /* ---------- 6. ÉVÉNEMENTS ---------- */
  $('#premiseForm').addEventListener('submit', e => {
    e.preventDefault();
    if (V.isListening()) V.stop();
    expand();
  });
  // Entrée = étoffer ; Maj+Entrée = retour à la ligne
  $('#premise').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      $('#premiseForm').requestSubmit();
    }
  });
  // Le champ grandit avec le texte
  $('#premise').addEventListener('input', e => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  });

  /* ---------- Dictée ----------
     La logique d'enregistrement est dans js/voice.js ; ici on gère
     seulement ce que l'utilisateur voit : messages, bouton d'action. */

  // Message sous le bouton micro, avec éventuellement un bouton d'action
  function micMessage(key, { error = false, action = null, pct = null } = {}) {
    const note = $('#micNote');
    note.textContent = t(key).replace('{pct}', pct ?? 0);
    note.classList.toggle('error', error);
    note.setAttribute('role', error ? 'alert' : 'status');
    const btn = $('#micAction');
    btn.hidden = !action;
    if (action) {
      btn.textContent = t(action.label);
      btn.onclick = action.run;
    }
  }
  const micIdle = () => micMessage(V.engine() === 'local' ? 'micNoteLocal' : 'micNote');

  // Proposer la dictée locale quand celle du navigateur ne marche pas
  const offerLocal = () => (V.localAvailable
    ? { label: 'micTryLocal', run: () => { V.setEngine('local'); renderMic(); startDictation(); } }
    : null);

  // Code d'erreur → message
  function showMicError(code) {
    if (code === 'not-allowed' || code === 'service-not-allowed') {
      micMessage(location.protocol === 'file:' ? 'micFile' : 'micDenied', { error: true });
    } else if (code === 'silent') {
      micMessage('micSilent', { error: true, action: offerLocal() });
    } else if (code === 'network') {
      micMessage('micNetwork', { error: true, action: offerLocal() });
    } else if (code === 'audio-capture') {
      micMessage('micNoMic', { error: true });
    } else if (code === 'model') {
      micMessage('micModelError', { error: true, action: { label: 'micLocalGo', run: startDictation } });
    } else if (code === 'no-speech') {
      micMessage('micEmpty', { error: true });
    } else {
      micMessage('micError', { error: true });
    }
  }

  function startDictation() {
    const before = $('#premise').value.trim();
    let failed = false;
    V.start({
      lang,
      onText: heard => {
        $('#premise').value = before ? `${before} ${heard}` : heard;
        $('#premise').dispatchEvent(new Event('input'));
      },
      onStatus: (status, pct) => {
        if (status === 'listening') micMessage('micListening');
        else if (status === 'nothing') micMessage('micNothing', { action: offerLocal() });
        else if (status === 'recording') {
          micMessage('micRecording');
          // le modèle se télécharge pendant l'enregistrement : on l'affiche
          if (pct != null && pct < 100) $('#micNote').textContent += ' (' + t('micModelPct').replace('{pct}', pct) + ')';
        } else if (status === 'loading') micMessage('micLoading', { pct });
        else if (status === 'transcribing') micMessage('micTranscribing');
        renderMic();
      },
      onEnd: hasText => {
        renderMic();
        if (!failed) micIdle();
        if (hasText) expand(); // on étoffe directement après la dictée
      },
      onError: code => {
        failed = true;
        renderMic();
        showMicError(code);
      }
    });
    renderMic();
  }

  $('#mic').addEventListener('click', () => {
    if (V.isListening()) { V.stop(); return; }
    if (V.isBusy()) return;
    // dictée locale jamais utilisée : on prévient du téléchargement avant
    if (V.engine() === 'local' && !V.modelReady()) {
      micMessage('micLocalIntro', { action: { label: 'micLocalGo', run: startDictation } });
      return;
    }
    startDictation();
  });

  $('#micEngine').addEventListener('click', e => {
    const b = e.target.closest('[data-engine]');
    if (!b || V.isListening() || V.isBusy()) return;
    V.setEngine(b.dataset.engine);
    renderMic();
    micIdle();
  });

  $('#surprise').addEventListener('click', surprise);
  $('#all').addEventListener('click', newIdea);
  $('#unlock').addEventListener('click', () => { state.locked.clear(); render(); });

  $('#copy').addEventListener('click', async () => {
    const d = G.describe(view(), lang, t);
    if (!d) return;
    try {
      await navigator.clipboard.writeText(d.text);
      $('#copy').textContent = t('copied');
      setTimeout(() => { $('#copy').textContent = t('copy'); }, 1500);
    } catch { /* presse-papiers indisponible */ }
  });

  $('#subjects').addEventListener('click', e => {
    const b = e.target.closest('[data-subject]');
    if (b) setSubject(b.dataset.subject);
  });
  $('#levels').addEventListener('click', e => {
    const b = e.target.closest('[data-level]');
    if (b) setLevel(b.dataset.level);
  });

  $('#lang').addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    store.set('lang', lang);
    renderStatic();
    buildControls();
    buildTiles();
    render();
    window.IM_SKIN?.refresh();
  });

  $('#hClear').addEventListener('click', () => {
    history = [];
    store.set('ideas', history);
    renderHistory();
  });

  $('#hList').addEventListener('click', e => {
    const b = e.target.closest('[data-h]');
    if (!b) return;
    const h = history[b.dataset.h];
    state.subject = h.subject;
    store.set('subject', h.subject);
    setActive(Object.keys(h.sel));
    state.locked.clear();
    state.premise = h.premise || '';
    $('#premise').value = state.premise;
    state.understood = null;
    buildTiles();
    state.currentId = h.id;
    apply({ ...h.sel }, { save: false });
    $('#mixer').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  // Cartes : choisir, relancer, verrouiller, retirer, ajouter
  $('#mixer').addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn || !btn.closest('.tiles')) return;
    const tile = btn.closest('.tile');
    const c = tile.dataset.c;

    switch (btn.dataset.act) {
      case 'open':
        toggleChips(c);
        break;
      case 'roll':
        apply(G.generate(baseSel(), activeCats(), state.locked, c));
        break;
      case 'lock':
        state.locked.has(c) ? state.locked.delete(c) : state.locked.add(c);
        render();
        break;
      case 'pick':
        state.locked.add(c); // choisir = garder
        apply({ ...baseSel(), [c]: btn.dataset.id });
        toggleChips(null);
        $(`#tile-${c} .tile-value`).focus();
        break;
      case 'auto':
        state.locked.delete(c);
        apply(G.generate(baseSel(), activeCats(), state.locked, c));
        toggleChips(null);
        $(`#tile-${c} .tile-value`).focus();
        break;
      case 'remove':
        state.locked.delete(c);
        setActive(activeCats().filter(k => k !== c));
        buildTiles();
        render();
        saveHistory('update');
        break;
      case 'addopen':
        state.addOpen = state.addOpen === tile.dataset.add ? null : tile.dataset.add;
        state.open = null;
        syncOpen();
        break;
      case 'add': {
        const nc = btn.dataset.c;
        setActive([...activeCats(), nc]);
        buildTiles();
        fillMissing();
        $(`#tile-${nc} .tile-value`)?.focus();
        break;
      }
    }
  });

  // Fermer les listes : Échap ou clic ailleurs
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || (!state.open && !state.addOpen)) return;
    const back = state.open ? $(`#tile-${state.open} .tile-value`) : $(`[data-add="${state.addOpen}"] .add-btn`);
    state.open = state.addOpen = null;
    syncOpen();
    back?.focus();
  });
  document.addEventListener('click', e => {
    if ((state.open || state.addOpen) && !e.target.closest('.tile')) {
      state.open = state.addOpen = null;
      syncOpen();
    }
  });

  renderStatic();
  buildControls();
  buildTiles();
  render();
})();

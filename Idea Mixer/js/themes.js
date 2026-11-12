/* =====================================================================
   THÈMES VISUELS
   - Chargé sans « defer » : applique le thème mémorisé avant l'affichage
     (pas de flash de l'ancien thème).
   - Mode « Auto » : le thème suit l'univers de l'idée en cours.
   Exposé sous window.IM_SKIN — utilisé par js/app.js :
     IM_SKIN.follow(idUnivers)  → à chaque nouvelle idée
     IM_SKIN.refresh()          → après un changement de langue
   ===================================================================== */
(() => {
  // id, noms FR/EN, couleurs de la pastille (fond, accent, carte)
  const SKINS = [
    { id: 'atelier', fr: 'Atelier', en: 'Studio', sw: ['#eef1f5', '#2a45f0', '#161e2e'] },
    { id: 'cyber', fr: 'Cyberpunk', en: 'Cyberpunk', sw: ['#0a0a14', '#ff2bd6', '#00e5ff'] },
    { id: 'fantasy', fr: 'Fantasy médiévale', en: 'Medieval fantasy', sw: ['#f2e8d2', '#2e5e3e', '#b08a3e'] },
    { id: 'western', fr: 'Western', en: 'Western', sw: ['#f6d4a0', '#c0410f', '#36190c'] },
    { id: 'dark', fr: 'Dark fantasy', en: 'Dark fantasy', sw: ['#0d0a0f', '#b81d3c', '#3a2a36'] },
    { id: 'scifi', fr: 'Science-fiction', en: 'Sci-fi', sw: ['#060a17', '#4fd8c8', '#2b3f8f'] },
    { id: 'steam', fr: 'Steampunk', en: 'Steampunk', sw: ['#211810', '#c9973f', '#4b3a27'] },
    { id: 'cosy', fr: 'Conte cosy', en: 'Cozy tale', sw: ['#fcf0ea', '#d9577a', '#d8f0e2'] }
  ];

  // Univers (js/data.js) → thème, pour le mode Auto
  const BY_GENRE = {
    fantasy: 'fantasy', myth: 'fantasy', dark: 'dark', horror: 'dark',
    scifi: 'scifi', cyber: 'cyber', steam: 'steam',
    western: 'western', postapo: 'western',
    tale: 'cosy', solar: 'cosy', daily: 'atelier'
  };

  const TXT = {
    fr: { theme: 'Thème', auto: 'Auto', autoHint: 'suit l’univers de l’idée', label: 'Choisir le thème' },
    en: { theme: 'Theme', auto: 'Auto', autoHint: 'follows the idea’s universe', label: 'Choose theme' }
  };

  const html = document.documentElement;
  const read = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } };

  let choice = read('skin');                 // 'auto' ou id d'un thème
  if (choice !== 'auto' && !SKINS.some(s => s.id === choice)) choice = 'auto';
  let genre = null;                          // univers de l'idée en cours

  const current = () => (choice === 'auto' ? BY_GENRE[genre] || 'atelier' : choice);
  const skin = id => SKINS.find(s => s.id === id);
  const lang = () => (html.lang === 'fr' ? 'fr' : 'en');
  const swatchStyle = s => `--s1:${s.sw[0]};--s2:${s.sw[1]};--s3:${s.sw[2]}`;

  function apply() {
    const id = current();
    if (html.dataset.skin === id) return;
    html.dataset.skin = id;
    const deco = document.querySelector('.deco');
    if (deco) { deco.classList.remove('fade'); void deco.offsetWidth; deco.classList.add('fade'); }
    renderButton();
  }
  html.dataset.skin = current(); // tout de suite, avant l'affichage

  /* ---------- Sélecteur dans la navigation ---------- */
  let btn, menu;

  function renderButton() {
    if (!btn) return;
    const T = TXT[lang()];
    const s = skin(current());
    btn.querySelector('.swatch').setAttribute('style', swatchStyle(s));
    btn.querySelector('.skin-name').textContent = choice === 'auto' ? `${T.auto} · ${s[lang()]}` : s[lang()];
    btn.setAttribute('aria-label', `${T.label} (${btn.querySelector('.skin-name').textContent})`);
  }

  function renderMenu() {
    const T = TXT[lang()];
    const auto = skin(BY_GENRE[genre] || 'atelier');
    menu.innerHTML =
      `<button type="button" data-skin-choice="auto" aria-pressed="${choice === 'auto'}">
         <span class="swatch" style="${swatchStyle(auto)}"></span>
         <span>${T.auto}<small>${T.autoHint}</small></span>
       </button><hr>` +
      SKINS.map(s => `<button type="button" data-skin-choice="${s.id}" aria-pressed="${choice === s.id}">
         <span class="swatch" style="${swatchStyle(s)}"></span><span>${s[lang()]}</span>
       </button>`).join('');
  }

  function setOpen(open) {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', open);
    if (open) { renderMenu(); menu.querySelector('[aria-pressed="true"]')?.focus(); }
  }

  function init() {
    const nav = document.querySelector('nav');
    const wrap = document.createElement('div');
    wrap.className = 'skin-picker';
    wrap.innerHTML = `
      <button class="lang skin-btn" type="button" aria-expanded="false" aria-controls="skinMenu">
        <span class="swatch" aria-hidden="true"></span><span class="skin-name"></span>
      </button>
      <div class="skin-menu" id="skinMenu" hidden></div>`;
    nav.insertBefore(wrap, document.querySelector('#lang'));
    btn = wrap.querySelector('.skin-btn');
    menu = wrap.querySelector('.skin-menu');

    btn.addEventListener('click', () => setOpen(menu.hidden));
    menu.addEventListener('click', e => {
      const b = e.target.closest('[data-skin-choice]');
      if (!b) return;
      choice = b.dataset.skinChoice;
      write('skin', choice);
      apply();
      renderButton();
      setOpen(false);
      btn.focus();
    });
    document.addEventListener('click', e => { if (!menu.hidden && !wrap.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); }
    });
    renderButton();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.IM_SKIN = {
    follow(g) { genre = g || null; apply(); },
    refresh() { renderButton(); if (menu && !menu.hidden) renderMenu(); }
  };
})();

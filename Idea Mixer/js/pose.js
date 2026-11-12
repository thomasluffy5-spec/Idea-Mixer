/* =====================================================================
   PANTINS 3D — APPLICATION
   1. Textes + stockage           6. Poses, symétrie, sol
   2. Scène Three.js              7. Caméra et lumière
   3. Construction des modèles    8. Sauvegarde, annuler
   4. Sélection + gizmo           9. Export PNG / JPEG
   5. Panneau d'outils           10. Événements + démarrage
   ===================================================================== */
(() => {
  const D = window.IM_POSE_DATA;
  const I18N = window.IM_POSE_I18N;
  const $ = s => document.querySelector(s);
  const DEG = Math.PI / 180;

  /* ---------- 1. TEXTES + STOCKAGE ---------- */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* stockage indisponible */ } }
  };
  let lang = store.get('lang') || (navigator.language || 'en').slice(0, 2);
  if (!I18N[lang]) lang = 'en';
  const t = k => I18N[lang][k] || k;

  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';

  const opts = Object.assign({ fmt: 'png', bg: 'transparent', scale: 2, fov: 'normal', az: 40, el: 50, shadows: true, mirror: true },
    store.get('pose-opts') || {});
  const saveOpts = () => store.set('pose-opts', opts);

  /* ---------- 2. SCÈNE ---------- */
  const stage = $('#stage');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0); // transparent : le fond du thème apparaît derrière
  stage.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(D.FOV[opts.fov] || 35, 1, 0.05, 200);
  camera.position.set(2.6, 1.7, 3.6);

  const orbit = new THREE.OrbitControls(camera, renderer.domElement);
  orbit.target.set(0, 0.9, 0);
  orbit.enableDamping = true;
  orbit.maxPolarAngle = Math.PI * 0.98;
  orbit.update();
  orbit.addEventListener('end', () => scheduleSave());

  const gizmo = new THREE.TransformControls(camera, renderer.domElement);
  gizmo.setSize(0.85);
  scene.add(gizmo);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x7a7a7a, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 0.85);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 30 });
  sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.22 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  let grid = null;
  function buildGrid() {
    if (grid) scene.remove(grid);
    grid = new THREE.GridHelper(20, 40, new THREE.Color(css('--mute')), new THREE.Color(css('--line')));
    grid.material.transparent = true;
    grid.material.opacity = 0.7;
    scene.add(grid);
  }
  buildGrid();

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);

  (function loop() {
    orbit.update();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();

  /* ---------- 3. MODÈLES ---------- */
  // couleurs converties en linéaire pour un rendu fidèle (sinon tout paraît délavé)
  const BASE = new THREE.Color(0xcfc4b6).convertSRGBToLinear();
  const JOINT = new THREE.Color(0xa99c8b).convertSRGBToLinear();
  const models = []; // objets racines présents dans la scène
  const pickables = []; // maillages cliquables

  const material = color => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0 });
    m.userData.base = color.clone(); // couleur d'origine, pour la surbrillance
    return m;
  };

  function partMesh(p) {
    let geo;
    if (p.shape === 'capsule') geo = new THREE.CapsuleGeometry(p.r, Math.max(0.001, p.len - 2 * p.r), 6, 14);
    else if (p.shape === 'cone') geo = new THREE.ConeGeometry(p.r, p.h, 14);
    else geo = new THREE.SphereGeometry(1, 24, 16);
    const mesh = new THREE.Mesh(geo, material(BASE));
    if (p.shape === 'ellipsoid') mesh.scale.set(...p.size);
    if (p.at) mesh.position.set(...p.at);
    if (p.rot) mesh.rotation.set(p.rot[0] * DEG, p.rot[1] * DEG, p.rot[2] * DEG);
    return mesh;
  }

  function buildJoint(node, joints) {
    const g = new THREE.Group();
    g.name = node.name;
    g.position.set(...node.pos);
    g.userData.rest = node.rest || [0, 0, 0];
    setDeg(g, g.userData.rest);
    joints[node.name] = g;
    if (node.ball) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(node.ball, 16, 12), material(JOINT));
      g.add(ball);
    }
    (node.parts || []).forEach(p => g.add(partMesh(p)));
    (node.children || []).forEach(c => g.add(buildJoint(c, joints)));
    return g;
  }

  function setDeg(obj, [x, y, z]) { obj.rotation.set(x * DEG, y * DEG, z * DEG); }
  const getDeg = obj => [obj.rotation.x / DEG, obj.rotation.y / DEG, obj.rotation.z / DEG].map(v => Math.round(v * 100) / 100);

  function buildShape(kind) {
    const geos = {
      box: () => new THREE.BoxGeometry(1, 1, 1),
      sphere: () => new THREE.SphereGeometry(0.5, 32, 20),
      cylinder: () => new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
      cone: () => new THREE.ConeGeometry(0.5, 1, 32)
    };
    const root = new THREE.Group();
    const mesh = new THREE.Mesh(geos[kind](), material(BASE));
    mesh.position.y = 0.5; // posé sur le sol, s'agrandit depuis la base
    root.add(mesh);
    root.userData.joints = {};
    return root;
  }

  function createModel(kind) {
    let root;
    if (D.MODELS[kind]) {
      const joints = {};
      root = buildJoint(D.MODELS[kind], joints);
      root.userData.joints = joints;
    } else {
      root = buildShape(kind);
    }
    root.userData.kind = kind;
    root.userData.isModel = true;
    root.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      o.userData.model = root;
      o.userData.joint = o.parent === root || !D.MODELS[kind] ? root : o.parent;
      pickables.push(o);
    });
    scene.add(root);
    models.push(root);
    return root;
  }

  function removeModel(root) {
    if (sel.model === root) select(null);
    scene.remove(root);
    models.splice(models.indexOf(root), 1);
    root.traverse(o => {
      if (!o.isMesh) return;
      const i = pickables.indexOf(o);
      if (i >= 0) pickables.splice(i, 1);
      o.geometry.dispose();
      o.material.dispose();
    });
  }

  const isRig = m => !!D.MODELS[m.userData.kind];

  /* ---------- 4. SÉLECTION + GIZMO ---------- */
  const sel = { model: null, joint: null };
  let mode = 'rotate';

  // Surbrillance : la couleur du membre choisi tire vers l'accent du thème
  function highlight(off = false) {
    const acc = new THREE.Color(css('--acc')).convertSRGBToLinear();
    for (const m of models) {
      m.traverse(o => {
        if (!o.isMesh) return;
        let k = 0;
        if (!off && m === sel.model) k = sel.joint === m ? 0.35 : (o.userData.joint === sel.joint ? 0.6 : 0);
        o.material.color.copy(o.material.userData.base).lerp(acc, k);
      });
    }
  }

  function select(joint) {
    sel.joint = joint;
    sel.model = joint ? findRoot(joint) : null;
    if (!joint) gizmo.detach();
    else gizmo.attach(joint);
    applyMode();
    highlight();
    renderPanel();
  }
  function findRoot(o) { while (o && !o.userData.isModel) o = o.parent; return o; }

  function applyMode() {
    if (!sel.joint) return;
    const isJoint = sel.joint !== sel.model;
    const m = isJoint ? 'rotate' : mode;
    gizmo.setMode(m);
    gizmo.setSpace(m === 'translate' ? 'world' : 'local');
    gizmo.showY = true;
  }

  function setMode(m) {
    mode = m;
    if (sel.joint && sel.joint !== sel.model) select(sel.model); // changer de mode = agir sur le modèle entier
    applyMode();
    renderPanel();
  }

  gizmo.addEventListener('dragging-changed', e => {
    orbit.enabled = !e.value;
    if (!e.value) commit();
  });
  gizmo.addEventListener('objectChange', () => {
    if (opts.mirror && sel.joint && sel.joint !== sel.model) mirrorJoint(sel.joint);
    if (sel.model && sel.joint === sel.model && mode === 'translate') sel.model.position.y = Math.max(sel.model.position.y, -2);
  });

  // Clic (sans glisser) dans la vue = sélection
  const raycaster = new THREE.Raycaster();
  let down = null;
  renderer.domElement.addEventListener('pointerdown', e => {
    down = { x: e.clientX, y: e.clientY, onGizmo: gizmo.axis !== null };
  });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down || down.onGizmo || e.button !== 0) { down = null; return; }
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    if (moved > 5) return;
    const r = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: -((e.clientY - r.top) / r.height) * 2 + 1 }, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (!hit) { select(null); return; }
    const j = hit.object.userData.joint;
    // re-cliquer sur le membre déjà choisi ne change rien ; un clic sur un autre pantin le sélectionne en entier
    select(sel.model && sel.model === hit.object.userData.model ? j : (isRig(hit.object.userData.model) ? j : hit.object.userData.model));
  });

  /* ---------- 5. PANNEAU ---------- */
  function jointLabel(name) {
    const m = name.match(/^([a-z]+?)(F|B)?(L|R)?$/);
    if (!m) return name;
    const [, base, side, lr] = m;
    const parts = [t('j_' + base)];
    if (side) parts.push(side === 'F' ? t('front') : t('backSide'));
    if (lr) parts.push(lr === 'L' ? t('left') : t('right'));
    return parts.join(' ');
  }

  function renderPanel() {
    const has = !!sel.model;
    $('#selTools').hidden = !has;
    if (!has) { $('#selName').textContent = t('none'); return; }
    const kind = sel.model.userData.kind;
    const isJoint = sel.joint !== sel.model;
    $('#selName').textContent = t(kind) + (isJoint ? ' · ' + jointLabel(sel.joint.name) : '');
    $('#selName').title = isJoint ? t('jointOnly') : '';

    document.querySelectorAll('[data-mode]').forEach(b => {
      b.setAttribute('aria-pressed', (isJoint ? 'rotate' : mode) === b.dataset.mode);
    });
    $('#selWhole').hidden = !isJoint;
    $('#selGround').hidden = !isRig(sel.model);
    $('#poseTools').hidden = !isRig(sel.model);
    if (isRig(sel.model)) {
      const current = sel.model.userData.pose;
      $('#poses').innerHTML = Object.keys(D.POSES[kind]).map(p =>
        `<button type="button" class="chip" data-pose="${p}" aria-pressed="${p === current}">${t(p)}</button>`).join('');
    }
  }

  function buildStaticControls() {
    $('#views').innerHTML = Object.keys(D.VIEWS).map(v =>
      `<button type="button" class="chip" data-view="${v}">${t('v' + v)}</button>`).join('') +
      `<button type="button" class="chip ghost" data-view="frame">${t('frame')}</button>`;
    $('#fovs').innerHTML = Object.keys(D.FOV).map(f => `<button type="button" data-fov="${f}">${t(f)}</button>`).join('');
    syncOptionButtons();
  }

  function syncOptionButtons() {
    const set = (attr, val) => document.querySelectorAll(`[data-${attr}]`).forEach(b => b.setAttribute('aria-pressed', b.dataset[attr] === String(val)));
    set('fov', opts.fov); set('fmt', opts.fmt); set('bg', opts.bg); set('scale', opts.scale);
    // le fond transparent n'existe pas en JPEG
    const tb = $('[data-bg="transparent"]');
    tb.disabled = opts.fmt === 'jpeg';
    $('#mirror').checked = opts.mirror;
    $('#shadows').checked = opts.shadows;
    $('#lightAz').value = opts.az;
    $('#lightEl').value = opts.el;
  }

  function renderTexts() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach(e => { e.textContent = t(e.dataset.t); });
    $('#lang').textContent = lang === 'fr' ? 'EN' : 'FR';
    $('#lang').setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
    buildStaticControls();
    renderPanel();
    window.IM_SKIN?.refresh();
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  /* ---------- 6. POSES, SYMÉTRIE, SOL ---------- */
  function applyPose(model, id) {
    const preset = D.POSES[model.userData.kind][id];
    if (!preset) return;
    const joints = model.userData.joints;
    for (const [name, g] of Object.entries(joints)) {
      if (g === model) continue;
      setDeg(g, (preset.joints && preset.joints[name]) || g.userData.rest);
    }
    const r = preset.root || [0, 0, 0];
    model.rotation.x = r[0] * DEG;
    model.rotation.z = r[2] * DEG;
    model.userData.pose = id;
    toGround(model, preset.lift || 0);
  }

  function toGround(model, lift = 0) {
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    model.position.y += -box.min.y + lift;
  }

  const twinName = n => (/L$/.test(n) ? n.replace(/L$/, 'R') : /R$/.test(n) ? n.replace(/R$/, 'L') : null);
  function mirrorJoint(g) {
    const tn = twinName(g.name);
    const twin = tn && sel.model.userData.joints[tn];
    if (twin) twin.rotation.set(g.rotation.x, -g.rotation.y, -g.rotation.z);
  }

  /* ---------- 7. CAMÉRA ET LUMIÈRE ---------- */
  function sceneBox(onlySelected) {
    const box = new THREE.Box3();
    const list = onlySelected && sel.model ? [sel.model] : models;
    list.forEach(m => box.expandByObject(m));
    if (box.isEmpty()) box.setFromCenterAndSize(new THREE.Vector3(0, 0.9, 0), new THREE.Vector3(1, 1.8, 1));
    return box;
  }

  let currentView = 'threequarter';
  function setView(id) {
    if (id !== 'frame') currentView = id;
    const box = sceneBox(id === 'frame');
    const target = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) * 0.6 + 0.15;
    const dist = radius / Math.sin((camera.fov * DEG) / 2) * 1.05;
    const dir = id === 'frame'
      ? camera.position.clone().sub(orbit.target).normalize()
      : new THREE.Vector3(...D.VIEWS[id]).normalize();
    const pos = target.clone().addScaledVector(dir, dist);
    pos.y = Math.max(pos.y, 0.05);
    camera.position.copy(pos);
    orbit.target.copy(target);
    orbit.update();
    placeSun();
    scheduleSave();
  }

  function setFov(f) {
    opts.fov = f;
    camera.fov = D.FOV[f];
    camera.updateProjectionMatrix();
    saveOpts();
    syncOptionButtons();
    setView('frame');
  }

  function placeSun() {
    const c = orbit.target;
    const az = opts.az * DEG, el = opts.el * DEG;
    sun.position.set(c.x + Math.cos(el) * Math.sin(az) * 8, Math.sin(el) * 8, c.z + Math.cos(el) * Math.cos(az) * 8);
    sun.target.position.copy(c);
    ground.visible = opts.shadows;
  }

  /* ---------- 8. SAUVEGARDE, ANNULER ---------- */
  const r3 = v => Math.round(v * 1000) / 1000;
  function serialize() {
    return {
      v: 1,
      models: models.map(m => ({
        kind: m.userData.kind,
        pose: m.userData.pose || null,
        p: m.position.toArray().map(r3),
        r: getDeg(m),
        s: m.scale.toArray().map(r3),
        j: Object.fromEntries(Object.entries(m.userData.joints).filter(([, g]) => g !== m).map(([n, g]) => [n, getDeg(g)]))
      })),
      cam: { p: camera.position.toArray().map(r3), t: orbit.target.toArray().map(r3) }
    };
  }

  function restore(state) {
    select(null);
    [...models].forEach(removeModel);
    for (const s of state.models || []) {
      if (!D.MODELS[s.kind] && !['box', 'sphere', 'cylinder', 'cone'].includes(s.kind)) continue;
      const m = createModel(s.kind);
      m.position.fromArray(s.p);
      setDeg(m, s.r);
      m.scale.fromArray(s.s);
      m.userData.pose = s.pose;
      for (const [n, rot] of Object.entries(s.j || {})) if (m.userData.joints[n]) setDeg(m.userData.joints[n], rot);
    }
    if (state.cam) {
      camera.position.fromArray(state.cam.p);
      orbit.target.fromArray(state.cam.t);
      orbit.update();
    }
    placeSun();
  }

  const undoStack = [];
  function commit() {
    const s = JSON.stringify(serialize());
    if (undoStack[undoStack.length - 1] !== s) undoStack.push(s);
    if (undoStack.length > 60) undoStack.shift();
    store.set('pose-scene', JSON.parse(s));
    renderPanel();
  }
  function undo() {
    if (undoStack.length < 2) return;
    undoStack.pop();
    const keepSel = sel.model ? models.indexOf(sel.model) : -1;
    restore(JSON.parse(undoStack[undoStack.length - 1]));
    store.set('pose-scene', JSON.parse(undoStack[undoStack.length - 1]));
    if (models[keepSel]) select(models[keepSel]);
  }
  let saveTimer;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.set('pose-scene', serialize()), 400);
  }

  /* ---------- 9. EXPORT ---------- */
  function exportImage() {
    const w = stage.clientWidth, h = stage.clientHeight;
    const prevRatio = renderer.getPixelRatio();
    const fmt = opts.fmt === 'jpeg' ? 'image/jpeg' : 'image/png';
    const bg = fmt === 'image/jpeg' && opts.bg === 'transparent' ? 'theme' : opts.bg;

    // on cache tout ce qui n'est pas la scène
    const prevGizmo = gizmo.visible;
    gizmo.visible = false;
    grid.visible = false;
    highlight(true);
    scene.background = bg === 'white' ? new THREE.Color('#ffffff') : bg === 'theme' ? new THREE.Color(css('--bg')) : null;

    renderer.setPixelRatio(Number(opts.scale));
    renderer.setSize(w, h, false);
    renderer.render(scene, camera);
    const url = renderer.domElement.toDataURL(fmt, 0.92);

    // retour à l'affichage normal
    scene.background = null;
    gizmo.visible = prevGizmo;
    grid.visible = true;
    renderer.setPixelRatio(prevRatio);
    renderer.setSize(w, h, false);
    highlight();

    const a = document.createElement('a');
    a.href = url;
    a.download = `pantin-idea-mixer.${opts.fmt === 'jpeg' ? 'jpg' : 'png'}`;
    document.body.append(a);
    a.click();
    a.remove();
  }

  /* ---------- 10. ÉVÉNEMENTS ---------- */
  function add(kind) {
    const m = createModel(kind);
    if (isRig(m)) applyPose(m, 'stand');
    // à droite des modèles existants, sans chevauchement
    if (models.length > 1) {
      const others = new THREE.Box3();
      models.filter(o => o !== m).forEach(o => others.expandByObject(o));
      const own = new THREE.Box3().setFromObject(m);
      m.position.x = others.max.x + 0.4 - own.min.x;
    }
    mode = 'translate'; // un nouvel objet se place d'abord
    select(m);
    commit();
  }

  document.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => add(b.dataset.add)));

  $('#modes').addEventListener('click', e => { const b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode); });
  $('#poses').addEventListener('click', e => {
    const b = e.target.closest('[data-pose]');
    if (!b || !sel.model) return;
    applyPose(sel.model, b.dataset.pose);
    commit();
  });
  $('#selWhole').addEventListener('click', () => select(sel.model));
  $('#selGround').addEventListener('click', () => { toGround(sel.model); commit(); });
  $('#selDup').addEventListener('click', duplicate);
  $('#selDel').addEventListener('click', () => { if (sel.model) { removeModel(sel.model); commit(); } });
  $('#mirror').addEventListener('change', e => { opts.mirror = e.target.checked; saveOpts(); });

  function duplicate() {
    if (!sel.model) return;
    const data = serialize().models[models.indexOf(sel.model)];
    const m = createModel(data.kind);
    m.position.fromArray(data.p);
    m.position.x += 0.8;
    setDeg(m, data.r);
    m.scale.fromArray(data.s);
    m.userData.pose = data.pose;
    for (const [n, rot] of Object.entries(data.j)) setDeg(m.userData.joints[n], rot);
    select(m);
    commit();
  }

  $('#views').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) setView(b.dataset.view); });
  $('#fovs').addEventListener('click', e => { const b = e.target.closest('[data-fov]'); if (b) setFov(b.dataset.fov); });

  $('#lightAz').addEventListener('input', e => { opts.az = +e.target.value; placeSun(); saveOpts(); });
  $('#lightEl').addEventListener('input', e => { opts.el = +e.target.value; placeSun(); saveOpts(); });
  $('#shadows').addEventListener('change', e => { opts.shadows = e.target.checked; placeSun(); saveOpts(); });

  $('#fmt').addEventListener('click', e => {
    const b = e.target.closest('[data-fmt]');
    if (!b) return;
    opts.fmt = b.dataset.fmt;
    if (opts.fmt === 'jpeg' && opts.bg === 'transparent') opts.bg = 'theme';
    saveOpts(); syncOptionButtons();
  });
  $('#bgs').addEventListener('click', e => { const b = e.target.closest('[data-bg]'); if (b && !b.disabled) { opts.bg = b.dataset.bg; saveOpts(); syncOptionButtons(); } });
  $('#scales').addEventListener('click', e => { const b = e.target.closest('[data-scale]'); if (b) { opts.scale = +b.dataset.scale; saveOpts(); syncOptionButtons(); } });
  $('#download').addEventListener('click', exportImage);

  $('#undo').addEventListener('click', undo);
  $('#clear').addEventListener('click', () => {
    if (!models.length || !confirm(t('clearConfirm'))) return;
    [...models].forEach(removeModel);
    commit();
  });

  $('#lang').addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    store.set('lang', lang);
    renderTexts();
  });

  // Raccourcis : W/E/R modes, Suppr, Ctrl+Z, Ctrl+D, F recadrer, Échap
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, select')) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); undo(); return; }
    if ((e.ctrlKey || e.metaKey) && k === 'd') { e.preventDefault(); duplicate(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (k === 'w') setMode('translate');
    else if (k === 'e') setMode('rotate');
    else if (k === 'r') setMode('scale');
    else if (k === 'f') setView('frame');
    else if (k === 'escape') select(null);
    else if ((k === 'delete' || k === 'backspace') && sel.model) { removeModel(sel.model); commit(); }
  });

  // Changement de thème : grille et surbrillance prennent les nouvelles couleurs
  new MutationObserver(() => { buildGrid(); highlight(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-skin'] });

  /* ---------- Démarrage ---------- */
  function startFromIdea(params) {
    const model = params.get('model') === 'quad' ? 'quad' : 'human';
    const poseId = D.FROM_IDEA[model][params.get('pose')] || 'stand';
    const angle = D.FROM_IDEA.angle[params.get('angle')] || 'threequarter';
    if (D.FROM_IDEA.fov[params.get('angle')]) { opts.fov = D.FROM_IDEA.fov[params.get('angle')]; camera.fov = D.FOV[opts.fov]; camera.updateProjectionMatrix(); }
    restore({ models: [] });
    const m = createModel(model);
    applyPose(m, poseId);
    setView(angle);
    select(m);
    history.replaceState(null, '', location.pathname); // un rechargement garde les retouches
    toast(t('fromIdea'));
  }

  resize();
  renderTexts();
  const params = new URLSearchParams(location.search);
  const saved = store.get('pose-scene');
  if (params.has('model')) startFromIdea(params);
  else if (saved && saved.models && saved.models.length) restore(saved);
  else { const m = createModel('human'); applyPose(m, 'stand'); setView('threequarter'); }
  placeSun();
  commit();
})();

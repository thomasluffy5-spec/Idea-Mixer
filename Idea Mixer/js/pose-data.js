/* =====================================================================
   PANTINS 3D — DÉFINITION DES MODÈLES ET DES POSES
   ---------------------------------------------------------------------
   Articulation : { name, pos, rest, ball, parts, children }
   - pos   : position par rapport à l'articulation parente (mètres)
   - rest  : rotation au repos [x, y, z] en degrés
   - ball  : rayon de la sphère d'articulation (facultatif)
   - parts : formes rattachées à cette articulation
       capsule  { r, len }       segment orienté selon Y (len = longueur totale)
       ellipsoid{ size:[rx,ry,rz] }
       cone     { r, h }
     + at:[x,y,z] position locale, rot:[x,y,z] rotation locale (degrés)
   Les articulations dont le nom finit par « L » sont dupliquées en « R »
   par symétrie (voir mirror()).

   Repères pour les rotations (degrés) :
   - membre vers l'avant : x négatif   - plier genou : x positif
   - bras gauche écarté  : z positif   - pencher le buste en avant : x positif
   ===================================================================== */
(() => {
  /* ---------- Symétrie gauche → droite ---------- */
  function mirror(node) {
    const flip = a => (a ? [a[0], -a[1], -a[2]] : a);
    return {
      ...node,
      name: node.name.replace(/L$/, 'R'),
      pos: [-node.pos[0], node.pos[1], node.pos[2]],
      rest: flip(node.rest),
      parts: (node.parts || []).map(p => ({ ...p, at: p.at && [-p.at[0], p.at[1], p.at[2]], rot: flip(p.rot) })),
      children: (node.children || []).map(mirror)
    };
  }
  const withMirror = node => [node, mirror(node)];

  /* ---------- Humanoïde (≈ 1,75 m) ---------- */
  const armL = {
    name: 'shoulderL', pos: [0.2, 0.24, 0], rest: [0, 0, 8], ball: 0.055,
    parts: [{ shape: 'capsule', r: 0.05, len: 0.28, at: [0, -0.14, 0] }],
    children: [{
      name: 'elbowL', pos: [0, -0.28, 0], ball: 0.045,
      parts: [{ shape: 'capsule', r: 0.042, len: 0.25, at: [0, -0.125, 0] }],
      children: [{
        name: 'handL', pos: [0, -0.25, 0], ball: 0.035,
        parts: [
          { shape: 'ellipsoid', size: [0.04, 0.075, 0.022], at: [0, -0.07, 0] },
          { shape: 'capsule', r: 0.016, len: 0.07, at: [0, -0.04, 0.035], rot: [-35, 0, 0] } // pouce
        ]
      }]
    }]
  };
  const legL = {
    name: 'thighL', pos: [0.095, -0.04, 0], ball: 0.07,
    parts: [{ shape: 'capsule', r: 0.068, len: 0.43, at: [0, -0.215, 0] }],
    children: [{
      name: 'kneeL', pos: [0, -0.43, 0], ball: 0.055,
      parts: [{ shape: 'capsule', r: 0.052, len: 0.41, at: [0, -0.205, 0] }],
      children: [{
        name: 'footL', pos: [0, -0.41, 0], ball: 0.045,
        parts: [{ shape: 'ellipsoid', size: [0.05, 0.035, 0.115], at: [0, -0.045, 0.06] }]
      }]
    }]
  };
  const HUMAN = {
    name: 'hips', pos: [0, 0.95, 0],
    parts: [{ shape: 'ellipsoid', size: [0.16, 0.1, 0.11] }],
    children: [
      {
        name: 'spine', pos: [0, 0.06, 0], ball: 0.06,
        parts: [{ shape: 'capsule', r: 0.065, len: 0.2, at: [0, 0.1, 0] }],
        children: [{
          name: 'chest', pos: [0, 0.2, 0],
          parts: [{ shape: 'ellipsoid', size: [0.19, 0.17, 0.11], at: [0, 0.13, 0] }],
          children: [
            {
              name: 'neck', pos: [0, 0.29, 0], ball: 0.045,
              parts: [{ shape: 'capsule', r: 0.04, len: 0.09, at: [0, 0.045, 0] }],
              children: [{
                name: 'head', pos: [0, 0.09, 0],
                parts: [
                  { shape: 'ellipsoid', size: [0.1, 0.125, 0.11], at: [0, 0.12, 0] },
                  { shape: 'ellipsoid', size: [0.02, 0.028, 0.02], at: [0, 0.11, 0.105] } // nez : indique où regarde le pantin
                ]
              }]
            },
            ...withMirror(armL)
          ]
        }]
      },
      ...withMirror(legL)
    ]
  };

  /* ---------- Quadrupède (gabarit chien / loup) ---------- */
  const leg = (name, z) => ({
    name: `leg${name}L`, pos: [0.12, -0.1, z], ball: 0.07,
    parts: [{ shape: 'capsule', r: 0.065, len: 0.3, at: [0, -0.15, 0] }],
    children: [{
      name: `knee${name}L`, pos: [0, -0.3, 0], ball: 0.05,
      parts: [{ shape: 'capsule', r: 0.045, len: 0.27, at: [0, -0.135, 0] }],
      children: [{
        name: `paw${name}L`, pos: [0, -0.27, 0],
        parts: [{ shape: 'ellipsoid', size: [0.05, 0.03, 0.07], at: [0, -0.02, 0.03] }]
      }]
    }]
  });
  const QUAD = {
    name: 'body', pos: [0, 0.72, 0],
    parts: [{ shape: 'ellipsoid', size: [0.2, 0.19, 0.48] }],
    children: [
      {
        name: 'neck', pos: [0, 0.08, 0.4], rest: [50, 0, 0], ball: 0.09,
        parts: [{ shape: 'capsule', r: 0.085, len: 0.34, at: [0, 0.17, 0] }],
        children: [{
          name: 'head', pos: [0, 0.32, 0], rest: [-50, 0, 0],
          parts: [
            { shape: 'ellipsoid', size: [0.11, 0.11, 0.14], at: [0, 0.04, 0.03] },
            { shape: 'ellipsoid', size: [0.065, 0.06, 0.11], at: [0, 0.0, 0.17] },  // museau
            { shape: 'cone', r: 0.035, h: 0.11, at: [0.07, 0.16, -0.01], rot: [0, 0, -15] }, // oreilles
            { shape: 'cone', r: 0.035, h: 0.11, at: [-0.07, 0.16, -0.01], rot: [0, 0, 15] }
          ]
        }]
      },
      {
        name: 'tail', pos: [0, 0.08, -0.46], rest: [-55, 0, 0], ball: 0.04,
        parts: [{ shape: 'capsule', r: 0.035, len: 0.38, at: [0, 0.19, 0] }]
      },
      ...withMirror(leg('F', 0.34)),
      ...withMirror(leg('B', -0.34))
    ]
  };

  /* ---------- Poses ----------
     joints : rotations en degrés (les articulations absentes reviennent au repos)
     root   : inclinaison du corps entier [x, _, z] (l'orientation Y choisie est conservée)
     lift   : hauteur au-dessus du sol après la pose (saut, chute…)              */
  const sym = (name, [x, y, z]) => ({ [name + 'L']: [x, y, z], [name + 'R']: [x, -y, -z] });

  const HUMAN_POSES = {
    stand: {},
    tpose: { joints: sym('shoulder', [0, 0, 90]) },
    walk: { joints: {
      thighL: [-25, 0, 0], kneeL: [10, 0, 0], thighR: [20, 0, 0], kneeR: [25, 0, 0],
      shoulderL: [20, 0, 6], elbowL: [-10, 0, 0], shoulderR: [-20, 0, -6], elbowR: [-25, 0, 0] } },
    run: { joints: {
      spine: [12, 0, 0], head: [-8, 0, 0],
      thighL: [-65, 0, 0], kneeL: [60, 0, 0], thighR: [40, 0, 0], kneeR: [95, 0, 0], footR: [20, 0, 0],
      shoulderL: [45, 0, 8], elbowL: [-80, 0, 0], shoulderR: [-55, 0, -8], elbowR: [-95, 0, 0] } },
    jump: { lift: 0.45, joints: {
      thighL: [-80, 0, 0], kneeL: [110, 0, 0], footL: [35, 0, 0], thighR: [-40, 0, 0], kneeR: [90, 0, 0], footR: [40, 0, 0],
      ...sym('shoulder', [-10, 0, 150]), ...sym('elbow', [-20, 0, 0]) } },
    crouch: { joints: {
      spine: [30, 0, 0], neck: [-15, 0, 0], head: [-15, 0, 0],
      ...sym('thigh', [-115, 0, 8]), ...sym('knee', [140, 0, 0]), ...sym('foot', [-25, 0, 0]),
      ...sym('shoulder', [-50, 0, 10]), ...sym('elbow', [-50, 0, 0]) } },
    sit: { joints: {
      ...sym('thigh', [-90, 0, 4]), ...sym('knee', [90, 0, 0]),
      ...sym('shoulder', [-25, 0, 5]), ...sym('elbow', [-55, 0, 0]) } },
    kneel: { joints: {
      spine: [5, 0, 0], thighL: [-90, 0, 0], kneeL: [90, 0, 0], thighR: [5, 0, 0], kneeR: [95, 0, 0], footR: [-50, 0, 0],
      shoulderL: [-40, 0, 10], elbowL: [-60, 0, 0] } },
    fight: { joints: {
      spine: [10, 25, 0], neck: [-5, 0, 0], head: [0, -20, 0],
      thighL: [-25, 0, 8], kneeL: [25, 0, 0], thighR: [15, 0, -10], kneeR: [20, 0, 0],
      shoulderL: [-55, 0, 25], elbowL: [-115, 0, 0], shoulderR: [-40, 0, -30], elbowR: [-120, 0, 0] } },
    hero: { joints: {
      chest: [-8, 0, 0], head: [-6, 0, 0], ...sym('thigh', [0, 0, 10]),
      ...sym('shoulder', [0, 0, 35]), ...sym('elbow', [0, 0, -95]) } },
    armsCrossed: { joints: {
      ...sym('shoulder', [-15, 0, 12]), ...sym('elbow', [0, 30, -90]) } },
    balance: { joints: {
      thighL: [0, 0, 3], thighR: [-70, 0, -5], kneeR: [90, 0, 0],
      ...sym('shoulder', [0, 0, 80]) } },
    lookBack: { joints: {
      spine: [0, 25, 0], chest: [0, 20, 0], neck: [0, 30, 0], head: [0, 25, 0],
      thighL: [-10, 0, 0], kneeL: [10, 0, 0] } },
    fall: { lift: 0.6, root: [-30, 0, 0], joints: {
      spine: [-15, 0, 0], neck: [-10, 0, 0],
      ...sym('shoulder', [-30, 0, 120]), ...sym('elbow', [-30, 0, 0]),
      thighL: [-50, 0, 0], kneeL: [70, 0, 0], thighR: [-10, 0, 0], kneeR: [30, 0, 0] } },
    float: { lift: 0.5, joints: {
      head: [-10, 0, 0], ...sym('shoulder', [0, 0, 50]), ...sym('elbow', [-20, 0, 0]),
      thighL: [-15, 0, 0], kneeL: [30, 0, 0], footL: [40, 0, 0], thighR: [5, 0, 0], kneeR: [45, 0, 0], footR: [40, 0, 0] } }
  };

  const QUAD_POSES = {
    stand: {},
    walk: { joints: {
      legFL: [-20, 0, 0], kneeFL: [15, 0, 0], legFR: [15, 0, 0],
      legBL: [18, 0, 0], kneeBL: [10, 0, 0], legBR: [-15, 0, 0], kneeBR: [25, 0, 0] } },
    run: { lift: 0.15, joints: {
      neck: [35, 0, 0], head: [-35, 0, 0], tail: [-75, 0, 0],
      legFL: [-55, 0, 0], kneeFL: [10, 0, 0], legFR: [-35, 0, 0], kneeFR: [40, 0, 0],
      legBL: [50, 0, 0], kneeBL: [10, 0, 0], legBR: [35, 0, 0], kneeBR: [30, 0, 0] } },
    sit: { root: [-35, 0, 0], joints: {
      neck: [30, 0, 0], head: [-10, 0, 0], tail: [-100, 0, 0],
      ...sym('legF', [35, 0, 0]), ...sym('legB', [-60, 0, 0]), ...sym('kneeB', [130, 0, 0]), ...sym('pawB', [-35, 0, 0]) } },
    lie: { joints: {
      neck: [35, 0, 0], head: [-35, 0, 0], tail: [-110, 0, 0],
      ...sym('legF', [-80, 0, 0]), ...sym('kneeF', [10, 0, 0]), ...sym('pawF', [70, 0, 0]),
      ...sym('legB', [-80, 0, 0]), ...sym('kneeB', [150, 0, 0]) } },
    bow: { root: [20, 0, 0], joints: {
      neck: [30, 0, 0], head: [-50, 0, 0], tail: [-20, 0, 0],
      ...sym('legF', [-50, 0, 0]), ...sym('kneeF', [70, 0, 0]), ...sym('legB', [-25, 0, 0]) } },
    leap: { lift: 0.4, root: [-15, 0, 0], joints: {
      tail: [-80, 0, 0],
      ...sym('legF', [-70, 0, 0]), ...sym('kneeF', [100, 0, 0]), ...sym('legB', [60, 0, 0]) } }
  };

  /* ---------- Vues caméra (direction depuis la cible) ---------- */
  const VIEWS = {
    threequarter: [0.75, 0.25, 1], front: [0, 0.08, 1], profile: [1, 0.08, 0], back: [0, 0.08, -1],
    high: [0.6, 1.1, 0.8], low: [0.7, -0.3, 0.9], ground: [0.8, -0.55, 1], birdseye: [0, 1, 0.001]
  };

  /* ---------- Correspondance avec le générateur d'idées ----------
     id de pose / d'angle dans js/data.js → pose / vue ici            */
  const FROM_IDEA = {
    human: { defend: 'fight', crouch: 'crouch', run: 'run', fall: 'fall', hero: 'hero', sit: 'sit', kneel: 'kneel',
             arms: 'armsCrossed', wall: 'stand', jump: 'jump', balance: 'balance', look: 'lookBack', float: 'float' },
    quad: { defend: 'bow', crouch: 'bow', run: 'run', fall: 'leap', hero: 'stand', sit: 'sit', kneel: 'lie',
            jump: 'leap', float: 'leap', balance: 'walk', look: 'stand', wall: 'lie', arms: 'sit' },
    angle: { front: 'front', threequarter: 'threequarter', profile: 'profile', back: 'back', low: 'low',
             high: 'high', birdseye: 'birdseye', ground: 'ground', dutch: 'threequarter', fisheye: 'low' },
    fov: { fisheye: 'wide' }
  };

  window.IM_POSE_DATA = {
    MODELS: { human: HUMAN, quad: QUAD },
    POSES: { human: HUMAN_POSES, quad: QUAD_POSES },
    VIEWS,
    FOV: { wide: 70, normal: 35, tele: 18 },
    FROM_IDEA
  };
})();

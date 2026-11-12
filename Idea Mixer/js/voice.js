/* =====================================================================
   DICTÉE VOCALE — deux moteurs
   ---------------------------------------------------------------------
   1. « navigateur » : Web Speech API (SpeechRecognition).
      Transcription en direct, mais dépend d'un service du navigateur :
      Chrome, Edge et Safari l'ont ; Opera, Brave, Vivaldi exposent l'API
      sans service derrière (rien ne se passe) ; Firefox ne l'a pas.
      → un « chien de garde » détecte ce silence et le signale.
   2. « locale » : on enregistre le micro (MediaRecorder), puis le modèle
      Whisper transcrit l'audio DANS le navigateur (transformers.js).
      Marche partout où le micro est accessible ; la voix ne quitte pas
      l'ordinateur. Premier usage : téléchargement du modèle (~75 Mo),
      ensuite mis en cache par le navigateur.

   Exposé sous window.IM_VOICE
   ===================================================================== */
(() => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  // Bibliothèque et modèle de la dictée locale
  const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2';
  const MODEL = 'Xenova/whisper-base';

  const read = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const write = (k, v) => { try { localStorage.setItem(k, v); } catch { /* stockage indisponible */ } };

  // Moteur choisi : mémorisé ; par défaut le navigateur s'il a l'API, sinon local
  let engine = read('voice-engine') || (SR ? 'native' : 'local');
  if (engine === 'native' && !SR) engine = 'local';

  let session = null; // session en cours (un seul enregistrement à la fois)

  /* =================== Moteur 1 : navigateur =================== */
  function startNative(cb) {
    const rec = new SR();
    rec.lang = cb.lang === 'fr' ? 'fr-FR' : 'en-US';
    rec.interimResults = true;
    rec.continuous = true;

    let heard = '';
    let gotAudio = false, gotResult = false, failed = false;
    const timers = [];
    const fail = code => {
      if (failed) return;
      failed = true;
      timers.forEach(clearTimeout);
      try { rec.abort(); } catch { /* déjà arrêté */ }
      // un service absent ne renvoie parfois jamais « onend » : on libère nous-mêmes
      if (session === mine) session = null;
      cb.onError(code);
    };

    // Chien de garde : certains navigateurs ont l'API mais ne font rien.
    // - micro jamais ouvert après 4 s → service absent
    // - la parole est détectée mais aucun texte 5 s après → service absent
    // - 10 s d'écoute sans aucun texte → on prévient sans couper
    timers.push(setTimeout(() => { if (!gotAudio) fail('silent'); }, 4000));
    timers.push(setTimeout(() => { if (!gotResult && !failed) cb.onStatus('nothing'); }, 10000));
    rec.onaudiostart = () => { gotAudio = true; };
    rec.onspeechstart = () => {
      gotAudio = true;
      timers.push(setTimeout(() => { if (!gotResult) fail('silent'); }, 5000));
    };

    rec.onresult = e => {
      gotResult = true;
      heard = Array.from(e.results, r => r[0].transcript).join(' ').replace(/\s+/g, ' ').trim();
      cb.onText(heard);
    };
    rec.onerror = e => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') fail(e.error);
    };
    rec.onend = () => {
      timers.forEach(clearTimeout);
      if (session === mine) session = null;
      if (!failed) cb.onEnd(heard.length > 0);
    };

    const mine = { stop: () => rec.stop(), busy: () => false };
    session = mine;
    try { rec.start(); } catch { fail('start'); return; }
    cb.onStatus('listening');
  }

  /* =================== Moteur 2 : local (Whisper) =================== */
  let asrPromise = null;
  let lastPct = 0;
  function loadModel(onProgress) {
    if (!asrPromise) {
      const files = {};
      asrPromise = (async () => {
        const { pipeline } = await import(TRANSFORMERS_URL);
        const asr = await pipeline('automatic-speech-recognition', MODEL, {
          dtype: 'q8',          // version allégée du modèle (~75 Mo)
          device: 'wasm',
          progress_callback: d => {
            if (d.status !== 'progress' || !d.total) return;
            files[d.file] = [d.loaded, d.total];
            const all = Object.values(files);
            lastPct = Math.round(100 * all.reduce((a, f) => a + f[0], 0) / all.reduce((a, f) => a + f[1], 0));
            onProgress(lastPct);
          }
        });
        write('voice-model-ready', '1');
        return asr;
      })();
      asrPromise.catch(() => { asrPromise = null; }); // on pourra réessayer
    }
    return asrPromise;
  }

  // Audio enregistré → échantillons mono à 16 kHz (format attendu par Whisper)
  async function toMono16k(blob) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
    ctx.close();
    if (buf.sampleRate === 16000) return buf.getChannelData(0);
    const off = new OfflineAudioContext(1, Math.ceil(buf.duration * 16000), 16000);
    const src = off.createBufferSource();
    src.buffer = buf;
    src.connect(off.destination);
    src.start();
    return (await off.startRendering()).getChannelData(0);
  }

  async function startLocal(cb) {
    let stream;
    session = { stop: () => {}, busy: () => true }; // réservé pendant l'accès au micro
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
    } catch (e) {
      session = null;
      cb.onError(e.name === 'NotAllowedError' || e.name === 'SecurityError' ? 'not-allowed'
        : e.name === 'NotFoundError' ? 'audio-capture' : 'start');
      return;
    }

    // Le modèle se télécharge pendant que tu parles
    let recording = true;
    const model = loadModel(pct => { if (recording) cb.onStatus('recording', pct); else cb.onStatus('loading', pct); });
    model.catch(() => {}); // l'erreur est traitée après l'enregistrement

    const chunks = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    mr.onstop = async () => {
      recording = false;
      stream.getTracks().forEach(tr => tr.stop());
      session = { stop: () => {}, busy: () => true }; // transcription en cours
      try {
        if (!chunks.length) throw Object.assign(new Error('empty'), { code: 'no-speech' });
        cb.onStatus('transcribing');
        const audio = await toMono16k(new Blob(chunks, { type: mr.mimeType }));
        let asr;
        try { asr = await model; } catch { throw Object.assign(new Error('model'), { code: 'model' }); }
        cb.onStatus('transcribing');
        const out = await asr(audio, {
          language: cb.lang === 'fr' ? 'french' : 'english',
          task: 'transcribe',
          chunk_length_s: 30, stride_length_s: 5 // dictées de plus de 30 s
        });
        const text = (Array.isArray(out) ? out[0].text : out.text || '').trim();
        session = null;
        if (text) cb.onText(text);
        cb.onEnd(!!text);
      } catch (e) {
        session = null;
        cb.onError(e.code || 'transcribe');
      }
    };
    mr.start();
    session = { stop: () => { if (mr.state !== 'inactive') mr.stop(); }, busy: () => !recording };
    cb.onStatus('recording', asrPromise && localStorage.getItem('voice-model-ready') ? 100 : lastPct);
  }

  /* =================== Interface publique =================== */
  /**
   * @param cb.lang      'fr' | 'en'
   * @param cb.onText    (texte) => void
   * @param cb.onEnd     (aDuTexte) => void
   * @param cb.onError   (code) => void : not-allowed, network, audio-capture,
   *                     silent (service absent), model, transcribe, start…
   * @param cb.onStatus  (état, pourcentage?) => void : listening, nothing,
   *                     recording, loading, transcribing
   */
  function start(cb) {
    if (session) return;
    const noop = () => {};
    const c = { onText: noop, onEnd: noop, onError: noop, onStatus: noop, ...cb };
    if (engine === 'native' && SR) startNative(c);
    else startLocal(c);
  }

  window.IM_VOICE = {
    supported: !!SR || canRecord,
    nativeAvailable: !!SR,
    localAvailable: canRecord,
    start,
    stop: () => session && session.stop(),
    isListening: () => !!session && !session.busy(),
    isBusy: () => !!session && session.busy(),
    engine: () => engine,
    setEngine: e => { engine = e === 'native' && SR ? 'native' : 'local'; write('voice-engine', engine); },
    modelReady: () => read('voice-model-ready') === '1'
  };
})();

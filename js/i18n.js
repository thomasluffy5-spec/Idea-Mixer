/* =====================================================================
   TEXTES D'INTERFACE (FR / EN)
   Les clés de critères (archetype, shot…) doivent correspondre à js/data.js.
   ===================================================================== */
window.IM_I18N = {
  en: {
    nHome: 'Home', nMixer: 'Idea Mixer', nHist: 'My ideas', nPose: '3D mannequins', poseIt: 'Pose it in 3D',
    h1: 'Don’t know what to draw?',
    intro: 'Describe a rough idea or start from scratch: Idea Mixer builds you a character, creature, setting, object or scene to draw, paint or model. No account needed.',
    inspire: 'Surprise me',

    /* Point de départ */
    premiseLabel: 'Got a rough idea? Describe it',
    premisePh: 'e.g. something sci-fi, maybe a character, but landscapes inspire me too…',
    expand: 'Flesh it out',
    micStart: 'Dictate', micStop: 'Stop',
    micNote: 'Browser dictation: live transcription by your browser’s speech service.',
    micNoteLocal: 'Local dictation: your voice is transcribed inside your browser (Whisper model); nothing is sent.',
    micError: 'Dictation failed. Try again, or type your idea.',
    micFile: 'Dictation is blocked when the page is opened as a local file (file://). Open the site through a local server (e.g. VS Code “Live Server”, address http://localhost…) or online over https.',
    micDenied: 'Microphone access denied. Allow it in your browser’s site settings (icon next to the address), then try again.',
    micNetwork: 'The browser’s speech service can’t be reached (offline, or a browser without one such as Opera, Brave, Vivaldi).',
    micSilent: 'Your browser offers dictation but transcribes nothing: that’s the case for Opera, Brave and Vivaldi, which have no speech service.',
    micNothing: 'Nothing received yet. If nothing comes, your browser probably has no speech service.',
    micTryLocal: 'Use local dictation',
    micLocalIntro: 'Local dictation: your voice is transcribed right in your browser, nothing is sent. First use downloads a ~75 MB model (cached afterwards).',
    micLocalGo: 'Download and dictate',
    micModelError: 'Couldn’t download the dictation model. Check your connection and try again.',
    micNoMic: 'No microphone detected.',
    micEmpty: 'I didn’t hear anything. Try again a little closer to the mic.',
    micRecording: 'Recording… speak, then click “Stop”.',
    micModelPct: 'preparing model: {pct}%',
    micLoading: 'Preparing model: {pct}%…',
    micTranscribing: 'Transcribing…',
    engineLabel: 'Dictation:', engineNative: 'browser', engineLocal: 'local',
    micListening: 'Listening… speak, then click “Stop”.',
    micBusy: 'Transcribing…',
    understood: 'Picked up from your idea:',
    nothingFound: 'I didn’t recognise anything specific, so here’s a random take. Adjust the cards below.',
    yourIdea: 'Your starting point',

    /* Résultat */
    drawThis: 'Draw this',
    randAll: 'New idea', unlockAll: 'Unlock all', copy: 'Copy', copied: 'Copied!',
    hint: 'Click a card to pick, the die to reroll it, the padlock to keep it.',
    empty: 'Describe an idea above, or press “New idea”.',
    draw: 'Draw',
    lineStaging: 'Staging', lineLight: 'Light & mood', lineColor: 'Colours', lineStyle: 'Style', lineChallenge: 'Challenge',

    /* Mixer */
    subjectQ: 'What do you want to create?',
    detail: 'Detail', simple: 'Simple', standard: 'Standard', detailed: 'Detailed',
    groupSubject: 'The subject', groupDirection: 'Staging & rendering',
    addCrit: 'Add a criterion', remove: 'Remove',
    rand: 'Reroll', lock: 'Lock', unlock: 'Unlock', auto: 'Random', choose: 'Choose',

    /* Historique */
    hEmpty: 'Your recent ideas will appear here (stored only in this browser).',
    hClear: 'Delete my ideas',

    /* Libellés des critères */
    genre: 'Universe', archetype: 'Role', species: 'Species', feature: 'Distinctive trait', hair: 'Hair',
    outfit: 'Outfit', pose: 'Pose', expression: 'Expression', holding: 'In hand', personality: 'Personality',
    base: 'Base animal', fusion: 'Hybrid feature', size: 'Size', ctrait: 'Peculiarity', temper: 'Temperament',
    setting: 'Place', landmark: 'Focal point', timeofday: 'Time of day', weather: 'Weather', season: 'Season',
    objtype: 'Object', material: 'Material', condition: 'Condition', objdetail: 'Mysterious detail',
    second: 'With…', event: 'Action',
    shot: 'Framing', angle: 'Camera angle', lighting: 'Lighting', mood: 'Mood', harmony: 'Colour harmony',
    palette: 'Palette', style: 'Style', challenge: 'Challenge',

    /* Début de phrase selon le sujet */
    headchar: 'a character:', headcreature: 'a creature:', headplace: 'a setting', headobject: 'an object:', headscene: 'a scene:'
  },
  fr: {
    nHome: 'Accueil', nMixer: 'Idea Mixer', nHist: 'Mes idées', nPose: 'Pantins 3D', poseIt: 'Poser en 3D',
    h1: 'Pas d’idée de dessin ?',
    intro: 'Décris un début d’idée ou pars de zéro : Idea Mixer te propose un personnage, une créature, un décor, un objet ou une scène à dessiner, peindre ou modéliser. Sans compte.',
    inspire: 'Surprends-moi',

    premiseLabel: 'Tu as déjà une envie ? Décris-la',
    premisePh: 'ex. un truc sci-fi, pourquoi pas un personnage, mais les paysages m’inspirent aussi…',
    expand: 'Étoffer mon idée',
    micStart: 'Dicter', micStop: 'Arrêter',
    micNote: 'Dictée du navigateur : transcription en direct par le service vocal de ton navigateur.',
    micNoteLocal: 'Dictée locale : ta voix est transcrite dans ton navigateur (modèle Whisper), rien n’est envoyé.',
    micError: 'La dictée a échoué. Réessaie, ou écris ton idée.',
    micFile: 'La dictée est bloquée quand la page est ouverte comme fichier local (file://). Ouvre le site via un serveur local (ex. « Live Server » dans VS Code, adresse http://localhost…) ou en ligne en https.',
    micDenied: 'Accès au micro refusé. Autorise-le dans les réglages du site (icône à gauche de l’adresse), puis réessaie.',
    micNetwork: 'Le service vocal du navigateur est injoignable (connexion coupée, ou navigateur sans service vocal comme Opera, Brave, Vivaldi).',
    micSilent: 'Ton navigateur propose la dictée mais ne transcrit rien : c’est le cas d’Opera, Brave ou Vivaldi, qui n’ont pas de service vocal.',
    micNothing: 'Je n’ai encore rien reçu. Si ça ne vient pas, ton navigateur n’a sans doute pas de service vocal.',
    micTryLocal: 'Utiliser la dictée locale',
    micLocalIntro: 'Dictée locale : ta voix est transcrite directement dans ton navigateur, sans rien envoyer. Le premier usage télécharge un modèle d’environ 75 Mo (gardé en cache ensuite).',
    micLocalGo: 'Télécharger et dicter',
    micModelError: 'Impossible de télécharger le modèle de dictée. Vérifie ta connexion, puis réessaie.',
    micNoMic: 'Aucun micro détecté.',
    micEmpty: 'Je n’ai rien entendu. Réessaie en parlant un peu plus près du micro.',
    micRecording: 'J’enregistre… parle, puis clique sur « Arrêter ».',
    micModelPct: 'préparation du modèle : {pct} %',
    micLoading: 'Préparation du modèle : {pct} %…',
    micTranscribing: 'Transcription en cours…',
    engineLabel: 'Dictée :', engineNative: 'navigateur', engineLocal: 'locale',
    micListening: 'Je t’écoute… parle, puis clique sur « Arrêter ».',
    micBusy: 'Transcription…',
    understood: 'Repéré dans ton idée :',
    nothingFound: 'Je n’ai rien reconnu de précis, voici une proposition au hasard. Ajuste les cartes plus bas.',
    yourIdea: 'Ton point de départ',

    drawThis: 'À dessiner',
    randAll: 'Nouvelle idée', unlockAll: 'Tout déverrouiller', copy: 'Copier', copied: 'Copié !',
    hint: 'Clique sur une carte pour choisir, sur le dé pour la relancer, sur le cadenas pour la garder.',
    empty: 'Décris une envie ci-dessus, ou clique sur « Nouvelle idée ».',
    draw: 'Dessine',
    lineStaging: 'Mise en scène', lineLight: 'Lumière & ambiance', lineColor: 'Couleurs', lineStyle: 'Style', lineChallenge: 'Défi',

    subjectQ: 'Tu veux créer quoi ?',
    detail: 'Détail', simple: 'Simple', standard: 'Standard', detailed: 'Détaillé',
    groupSubject: 'Le sujet', groupDirection: 'Mise en scène & rendu',
    addCrit: 'Ajouter un critère', remove: 'Retirer',
    rand: 'Relancer', lock: 'Verrouiller', unlock: 'Déverrouiller', auto: 'Au hasard', choose: 'Choisir',

    hEmpty: 'Tes dernières idées apparaîtront ici (stockées uniquement dans ce navigateur).',
    hClear: 'Supprimer mes idées',

    genre: 'Univers', archetype: 'Rôle', species: 'Espèce', feature: 'Trait distinctif', hair: 'Coiffure',
    outfit: 'Tenue', pose: 'Pose', expression: 'Expression', holding: 'En main', personality: 'Personnalité',
    base: 'Animal de base', fusion: 'Trait hybride', size: 'Taille', ctrait: 'Particularité', temper: 'Tempérament',
    setting: 'Lieu', landmark: 'Point focal', timeofday: 'Moment', weather: 'Météo', season: 'Saison',
    objtype: 'Objet', material: 'Matière', condition: 'État', objdetail: 'Détail mystérieux',
    second: 'Avec…', event: 'Action',
    shot: 'Cadrage', angle: 'Angle de vue', lighting: 'Lumière', mood: 'Ambiance', harmony: 'Harmonie',
    palette: 'Palette', style: 'Style', challenge: 'Défi',

    headchar: 'un personnage :', headcreature: 'une créature :', headplace: 'un décor', headobject: 'un objet :', headscene: 'une scène :'
  }
};

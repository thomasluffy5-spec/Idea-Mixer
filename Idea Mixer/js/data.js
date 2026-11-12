/* =====================================================================
   DONNÉES DU GÉNÉRATEUR
   ---------------------------------------------------------------------
   Élément : [id, texte EN, texte FR, tags, mots-clés]
   - tags : univers compatibles séparés par des espaces ; "*" = universel.
     fantasy · dark · scifi · cyber · steam · western · horror · postapo
     solar · myth · daily · tale
   - mots-clés (facultatif) : mots FR/EN séparés par "|" que l'analyse
     du « point de départ » reconnaît (accents et majuscules ignorés).

   Les textes sont des fragments de phrase écrits pour rester corrects
   au masculin comme au féminin (« en armure », « l'air serein »…).

   Pour ajouter un critère : l'ajouter dans CATS, le citer dans un SUBJECT
   (ou dans DIRECTION) et ajouter son libellé dans js/i18n.js.
   ===================================================================== */
window.IM_DATA = {

  /* ---------- UNIVERS (genre) ---------- */
  GENRES: [
    ['fantasy', 'fantasy', 'fantasy', 'fantasy|fantastique|magie|magique|magic|medieval|heroic fantasy'],
    ['dark', 'dark fantasy', 'dark fantasy', 'dark fantasy|sombre|gothique|gothic|grimdark|maudit|cursed'],
    ['scifi', 'sci-fi', 'science-fiction', 'sci-fi|scifi|science-fiction|science fiction|sf|futur|futuriste|futuristic|espace|spatial|space|galaxie|alien|extraterrestre'],
    ['cyber', 'cyberpunk', 'cyberpunk', 'cyberpunk|cyber|neon|dystopie|dystopia|megacorpo'],
    ['steam', 'steampunk', 'steampunk', 'steampunk|vapeur|victorien|victorian|engrenage|rouage|gear|clockwork'],
    ['western', 'western', 'western', 'western|far west|wild west|cowboy|saloon|shérif|sheriff'],
    ['horror', 'horror', 'horreur', 'horreur|horror|effrayant|flippant|terrifiant|creepy|glauque|angoissant|scary'],
    ['postapo', 'post-apocalyptic', 'post-apocalyptique', 'post-apo|post apo|postapo|post-apocalyptique|post-apocalyptic|apocalypse|fin du monde|wasteland'],
    ['solar', 'solarpunk', 'solarpunk', 'solarpunk|utopie|utopia|ecologique|verdoyant|eco'],
    ['myth', 'mythology & folklore', 'mythologie & folklore', 'mythologie|mythologique|mythology|mythe|myth|folklore|dieux|divinite|legende|legend|yokai'],
    ['daily', 'everyday life', 'quotidien', 'quotidien|contemporain|moderne|modern|realiste|slice of life|de nos jours|everyday|urbain'],
    ['tale', 'fairy tale & cozy', 'conte & cosy', 'conte|feerique|merveilleux|cosy|cozy|mignon|cute|kawaii|whimsical|fairy tale']
  ],

  /* ---------- SUJETS PRINCIPAUX ----------
     head    : critère obligatoire qui porte la phrase
     cats    : critères disponibles pour ce sujet (ordre d'affichage)
     def     : critères actifs par défaut (niveau « Standard »)
     simple  : critères du niveau « Simple »
     dir     : critères de mise en scène actifs par défaut              */
  SUBJECTS: [
    { id: 'char', en: 'Character', fr: 'Personnage', head: 'archetype',
      kw: 'personnage|perso|character|oc|heros|heroine|hero|portrait|protagoniste|guerrier|guerriere',
      cats: ['genre', 'archetype', 'species', 'feature', 'hair', 'outfit', 'pose', 'expression', 'holding', 'personality', 'event', 'setting', 'timeofday', 'weather'],
      def: ['genre', 'archetype', 'species', 'feature', 'hair', 'outfit', 'pose', 'expression'],
      simple: ['genre', 'archetype', 'outfit'],
      dir: ['shot', 'angle', 'lighting', 'palette'] },
    { id: 'creature', en: 'Creature', fr: 'Créature', head: 'base',
      kw: 'creature|monstre|monster|bete|beast|bestiole|familier|dragon|chimere|chimera',
      cats: ['genre', 'base', 'fusion', 'size', 'ctrait', 'temper', 'pose', 'setting', 'timeofday', 'weather'],
      def: ['genre', 'base', 'fusion', 'size', 'ctrait', 'temper', 'setting'],
      simple: ['genre', 'base', 'fusion'],
      dir: ['angle', 'lighting', 'palette'] },
    { id: 'place', en: 'Setting', fr: 'Décor', head: 'setting',
      kw: 'paysage|paysages|decor|environnement|lieu|landscape|environment|background|ville|city|batiment|architecture',
      cats: ['genre', 'setting', 'landmark', 'timeofday', 'weather', 'season'],
      def: ['genre', 'setting', 'landmark', 'timeofday', 'weather'],
      simple: ['genre', 'setting', 'timeofday'],
      dir: ['shot', 'angle', 'mood', 'palette'] },
    { id: 'object', en: 'Object', fr: 'Objet', head: 'objtype',
      kw: 'objet|object|accessoire|prop|props|item|artefact|artifact|nature morte|still life',
      cats: ['genre', 'objtype', 'material', 'condition', 'objdetail', 'setting'],
      def: ['genre', 'objtype', 'material', 'condition', 'objdetail'],
      simple: ['genre', 'objtype', 'material'],
      dir: ['angle', 'lighting', 'style'] },
    { id: 'scene', en: 'Scene', fr: 'Scène', head: 'archetype',
      kw: 'scene|histoire|story|moment|narratif|narrative',
      cats: ['genre', 'archetype', 'species', 'second', 'event', 'setting', 'timeofday', 'weather'],
      def: ['genre', 'archetype', 'second', 'event', 'setting', 'timeofday'],
      simple: ['genre', 'archetype', 'event', 'setting'],
      dir: ['shot', 'angle', 'lighting', 'mood', 'palette'] }
  ],

  /* Critères de mise en scène et de rendu, communs à tous les sujets */
  DIRECTION: ['shot', 'angle', 'lighting', 'mood', 'harmony', 'palette', 'style', 'challenge'],

  /* Poids résiduel d'un élément « hors univers » → un peu d'inattendu */
  UNEXPECTED: 0.06,

  /* ---------- CRITÈRES ---------- */
  CATS: {
    /* ===== Personnage ===== */
    archetype: [
      ['knight', 'a knight', 'un chevalier', 'fantasy dark myth', 'chevalier|knight|paladin'],
      ['mage', 'a mage', 'un mage', 'fantasy dark steam tale', 'mage|sorcier|sorciere|magicien|wizard|witch|sorcerer'],
      ['assassin', 'an assassin', 'un assassin', 'fantasy dark cyber', 'assassin|ninja'],
      ['hunter', 'a huntress', 'une chasseuse', 'fantasy dark western horror postapo', 'chasseur|chasseuse|hunter|huntress|traqueur'],
      ['outlaw', 'an outlaw', 'un hors-la-loi', 'western postapo', 'hors-la-loi|outlaw|bandit|pirate'],
      ['detective', 'a detective', 'un détective', 'daily horror steam cyber', 'detective|enqueteur|inspecteur|investigator'],
      ['pilot', 'a starship pilot', 'un pilote de vaisseau', 'scifi cyber', 'pilote|pilot|astronaute|astronaut'],
      ['hacker', 'a hacker', 'une hackeuse', 'cyber scifi', 'hacker|hackeuse|pirate informatique'],
      ['inventor', 'an inventor', 'une inventrice', 'steam solar', 'inventeur|inventrice|inventor|ingenieur|engineer|scientifique|scientist'],
      ['survivor', 'a survivor', 'un survivant', 'horror postapo', 'survivant|survivante|survivor'],
      ['healer', 'a healer', 'une guérisseuse', 'fantasy tale solar', 'guerisseur|guerisseuse|healer|soigneur|medecin|doctor'],
      ['mercenary', 'a mercenary', 'une mercenaire', 'scifi postapo fantasy dark western', 'mercenaire|mercenary|soldat|soldier'],
      ['priestess', 'a priestess', 'une prêtresse', 'myth fantasy dark', 'pretre|pretresse|priest|priestess|moine|monk|oracle'],
      ['explorer', 'an explorer', 'une exploratrice', 'fantasy steam scifi solar', 'explorateur|exploratrice|explorer|aventurier|aventuriere|adventurer|cartographe'],
      ['mechanic', 'a mechanic', 'une mécanicienne', 'steam scifi postapo cyber', 'mecanicien|mecanicienne|mechanic|bricoleur'],
      ['merchant', 'a travelling merchant', 'un marchand ambulant', '*', 'marchand|merchant|vendeur|trader'],
      ['musician', 'a street musician', 'une musicienne de rue', 'daily tale cyber', 'musicien|musicienne|musician|barde|bard'],
      ['gardener', 'a gardener', 'un jardinier', 'solar tale daily', 'jardinier|jardiniere|gardener|botaniste'],
      ['cook', 'a cook', 'une cuisinière', 'daily tale', 'cuisinier|cuisiniere|cook|chef'],
      ['royal', 'an exiled royal', 'une reine en exil', 'fantasy dark myth tale', 'roi|reine|prince|princesse|king|queen|royal']
    ],
    species: [
      ['human', 'of human appearance', 'd’apparence humaine', '*', 'humain|humaine|human'],
      ['elf', 'of elven blood', 'au sang elfique', 'fantasy tale myth', 'elfe|elf|elfique|elven'],
      ['dwarf', 'of dwarven lineage', 'de lignée naine', 'fantasy', 'nain|naine|dwarf'],
      ['android', 'built as an android', 'androïde', 'scifi cyber', 'androide|android|robot|ia|synthetique'],
      ['cyborg', 'with cybernetic implants', 'aux implants cybernétiques', 'cyber scifi postapo', 'cyborg|implant|augmente|augmented'],
      ['beast', 'with fox-like features', 'aux traits de renard', 'tale myth fantasy', 'renard|fox|anthropomorphe|furry|kemonomimi'],
      ['bird', 'with raven-like features', 'aux traits de corbeau', 'myth dark fantasy', 'corbeau|raven|crow|plumes|tengu'],
      ['undead', 'from beyond the grave', 'd’outre-tombe', 'dark horror', 'mort-vivant|undead|zombie|squelette|skeleton|vampire'],
      ['ghost', 'with a spectral look', 'à l’aspect spectral', 'horror myth tale', 'fantome|ghost|spectre|esprit|spirit'],
      ['alien', 'from another world', 'venu d’un autre monde', 'scifi', 'alien|extraterrestre'],
      ['demigod', 'of divine descent', 'd’ascendance divine', 'myth fantasy', 'demi-dieu|divin|divine|dieu|god|deesse|goddess'],
      ['golem', 'with a body of stone', 'au corps de pierre', 'fantasy myth', 'golem|pierre|stone'],
      ['mutant', 'with visible mutations', 'aux mutations visibles', 'postapo scifi horror', 'mutant|mutation'],
      ['automaton', 'with a clockwork body', 'au corps d’automate', 'steam', 'automate|automaton']
    ],
    feature: [
      ['scar', 'with a scar across one eye', 'avec une cicatrice en travers de l’œil', '*', 'cicatrice|scar|balafre'],
      ['mecharm', 'with a mechanical arm', 'avec un bras mécanique', 'steam scifi cyber postapo', 'bras mecanique|prothese|prosthetic|mechanical arm'],
      ['glowtattoo', 'with glowing tattoos', 'avec des tatouages lumineux', 'fantasy cyber myth scifi', 'tatouage|tattoo'],
      ['freckles', 'with lots of freckles', 'avec des taches de rousseur', '*', 'rousseur|freckles'],
      ['heterochromia', 'with mismatched eyes', 'aux yeux vairons', '*', 'vairon|heterochromie|heterochromia'],
      ['horns', 'with broken horns', 'avec des cornes brisées', 'fantasy dark myth', 'cornes|horns|demon'],
      ['runes', 'with skin marked by runes', 'à la peau marquée de runes', 'fantasy dark myth', 'runes|glyphes'],
      ['glasses', 'wearing cracked glasses', 'avec des lunettes fêlées', 'daily steam postapo', 'lunettes|glasses'],
      ['crystal', 'with a crystal limb', 'avec un membre de cristal', 'fantasy scifi', 'cristal|crystal'],
      ['bandage', 'with a bandaged face', 'le visage en partie bandé', 'horror postapo dark', 'bandage|pansement'],
      ['piercings', 'with many piercings', 'avec de nombreux piercings', 'cyber daily', 'piercing'],
      ['eyepatch', 'with an eye patch', 'avec un cache-œil', 'western fantasy postapo', 'cache-oeil|eyepatch|borgne'],
      ['birthmark', 'with a large birthmark', 'avec une grande tache de naissance', 'daily tale', 'tache de naissance|birthmark'],
      ['wings', 'with small tattered wings', 'avec de petites ailes abîmées', 'fantasy myth tale', 'ailes|wings|ange|angel']
    ],
    hair: [
      ['braids', 'with braided hair', 'les cheveux tressés', '*', 'tresse|tresses|braid|braids|natte'],
      ['shaved', 'with a shaved head', 'le crâne rasé', '*', 'rase|chauve|shaved|bald'],
      ['long', 'with long windswept hair', 'les cheveux longs au vent', '*', 'cheveux longs|long hair'],
      ['bob', 'with a sharp bob cut', 'avec une coupe au carré', 'daily cyber', 'carre|bob'],
      ['bun', 'with a messy bun', 'avec un chignon défait', 'daily tale', 'chignon|bun'],
      ['mohawk', 'with a mohawk', 'avec une crête', 'cyber postapo', 'crete|mohawk|iroquoise|punk'],
      ['locs', 'with long locs', 'avec de longues locks', '*', 'locks|locs|dreadlocks'],
      ['messy', 'with short messy hair', 'les cheveux courts en bataille', '*', 'en bataille|messy'],
      ['curls', 'with big voluminous curls', 'avec de grosses boucles', '*', 'boucles|boucle|frise|curls|curly|afro'],
      ['undercut', 'with an undercut', 'avec une coupe undercut', 'cyber daily scifi', 'undercut'],
      ['white', 'with prematurely white hair', 'les cheveux blanchis trop tôt', 'dark fantasy', 'cheveux blancs|white hair'],
      ['hood', 'hair hidden under a hood', 'les cheveux cachés sous une capuche', 'fantasy dark cyber', 'capuche|hood']
    ],
    outfit: [
      ['armor', 'in mismatched armor', 'en armure dépareillée', 'fantasy dark myth postapo', 'armure|armor|armour'],
      ['coat', 'in a long worn coat', 'en long manteau usé', 'western steam dark daily', 'manteau|coat|trench'],
      ['spacesuit', 'in a spacesuit', 'en combinaison spatiale', 'scifi', 'combinaison spatiale|spacesuit|scaphandre'],
      ['workwear', 'in stained work clothes', 'en tenue de travail tachée', 'daily steam postapo', 'bleu de travail|salopette|work clothes|overalls'],
      ['ceremony', 'in ceremonial dress', 'en tenue de cérémonie', 'fantasy myth tale', 'ceremonie|ceremonial|robe de bal|gala'],
      ['cloak', 'under a hooded cloak', 'sous une cape à capuche', 'fantasy dark tale', 'cape|cloak'],
      ['poncho', 'in a poncho and wide hat', 'en poncho et chapeau large', 'western', 'poncho|chapeau|hat'],
      ['leather', 'in a studded leather jacket', 'en veste de cuir cloutée', 'cyber postapo daily', 'cuir|leather|veste|jacket'],
      ['uniform', 'in a military uniform', 'en uniforme militaire', 'scifi steam postapo', 'uniforme|uniform|militaire|military'],
      ['rags', 'in patched rags', 'en haillons rapiécés', 'postapo dark horror', 'haillons|rags|guenilles'],
      ['raincoat', 'in a yellow raincoat', 'en ciré jaune', 'daily tale horror', 'cire|raincoat|impermeable'],
      ['techwear', 'in neon techwear', 'en techwear à néons', 'cyber', 'techwear'],
      ['robes', 'in flowing robes', 'en longue robe ample', 'fantasy myth', 'robe|robes|toge|tunique|tunic'],
      ['harness', 'with a harness full of tools', 'avec un harnais plein d’outils', 'steam postapo scifi', 'harnais|outils|tools']
    ],
    pose: [
      ['defend', 'in a defensive stance', 'en garde défensive', '*', 'en garde|defensive'],
      ['crouch', 'crouching low', 'en position accroupie', '*', 'accroupi|accroupie|crouch|crouching'],
      ['run', 'mid-run', 'en pleine course', '*', 'course|courir|running|cours'],
      ['fall', 'falling', 'en pleine chute', '*', 'chute|falling|tomber'],
      ['hero', 'in a heroic pose', 'dans une pose héroïque', '*', 'heroique|heroic'],
      ['sit', 'seated and resting', 'en position assise', '*', 'assis|assise|sitting|seated'],
      ['kneel', 'down on one knee', 'un genou à terre', '*', 'genou|agenouille|kneel|kneeling'],
      ['arms', 'arms crossed', 'les bras croisés', '*', 'bras croises|arms crossed'],
      ['wall', 'leaning against a wall', 'dos contre un mur', '*', 'adosse|leaning'],
      ['jump', 'mid-jump', 'en plein saut', '*', 'saut|saute|jump|jumping|bond'],
      ['balance', 'balancing precariously', 'en équilibre précaire', '*', 'equilibre|balance'],
      ['look', 'glancing back over the shoulder', 'se retournant par-dessus l’épaule', '*', 'se retourne|regard en arriere|over the shoulder'],
      ['float', 'floating in the air', 'en lévitation', 'fantasy myth scifi tale', 'levitation|vole|flotte|floating|flying']
    ],
    expression: [
      ['determined', 'looking determined', 'l’air déterminé', '*', 'determine|determined'],
      ['smirk', 'with a crooked smile', 'un sourire en coin', '*', 'sourire|smile|smirk'],
      ['tears', 'with tears in the eyes', 'les larmes aux yeux', '*', 'larmes|pleure|tears|crying|triste|sad'],
      ['tired', 'looking exhausted', 'l’air épuisé', '*', 'epuise|fatigue|tired|exhausted'],
      ['furious', 'with a furious glare', 'le regard furieux', '*', 'furieux|colere|angry|furious|rage'],
      ['wary', 'with a suspicious look', 'le regard méfiant', '*', 'mefiant|suspicious|wary'],
      ['laugh', 'laughing out loud', 'riant aux éclats', 'tale daily', 'rire|rit|laugh|laughing|joyeux|happy'],
      ['serene', 'looking serene', 'l’air serein', '*', 'serein|calme|serene|peaceful'],
      ['scared', 'wide-eyed with fear', 'les yeux écarquillés de peur', 'horror', 'peur|effraye|scared|afraid|fear'],
      ['dreamy', 'lost in thought', 'l’esprit ailleurs', '*', 'reveur|pensif|dreamy|thoughtful'],
      ['jaw', 'jaw clenched', 'la mâchoire serrée', '*', 'machoire|jaw'],
      ['proud', 'chin up, proud', 'le menton fier', '*', 'fier|fierte|proud']
    ],
    holding: [
      ['sword', 'holding an ancient longsword', 'tenant une épée longue ancienne', 'fantasy dark myth', 'epee|sword|lame|blade'],
      ['dagger', 'gripping a curved dagger', 'serrant une dague courbe', 'fantasy dark western cyber', 'dague|couteau|dagger|knife'],
      ['bow', 'carrying a bow', 'portant un arc', 'fantasy dark western myth', 'arc|bow|fleche|arrow'],
      ['revolver', 'drawing a revolver', 'dégainant un revolver', 'western', 'revolver|pistolet|gun|colt'],
      ['laser', 'aiming a laser rifle', 'visant avec un fusil laser', 'scifi cyber', 'laser|blaster|fusil|rifle'],
      ['staff', 'leaning on a glowing staff', 's’appuyant sur un bâton lumineux', 'fantasy dark', 'baton|staff|sceptre'],
      ['gauntlet', 'wearing a clockwork gauntlet', 'portant un gantelet mécanique', 'steam', 'gantelet|gauntlet'],
      ['lantern', 'holding a dim lantern', 'tenant une lanterne vacillante', 'horror dark tale', 'lanterne|lantern|lampe'],
      ['map', 'studying an old map', 'consultant une vieille carte', 'fantasy steam western', 'carte|map'],
      ['book', 'clutching an old book', 'serrant un vieux livre', '*', 'livre|grimoire|book|tome'],
      ['camera', 'holding a camera', 'tenant un appareil photo', 'daily', 'appareil photo|camera|photo'],
      ['instrument', 'carrying a musical instrument', 'portant un instrument de musique', '*', 'guitare|violon|instrument|flute|luth'],
      ['flowers', 'holding a bouquet of flowers', 'tenant un bouquet de fleurs', 'tale solar daily', 'fleur|fleurs|bouquet|flower'],
      ['tea', 'holding a steaming cup', 'tenant une tasse fumante', 'daily tale', 'tasse|cafe|tea|coffee|mug'],
      ['mask', 'holding a mask', 'tenant un masque', 'myth horror dark', 'masque|mask'],
      ['cage', 'carrying a cage with a tiny creature', 'portant une cage avec une petite créature', 'fantasy tale', 'cage'],
      ['holo', 'holding a holographic tablet', 'tenant une tablette holographique', 'scifi cyber', 'hologramme|holographique|tablette|tablet'],
      ['umbrella', 'holding a broken umbrella', 'tenant un parapluie cassé', 'daily tale horror', 'parapluie|umbrella']
    ],
    personality: [
      ['secret', 'hiding a secret', 'qui cache un secret', '*', 'secret'],
      ['water', 'terrified of water', 'qui a peur de l’eau', '*', 'peur de l eau'],
      ['shiny', 'who collects shiny things', 'qui collectionne les objets brillants', 'tale fantasy', 'collectionne|collector'],
      ['guilt', 'eaten up by guilt', 'que la culpabilité ronge', 'dark', 'culpabilite|guilt'],
      ['nosmile', 'who never smiles', 'qui ne sourit jamais', '*', 'ne sourit jamais'],
      ['curious', 'far too curious', 'd’une curiosité maladive', '*', 'curieux|curieuse|curious'],
      ['redemption', 'seeking redemption', 'en quête de rédemption', 'dark fantasy western', 'redemption'],
      ['liar', 'a terrible liar', 'qui ment très mal', 'tale daily', 'menteur|menteuse|liar'],
      ['machines', 'who talks to machines', 'qui parle aux machines', 'steam scifi cyber', 'parle aux machines'],
      ['clan', 'whose whole clan vanished', 'dont tout le clan a disparu', 'fantasy dark postapo myth', 'clan|last of'],
      ['gentle', 'gentle despite appearances', 'd’une grande douceur malgré les apparences', '*', 'gentil|doux|gentle'],
      ['showoff', 'a hopeless show-off', 'qui frime sans arrêt', 'tale western daily', 'frimeur|vantard|show-off']
    ],

    /* ===== Créature ===== */
    base: [
      ['wolf', 'a wolf', 'un loup', 'fantasy dark myth horror', 'loup|wolf|chien|dog'],
      ['deepfish', 'a deep-sea fish', 'un poisson des abysses', 'horror scifi', 'poisson|fish|abysses|abyss'],
      ['owl', 'an owl', 'une chouette', 'fantasy tale myth', 'chouette|hibou|owl'],
      ['deer', 'a deer', 'un cerf', 'fantasy myth solar tale', 'cerf|biche|deer|stag'],
      ['mantis', 'a praying mantis', 'une mante religieuse', 'horror scifi', 'mante|insecte|insect|mantis'],
      ['jellyfish', 'a jellyfish', 'une méduse', 'scifi solar tale', 'meduse|jellyfish'],
      ['snake', 'a snake', 'un serpent', 'myth dark fantasy', 'serpent|snake|reptile'],
      ['turtle', 'a turtle', 'une tortue', 'tale solar myth', 'tortue|turtle'],
      ['cat', 'a cat', 'un chat', 'tale daily myth', 'chat|cat|felin'],
      ['toad', 'a toad', 'un crapaud', 'tale dark fantasy', 'crapaud|grenouille|toad|frog'],
      ['whale', 'a whale', 'une baleine', 'fantasy scifi solar', 'baleine|whale'],
      ['bat', 'a bat', 'une chauve-souris', 'horror dark', 'chauve-souris|bat'],
      ['snail', 'a snail', 'un escargot', 'tale solar', 'escargot|snail|limace'],
      ['raven', 'a raven', 'un corbeau', 'dark myth horror', 'corbeau|raven|crow|oiseau|bird'],
      ['lizard', 'a lizard', 'un lézard', 'fantasy western scifi', 'lezard|lizard|dragon'],
      ['octopus', 'an octopus', 'une pieuvre', 'horror scifi myth', 'pieuvre|poulpe|octopus|kraken']
    ],
    fusion: [
      ['butterfly', 'with butterfly wings', 'avec des ailes de papillon', 'tale fantasy solar', 'papillon|butterfly'],
      ['shell', 'with a tortoise shell', 'avec une carapace de tortue', '*', 'carapace|shell'],
      ['tentacles', 'with tentacles', 'avec des tentacules', 'horror scifi myth', 'tentacule|tentacles'],
      ['antlers', 'with deer antlers', 'avec des bois de cerf', 'fantasy myth dark', 'bois de cerf|antlers'],
      ['scales', 'covered in fish scales', 'aux écailles de poisson', '*', 'ecailles|scales'],
      ['eyes', 'with many eyes', 'avec des yeux multiples', 'horror dark myth', 'yeux multiples|many eyes'],
      ['peacock', 'with peacock feathers', 'avec des plumes de paon', 'fantasy tale myth', 'plumes|feathers|paon'],
      ['scorpion', 'with a scorpion tail', 'avec une queue de scorpion', 'western dark scifi', 'scorpion'],
      ['crystal', 'with a crystal body', 'avec un corps de cristal', 'fantasy scifi', 'cristal|crystal'],
      ['moss', 'covered in moss and flowers', 'où poussent mousse et fleurs', 'solar tale fantasy', 'mousse|moss|vegetal|plante'],
      ['clockwork', 'with clockwork parts', 'avec des pièces d’horlogerie', 'steam', 'horlogerie|mecanique|clockwork|mechanical'],
      ['bones', 'with exposed bones', 'avec des os apparents', 'horror dark', 'os|squelette|bones|skeleton'],
      ['fire', 'with a flaming mane', 'avec une crinière de flammes', 'fantasy myth', 'feu|flamme|fire|flame'],
      ['circuits', 'with glowing circuits', 'aux circuits lumineux', 'cyber scifi', 'circuit|cyber']
    ],
    size: [
      ['tiny', 'tiny enough to fit in a hand', 'minuscule, tenant dans une main', '*', 'minuscule|tiny'],
      ['catsize', 'the size of a cat', 'de la taille d’un chat', '*'],
      ['humansize', 'human-sized', 'de taille humaine', '*'],
      ['house', 'as big as a house', 'de la taille d’une maison', '*', 'maison|house'],
      ['colossal', 'as vast as a hill', 'aussi vaste qu’une colline', 'fantasy myth scifi', 'geant|colossal|giant|enorme|kaiju']
    ],
    ctrait: [
      ['glow', 'that glows in the dark', 'qui brille dans le noir', 'fantasy scifi solar', 'brille|lumineux|bioluminescent|glow'],
      ['village', 'carrying a village on its back', 'qui porte un village sur son dos', 'tale fantasy solar', 'village'],
      ['twoheads', 'with two heads', 'à deux têtes', 'myth dark', 'deux tetes|two heads'],
      ['noeyes', 'with no eyes', 'sans yeux', 'horror', 'sans yeux|aveugle|blind'],
      ['translucent', 'with a translucent body', 'au corps translucide', 'scifi horror', 'translucide|transparent'],
      ['scarred', 'covered in scars', 'au corps couvert de cicatrices', 'dark postapo', 'cicatrices|scars'],
      ['butterflies', 'followed by a swarm of butterflies', 'qu’accompagne une nuée de papillons', 'tale solar', 'nuee'],
      ['camo', 'that blends into its surroundings', 'qui se fond dans le décor', '*', 'camouflage|camoufle'],
      ['armored', 'wearing improvised armor', 'portant une armure de fortune', 'postapo fantasy', 'armure|armor'],
      ['rider', 'with a tiny rider on its back', 'avec un minuscule cavalier sur le dos', 'fantasy tale', 'monture|cavalier|rider|mount']
    ],
    temper: [
      ['wild', 'with a wild temper', 'au caractère farouche', '*', 'farouche|sauvage|wild'],
      ['playful', 'in a playful mood', 'd’humeur joueuse', 'tale', 'joueur|joueuse|playful'],
      ['protective', 'with a protective instinct', 'à l’instinct protecteur', '*', 'protecteur|protective|gardien|guardian'],
      ['hungry', 'always hungry', 'à la faim insatiable', 'horror tale', 'affame|hungry'],
      ['curious', 'with a curious nature', 'au tempérament curieux', '*', 'curieux|curious'],
      ['majestic', 'majestic and calm', 'd’une majesté tranquille', 'myth fantasy', 'majestueux|majestic'],
      ['shy', 'shy and easily startled', 'd’une timidité maladive', 'tale', 'timide|shy'],
      ['cunning', 'cunning and patient', 'à l’intelligence rusée', 'dark horror', 'ruse|cunning|malin']
    ],

    /* ===== Décor ===== */
    setting: [
      ['cathedral', 'in a ruined cathedral', 'dans une cathédrale en ruines', 'fantasy dark horror', 'cathedrale|eglise|cathedral|church'],
      ['forest', 'in a snowy forest', 'dans une forêt enneigée', 'fantasy dark horror western tale', 'foret|forest|bois|woods'],
      ['canyon', 'in a desert canyon', 'dans un canyon désertique', 'western scifi postapo', 'canyon|desert'],
      ['alley', 'in a neon-lit alley', 'dans une ruelle éclairée au néon', 'cyber', 'ruelle|alley|rue|street'],
      ['airship', 'on an airship deck', 'sur le pont d’un dirigeable', 'steam', 'dirigeable|airship|zeppelin'],
      ['station', 'in a derelict space station', 'dans une station spatiale abandonnée', 'scifi horror', 'station spatiale|space station|vaisseau|spaceship'],
      ['village', 'in an abandoned village', 'dans un village abandonné', 'horror western dark postapo', 'village abandonne|hameau'],
      ['mushrooms', 'in a forest of giant mushrooms', 'dans une forêt de champignons géants', 'fantasy tale solar', 'champignon|mushroom'],
      ['vertical', 'in a vertical city', 'dans une ville verticale', 'cyber scifi solar', 'ville verticale|megapole|megacity|gratte-ciel|skyscraper'],
      ['market', 'in a night market', 'dans un marché de nuit', 'daily cyber myth tale', 'marche|market|bazar'],
      ['harbor', 'in a misty harbor', 'dans un port brumeux', 'steam fantasy daily', 'port|harbor|quai|dock'],
      ['tundra', 'on a frozen tundra', 'sur une toundra gelée', 'fantasy postapo scifi', 'toundra|tundra|glace|ice|gele|banquise'],
      ['jungle', 'in a jungle swallowing ruins', 'dans une jungle qui avale des ruines', 'fantasy postapo myth solar', 'jungle|ruines|ruins|temple'],
      ['saltflat', 'on a salt flat', 'sur un désert de sel', 'scifi postapo western', 'desert de sel|salt'],
      ['cliffs', 'on cliffs above the sea', 'sur des falaises au-dessus de la mer', '*', 'falaise|cliff|mer|ocean|sea|plage|beach'],
      ['subway', 'in an abandoned subway', 'dans un métro abandonné', 'horror postapo daily cyber', 'metro|subway|tunnel'],
      ['library', 'in an endless library', 'dans une bibliothèque sans fin', 'fantasy tale dark', 'bibliotheque|library'],
      ['islands', 'among floating islands', 'parmi des îles flottantes', 'fantasy myth solar', 'iles flottantes|ile flottante|floating islands'],
      ['seabed', 'on the seabed', 'au fond de l’océan', 'scifi myth horror', 'sous-marin|underwater|fond marin|ocean floor|abysses'],
      ['mountain', 'in a mountain temple', 'dans un temple de montagne', 'myth fantasy', 'montagne|mountain|monastere'],
      ['engine', 'in a roaring engine room', 'dans une salle des machines', 'steam scifi', 'salle des machines|engine room|usine|factory'],
      ['battlefield', 'on a battlefield after the fight', 'sur un champ de bataille après le combat', 'fantasy dark postapo', 'champ de bataille|battlefield'],
      ['kitchen', 'in a cluttered little kitchen', 'dans une petite cuisine encombrée', 'daily tale', 'cuisine|kitchen'],
      ['rooftop', 'on a rooftop at night', 'sur un toit d’immeuble la nuit', 'daily cyber', 'toit|rooftop'],
      ['greenhouse', 'in a giant greenhouse', 'dans une serre géante', 'solar tale steam', 'serre|greenhouse|jardin|garden'],
      ['swamp', 'in a foggy swamp', 'dans un marais brumeux', 'horror dark fantasy', 'marais|marecage|swamp|bayou'],
      ['saloon', 'in a dusty saloon', 'dans un saloon poussiéreux', 'western', 'saloon'],
      ['volcano', 'at the edge of a volcano', 'au bord d’un volcan', 'fantasy myth scifi', 'volcan|volcano|lave|lava']
    ],
    landmark: [
      ['statue', 'with a fallen colossal statue', 'avec une statue colossale effondrée', 'fantasy myth postapo', 'statue'],
      ['tree', 'with a gigantic tree', 'avec un arbre gigantesque', 'fantasy solar tale myth', 'arbre|tree'],
      ['tower', 'with a lonely tower', 'avec une tour solitaire', 'fantasy dark', 'tour|tower'],
      ['wreck', 'with a crashed starship', 'avec l’épave d’un vaisseau', 'scifi postapo', 'epave|wreck|crash'],
      ['bridge', 'with a rope bridge', 'avec un pont suspendu', '*', 'pont|bridge'],
      ['lighthouse', 'with a lighthouse', 'avec un phare', 'daily tale horror steam', 'phare|lighthouse'],
      ['gate', 'with a monumental gate', 'avec une porte monumentale', 'fantasy myth scifi', 'portail|gate|portal'],
      ['skeleton', 'with the skeleton of a giant creature', 'avec le squelette d’une créature géante', 'fantasy postapo dark', 'squelette|skeleton|fossile'],
      ['waterfall', 'with a waterfall', 'avec une cascade', 'fantasy solar myth tale', 'cascade|waterfall|riviere|river'],
      ['train', 'with an abandoned train', 'avec un train abandonné', 'western postapo steam daily', 'train|locomotive'],
      ['radio', 'with a radio mast', 'avec une antenne radio', 'scifi postapo daily', 'antenne|radio|antenna'],
      ['windmill', 'with a windmill', 'avec un moulin', 'tale solar daily', 'moulin|windmill|eolienne'],
      ['machine', 'with a huge machine at a standstill', 'avec une immense machine à l’arrêt', 'steam scifi postapo', 'machine|robot geant|mecha'],
      ['shrine', 'with a small roadside shrine', 'avec un petit autel au bord du chemin', 'myth tale', 'autel|sanctuaire|shrine|torii']
    ],
    timeofday: [
      ['dawn', 'at dawn', 'à l’aube', '*', 'aube|dawn|lever du soleil|sunrise'],
      ['noon', 'under a harsh noon sun', 'sous le soleil écrasant de midi', 'western postapo', 'midi|noon'],
      ['golden', 'at golden hour', 'à l’heure dorée', '*', 'heure doree|golden hour'],
      ['dusk', 'at dusk', 'au crépuscule', '*', 'crepuscule|dusk|coucher de soleil|sunset'],
      ['bluehour', 'during the blue hour', 'à l’heure bleue', '*', 'heure bleue|blue hour'],
      ['night', 'in pitch-black night', 'en pleine nuit noire', 'horror dark', 'nuit|night'],
      ['starry', 'under a starry sky', 'sous un ciel étoilé', 'fantasy scifi tale', 'etoile|etoiles|starry|stars'],
      ['eclipse', 'during an eclipse', 'pendant une éclipse', 'myth dark scifi', 'eclipse']
    ],
    weather: [
      ['rain', 'in pouring rain', 'sous une pluie battante', '*', 'pluie|pleut|rain|rainy'],
      ['fog', 'in thick fog', 'dans un brouillard épais', 'horror dark', 'brouillard|brume|fog|mist'],
      ['snow', 'in falling snow', 'sous la neige', '*', 'neige|snow'],
      ['storm', 'in a thunderstorm', 'en plein orage', '*', 'orage|tempete|storm|eclair|lightning'],
      ['clear', 'under a clear sky', 'sous un ciel dégagé', '*', 'ciel bleu|clear sky|beau temps'],
      ['sandstorm', 'in a sandstorm', 'dans une tempête de sable', 'western postapo scifi', 'tempete de sable|sandstorm'],
      ['wind', 'in strong wind', 'dans un vent violent', '*', 'vent|wind'],
      ['puddles', 'just after the rain', 'juste après la pluie', 'daily cyber', 'flaque|apres la pluie|puddle'],
      ['aurora', 'under an aurora', 'sous une aurore boréale', 'fantasy scifi myth', 'aurore|aurora'],
      ['ash', 'with ash falling', 'sous une pluie de cendres', 'postapo dark', 'cendre|ash']
    ],
    season: [
      ['spring', 'in spring', 'au printemps', '*', 'printemps|spring'],
      ['summer', 'in summer', 'en été', '*', 'en ete|summer|estival'],
      ['autumn', 'in autumn', 'en automne', '*', 'automne|autumn'],
      ['winter', 'in winter', 'en hiver', '*', 'hiver|winter']
    ],

    /* ===== Objet ===== */
    objtype: [
      ['sword', 'a sword', 'une épée', 'fantasy dark myth', 'epee|sword'],
      ['watch', 'a pocket watch', 'une montre à gousset', 'steam daily', 'montre|watch|horloge'],
      ['lamp', 'a lamp', 'une lampe', '*', 'lampe|lamp|lanterne|lantern'],
      ['book', 'a book', 'un livre', '*', 'livre|grimoire|book'],
      ['mask', 'a mask', 'un masque', 'myth horror dark', 'masque|mask'],
      ['crown', 'a crown', 'une couronne', 'fantasy myth tale', 'couronne|crown'],
      ['musicbox', 'a music box', 'une boîte à musique', 'tale horror steam', 'boite a musique|music box'],
      ['helmet', 'a helmet', 'un casque', '*', 'casque|helmet'],
      ['key', 'a key', 'une clé', '*', 'cle|key'],
      ['teapot', 'a teapot', 'une théière', 'daily tale', 'theiere|teapot'],
      ['potion', 'a potion bottle', 'une fiole', 'fantasy tale', 'fiole|potion|flacon'],
      ['compass', 'a compass', 'une boussole', 'steam fantasy western', 'boussole|compass'],
      ['camera', 'a camera', 'un appareil photo', 'daily steam', 'appareil photo|camera'],
      ['boots', 'a pair of boots', 'une paire de bottes', '*', 'bottes|boots|chaussures|shoes'],
      ['backpack', 'a backpack', 'un sac à dos', 'postapo daily scifi', 'sac|backpack|bag'],
      ['radio', 'a radio', 'une radio', 'daily postapo scifi', 'radio'],
      ['robot', 'a toy robot', 'un robot jouet', 'scifi tale daily', 'robot jouet|toy robot|jouet|toy'],
      ['gun', 'a ray gun', 'un pistolet à rayons', 'scifi cyber', 'pistolet|blaster|gun'],
      ['vehicle', 'a small vehicle', 'un petit véhicule', '*', 'vehicule|voiture|moto|vaisseau|vehicle|car|bike'],
      ['chair', 'a chair', 'une chaise', 'daily tale', 'chaise|fauteuil|chair|meuble|furniture']
    ],
    material: [
      ['wood', 'in carved wood', 'en bois sculpté', 'fantasy tale myth', 'bois|wood'],
      ['brass', 'in brass', 'en laiton', 'steam', 'laiton|cuivre|brass|copper'],
      ['glass', 'in blown glass', 'en verre soufflé', 'fantasy tale', 'verre|glass'],
      ['bone', 'in bone', 'en os', 'dark horror myth', 'os|bone'],
      ['crystal', 'in crystal', 'en cristal', 'fantasy scifi', 'cristal|crystal'],
      ['fabric', 'in patched fabric', 'en tissu rapiécé', 'tale postapo daily', 'tissu|fabric'],
      ['stone', 'in stone', 'en pierre', 'myth fantasy', 'pierre|stone'],
      ['chrome', 'in chrome', 'en métal chromé', 'scifi cyber', 'chrome|metal'],
      ['ceramic', 'in ceramic', 'en céramique', 'daily tale', 'ceramique|porcelaine|ceramic|porcelain'],
      ['scrap', 'made of salvaged scrap', 'en pièces de récupération', 'postapo steam', 'recuperation|recup|scrap'],
      ['gold', 'in gold', 'en or', 'fantasy myth', 'gold|dore'],
      ['plastic', 'in colorful plastic', 'en plastique coloré', 'daily scifi', 'plastique|plastic']
    ],
    condition: [
      ['new', 'looking brand new', 'à l’aspect neuf et brillant', '*', 'neuf|brillant|new|shiny'],
      ['chipped', 'with chipped edges', 'aux bords ébréchés', '*', 'ebreche|chipped'],
      ['cracked', 'with a cracked surface', 'à la surface fissurée', '*', 'fissure|cracked|fele'],
      ['peeling', 'with peeling paint', 'à la peinture écaillée', 'daily postapo', 'ecaille|peeling'],
      ['gears', 'with exposed mechanisms', 'aux mécanismes apparents', 'steam scifi', 'mecanisme|gears'],
      ['moss', 'with moss growing on it', 'où pousse de la mousse', 'solar postapo tale', 'mousse|moss'],
      ['rust', 'with rusty metal', 'au métal rouillé', 'postapo western', 'rouille|rust'],
      ['repaired', 'with visible repairs', 'aux réparations visibles', '*', 'repare|repaired|rafistole'],
      ['smoke', 'with smoke escaping', 'd’où s’échappe de la fumée', 'steam scifi', 'fumee|smoke'],
      ['ice', 'trapped in ice', 'dans un bloc de glace', 'fantasy scifi', 'glace|ice']
    ],
    objdetail: [
      ['light', 'holding a living light', 'qui contient une lumière vivante', 'fantasy tale solar', 'lumiere|light'],
      ['inscription', 'engraved with an unreadable inscription', 'portant une inscription illisible', 'myth fantasy dark', 'inscription|grave|engraved'],
      ['whisper', 'that whispers when you get close', 'qui murmure quand on approche', 'horror dark myth', 'murmure|whisper'],
      ['home', 'that a tiny creature lives in', 'qui sert de maison à un petit être', 'tale', 'maison|home'],
      ['world', 'that shows another world', 'qui montre un autre monde', 'fantasy scifi', 'autre monde|other world|portail'],
      ['moon', 'that only works under a full moon', 'qui ne fonctionne qu’à la pleine lune', 'dark myth', 'pleine lune|full moon'],
      ['float', 'that floats in the air', 'qui flotte dans les airs', 'fantasy scifi', 'flotte|floating'],
      ['cable', 'connected to a mysterious cable', 'd’où sort un câble mystérieux', 'cyber scifi', 'cable'],
      ['gems', 'set with precious stones', 'aux pierres précieuses serties', 'fantasy myth', 'pierres precieuses|gemmes|gems|bijou'],
      ['label', 'with a handwritten tag', 'avec une étiquette manuscrite', 'daily tale', 'etiquette|tag|note']
    ],

    /* ===== Scène ===== */
    second: [
      ['rival', 'facing a rival', 'face à un rival', '*', 'rival|ennemi|enemy|adversaire'],
      ['pet', 'with an animal companion', 'avec un compagnon animal', '*', 'compagnon|companion|animal de compagnie|pet'],
      ['mentor', 'beside an old mentor', 'aux côtés d’un vieux mentor', 'fantasy myth western', 'mentor|maitre|master'],
      ['robot', 'with a robot sidekick', 'avec un petit robot acolyte', 'scifi cyber steam', 'robot|drone'],
      ['giant', 'facing a giant creature', 'face à une créature géante', 'fantasy myth scifi horror', 'monstre|creature geante|giant|dragon|kaiju'],
      ['watched', 'alone, watched from afar', 'tandis qu’une silhouette l’observe de loin', 'horror dark', 'observe|watched|seul|alone'],
      ['crowd', 'surrounded by a crowd', 'au milieu d’une foule', 'daily cyber', 'foule|crowd'],
      ['lost', 'reunited with a lost loved one', 'retrouvant un être cher disparu', '*', 'retrouvailles|reunion|amour|love'],
      ['child', 'guiding a lost child', 'guidant un enfant perdu', 'tale postapo fantasy', 'enfant|child|kid'],
      ['band', 'with a ragtag band of allies', 'avec une bande d’alliés hétéroclites', 'fantasy scifi postapo', 'equipe|groupe|team|party|allies']
    ],
    event: [
      ['duel', 'during a duel', 'pendant un duel', 'fantasy dark western', 'duel|combat|fight'],
      ['flee', 'while fleeing a pursuer', 'en fuyant un poursuivant', '*', 'fuite|fuit|fuir|flee|chase|poursuite'],
      ['discover', 'discovering something hidden', 'en découvrant quelque chose de caché', '*', 'decouvre|decouverte|discover'],
      ['battle', 'in the middle of a battle', 'au milieu d’une bataille', 'fantasy dark scifi', 'bataille|battle|guerre|war'],
      ['defendplace', 'defending a place', 'en défendant un lieu', 'fantasy dark scifi western', 'defend|proteger|protect'],
      ['ritual', 'during a ceremony', 'pendant une cérémonie', 'fantasy dark horror steam myth', 'ceremonie|rituel|ritual'],
      ['repair', 'while repairing a machine', 'en réparant une machine', 'steam scifi postapo', 'repare|repair|bricole'],
      ['letter', 'reading a letter for the hundredth time', 'en relisant une lettre pour la centième fois', 'daily tale', 'lettre|letter'],
      ['farewell', 'while saying goodbye', 'en faisant ses adieux', '*', 'adieux|au revoir|goodbye|depart'],
      ['prepare', 'getting ready for a fight', 'en se préparant au combat', '*', 'prepare|preparation'],
      ['cooking', 'cooking for others', 'en cuisinant pour les autres', 'daily tale', 'cuisine|cooking|repas|meal'],
      ['music', 'playing music', 'en jouant de la musique', '*', 'musique|music|joue|chante|sing'],
      ['collapse', 'escaping a collapse', 'en échappant à un effondrement', 'postapo fantasy scifi', 'effondrement|collapse|ecroule'],
      ['travel', 'setting off on a journey', 'en partant en voyage', '*', 'voyage|journey|travel|depart|route']
    ],

    /* ===== Mise en scène & rendu (communs) ===== */
    shot: [
      ['extremewide', 'extreme wide shot', 'plan très large', '*', 'plan tres large|panorama|extreme wide'],
      ['wide', 'wide shot', 'plan large', '*', 'plan large|wide shot'],
      ['full', 'full-body shot', 'plan en pied', '*', 'en pied|full body|corps entier'],
      ['medium', 'waist-up shot', 'plan taille', '*', 'plan taille|buste|medium shot|waist'],
      ['closeup', 'close-up', 'gros plan', '*', 'gros plan|close-up|closeup|visage'],
      ['detail', 'extreme close-up on a detail', 'très gros plan sur un détail', '*', 'detail|tres gros plan'],
      ['pov', 'point-of-view shot', 'vue subjective', '*', 'subjective|pov|premiere personne'],
      ['ots', 'over-the-shoulder shot', 'plan par-dessus l’épaule', '*', 'par-dessus l epaule|over the shoulder'],
      ['turnaround', 'turnaround sheet (front, side, back)', 'fiche de personnage (face, profil, dos)', '*', 'turnaround|model sheet|fiche|chara design|character sheet'],
      ['expressions', 'sheet of 6 expressions', 'planche de 6 expressions', '*', 'planche|expression sheet']
    ],
    angle: [
      ['front', 'front view', 'vue de face', '*', 'de face|front'],
      ['threequarter', 'three-quarter view', 'vue de trois-quarts', '*', 'trois-quarts|three-quarter|3/4'],
      ['profile', 'profile view', 'vue de profil', '*', 'profil|profile|side view'],
      ['back', 'seen from behind', 'vue de dos', '*', 'de dos|from behind'],
      ['low', 'low angle', 'en contre-plongée', '*', 'contre-plongee|low angle'],
      ['high', 'high angle', 'en plongée', '*', 'plongee|high angle'],
      ['birdseye', 'bird’s-eye view', 'vue aérienne', '*', 'vue aerienne|vue du ciel|birds eye|top down|vue de dessus'],
      ['ground', 'ground-level view', 'au ras du sol', '*', 'ras du sol|ground level'],
      ['dutch', 'tilted (dutch) angle', 'cadre penché', '*', 'penche|dutch|tilted'],
      ['fisheye', 'fisheye distortion', 'déformation grand-angle', '*', 'fisheye|grand angle|wide angle']
    ],
    lighting: [
      ['back', 'strong backlight', 'fort contre-jour', '*', 'contre-jour|backlight|silhouette'],
      ['moon', 'cold moonlight', 'clair de lune froid', 'fantasy dark horror', 'clair de lune|moonlight|lune'],
      ['neon', 'neon glow', 'lueur de néon', 'cyber scifi', 'neon'],
      ['sunset', 'low sunset light', 'lumière rasante de fin de journée', 'western fantasy steam', 'lumiere rasante'],
      ['candle', 'flickering candlelight', 'lueur vacillante de bougie', 'horror dark steam', 'bougie|candle|chandelle'],
      ['soft', 'soft diffused light', 'lumière douce et diffuse', 'tale daily solar', 'lumiere douce|soft light|diffuse'],
      ['under', 'light from below', 'éclairage par en dessous', 'horror', 'par en dessous|from below|uplight'],
      ['chiaroscuro', 'dramatic chiaroscuro', 'clair-obscur dramatique', 'dark myth', 'clair-obscur|chiaroscuro|contraste|contrast'],
      ['campfire', 'campfire light', 'lumière de feu de camp', 'western fantasy postapo', 'feu de camp|campfire'],
      ['bio', 'bioluminescent glow', 'lueur bioluminescente', 'scifi fantasy solar', 'bioluminescent'],
      ['stained', 'light through stained glass', 'lumière à travers des vitraux', 'fantasy dark myth', 'vitrail|vitraux|stained glass'],
      ['screen', 'cold screen light', 'lumière froide d’un écran', 'cyber daily scifi', 'ecran|screen']
    ],
    mood: [
      ['stormy', 'stormy mood', 'ambiance orageuse', '*', 'orageux|orageuse'],
      ['calm', 'calm mood', 'ambiance calme', 'western steam tale solar', 'calme|paisible|calm'],
      ['epic', 'epic mood', 'ambiance épique', 'fantasy dark scifi myth', 'epique|epic'],
      ['melancholic', 'melancholic mood', 'ambiance mélancolique', '*', 'melancolique|melancholic|nostalgique'],
      ['mysterious', 'mysterious mood', 'ambiance mystérieuse', '*', 'mysterieux|mysterieuse|mysterious|mystere'],
      ['cozy', 'cozy mood', 'ambiance chaleureuse', 'tale daily solar', 'chaleureux|chaleureuse|cozy|cosy'],
      ['tense', 'tense mood', 'ambiance tendue', 'horror dark cyber', 'tendu|tension|tense'],
      ['dreamlike', 'dreamlike mood', 'ambiance onirique', 'tale myth fantasy', 'onirique|reve|dream|surreal|surrealiste'],
      ['solemn', 'solemn mood', 'ambiance solennelle', 'myth fantasy', 'solennel|solemn'],
      ['joyful', 'joyful mood', 'ambiance joyeuse', 'tale daily solar', 'joyeux|joyeuse|joyful|fun'],
      ['eerie', 'eerie mood', 'ambiance inquiétante', 'horror dark', 'inquietant|eerie|malaise']
    ],
    harmony: [
      ['complementary', 'complementary', 'complémentaires', '*', 'complementaire|complementary'],
      ['split', 'split-complementary', 'complémentaires divisées', '*', 'complementaire divisee|split'],
      ['analogous', 'analogous', 'analogues', '*', 'analogue|analogous|camaieu'],
      ['triadic', 'triadic', 'triadique', '*', 'triadique|triadic'],
      ['mono', 'monochrome', 'monochrome', '*', 'monochrome|monochromatique'],
      ['accent', 'greyscale with one accent color', 'niveaux de gris + une couleur d’accent', '*', 'niveaux de gris|greyscale|grayscale'],
      ['three', 'only 3 colors', '3 couleurs seulement', '*', '3 couleurs|three colors'],
      ['bw', 'black and white', 'noir et blanc', '*', 'noir et blanc|black and white|n&b']
    ],
    palette: [
      ['cold', 'cold and desaturated', 'froide et désaturée', 'dark horror scifi', 'froid|froide|cold|desature'],
      ['ochre', 'warm ochre and dust', 'ocre chaud et poussière', 'western fantasy postapo', 'ocre|ochre|chaud|warm'],
      ['teal', 'teal and magenta', 'turquoise et magenta', 'cyber scifi', 'turquoise|magenta|teal'],
      ['brass', 'brass and deep green', 'laiton et vert profond', 'steam fantasy', 'vert|green'],
      ['blood', 'blood red and black', 'rouge sang et noir', 'dark horror', 'rouge|red|sang|blood'],
      ['pastel', 'soft pastels', 'pastels doux', 'tale solar daily', 'pastel'],
      ['nightgold', 'night blue and gold', 'bleu nuit et or', 'fantasy myth', 'bleu nuit|night blue|dore|golden'],
      ['moss', 'moss green and brown', 'vert mousse et brun', 'solar fantasy tale', 'brun|brown|terre|earth'],
      ['sunset', 'purple and sunset orange', 'violet et orange couchant', 'scifi cyber tale', 'violet|purple|orange'],
      ['rust', 'off-white and rust', 'blanc cassé et rouille', 'postapo western steam', 'rouille|rust|blanc casse'],
      ['yellow', 'desaturated with a touch of yellow', 'désaturée avec une touche de jaune', 'daily postapo', 'jaune|yellow']
    ],
    style: [
      ['realistic', 'realistic', 'réaliste', '*', 'realiste|realistic|photorealiste'],
      ['semi', 'semi-realistic', 'semi-réaliste', '*', 'semi-realiste|semi realistic'],
      ['cartoon', 'cartoon', 'cartoon', 'tale daily', 'cartoon|toon|dessin anime'],
      ['anime', 'anime-inspired', 'inspiré de l’anime', '*', 'anime|manga'],
      ['clearline', 'clear line (ligne claire)', 'ligne claire', 'daily tale', 'ligne claire|bd|bande dessinee|comic'],
      ['impasto', 'thick painterly strokes', 'peinture en touches épaisses', '*', 'painterly|impasto|huile|oil painting|touches epaisses'],
      ['watercolor', 'watercolor', 'aquarelle', 'tale solar myth', 'aquarelle|watercolor'],
      ['ink', 'ink and hatching', 'encre et hachures', 'dark horror western', 'encre|ink|hachures'],
      ['pixel', 'pixel art', 'pixel art', '*', 'pixel|pixel art'],
      ['lowpoly', 'low-poly 3D', '3D low-poly', '*', 'low-poly|lowpoly|low poly'],
      ['clay', 'clay / sculpted look', 'aspect pâte à modeler / sculpté', 'tale', 'pate a modeler|argile|clay|sculpture|sculpt'],
      ['flat', 'flat shapes and silhouettes', 'aplats et silhouettes', '*', 'aplat|flat|vectoriel|vector']
    ],
    challenge: [
      ['silhouette', 'start with a solid black silhouette', 'commence par une silhouette toute noire', '*', 'silhouette'],
      ['round', 'use only round shapes', 'n’utilise que des formes rondes', '*', 'formes rondes|round shapes'],
      ['sharp', 'use only angular shapes', 'n’utilise que des formes anguleuses', '*', 'formes anguleuses|angular|triangle'],
      ['timer', 'finish in 30 minutes', 'termine en 30 minutes', '*', '30 minutes|chrono|speedpaint|rapide|quick'],
      ['noline', 'no outlines', 'sans aucun contour', '*', 'sans contour|lineless|no lines'],
      ['onetool', 'use a single brush or tool', 'un seul pinceau ou outil', '*', 'un seul pinceau|one brush'],
      ['values', '5 values maximum', '5 valeurs de gris maximum', '*', 'valeurs|values'],
      ['variants', 'sketch 3 quick variants first', 'fais d’abord 3 variantes rapides', '*', 'variantes|variants|thumbnails'],
      ['noundo', 'no eraser, no undo', 'sans gomme ni retour arrière', '*', 'sans gomme|no undo'],
      ['memory', 'from memory, no references', 'de mémoire, sans référence', '*', 'de memoire|from memory'],
      ['offhand', 'with your non-dominant hand', 'avec ta main non dominante', '*', 'main gauche|non dominante|other hand']
    ]
  }
};

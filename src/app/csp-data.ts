export interface Experience {
  facility: string;
  verdict: "good" | "bad";
  emoji: string;
  summary: string;
  details: string;
  website?: string;
  calmingItems?: { emoji: string; label: string; desc: string }[];
  unrestItems?: { emoji: string; label: string; desc: string }[];
  links?: { label: string; url: string; image?: string }[];
}

export const experiences: Experience[] = [
  {
    facility: "Amstelmeren (GGZ inGeest) - Amstelveenseweg 589, 1081 JC Amsterdam",
    verdict: "bad",
    emoji: "🚫",
    summary: "Absoluut niet - stuur hier niemand heen die rust nodig heeft",
    details: "De omstandigheden op Amstelmeren waren ECHT onacceptabel. De afdeling was overvol en ALLES stonk naar poep en plas. Er werd structureel niet schoongemaakt. Er liepen ratten over de gang. Medebewoners liepen op open wonden aan hun voeten. Er was nauwelijks begeleiding aanwezig. Veel medebewoners waren ernstig depressief, anderen waren luidruchtig en onvoorspelbaar. Zelfs een dakloze op straat leeft nog schoner.\n\nZo'n drukke, gore, ranzige plek moet je niemand aandoen die een beetje rust nodig heeft. Niet iemand in een manie, niet iemand met een depressie, niet eens de meest normale mens. Het werkt herstel niet alleen tegen - het verergert de situatie actief.\n\nIn het geval van Daantje was er niet eens sprake van een manie - hij was daar allang uit. In Parnassia Castricum sliep hij prima met alleen een beetje melatonine, dat ging helemaal goed. Hij werd door paniek van omstanders daar neergezet, niet omdat het medisch nodig was.\n\nTer context: Daantje heeft in zijn dagelijks leven twee schoonmakers in dienst en een robotstofzuiger die elke dag de vloeren reinigt. Zijn behoefte aan een schone leefomgeving is uitzonderlijk hoog. In een instelling waar basale hygiene niet op orde is, was het voor hem onmogelijk om tot rust te komen.\n\nEen betere oplossing zou zijn: een rustige plek in de natuur, met goede sanitaire voorzieningen, warmte, en stilte - zodat iemand daadwerkelijk tot rust kan komen.\n\nDit is ook besproken bij de rechter op vrijdag 10 april 2026 om 10:45."
  },
  {
    facility: "Parnassia Castricum Unit 6 - Dokter de Jonghweg 2, 1901 DB Castricum",
    verdict: "good",
    emoji: "✅",
    summary: "Prima - rustige mensen, redelijk clean",
    details: "Rustige omgeving met rustige medebewoners. Redelijk schoon. Miste wel het eigen leven: een goed bad, douche, en gym. Maar over het geheel een acceptabele plek waar je tot rust kunt komen."
  },
  {
    facility: "De Nieuwe Valerius (GGZ inGeest) - Valeriusplein 9, 1075 BG Amsterdam",
    verdict: "good",
    emoji: "✅",
    summary: "Oke - goed bad, vriendelijk personeel, maar heftige medebewoners",
    details: "Het bad was nice. Personeel was heel vriendelijk (maar dat zijn ze overal). Wel hele heftige mensen daar. De voornaamste uitdaging was het vermijden van alle impulsen, en dat ging lastig omdat het een vrij kleine plek was."
  },
  {
    facility: "Wat mij tot rust brengt",
    verdict: "good",
    emoji: "🌿",
    summary: "Een ondernemer in overdrive heeft geen instelling nodig - maar rust, natuur en warmte",
    details: "Ik hou zoveel van de mensen om me heen. En m'n gezin natuurlijk in het bijzonder. Lieve moeder Margje, zorgzame tweelingzusje Santje, snelle slimmerik regelaar Roosje, en de wijsheid hemzelfde m'n vader Aad. En dan nu ook zo'n godsgeschenk met m'n neefjes: Joe, Billy & Nick - en straks ook nog een kindje van Sanne. M'n brothers-in-law zijn ook geweldig; Niels & Sven, echte bazen. Het liefst ben ik gewoon dichtbij hen. Dat geeft mij een fijn en gelukkig gevoel. Ik hou van iedereen hoor, maar van hun het allermeest.\n\nEn dan Lotje & Doortje - voor mij zijn zij gewoon familie. Ik hou net zoveel van deze twee hondjes als van mijn familie. Als iets of iemand mij rustig kan krijgen en houden, dan is het Lotje wel. Ik hou van alle honden, en eigenlijk van alle dieren - maar voor Lotje natuurlijk extra veel.",
    website: "https://www.natuurhuisje.nl/in-het-bos",
    calmingItems: [
      { emoji: "🎯", label: "Doen waar ik behoefte aan heb", desc: "Rust is luisteren naar jezelf - dat verschilt per moment" },
      { emoji: "🏡", label: "Hutje in het bos", desc: "Natuur, stilte, geen prikkels" },
      { emoji: "🛁", label: "Hot tub / warm bad", desc: "Warmte ontspant het hele lichaam" },
      { emoji: "🚿", label: "Warme douche", desc: "Reset-knop, even alles loslaten" },
      { emoji: "🐕", label: "Lotje knuffelen", desc: "Beste manier om tot rust te komen" },
      { emoji: "🐾", label: "Doortje erbij", desc: "Twee hondjes = dubbel anker" },
      { emoji: "👶🏻", label: "Neefjes om me heen", desc: "Onvoorwaardelijke liefde, in het moment" },
      { emoji: "📝", label: "Pen en papier", desc: "Schrijven zonder schermen" },
      { emoji: "📵", label: "Geen schermen", desc: "Telefoon weg, laptop dicht" },
      { emoji: "🌲", label: "Natuur", desc: "Bos, water, frisse lucht" },
      { emoji: "🏃🏼‍♂️", label: "Hardlopen", desc: "In het bos, hoofd leeg maken" },
      { emoji: "🧹", label: "Schone omgeving", desc: "Fris, opgeruimd, geen chaos" },
      { emoji: "🔇", label: "Weinig mensen", desc: "Geen drukte, geen meningen" },
      { emoji: "🛏️", label: "Mijn eigen bed", desc: "7-8 kussens, slapen als een embryo" },
      { emoji: "🥘", label: "Andijvie stamppot", desc: "Van mama, het allerlekkerste" },
      { emoji: "🎬", label: "Film met moeders of vrienden", desc: "Lekker op de bank, samen kijken" },
      { emoji: "🌊", label: "Zee / water", desc: "Golven, zout, even helemaal leeg" },
      { emoji: "🥵", label: "Sauna", desc: "Hitte, zweten, loslaten" },
      { emoji: "🥶", label: "IJsbad", desc: "Na de sauna - reset voor lijf en hoofd" },
      { emoji: "🧖🏼‍♂️", label: "Wellness", desc: "Warmte, rust, even helemaal niks" },
      { emoji: "👱🏻‍♀️", label: "Rustgevende vrouw", desc: "Verplicht ontspannen, even uit mn hoofd" },
      { emoji: "💚", label: "Familie dichtbij", desc: "Maar op mijn tempo" },
      { emoji: "🌳", label: "Boswandeling", desc: "Zonder doel, zonder telefoon" },
      { emoji: "🌬️", label: "Ademhaling", desc: "Even stil, 5 minuten, niks anders" },
      { emoji: "🎧", label: "Muziek op", desc: "Koptelefoon op, wereld uit" },
      { emoji: "☕", label: "Warme thee / koffie", desc: "Rustig drinken, niks moeten" },
      { emoji: "🧘🏼‍♂️", label: "Stretchen", desc: "Lichaam los, hoofd volgt" },
      { emoji: "🌅", label: "Zonsondergang kijken", desc: "Alles stopt even" },
      { emoji: "🔥", label: "Kampvuur / kaarsen", desc: "Vlammen kijken, hypnotiserend" },
      { emoji: "📖", label: "Boek lezen", desc: "Echt papier, geen Kindle" },
      { emoji: "🎣", label: "Vissen", desc: "Geduld, stilte, water" },
      { emoji: "🚴🏼‍♂️", label: "Fietsen", desc: "Wind, beweging, geen bestemming" },
      { emoji: "🎨", label: "Tekenen / kleuren", desc: "Creatief bezig, geen output druk" },
      { emoji: "🍳", label: "Koken voor anderen", desc: "Iets maken met je handen" },
      { emoji: "🌧️", label: "Regen luisteren", desc: "Binnen, warm, regen op het dak" },
      { emoji: "🛋️", label: "Niks doen op de bank", desc: "Echt niks, geen schuldgevoel" },
      { emoji: "🪴", label: "Planten verzorgen", desc: "Rustig ritueel, groei zien" },
      { emoji: "🏊🏼‍♂️", label: "Zwemmen", desc: "Water, stilte, gewichtloos" },
      { emoji: "🌾", label: "Buiten zitten", desc: "Tuin, terras, zon op je gezicht" },
      { emoji: "🧸", label: "Knuffelen", desc: "Met iemand, een hond, een kussen" },
      { emoji: "🎵", label: "Zelf muziek maken", desc: "Piano, gitaar, wat dan ook" },
      { emoji: "🗺️", label: "Dagje weg zonder plan", desc: "Auto in, zien waar je uitkomt" },
      { emoji: "🐴", label: "Dieren aaien", desc: "Boerderij, kinderboerderij, maakt niet uit" },
      { emoji: "🧼", label: "Lang douchen", desc: "20 minuten, geen haast" },
      { emoji: "🌿", label: "Tuinieren", desc: "Handen in de aarde, hoofd leeg" },
      { emoji: "⛺", label: "Kamperen", desc: "Simpel leven, alleen het essentiële" },
      { emoji: "🍦", label: "IJsje eten aan zee", desc: "Simpel geluk" },
      { emoji: "📸", label: "Foto's maken", desc: "De wereld door een lens bekijken" },
      { emoji: "🛶", label: "Kanoën / suppen", desc: "Rustig over het water glijden" },
      { emoji: "🌙", label: "Sterren kijken", desc: "Buiten, stil, perspectief" },
      { emoji: "🧴", label: "Massage", desc: "Spanning uit je lijf laten halen" },
      { emoji: "🫖", label: "Theeritueel", desc: "Langzaam zetten, rustig drinken" },
      { emoji: "🎙️", label: "Podcast luisteren", desc: "Iemand anders praat, jij luistert" },
      { emoji: "🏖️", label: "Strand liggen", desc: "Zon, zand, ogen dicht" },
      { emoji: "🐶", label: "Hond uitlaten", desc: "Lotje bepaalt het tempo" },
      { emoji: "🥋", label: "Wijsheden van papa", desc: "Mijn sensei - hij heeft het pad al bewandeld" },
    ],
    links: [
      { label: "Lotje", url: "https://www.instagram.com/stories/highlights/17878688695950098/", image: "/highlights/lotje.jpg" },
      { label: "Doortje", url: "https://www.instagram.com/stories/highlights/17880308928183060/", image: "/highlights/doortje.jpg" },
      { label: "Neefjes", url: "https://www.instagram.com/stories/highlights/17991284398359243/", image: "/highlights/neefjes.jpg" }
    ]
  },
  {
    facility: "Wat mij onrustig maakt",
    verdict: "bad",
    emoji: "⚠️",
    summary: "De dingen die mij triggeren, uit balans brengen, of ontregeling versnellen",
    details: "Dit is geen zwakte - dit is zelfkennis. Als ik te veel hiervan op mijn bordje krijg, ga ik sneller in overdrive. Weten wat mij onrustig maakt helpt om op tijd bij te sturen.",
    unrestItems: [
      { emoji: "🏥", label: "Gedwongen opname", desc: "Vrijheid afpakken = escalatie, nooit oplossing" },
      { emoji: "🚫", label: "Amstelmeren", desc: "Vieze, chaotische instelling - nooit meer" },
      { emoji: "👥", label: "Te veel mensen", desc: "Drukke ruimtes, veel stemmen, overprikkeling" },
      { emoji: "📱", label: "Te veel schermen", desc: "Notificaties, info-overload, geen rust" },
      { emoji: "😴", label: "Te weinig slaap", desc: "Onder de 7 uur = gevaarzone" },
      { emoji: "🗣️", label: "Mijn verhaal herhalen", desc: "Steeds opnieuw uitleggen aan nieuwe mensen" },
      { emoji: "🤷", label: "Onbegrip", desc: "Mensen die mijn tempo niet volgen of me niet geloven" },
      { emoji: "⛓️", label: "Geen controle", desc: "Dingen moeten die ik niet wil, geen keuze hebben" },
      { emoji: "🍺", label: "Alcohol", desc: "Vergroot alles - stemmingen, impulsen, slaapproblemen" },
      { emoji: "💊", label: "Verkeerde medicatie", desc: "Zombie-gevoel, creativiteit weg" },
      { emoji: "🌀", label: "Te veel parallelle projecten", desc: "Te veel ballen hooghouden tegelijk" },
      { emoji: "📋", label: "Onder tijdsdruk plannen", desc: "Grote beslissingen moeten nemen op moment zelf" },
      { emoji: "🧹", label: "Chaos / rommel", desc: "Vieze omgeving, geen structuur" },
      { emoji: "🚨", label: "Conflict / ruzie", desc: "Vooral met mensen van wie ik hou" },
      { emoji: "🔊", label: "Harde geluiden", desc: "Onverwachte, scherpe, doorlopende geluiden" },
      { emoji: "💡", label: "Fel TL-licht", desc: "Ziekenhuisverlichting, geen natuurlijk licht" },
      { emoji: "🕐", label: "Gehaast zijn", desc: "Te weinig tijd, steeds te laat, achter de feiten" },
      { emoji: "📉", label: "Whoop recovery rood", desc: "Onder 34% = lichaam vraagt om pauze" },
      { emoji: "❓", label: "Onzekerheid", desc: "Niet weten wat er gaat gebeuren, geen duidelijkheid" },
      { emoji: "🙋", label: "Alleen moeten regelen", desc: "Te weinig support, alles zelf moeten oplossen" },
      { emoji: "🥤", label: "Te veel cafeïne", desc: "Meer dan 2 koffies = rusteloos" },
      { emoji: "🍔", label: "Slecht eten", desc: "Suiker, geen voeding, blood sugar crashes" },
      { emoji: "📵", label: "Geen contact met naasten", desc: "Isolement, afgesloten voelen" },
      { emoji: "⏰", label: "Verstoorde routine", desc: "Gebroken ritme, geen vast ritueel" },
      { emoji: "👽", label: "Medebewoners in psychose", desc: "Mensen die denken dat ze Bruce Lee of een alien zijn" },
      { emoji: "🥷", label: "Agressief gedrag", desc: "Tegen muren aanrennen, poep gooien, schreeuwen" },
      { emoji: "🍣", label: "Geen privacy", desc: "Dikke man die mijn sushi opeet - geen eigen ruimte" },
      { emoji: "🌀", label: "Illuminati-theorieen", desc: "Iedereen denkt afgeluisterd te worden - paranoia is besmettelijk" },
    ],
  }
];

export interface PersonalInfo {
  label: string;
  value: string;
  sensitive?: boolean;
}

export interface PersonalSection {
  title: string;
  emoji: string;
  items: PersonalInfo[];
}

export const personalSections: PersonalSection[] = [
  {
    title: "Persoonsgegevens",
    emoji: "🪪",
    items: [
      { label: "Naam", value: "Daantje Goedhart" },
      { label: "Geboortedatum", value: "08 juni 1997" },
      { label: "BSN", value: "...", sensitive: true },
      { label: "Geboorteplaats", value: "Beverwijk" },
      { label: "Adres", value: "Rupelmonde 49, 1081 GR Amsterdam" },
      { label: "Telefoon", value: "..." },
      { label: "E-mail", value: "daantje@clearly.co" },
      { label: "E-mail (prive)", value: "daantjegoedhart@hotmail.com" },
    ],
  },
  {
    title: "Zorgverzekering",
    emoji: "🏥",
    items: [
      { label: "Verzekeraar", value: "Zilveren Kruis" },
      { label: "Relatienummer", value: "170285723", sensitive: true },
      { label: "Type", value: "Basis Start (Basis Budget) - Naturapolis" },
      { label: "Aanvullend", value: "Aanvullend 1 ster" },
      { label: "Eigen risico", value: "Verplicht: \u20AC385 + Vrijwillig: \u20AC500" },
      { label: "Geldig", value: "1 jan 2026 - 31 dec 2026" },
    ],
  },
  {
    title: "Medisch",
    emoji: "🩺",
    items: [
      { label: "Diagnose", value: "..." },
      { label: "Bloedgroep", value: "..." },
      { label: "Allergieen", value: "..." },
      { label: "Eerste episode", value: "..." },
      { label: "Aantal episodes", value: "..." },
    ],
  },
  {
    title: "Behandelteam",
    emoji: "👨‍⚕️",
    items: [
      { label: "Psychiater", value: "..." },
      { label: "Huisarts", value: "..." },
      { label: "Huisartsenpraktijk", value: "..." },
      { label: "Apotheek", value: "..." },
      { label: "Crisisdienst", value: "GGZ InGeest" },
    ],
  },
  {
    title: "Identificatie",
    emoji: "📋",
    items: [
      { label: "Paspoort nr.", value: "NYCR42RC3", sensitive: true },
      { label: "Rijbewijs nr.", value: "...", sensitive: true },
      { label: "Paspoort geldig tot", value: "04 juni 2028" },
      { label: "Nationaliteit", value: "Nederlandse" },
      { label: "Geslacht", value: "M" },
      { label: "Lengte", value: "1,85 m" },
    ],
  },
];

export interface Medication {
  name: string;
  type: "mood_stabilizer" | "antipsychotic" | "sleep" | "supplement" | "other";
  status: "active" | "refused" | "stopped" | "as_needed" | "other";
  dosage?: string;
  timing?: string;
  started?: string;
  stopped?: string;
  prescribed_by?: string;
  notes?: string;
}

export const medications: Medication[] = [
  // --- Actief ---
  {
    name: "Lithium (Priadel)",
    type: "mood_stabilizer",
    status: "active",
    dosage: "800mg",
    timing: "Per dag",
    started: "2026-04",
    prescribed_by: "De Nieuwe Valerius (GGZ inGeest)",
    notes: "VERPLICHT - neem ik alleen omdat het moet. Niet uit eigen keuze. Bloedspiegel elke 3 maanden controleren. Veel water drinken.",
  },
  {
    name: "Lorazepam",
    type: "sleep",
    status: "active",
    dosage: "2.5mg",
    timing: "Per dag",
    started: "2026-04",
    prescribed_by: "De Nieuwe Valerius (GGZ inGeest)",
    notes: "VERPLICHT - neem ik alleen omdat het moet. Niet uit eigen keuze. Verslavingsgevoelig, niet langer dan nodig.",
  },

  // --- Overig (niet aangeboden, niet genomen, niet geweigerd) ---
  {
    name: "Oxazepam",
    type: "sleep",
    status: "other",
    notes: "Niet aangeboden, niet genomen, niet geweigerd.",
  },

  // --- Geweigerd ---
  {
    name: "Olanzapine (Zyprexa)",
    type: "antipsychotic",
    status: "refused",
    dosage: "...",
    notes: "Reden: ...",
  },
  {
    name: "Quetiapine (Seroquel)",
    type: "antipsychotic",
    status: "refused",
    dosage: "...",
    notes: "Reden: ...",
  },
  {
    name: "Haloperidol (Haldol)",
    type: "antipsychotic",
    status: "refused",
    dosage: "...",
    notes: "Reden: ...",
  },

  // --- Gestopt ---
  {
    name: "Aripiprazol (Abilify)",
    type: "antipsychotic",
    status: "stopped",
    dosage: "...",
    started: "...",
    stopped: "...",
    notes: "Reden van stoppen: ...",
  },
  {
    name: "Valproaat (Depakine)",
    type: "mood_stabilizer",
    status: "stopped",
    dosage: "...",
    started: "...",
    stopped: "...",
    notes: "Reden van stoppen: ...",
  },
];

export interface PhaseField {
  label: string;
  icon: string;
  value: string;
}

export interface Phase {
  id: number;
  name: string;
  subtitle: string;
  emoji: string;
  colorKey: string;
  fields: PhaseField[];
}

export interface CSPData {
  naam: string;
  datum: string;
  phases: Phase[];
}

export const defaultCSPData: CSPData = {
  naam: "",
  datum: new Date().toISOString().split("T")[0],
  phases: [
    {
      id: 0,
      name: "Stabiele fase",
      subtitle: "Het gaat goed",
      emoji: "😊",
      colorKey: "0",
      fields: [
        {
          label: "Signalen",
          icon: "👁️",
          value:
            "😴 **7-8 uur** slaap per nacht\n💚 Whoop recovery **groen** (**>66%**)\n📋 Gestructureerde dag met vaste routine\n🎯 Gefocust op Clearly zonder te veel parallelle projecten\n🧠 Rustig, helder denken\n🍽️ Normale eetlust en sociale contacten",
        },
        {
          label: "Wat kan ik zelf doen?",
          icon: "🛠️",
          value:
            "🛏️ Vaste bedtijd aanhouden (uiterlijk **23:00**)\n🏃 Dagelijks bewegen / sporten\n⌚ Whoop recovery dagelijks checken\n📵 Telefoon weg na **22:00**\n🤖 Beperkt AI-gebruik in de avond\n💧 Voldoende water drinken\n💊 Medicatie innemen zoals voorgeschreven",
        },
        {
          label: "Wie kan ik bellen voor hulp?",
          icon: "📞",
          value: "🩺 Psychiater (reguliere afspraken)\n🏥 Huisarts",
        },
        {
          label: "Wat kunnen anderen doen?",
          icon: "🤝",
          value:
            "✅ Naasten hoeven niks speciaals te doen\n💬 Open communicatie onderhouden over hoe het gaat\n🙏 Vraag hoe je kunt ondersteunen, geef geen ongevraagde adviezen\n📚 Leer over bipolaire stoornis (psycho-educatie) zodat je signalen herkent",
        },
        {
          label: "Suicidaliteit",
          icon: "🛡️",
          value:
            "🟢 Ik heb **geen doodsgedachten**\n📋 Veiligheidsplan is opgesteld en besproken met behandelaar\n💬 Ik kan open praten over hoe ik me voel",
        },
        {
          label: "Middelengebruik",
          icon: "🍷",
          value:
            "✅ Onder controle / niet gebruiken\n💊 Medicatie wordt ingenomen zoals voorgeschreven\n🚫 Geen alcohol of drugs",
        },
        {
          label: "Doel",
          icon: "🎯",
          value:
            "⚖️ Stabiliteit behouden\n🔄 Routine vasthouden\n🏗️ Gefocust bouwen aan Clearly",
        },
      ],
    },
    {
      id: 1,
      name: "Beginnende / aanwezige spanning",
      subtitle: "Er verandert iets",
      emoji: "😐",
      colorKey: "1",
      fields: [
        {
          label: "Signalen",
          icon: "👁️",
          value:
            "😴 Slaap zakt naar **5-6 uur** per nacht\n💛 Whoop recovery **geel** (**34-66%**)\n⚡ Meer energie dan normaal, voelt fijn\n🗣️ Sneller praten, meer ideeen tegelijk\n🌙 's Avonds langer op met AI of werk\n🔀 Meerdere projecten tegelijk willen oppakken\n🏃 Minder behoefte aan pauzes\n😤 Sneller boos, vooral als ik mijn zin niet krijg, zoek discussies op\n🫥 Minder contact zoeken, in mijzelf gekeerd\n😰 Gespannen of angstig, soms bang zonder reden\n💭 Snelle gedachten die ik niet kan stoppen\n🌀 Meer piekeren over nare gebeurtenissen uit het verleden",
        },
        {
          label: "Wat kan ik zelf doen?",
          icon: "🛠️",
          value:
            "📵 Telefoon weg na **22:00** (**niet onderhandelbaar**)\n😴 Slaap prioriteren boven alles\n⌚ Whoop checken en serieus nemen\n🚫 Geen nieuwe projecten starten\n🏃 Extra bewegen om energie kwijt te raken\n🤖 AI-gebruik 's avonds stoppen",
        },
        {
          label: "Wie kan ik bellen voor hulp?",
          icon: "📞",
          value:
            "👋 Signaal afgeven aan naasten (**Don**, **Jeroen**)\n🩺 Psychiater informeren bij volgend gesprek",
        },
        {
          label: "Wat kunnen anderen doen?",
          icon: "🤝",
          value:
            "💤 Naasten mogen vragen: 'Hoeveel slaap je?'\n🪞 Naasten mogen zeggen: 'Ik merk dat je sneller praat / meer energie hebt'\n👂 Serieus nemen als zij iets signaleren\n🗣️ Gebruik korte zinnen, praat rustiger, herhaal dingen als het nodig is\n🤝 Bekrachtig gewenst gedrag, ga niet de strijd aan\n❤️ Richt je op onderliggende gevoelens, niet op de inhoud van de ontregeling",
        },
        {
          label: "Suicidaliteit",
          icon: "🛡️",
          value:
            "🟡 Soms liever dood, soms liever leven\n💬 Bespreek deze gedachten met behandelaar of vertrouwenspersoon\n📋 Veiligheidsplan opnieuw doornemen\n📞 Bij acute nood: bel **113** (Zelfmoordpreventie) of **0900-0113**",
        },
        {
          label: "Middelengebruik",
          icon: "🍷",
          value:
            "⚠️ Meer alcohol of drugs dan normaal\n💊 Medicatie wordt nog wel ingenomen\n🚩 Let op: middelengebruik versterkt ontregeling",
        },
        {
          label: "Doel",
          icon: "🎯",
          value:
            "⬇️ Terug naar fase 0\n😴 Slaap herstellen naar **7-8 uur**\n🛑 Escalatie voorkomen",
        },
      ],
    },
    {
      id: 2,
      name: "Hoge spanning, gedeeltelijk controleverlies",
      subtitle: "Professionele hulp nodig",
      emoji: "😟",
      colorKey: "2",
      fields: [
        {
          label: "Signalen",
          icon: "👁️",
          value:
            "😴 Slaap **3-4 uur** en het 'geweldig' vinden\n❤️ Whoop recovery **rood** (**<34%**), meerdere dagen\n🔀 Meerdere projecten tegelijk starten\n😤 Ongeduldig of geirriteerd als iemand tegenspreekt\n💸 Impulsieve beslissingen (financieel, zakelijk)\n🔍 Achterdocht richting collega's of naasten\n🌙 's Nachts actief met AI, werk of plannen\n✊ Lichamelijke spanning: gebalde vuisten, dreigende houding, paniekaanvallen\n😶 Oninvoelbaar voor anderen, moeilijk te volgen in gesprek\n🫸 Bemoei mij met anderen, prikkelbaar\n😡 Dreig met agressie maar soms nog tot rust te brengen\n🧠 Kan moeilijk denken, concentreren en beslissingen nemen\n↔️ Moeite met afstand en nabijheid tot anderen",
        },
        {
          label: "Wat kan ik zelf doen?",
          icon: "🛠️",
          value:
            "📞 Psychiater bellen (**niet wachten** op volgend gesprek)\n💊 Medicatie checken met arts\n📴 Alle schermen uit na **21:00**\n🚫 **Geen grote beslissingen** nemen\n✋ **Geen contracten tekenen** of geld uitgeven",
        },
        {
          label: "Wie kan ik bellen voor hulp?",
          icon: "📞",
          value:
            "🩺 Psychiater direct bellen\n💚 **Aad (vader)** inschakelen\n🔱 **Don** en/of ⛰️ **Jeroen**\n🏥 **Huisartsenpost** (0900-1515) als psychiater niet bereikbaar",
        },
        {
          label: "Wat kunnen anderen doen?",
          icon: "🤝",
          value:
            "💚 **Aad (vader)** mag actief ingrijpen\n🩺 Naasten mogen contact opnemen met psychiater namens mij\n💻 MacBook en telefoon innemen\n🤫 Niet in discussie gaan, maar grenzen stellen\n🏡 Haal mij weg bij de bron van onrust, bied een **prikkelarme omgeving**\n🕊️ Maak de situatie veilig met **zo min mogelijk dwang en drang**\n💛 Stel mij gerust en geef hoop, maar geen valse geruststellingen\n🗣️ Gebruik korte zinnen, praat rustiger, herhaal indien nodig\n\n🏠 **Plan 1**: Terug naar **Margha (mama)** - voorkeur\n🔑 **Plan 2**: Terug naar **Rupelmonde 49**\n🏘️ **Plan 3**: Eigen nieuw appartement zoeken\n\n📞 Wie bellen?\n🎳 Onschuldige avonturen (spontane uitjes): bel mama\n🚨 Echt grensoverschrijdend gedrag: bel **Aad (vader)**\n\n🐕 **Lotje & Doortje**: bij mama als het rustig is, bij Aad als het heftig is",
        },
        {
          label: "Suicidaliteit",
          icon: "🛡️",
          value:
            "🟠 Ik denk dat ik beter dood kan zijn\n🚨 Dit moet **direct** besproken worden met psychiater of crisisdienst\n📞 Bel **113** (Zelfmoordpreventie) of **0900-0113**\n👥 Naasten: vraag hier **actief** naar, wacht niet tot ik het zelf zeg",
        },
        {
          label: "Middelengebruik",
          icon: "🍷",
          value:
            "🔴 Toenemend gebruik, stopt niet ondanks waarschuwingen\n💊 Niet eens met medicatie - neemt het onregelmatig of weigert\n⚠️ Combinatie alcohol/drugs + geen medicatie = **hoog risico**",
        },
        {
          label: "Doel",
          icon: "🎯",
          value:
            "⬇️ De-escaleren naar fase 1\n🩺 Professionele hulp inschakelen\n🛡️ Schade beperken (financieel, relationeel)",
        },
      ],
    },
    {
      id: 3,
      name: "Crisis, overwegend controleverlies",
      subtitle: "Direct handelen",
      emoji: "🚨",
      colorKey: "3",
      fields: [
        {
          label: "Signalen",
          icon: "👁️",
          value:
            "🚫 Niet meer slapen en geen behoefte voelen\n🌀 Psychotische kenmerken: wanen, extreme achterdocht\n😡 Geloven dat anderen liegen, stelen of samenspannen\n🙈 Totaal geen **ziekte-inzicht** ('er is niks aan de hand')\n💥 Conflicten met iedereen die probeert te helpen\n⚠️ Onvoorspelbaar of roekeloos gedrag\n🔄 Dag en nacht lopen door elkaar",
        },
        {
          label: "Wat kan ik zelf doen?",
          icon: "🛠️",
          value:
            "🪞 In deze fase is **zelfinzicht waarschijnlijk afwezig**\n📋 Daarom is dit plan er: zodat anderen mogen handelen\n📞 Als er toch een helder moment is: bel crisisdienst **GGZ InGeest**",
        },
        {
          label: "Wie kan ik bellen voor hulp?",
          icon: "📞",
          value:
            "🏥 Crisisdienst **GGZ InGeest**\n🩺 Psychiater\n🏥 **Huisartsenpost**\n💚 **Aad (vader)** als eerste contactpersoon",
        },
        {
          label: "Wat kunnen anderen doen?",
          icon: "🤝",
          value:
            "🩺 Contact opnemen met psychiater of crisisdienst namens mij\n📝 Alleen pen en papier, geen MacBook of telefoon\n🤫 Niet in discussie gaan over of het wel of niet een crisis is\n📋 Beslissingen overnemen op basis van dit plan\n🕊️ Maak de situatie veilig met **zo min mogelijk dwang en drang**\n🗣️ Praat langzamer, gebruik korte zinnen, herhaal dingen\n💛 Stel mij gerust, verzeker mij van mijn veiligheid\n👨‍👩‍👦 Betrek naasten, moedig ze aan om bij mij te blijven (rooming-in)\n\n🏠 **Plan 1**: Terug naar **Margha (mama)** - voorkeur\n🔑 **Plan 2**: Terug naar **Rupelmonde 49**\n🏘️ **Plan 3**: Eigen nieuw appartement zoeken\n\n📞 Wie bellen?\n🎳 Onschuldige avonturen (spontane uitjes): bel mama\n🚨 Echt grensoverschrijdend gedrag: bel **Aad (vader)**\n\n🐕 **Lotje & Doortje**: bij mama als het tranquillo is, bij Aad als het heftig is\n\n🏥 Mocht opname ooit nodig zijn (niet verwacht):\n✅ **Parnassia Castricum Unit 6** - prima\n✅ **De Nieuwe Valerius** - prima\n🚫 **NIET Amstelmeren** - onhygienisch, kan daar niet tot rust komen",
        },
        {
          label: "Suicidaliteit",
          icon: "🛡️",
          value:
            "🔴 Ik heb een **plan gemaakt** voor zelfdoding\n🚨 **DIRECT HANDELEN** - bel crisisdienst **GGZ InGeest** of **112**\n📞 **113** (Zelfmoordpreventie) - 24/7 bereikbaar\n👥 Naasten: neem regie over, laat mij **niet alleen**\n🏥 Veiligheidsplan activeren - opname kan nodig zijn",
        },
        {
          label: "Middelengebruik",
          icon: "🍷",
          value:
            "🔴 Veel gebruik, werkt niet mee over medicatie\n💊 Weigert medicatie volledig\n⚠️ Middelengebruik verhoogt **suiciderisico** aanzienlijk\n🩺 Behandelaar moet hiervan op de hoogte zijn",
        },
        {
          label: "Doel",
          icon: "🎯",
          value:
            "🛡️ Veiligheid waarborgen\n🌿 Rust en natuur, niet een ziekenhuis\n🩺 Professionele hulp op afstand (psychiater belt in)\n🐕 **Lotje & Doortje** als anker",
        },
      ],
    },
  ],
};

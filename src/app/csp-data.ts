export interface Experience {
  facility: string;
  verdict: "good" | "bad";
  emoji: string;
  summary: string;
  details: string;
}

export const experiences: Experience[] = [
  {
    facility: "Amstelmeren (GGZ inGeest) - Amstelveenseweg 589, 1081 JC Amsterdam",
    verdict: "bad",
    emoji: "🚫",
    summary: "Absoluut niet - het ergste wat je iemand in een manie kunt aandoen",
    details: "Het was daar fucking druk. Het stonk fucking hard. Er liepen gewoon ratten. Mensen liepen op dode voeten. Er was weinig begeleiding. Mensen waren depressief. Sommige mensen waren zelfs luid. Het was daar gewoon echt heel goor.\n\nAls je iemand in een manie hebt, moet die persoon tot rust kunnen komen. Om tot rust te komen moet diegene zich in een rustige omgeving bevinden. Dat betekent: niet te veel mensen, en wel hygiene. Bij Amstelmeren was dat allesbehalve.\n\nDit is eigenlijk het allerergste wat je iemand in een manie kunt aandoen. Sterker nog: stuur iemand in een manie NOOIT naar zo'n plek als diegene nog tot rede vatbaar is.\n\nBeter is het om iemand gewoon in een hutje in een bos te zetten, met een hot tub en een warme douche, zodat diegene echt goed tot rust kan komen.\n\nDaantje heeft zelf twee schoonmakers in dienst en een robotstofzuiger - zijn schoonmaakbehoefte is heel hoog. Hij kon hier absoluut niet tot rust komen."
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
    facility: "Wat WEL werkt bij manie",
    verdict: "good",
    emoji: "🏡",
    summary: "Hutje in het bos, hot tub, warme douche, rust",
    details: "Iemand in een manie moet tot rust komen. Dat betekent:\n- Rustige omgeving (bos, natuur)\n- Niet te veel mensen\n- Goede hygiene (schoon, fris)\n- Hot tub / warm bad\n- Warme douche\n- Pen en papier (geen schermen)\n- Hondjes Lotje & Doortje als anker\n\nDit is het tegenovergestelde van een drukke, vieze instelling. Rust, natuur, en warmte zijn de sleutel."
  }
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
            "✅ Naasten hoeven niks speciaals te doen\n💬 Open communicatie onderhouden over hoe het gaat",
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
            "😴 Slaap zakt naar **5-6 uur** per nacht\n💛 Whoop recovery **geel** (**34-66%**)\n⚡ Meer energie dan normaal, voelt fijn\n🗣️ Sneller praten, meer ideeen tegelijk\n🌙 's Avonds langer op met AI of werk\n🔀 Meerdere projecten tegelijk willen oppakken\n🏃 Minder behoefte aan pauzes",
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
            "💤 Naasten mogen vragen: 'Hoeveel slaap je?'\n🪞 Naasten mogen zeggen: 'Ik merk dat je sneller praat / meer energie hebt'\n👂 Serieus nemen als zij iets signaleren",
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
            "😴 Slaap **3-4 uur** en het 'geweldig' vinden\n❤️ Whoop recovery **rood** (**<34%**), meerdere dagen\n🔀 Meerdere projecten tegelijk starten\n😤 Ongeduldig of geirriteerd als iemand tegenspreekt\n💸 Impulsieve beslissingen (financieel, zakelijk)\n🔍 Achterdocht richting collega's of naasten\n🌙 's Nachts actief met AI, werk of plannen",
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
            "💚 **Aad (vader)** mag actief ingrijpen\n🩺 Naasten mogen contact opnemen met psychiater namens mij\n💻 MacBook en telefoon innemen\n🤫 Niet in discussie gaan, maar grenzen stellen\n\n🏠 **Plan 1**: Terug naar **Margha (mama)** - voorkeur\n🔑 **Plan 2**: Terug naar **Rupelmonde 49**\n🏘️ **Plan 3**: Eigen nieuw appartement zoeken\n\n📞 Wie bellen?\n🎳 Onschuldige avonturen (spontane uitjes): bel mama\n🚨 Echt grensoverschrijdend gedrag: bel **Aad (vader)**\n\n🐕 **Lotje & Doortje**: bij mama als het rustig is, bij Aad als het heftig is",
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
            "🩺 Contact opnemen met psychiater of crisisdienst namens mij\n📝 Alleen pen en papier, geen MacBook of telefoon\n🤫 Niet in discussie gaan over of het wel of niet een crisis is\n📋 Beslissingen overnemen op basis van dit plan\n\n🏠 **Plan 1**: Terug naar **Margha (mama)** - voorkeur\n🔑 **Plan 2**: Terug naar **Rupelmonde 49**\n🏘️ **Plan 3**: Eigen nieuw appartement zoeken\n\n📞 Wie bellen?\n🎳 Onschuldige avonturen (spontane uitjes): bel mama\n🚨 Echt grensoverschrijdend gedrag: bel **Aad (vader)**\n\n🐕 **Lotje & Doortje**: bij mama als het tranquillo is, bij Aad als het heftig is\n\n🏥 Mocht opname ooit nodig zijn (niet verwacht):\n✅ **Parnassia Castricum Unit 6** - prima\n✅ **De Nieuwe Valerius** - prima\n🚫 **NIET Amstelmeren** - onhygienisch, kan daar niet tot rust komen",
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

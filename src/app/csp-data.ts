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
            "7-8 uur slaap per nacht\nWhoop recovery groen (>66%)\nGestructureerde dag met vaste routine\nGefocust op Clearly zonder te veel parallelle projecten\nRustig, helder denken\nNormale eetlust en sociale contacten",
        },
        {
          label: "Wat kan ik zelf doen?",
          icon: "🛠️",
          value:
            "Vaste bedtijd aanhouden (uiterlijk 23:00)\nDagelijks bewegen / sporten\nWhoop recovery dagelijks checken\nTelefoon weg na 22:00\nBeperkt AI-gebruik in de avond\nVoldoende water drinken\nMedicatie innemen zoals voorgeschreven",
        },
        {
          label: "Wie kan ik bellen voor hulp?",
          icon: "📞",
          value: "Psychiater (reguliere afspraken)\nHuisarts",
        },
        {
          label: "Wat kunnen anderen doen?",
          icon: "🤝",
          value:
            "Naasten hoeven niks speciaals te doen\nOpen communicatie onderhouden over hoe het gaat",
        },
        {
          label: "Doel",
          icon: "🎯",
          value:
            "Stabiliteit behouden\nRoutine vasthouden\nGefocust bouwen aan Clearly",
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
            "Slaap zakt naar 5-6 uur per nacht\nWhoop recovery geel (34-66%)\nMeer energie dan normaal, voelt fijn\nSneller praten, meer ideeen tegelijk\n's Avonds langer op met AI of werk\nMeerdere projecten tegelijk willen oppakken\nMinder behoefte aan pauzes",
        },
        {
          label: "Wat kan ik zelf doen?",
          icon: "🛠️",
          value:
            "Telefoon weg na 22:00 (niet onderhandelbaar)\nSlaap prioriteren boven alles\nWhoop checken en serieus nemen\nGeen nieuwe projecten starten\nExtra bewegen om energie kwijt te raken\nAI-gebruik 's avonds stoppen",
        },
        {
          label: "Wie kan ik bellen voor hulp?",
          icon: "📞",
          value:
            "Signaal afgeven aan naasten (Daan, Don)\nPsychiater informeren bij volgend gesprek",
        },
        {
          label: "Wat kunnen anderen doen?",
          icon: "🤝",
          value:
            "Naasten mogen vragen: 'Hoeveel slaap je?'\nNaasten mogen zeggen: 'Ik merk dat je sneller praat / meer energie hebt'\nSerieus nemen als zij iets signaleren",
        },
        {
          label: "Doel",
          icon: "🎯",
          value:
            "Terug naar fase 0\nSlaap herstellen naar 7-8 uur\nEscalatie voorkomen",
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
            "Slaap 3-4 uur en het 'geweldig' vinden\nWhoop recovery rood (<34%), meerdere dagen\nMeerdere projecten tegelijk starten\nOngeduldig of geirriteerd als iemand tegenspreekt\nImpulsieve beslissingen (financieel, zakelijk)\nAchterdocht richting collega's of naasten\n's Nachts actief met AI, werk of plannen",
        },
        {
          label: "Wat kan ik zelf doen?",
          icon: "🛠️",
          value:
            "Psychiater bellen (niet wachten op volgend gesprek)\nMedicatie checken met arts\nAlle schermen uit na 21:00\nGeen grote beslissingen nemen\nGeen contracten tekenen of geld uitgeven",
        },
        {
          label: "Wie kan ik bellen voor hulp?",
          icon: "📞",
          value:
            "Psychiater direct bellen\nAad (vader) inschakelen\nDaan en/of Don\nHuisartsenpost (0900-1515) als psychiater niet bereikbaar",
        },
        {
          label: "Wat kunnen anderen doen?",
          icon: "🤝",
          value:
            "Aad (vader) mag actief ingrijpen\nNaasten mogen contact opnemen met psychiater namens mij\nMacBook en telefoon innemen\nNiet in discussie gaan, maar grenzen stellen\nRustige omgeving creeren (boshuisje, natuur)\nZorg dat Lotje & Doortje bij me zijn",
        },
        {
          label: "Doel",
          icon: "🎯",
          value:
            "De-escaleren naar fase 1\nProfessionele hulp inschakelen\nSchade beperken (financieel, relationeel)",
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
            "Niet meer slapen en geen behoefte voelen\nPsychotische kenmerken: wanen, extreme achterdocht\nGeloven dat anderen liegen, stelen of samenspannen\nTotaal geen ziekte-inzicht ('er is niks aan de hand')\nConflicten met iedereen die probeert te helpen\nOnvoorspelbaar of roekeloos gedrag\nDag en nacht lopen door elkaar",
        },
        {
          label: "Wat kan ik zelf doen?",
          icon: "🛠️",
          value:
            "In deze fase is zelfinzicht waarschijnlijk afwezig\nDaarom is dit plan er: zodat anderen mogen handelen\nAls er toch een helder moment is: bel crisisdienst GGZ InGeest",
        },
        {
          label: "Wie kan ik bellen voor hulp?",
          icon: "📞",
          value:
            "Crisisdienst GGZ InGeest\nPsychiater\nHuisartsenpost\nAad (vader) als eerste contactpersoon",
        },
        {
          label: "Wat kunnen anderen doen?",
          icon: "🤝",
          value:
            "Contact opnemen met psychiater of crisisdienst namens mij\nBreng me naar een rustige plek (boshuisje, natuur) - geen ziekenhuis\nAlleen pen en papier, geen MacBook of telefoon\nZorg dat Lotje & Doortje bij me zijn\nNiet in discussie gaan over of het wel of niet een crisis is\nBeslissingen overnemen op basis van dit plan",
        },
        {
          label: "Doel",
          icon: "🎯",
          value:
            "Veiligheid waarborgen\nRust en natuur, niet een ziekenhuis\nProfessionele hulp op afstand (psychiater belt in)\nLotje & Doortje als anker",
        },
      ],
    },
  ],
};

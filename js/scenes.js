const heroImagePath = "image/Capture d'écran 2026-04-21 141151.png";
const johnnyBirthDate = "";

export const themeOrder = [
  "whoAmI",
  "strength",
  "evolution",
  "projects",
  "vision",
  "difference",
];

export const scenes = {
  intro: {
    id: "intro",
    label: "Accueil",
    title: "Johnny Fleury, entre terrain, logistique et performance.",
    subtitle:
      "Un parcours interactif conçu pour faire comprendre rapidement un profil, une logique de travail et une valeur concrète.",
    body: [
      "En moins de trois minutes, cette expérience résume un parcours construit chez Migros Online entre opérations, projets, data et performance.",
      "Chaque scène reste courte, lisible et accompagnée d'une lecture vocale déclenchée à la demande.",
    ],
    speechText: "",
    layout: "hero",
    actions: [
      {
        type: "navigate",
        target: "menu",
        label: "Commencer",
        variant: "primary",
      },
    ],
    next: "menu",
  },
  menu: {
    id: "menu",
    label: "Menu",
    title: "Choisissez l'angle de lecture le plus utile.",
    subtitle:
      "Six scènes courtes pour comprendre rapidement le parcours, les forces et la logique de travail de Johnny Fleury.",
    body: [
      "Chaque carte ouvre une scène claire, avec texte concis, avatar visible et lecture vocale en français quand le navigateur le permet.",
    ],
    speechText:
      "Choisissez le thème que vous souhaitez explorer. Chaque scène est courte, claire et peut être écoutée ou relue à votre rythme.",
    layout: "menu",
    choices: themeOrder,
    actions: [
      {
        type: "navigate",
        target: "intro",
        label: "Retour a l'accueil",
        variant: "ghost",
      },
    ],
  },
  whoAmI: {
    id: "whoAmI",
    label: "Qui je suis",
    title: "Qui je suis",
    subtitle:
      "Un profil qui relie opérations, logistique, data et vision concrète du service rendu.",
    body: [
      "Je m'appelle Johnny Fleury. Mon parcours relie terrain, logistique, data et performance.",
      "Depuis plus de 7 ans chez Migros Online, j'ai construit une vision concrète entre opérationnel et stratégie.",
    ],
    speechText:
      "Je m'appelle Johnny Fleury. Mon parcours relie terrain, logistique, data et performance. Depuis plus de 7 ans chez Migros Online, j'ai construit une vision concrète entre opérationnel et stratégie.",
    layout: "detail",
    next: "strength",
    back: "menu",
    actions: [],
  },
  strength: {
    id: "strength",
    label: "Ma force",
    title: "Ma force",
    subtitle:
      "Faire des données et des contraintes terrain un point d'appui concret pour la performance.",
    body: [
      "Ma force, c'est de transformer des données et des contraintes terrain en leviers de performance.",
      "Je ne me limite pas à analyser : je cherche à comprendre, négocier, optimiser et faire progresser.",
    ],
    speechText:
      "Ma force, c'est de transformer des données et des contraintes terrain en leviers de performance. Je ne me limite pas à analyser, je cherche à comprendre et à améliorer.",
    layout: "detail",
    next: "evolution",
    back: "menu",
    actions: [],
    metrics: [
      { value: "Négociation", label: "Fournisseurs, packaging et arbitrages économiques" },
      { value: "Excel expert", label: "Analyse, suivi de performance et lecture des marges" },
      { value: "Transverse", label: "Capacité à relier opérationnel, achats et finance" },
    ],
    profileCard: {
      name: "Johnny Fleury",
      role: "Acheteur e-commerce | Data | Logistique",
      buttonLabel: "Moi ?",
      birthDate: johnnyBirthDate,
      details: [
        { label: "Adresse", value: "415 Route de Champagnole, 39300 Sapois" },
        { label: "Téléphone", value: "+33 6 98 54 42 32" },
        { label: "Email", value: "johnny.fleury87@gmail.com" },
      ],
    },
    media: null,
  },
  evolution: {
    id: "evolution",
    label: "Mon évolution",
    title: "Mon évolution",
    subtitle:
      "Une progression du terrain vers des rôles transverses avec une vision de plus en plus globale des opérations.",
    body: [
      "J'ai évolué du terrain vers des rôles transverses. De préparateur de commande à coordinateur de projets, j'ai développé une vision globale des opérations logistiques.",
      "Ce parcours m'a appris à relier exécution, contraintes réelles et décisions de structure.",
    ],
    speechText:
      "J'ai évolué du terrain vers des rôles transverses. De préparateur de commande à coordinateur de projets, j'ai développé une vision globale des opérations logistiques.",
    layout: "detail",
    next: "projects",
    back: "menu",
    actions: [],
    metrics: [
      { value: "2026 - aujourd'hui", label: "Quality Project Coordinator" },
      { value: "2024 - 2026", label: "Logistics Projects Coordinator" },
      { value: "2020 - 2024", label: "Assistant logistique" },
      { value: "2019 - 2020", label: "Préparateur de commande" },
    ],
  },
  projects: {
    id: "projects",
    label: "Projets & impact",
    title: "Projets & impact",
    subtitle:
      "Des projets logistiques et achats menés avec une logique de coordination, de négociation et de résultat.",
    body: [
      "J'ai contribué à des projets logistiques, travaillé avec les équipes achats, finance et supply chain, et piloté des négociations de contrats packaging à l'échelle européenne.",
      "Mon rôle consiste à faire converger plusieurs contraintes vers une décision utile, lisible et exploitable.",
    ],
    speechText:
      "J'ai contribué à des projets logistiques, travaillé avec les équipes achats, finance et supply chain, et piloté des négociations de contrats packaging à l'échelle européenne.",
    layout: "detail",
    next: "vision",
    back: "menu",
    actions: [],
    metrics: [
      { value: "Packaging", label: "Lead négociation Suisse et Europe" },
      { value: "Transverse", label: "Achats, finance, supply chain et opérations" },
      { value: "Performance", label: "Recherche continue de gains concrets et durables" },
    ],
    media: {
      type: "image",
      src: heroImagePath,
      alt: "Illustration d'un environnement logistique et projet",
      caption:
        "Un support visuel peut ici servir de preuve complémentaire pour incarner un projet, un outil ou une négociation pilotée.",
    },
  },
  vision: {
    id: "vision",
    label: "Ma vision",
    title: "Ma vision",
    subtitle:
      "La performance devient durable quand terrain, organisation et data sont lisibles dans une même chaîne de décision.",
    body: [
      "Je considère que la performance vient du lien entre terrain, organisation et data.",
      "Mon objectif est de rendre ces connexions visibles, compréhensibles et exploitables.",
    ],
    speechText:
      "Je considère que la performance vient du lien entre terrain, organisation et data. Mon objectif est de rendre ces connexions visibles et exploitables.",
    layout: "detail",
    next: "difference",
    back: "menu",
    actions: [],
  },
  difference: {
    id: "difference",
    label: "Ce qui me différencie",
    title: "Ce qui me différencie",
    subtitle:
      "Une façon de travailler qui cherche la clarté, l'utilité et une restitution directement actionnable.",
    body: [
      "Je ne me limite pas à un CV. Cette expérience interactive reflète ma manière de travailler : structurer, rendre clair et créer des outils utiles.",
      "Mon objectif n'est pas seulement de présenter un parcours, mais de montrer une logique de contribution.",
    ],
    speechText:
      "Je ne me limite pas à un CV. Cette expérience interactive reflète ma manière de travailler : structurer, rendre clair et créer des outils utiles.",
    layout: "detail",
    next: "conclusion",
    back: "menu",
    actions: [],
  },
  conclusion: {
    id: "conclusion",
    label: "Conclusion",
    title: "Conclusion",
    subtitle:
      "Une prise de contact simple, après un parcours concis qui fait comprendre la valeur sans passer par un CV classique.",
    body: [
      "Si cette approche correspond à votre vision, je serais ravi d'échanger avec vous.",
      "Le parcours est volontairement court pour aller à l'essentiel : parcours, logique, impact et manière de travailler.",
    ],
    speechText:
      "Si cette approche correspond à votre vision, je serais ravi d'échanger avec vous.",
    layout: "detail",
    back: "menu",
    actions: [
      {
        type: "navigate",
        target: "menu",
        label: "Retour menu",
        variant: "primary",
      },
    ],
  },
};

export function getScene(sceneId) {
  return scenes[sceneId] ?? scenes.intro;
}

export function getNextTheme(sceneId) {
  const currentIndex = themeOrder.indexOf(sceneId);
  if (currentIndex === -1) {
    return null;
  }

  return themeOrder[currentIndex + 1] ?? null;
}
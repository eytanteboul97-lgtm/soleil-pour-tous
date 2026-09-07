import type { LeadFormValues } from "@/lib/lead-schema";

export type AideSlug =
  | "pompe-a-chaleur"
  | "isolation"
  | "solaire"
  | "chauffage"
  | "renovation-energetique"
  | "chauffe-eau";

export type AideFiche = {
  slug: AideSlug;
  travauxKey: LeadFormValues["typeTravaux"][number];
  title: string;
  metaDescription: string;
  heroTagline: string;
  beneficiaires: string;
  travauxConcernes: string;
  conditionsPrincipales: string[];
  montant: string;
  cumul: string;
  dateValidite: string;
  sourceOfficielle: { label: string; url: string }[];
  derniereVerification: string;
};

const OFFICIAL_SOURCES = {
  franceRenov: { label: "France Rénov'", url: "https://france-renov.gouv.fr" },
  servicePublic: { label: "Service-Public.fr", url: "https://www.service-public.fr" },
  ademe: { label: "ADEME", url: "https://www.ademe.fr" },
  anah: { label: "ANAH", url: "https://www.anah.gouv.fr" },
};

// Date affichée sur chaque fiche comme "Informations vérifiées le...". À
// mettre à jour manuellement (ou via l'admin, une fois branché) à chaque
// relecture du contenu face aux sources officielles ci-dessus.
const LAST_VERIFIED = "07/09/2026";

export const AIDES_FICHES: Record<AideSlug, AideFiche> = {
  "pompe-a-chaleur": {
    slug: "pompe-a-chaleur",
    travauxKey: "pac-air-eau",
    title: "Aides pour l'installation d'une pompe à chaleur",
    metaDescription:
      "MaPrimeRénov', Coup de pouce chauffage, CEE : découvrez les aides disponibles pour remplacer votre chaudière par une pompe à chaleur et vérifiez votre éligibilité gratuitement.",
    heroTagline:
      "Remplacer une chaudière au fioul, au gaz ou électrique par une pompe à chaleur performante fait partie des travaux les plus aidés en France.",
    beneficiaires:
      "Propriétaires occupants et, sous conditions, propriétaires bailleurs, pour un logement achevé depuis plus de deux ans.",
    travauxConcernes:
      "Installation d'une pompe à chaleur Air/Eau ou Eau/Eau en remplacement d'un système de chauffage existant (chaudière fioul, gaz, électrique).",
    conditionsPrincipales: [
      "Logement achevé depuis plus de 2 ans, résidence principale dans la majorité des dispositifs.",
      "Installation réalisée par un professionnel certifié RGE (Reconnu Garant de l'Environnement).",
      "Le montant de l'aide varie selon le revenu fiscal de référence du foyer.",
    ],
    montant:
      "Calculé selon votre niveau de revenu (bandes MaPrimeRénov') et pouvant se cumuler avec les Certificats d'Économies d'Énergie (CEE). Le montant précis applicable à votre situation s'affiche pendant la simulation.",
    cumul:
      "Cumulable dans la plupart des cas avec les CEE et, selon les territoires, avec des aides locales ou régionales complémentaires.",
    dateValidite:
      "Dispositif actif, conditions et montants révisés régulièrement par arrêté — à reconfirmer lors de l'étude personnalisée.",
    sourceOfficielle: [OFFICIAL_SOURCES.franceRenov, OFFICIAL_SOURCES.anah],
    derniereVerification: LAST_VERIFIED,
  },
  isolation: {
    slug: "isolation",
    travauxKey: "isolation",
    title: "Aides pour vos travaux d'isolation thermique",
    metaDescription:
      "Combles, murs, planchers : découvrez les aides disponibles (MaPrimeRénov', CEE, éco-PTZ) pour financer vos travaux d'isolation et vérifiez votre éligibilité.",
    heroTagline:
      "L'isolation reste souvent le premier levier d'économies d'énergie d'un logement, avant même de changer de mode de chauffage.",
    beneficiaires:
      "Propriétaires occupants et propriétaires bailleurs, pour un logement achevé depuis plus de deux ans.",
    travauxConcernes:
      "Isolation des combles, des rampants, des murs par l'intérieur ou l'extérieur, et des planchers bas.",
    conditionsPrincipales: [
      "Logement achevé depuis plus de 2 ans.",
      "Travaux réalisés par un professionnel certifié RGE, avec des matériaux répondant à des critères de résistance thermique minimale.",
      "Le montant de l'aide varie selon le revenu fiscal de référence du foyer et la surface isolée.",
    ],
    montant:
      "Aide calculée au m² isolé selon votre niveau de revenu, pouvant se cumuler avec les CEE. Le montant précis applicable à votre situation s'affiche pendant la simulation.",
    cumul:
      "Cumulable avec les CEE et, selon les cas, avec l'éco-prêt à taux zéro pour financer le reste à charge.",
    dateValidite:
      "Dispositif actif, conditions et montants révisés régulièrement par arrêté — à reconfirmer lors de l'étude personnalisée.",
    sourceOfficielle: [OFFICIAL_SOURCES.franceRenov, OFFICIAL_SOURCES.ademe],
    derniereVerification: LAST_VERIFIED,
  },
  solaire: {
    slug: "solaire",
    travauxKey: "photovoltaique",
    title: "Aides pour l'installation de panneaux solaires photovoltaïques",
    metaDescription:
      "TVA réduite, revente du surplus, exonération d'impôt sous conditions : découvrez les dispositifs applicables au photovoltaïque et vérifiez votre éligibilité gratuitement.",
    heroTagline:
      "Produire sa propre électricité permet de réduire durablement sa facture, avec un cadre fiscal et réglementaire spécifique au photovoltaïque.",
    beneficiaires:
      "Propriétaires occupants et propriétaires bailleurs disposant d'une toiture adaptée (orientation, surface, absence d'ombrage important).",
    travauxConcernes:
      "Installation de panneaux photovoltaïques en autoconsommation, avec ou sans revente du surplus d'électricité produite.",
    conditionsPrincipales: [
      "Installation réalisée par un professionnel certifié RGE.",
      "Puissance de l'installation déterminant le taux de TVA applicable et les démarches de raccordement.",
      "Contrat d'achat du surplus soumis aux tarifs réglementés en vigueur au moment de la mise en service.",
    ],
    montant:
      "TVA réduite selon la puissance installée, revente du surplus à un tarif réglementé, et exonération d'impôt sur le revenu possible sous conditions pour les petites installations. La prime à l'autoconsommation n'est plus attribuée aux nouveaux dossiers depuis juin 2026.",
    cumul:
      "Le cumul avec d'autres dispositifs dépend de la nature exacte du projet — étudié au cas par cas lors de la simulation.",
    dateValidite:
      "Cadre réglementaire actif ; le tarif de rachat du surplus et la fiscalité applicable évoluent par arrêté — à reconfirmer lors de l'étude personnalisée.",
    sourceOfficielle: [OFFICIAL_SOURCES.servicePublic, OFFICIAL_SOURCES.ademe],
    derniereVerification: LAST_VERIFIED,
  },
  chauffage: {
    slug: "chauffage",
    travauxKey: "pac-air-air",
    title: "Aides pour changer votre mode de chauffage",
    metaDescription:
      "Pompe à chaleur Air/Air, chaudière biomasse, raccordement à un réseau de chaleur : découvrez les aides disponibles pour votre projet de chauffage.",
    heroTagline:
      "Remplacer un chauffage énergivore par une solution plus performante est l'un des travaux les plus fréquemment soutenus par les dispositifs d'aide.",
    beneficiaires:
      "Propriétaires occupants et, sous conditions, propriétaires bailleurs, pour un logement achevé depuis plus de deux ans.",
    travauxConcernes:
      "Pompe à chaleur Air/Air (chauffage et rafraîchissement réversible), chaudière biomasse, ou raccordement à un réseau de chaleur selon votre zone.",
    conditionsPrincipales: [
      "Logement achevé depuis plus de 2 ans.",
      "Installation réalisée par un professionnel certifié RGE.",
      "Le montant de l'aide varie selon le revenu fiscal de référence du foyer et le type d'équipement choisi.",
    ],
    montant:
      "Calculé selon votre niveau de revenu et le type de solution retenue, pouvant se cumuler avec les CEE. Le montant précis applicable à votre situation s'affiche pendant la simulation.",
    cumul: "Cumulable dans la plupart des cas avec les CEE et, selon les territoires, avec des aides locales.",
    dateValidite:
      "Dispositif actif, conditions et montants révisés régulièrement par arrêté — à reconfirmer lors de l'étude personnalisée.",
    sourceOfficielle: [OFFICIAL_SOURCES.franceRenov, OFFICIAL_SOURCES.servicePublic],
    derniereVerification: LAST_VERIFIED,
  },
  "renovation-energetique": {
    slug: "renovation-energetique",
    travauxKey: "renovation-globale",
    title: "Aides pour une rénovation énergétique globale",
    metaDescription:
      "Combiner plusieurs travaux (isolation, chauffage, ventilation) pour maximiser vos aides MaPrimeRénov' : découvrez le parcours de la rénovation globale.",
    heroTagline:
      "Combiner plusieurs travaux dans le cadre d'un même parcours permet souvent d'atteindre des taux d'aide plus élevés qu'un projet isolé.",
    beneficiaires:
      "Propriétaires occupants et propriétaires bailleurs, pour un logement achevé depuis plus de deux ans, engagés dans un parcours de travaux combinés.",
    travauxConcernes:
      "Association de plusieurs postes de travaux (isolation, chauffage, ventilation) dans le cadre d'un parcours accompagné, visant un gain de performance énergétique global du logement.",
    conditionsPrincipales: [
      "Logement achevé depuis plus de 2 ans.",
      "Accompagnement par un professionnel habilité pour le volet rénovation globale (Mon Accompagnateur Rénov' ou équivalent selon le dispositif).",
      "Gain de performance énergétique minimal à atteindre, vérifié par audit avant/après travaux.",
    ],
    montant:
      "Aide calculée selon votre niveau de revenu et le gain de performance énergétique visé — généralement plus avantageuse qu'une somme des aides mono-geste. Le montant précis applicable à votre situation s'affiche pendant la simulation.",
    cumul:
      "Cumulable avec l'éco-prêt à taux zéro pour financer le reste à charge ; le cumul avec les CEE dépend du dispositif choisi.",
    dateValidite:
      "Dispositif actif, conditions et montants révisés régulièrement par arrêté — à reconfirmer lors de l'étude personnalisée.",
    sourceOfficielle: [OFFICIAL_SOURCES.franceRenov, OFFICIAL_SOURCES.anah],
    derniereVerification: LAST_VERIFIED,
  },
  "chauffe-eau": {
    slug: "chauffe-eau",
    travauxKey: "ballon-thermodynamique",
    title: "Aides pour un chauffe-eau thermodynamique",
    metaDescription:
      "MaPrimeRénov' et CEE pour remplacer votre ballon électrique par un chauffe-eau thermodynamique : découvrez les aides et vérifiez votre éligibilité.",
    heroTagline:
      "Un chauffe-eau thermodynamique produit l'eau chaude sanitaire jusqu'à trois fois moins cher qu'un ballon électrique classique.",
    beneficiaires:
      "Propriétaires occupants et, sous conditions, propriétaires bailleurs, pour un logement achevé depuis plus de deux ans.",
    travauxConcernes:
      "Remplacement d'un chauffe-eau électrique classique par un chauffe-eau thermodynamique (sur air ambiant ou air extrait).",
    conditionsPrincipales: [
      "Logement achevé depuis plus de 2 ans.",
      "Installation réalisée par un professionnel certifié RGE.",
      "Le montant de l'aide varie selon le revenu fiscal de référence du foyer.",
    ],
    montant:
      "Calculé selon votre niveau de revenu, pouvant se cumuler avec les CEE. Le montant précis applicable à votre situation s'affiche pendant la simulation.",
    cumul: "Cumulable dans la plupart des cas avec les CEE.",
    dateValidite:
      "Dispositif actif, conditions et montants révisés régulièrement par arrêté — à reconfirmer lors de l'étude personnalisée.",
    sourceOfficielle: [OFFICIAL_SOURCES.franceRenov, OFFICIAL_SOURCES.ademe],
    derniereVerification: LAST_VERIFIED,
  },
};

export const AIDES_SLUGS = Object.keys(AIDES_FICHES) as AideSlug[];

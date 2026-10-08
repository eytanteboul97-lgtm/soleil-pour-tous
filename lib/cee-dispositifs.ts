// Moteur réglementaire CEE (Certificats d'Économies d'Énergie) pour les pompes
// à chaleur — configuration versionnée, séparée de l'interface, pour pouvoir
// être mise à jour sans retoucher les pages qui l'affichent.
//
// Règle absolue : aucun montant en euros n'est inventé ici. Le volume de CEE
// (en kWh cumac) et son coefficient de bonification "Coup de pouce" ne sont
// JAMAIS présentés comme un multiplicateur direct d'un montant en euros — seul
// un obligé/délégataire CEE partenaire peut confirmer la valorisation réelle
// (son barème dépend de ses propres objectifs commerciaux, pas uniquement du
// texte réglementaire). Quand une donnée manque, on affiche "Vérification
// nécessaire" plutôt qu'un chiffre approximatif.

export type FicheCeeId = "BAR-TH-171" | "BAR-TH-172" | "BAR-TH-129";
export type TypePac = "air-eau" | "eau-eau" | "air-air";

export type FicheCee = {
  id: FicheCeeId;
  typePac: TypePac;
  title: string;
  shortLabel: string;
  description: string;
  dateEntreeVigueur: string;
  conditionsTechniques: string[];
  coupDePouce: {
    eligible: boolean | "partiel";
    note: string;
  };
  maPrimeRenov: {
    potentiellementMobilisable: boolean;
    note: string;
  };
  pointsDeVigilance: string[];
  sourceOfficielle: { label: string; url: string }[];
  derniereVerification: string;
};

const LAST_VERIFIED = "07/09/2026";

const FRANCE_RENOV_CEE = { label: "France Rénov' — Aides CEE", url: "https://france-renov.gouv.fr/aides/cee" };
const ECOLOGIE_GOUV_OSE = {
  label: "ecologie.gouv.fr — Opérations standardisées d'économies d'énergie",
  url: "https://www.ecologie.gouv.fr/politiques-publiques/operations-standardisees-deconomies-denergie",
};
const ECOLOGIE_GOUV_COUP_DE_POUCE = {
  label: "ecologie.gouv.fr — Coup de pouce Chauffage",
  url: "https://www.ecologie.gouv.fr/politiques-publiques/coup-pouce-chauffage",
};

export const FICHES_CEE_PAC: Record<FicheCeeId, FicheCee> = {
  "BAR-TH-171": {
    id: "BAR-TH-171",
    typePac: "air-eau",
    title: "BAR-TH-171 — Pompe à chaleur Air/Eau",
    shortLabel: "PAC Air/Eau",
    description:
      "Fiche d'opération standardisée couvrant l'installation d'une pompe à chaleur Air/Eau destinée au chauffage (avec ou sans production d'eau chaude sanitaire) en remplacement d'un système de chauffage existant, dans un logement résidentiel.",
    dateEntreeVigueur:
      "Fiche en vigueur, régulièrement mise à jour par arrêté — les exigences de performance (COP, SCOP) et le volume de CEE associé évoluent à chaque révision.",
    conditionsTechniques: [
      "Performance saisonnière (SCOP / étiquette énergétique) conforme au seuil en vigueur à la date de signature du devis.",
      "Installation réalisée par un professionnel certifié RGE, dans les règles de l'art (dimensionnement adapté au logement).",
      "Logement résidentiel existant, achevé depuis plus de deux ans dans la majorité des cas.",
    ],
    coupDePouce: {
      eligible: "partiel",
      note:
        "Bonification \"Coup de pouce Chauffage\" possible lorsque la PAC Air/Eau remplace une chaudière individuelle au charbon, au fioul ou au gaz — pas lorsqu'elle remplace un chauffage déjà électrique, une PAC existante ou un chauffage bois.",
    },
    maPrimeRenov: {
      potentiellementMobilisable: true,
      note: "Geste potentiellement mobilisable dans le cadre de MaPrimeRénov', selon le revenu fiscal de référence du foyer — à confirmer lors de l'étude personnalisée.",
    },
    pointsDeVigilance: [
      "Le volume de CEE (en kWh cumac) dépend de la zone climatique, de la surface chauffée et de la performance de l'équipement — jamais d'un montant fixe en euros.",
      "L'offre CEE doit être acceptée avant le démarrage des travaux : un devis signé ou des travaux déjà commencés avant l'accord de l'obligé/délégataire rendent l'opération inéligible.",
      "Le modèle de PAC installé doit figurer, lorsque l'agrément est exigé par l'obligé/délégataire concerné, parmi les modèles reconnus par celui-ci.",
    ],
    sourceOfficielle: [FRANCE_RENOV_CEE, ECOLOGIE_GOUV_OSE, ECOLOGIE_GOUV_COUP_DE_POUCE],
    derniereVerification: LAST_VERIFIED,
  },
  "BAR-TH-172": {
    id: "BAR-TH-172",
    typePac: "eau-eau",
    title: "BAR-TH-172 — Pompe à chaleur Eau/Eau ou Eau glycolée/Eau",
    shortLabel: "PAC géothermique",
    description:
      "Fiche d'opération standardisée couvrant l'installation d'une pompe à chaleur géothermique (captage sur eau de nappe ou capteurs enterrés avec fluide eau glycolée) destinée au chauffage, en remplacement d'un système de chauffage existant.",
    dateEntreeVigueur:
      "Fiche en vigueur, régulièrement mise à jour par arrêté — les exigences de performance et le volume de CEE associé évoluent à chaque révision.",
    conditionsTechniques: [
      "Performance saisonnière conforme au seuil en vigueur à la date de signature du devis.",
      "Installation réalisée par un professionnel certifié RGE, incluant le cas échéant les forages ou le réseau de capteurs enterrés dans les règles de l'art.",
      "Logement résidentiel existant, achevé depuis plus de deux ans dans la majorité des cas.",
    ],
    coupDePouce: {
      eligible: "partiel",
      note:
        "Bonification \"Coup de pouce Chauffage\" possible lorsque la PAC géothermique remplace une chaudière individuelle au charbon, au fioul ou au gaz — à vérifier au cas par cas selon le système remplacé.",
    },
    maPrimeRenov: {
      potentiellementMobilisable: true,
      note: "Geste potentiellement mobilisable dans le cadre de MaPrimeRénov', selon le revenu fiscal de référence du foyer — à confirmer lors de l'étude personnalisée.",
    },
    pointsDeVigilance: [
      "Le volume de CEE dépend des mêmes paramètres que pour une PAC Air/Eau (zone climatique, surface, performance), avec en plus le coût du captage (forage ou capteurs enterrés) à intégrer dans le calcul du reste à charge.",
      "L'offre CEE doit être acceptée avant le démarrage des travaux, y compris avant les travaux de captage.",
      "Une étude de sol ou de nappe préalable est généralement nécessaire avant de chiffrer précisément le projet.",
    ],
    sourceOfficielle: [FRANCE_RENOV_CEE, ECOLOGIE_GOUV_OSE, ECOLOGIE_GOUV_COUP_DE_POUCE],
    derniereVerification: LAST_VERIFIED,
  },
  "BAR-TH-129": {
    id: "BAR-TH-129",
    typePac: "air-air",
    title: "BAR-TH-129 — Pompe à chaleur Air/Air",
    shortLabel: "PAC Air/Air",
    description:
      "Fiche d'opération standardisée couvrant l'installation d'une pompe à chaleur Air/Air (chauffage et rafraîchissement réversible), sous réserve des conditions applicables à ce type d'équipement — distinct des PAC Air/Eau et Eau/Eau.",
    dateEntreeVigueur:
      "Fiche en vigueur, avec un périmètre d'éligibilité plus restreint que les PAC à eau — à vérifier précisément au cas par cas.",
    conditionsTechniques: [
      "Performance (SCOP/étiquette) conforme au seuil en vigueur à la date de signature du devis.",
      "Installation réalisée par un professionnel certifié RGE.",
      "Le périmètre d'éligibilité CEE classique pour l'Air/Air est plus restrictif que pour les PAC à eau — à confirmer au cas par cas selon le profil du logement et le système remplacé.",
    ],
    coupDePouce: {
      eligible: false,
      note:
        "La PAC Air/Air n'est pas présentée comme éligible automatiquement au \"Coup de pouce Chauffage\" — ce bonus cible historiquement le remplacement d'une chaudière par une PAC à eau. Une éligibilité CEE classique reste possible sous conditions, à vérifier au cas par cas.",
    },
    maPrimeRenov: {
      potentiellementMobilisable: false,
      note: "Ce geste n'est pas attribué automatiquement à la PAC Air/Air dans le cadre de MaPrimeRénov' — à confirmer précisément lors de l'étude personnalisée selon votre situation.",
    },
    pointsDeVigilance: [
      "Ne jamais présenter une PAC Air/Air comme éligible automatiquement au Coup de pouce Chauffage ni à MaPrimeRénov' par geste : ces deux dispositifs ciblent en priorité les PAC à eau.",
      "Une éligibilité CEE \"classique\" (hors bonus Coup de pouce) reste possible sous conditions — à vérifier précisément avec un partenaire habilité.",
      "Le rafraîchissement réversible n'est pas un critère valorisé par les CEE : seule la fonction chauffage est prise en compte.",
    ],
    sourceOfficielle: [FRANCE_RENOV_CEE, ECOLOGIE_GOUV_OSE],
    derniereVerification: LAST_VERIFIED,
  },
};

export const FICHES_CEE_PAC_LIST = Object.values(FICHES_CEE_PAC);

// Chaudières/systèmes dont le remplacement par une PAC à eau performante peut
// ouvrir droit à la bonification "Coup de pouce Chauffage". Un chauffage déjà
// électrique, une PAC existante ou un chauffage bois ne sont volontairement
// pas inclus : ce n'est pas un remplacement de système fossile individuel.
export const SYSTEMES_ELIGIBLES_COUP_DE_POUCE = [
  "Chaudière individuelle au charbon",
  "Chaudière individuelle au fioul",
  "Chaudière individuelle au gaz",
] as const;

export const SYSTEMES_NON_ELIGIBLES_COUP_DE_POUCE = [
  "Chauffage déjà électrique",
  "Pompe à chaleur déjà installée",
  "Chauffage au bois",
] as const;

export const COUP_DE_POUCE_CHAUFFAGE = {
  title: "Coup de pouce Chauffage",
  description:
    "Bonification du volume de CEE (en kWh cumac, pas en euros) attribuée au remplacement d'une chaudière individuelle au charbon, au fioul ou au gaz par un équipement de chauffage performant éligible — dont certaines pompes à chaleur à eau.",
  exigences: [
    "Le système remplacé doit être l'un des systèmes listés comme éligibles ci-dessus — un chauffage déjà électrique, une PAC existante ou un chauffage bois n'ouvrent pas droit à cette bonification.",
    "L'équipement installé doit respecter les exigences de performance énergétique saisonnière en vigueur au moment de la signature du devis.",
    "Lorsque l'obligé ou le délégataire CEE l'exige, le modèle de PAC installé doit figurer parmi les modèles agréés par celui-ci.",
    "L'installation doit être réalisée par un professionnel certifié RGE (Reconnu Garant de l'Environnement).",
  ],
  chronologie:
    "L'offre CEE doit impérativement être acceptée par le foyer avant le démarrage des travaux et, selon les obligés, avant la signature définitive du devis. Un chantier déjà commencé ou un devis déjà signé sans accord préalable de l'obligé/délégataire rend l'opération inéligible à la bonification — c'est l'un des points de vigilance les plus fréquents.",
  avertissementMontant:
    "Le coefficient de bonification \"Coup de pouce\" multiplie un volume de CEE exprimé en kWh cumac, pas un montant en euros. La valeur en euros de votre prime dépend du barème propre à l'obligé ou au délégataire qui la finance, lequel peut varier d'un partenaire à l'autre et dans le temps. Votre prime CEE potentielle doit être confirmée auprès d'un partenaire habilité.",
  sourceOfficielle: [ECOLOGIE_GOUV_COUP_DE_POUCE, FRANCE_RENOV_CEE],
  derniereVerification: LAST_VERIFIED,
};

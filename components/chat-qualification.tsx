"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceButtons } from "@/components/choice-buttons";
import { MultiChoiceButtons } from "@/components/multi-choice-buttons";
import { AdvisorBubble, UserBubble, TypingIndicator } from "@/components/chat-bubble";
import { LiveEstimatePanel, type LiveEstimate } from "@/components/live-estimate-panel";
import { AnalyzingSequence } from "@/components/analyzing-sequence";
import { Reveal } from "@/components/reveal";
import { computeSimulation, getIncomeBand, regionLabel } from "@/lib/simulator";
import { estimateReferenceMonthlyBill, estimateSavingsRate } from "@/lib/reference-bill";
import { getApplicableDispositifs } from "@/lib/dispositifs";
import { useAddressAutocomplete } from "@/lib/use-address-autocomplete";
import { clearProgress, loadProgress, saveProgress } from "@/lib/form-persistence";
import {
  trackLead,
  trackProjectUndecided,
  trackRgeInterest,
  trackSimulationStarted,
  trackTeaserViewed,
} from "@/lib/meta-pixel";
import {
  trackLead as trackGa4Lead,
  trackProjectUndecided as trackGa4ProjectUndecided,
  trackRgeInterest as trackGa4RgeInterest,
  trackSimulationStarted as trackGa4SimulationStarted,
  trackTeaserViewed as trackGa4TeaserViewed,
} from "@/lib/ga4";
import {
  captureAttribution,
  generateEventId,
  getFacebookCookies,
  type Attribution,
} from "@/lib/attribution";
import { cn } from "@/lib/utils";
import {
  leadFormSchema,
  type LeadFormValues,
  EMAIL_LOOKS_VALID_REGEX,
  NOMBRE_PERSONNES_LABELS,
  ORIENTATION_LABELS,
  PHONE_REGEX,
  POSTAL_CODE_REGEX,
  STATUT_LABELS,
  TYPE_CHAUFFAGE_LABELS,
  TYPE_LOGEMENT_LABELS,
  TYPE_TRAVAUX_BENEFIT_TAGLINE,
  TYPE_TRAVAUX_EMOJI,
  TYPE_TRAVAUX_LABELS,
  TYPE_TRAVAUX_VALUES,
} from "@/lib/lead-schema";

type Travaux = LeadFormValues["typeTravaux"][number];

type ScreenId =
  | "travaux"
  | "address"
  | "contact"
  | "logement"
  | "statut"
  | "chauffage"
  | "personnes"
  | "facture"
  | "toiture"
  | "revenu";

const FIELDS_BY_SCREEN: Record<ScreenId, (keyof LeadFormValues)[]> = {
  travaux: ["typeTravaux"],
  address: ["adresse", "codePostal", "ville"],
  contact: ["prenom", "telephone", "email", "consentement"],
  logement: ["typeLogement"],
  statut: ["statutOccupation"],
  chauffage: ["typeChauffage"],
  personnes: ["nombrePersonnes"],
  facture: ["factureMensuelle"],
  toiture: ["surfaceToiture", "orientationToit"],
  revenu: ["revenuFiscal"],
};

// Les coordonnées sont demandées tôt dans le parcours (juste après projet +
// ville), pas à la toute fin : sur du trafic publicitaire froid, un visiteur
// qui abandonne après avoir laissé prénom/tél/email reste contactable (lead
// partiel envoyé via /api/lead-early), au lieu de perdre tout le contact s'il
// décroche plus tard sur une question de logement/chauffage/revenu.
function assistantMessage(screen: ScreenId, v: Partial<LeadFormValues>): string {
  switch (screen) {
    case "travaux":
      return "Bonjour ! Quel est votre projet ?";
    case "address":
      return "Dans quelle commune se trouve le logement ? Cela nous permet de vérifier les aides disponibles dans votre secteur.";
    case "contact":
      return "Pour que je puisse vous transmettre vos aides personnalisées, laissez-moi vos coordonnées — ça ne prend que 10 secondes, le reste des questions arrive juste après.";
    case "logement":
      return "Et pour quel type de logement ?";
    case "statut":
      return "Êtes-vous propriétaire ou locataire de ce logement ?";
    case "chauffage":
      return v.statutOccupation === "locataire"
        ? "Parfait, votre projet se précise. Petite précision au passage : en tant que locataire, l'accord de votre propriétaire sera nécessaire avant les travaux — votre conseiller pourra vous accompagner pour en discuter avec lui. Quel type de chauffage utilisez-vous actuellement ?"
        : "Parfait, votre projet se précise. Quel type de chauffage utilisez-vous actuellement ?";
    case "personnes":
      return "Combien de personnes vivent dans le foyer ?";
    case "facture":
      return "Encore quelques questions pour identifier vos aides. Quel est le montant approximatif de votre facture d'électricité mensuelle ?";
    case "toiture":
      return "Parlons de votre toiture pour le projet photovoltaïque : quelle est sa surface approximative, et son orientation principale ?";
    case "revenu":
      return "Dernière étape avant l'analyse : quel est votre revenu fiscal de référence ? Cette information sert uniquement à vérifier votre éligibilité aux aides.";
  }
}

function userSummary(screen: ScreenId, v: Partial<LeadFormValues>): string {
  switch (screen) {
    case "travaux":
      return (v.typeTravaux ?? []).map((t) => TYPE_TRAVAUX_LABELS[t]).join(", ");
    case "address":
      return `${v.codePostal ?? ""} ${v.ville ?? ""}`.trim();
    case "contact":
      return v.prenom ? `${v.prenom} — coordonnées enregistrées ✓` : "Coordonnées enregistrées ✓";
    case "logement":
      return v.typeLogement ? TYPE_LOGEMENT_LABELS[v.typeLogement] : "";
    case "statut":
      return v.statutOccupation ? STATUT_LABELS[v.statutOccupation] : "";
    case "chauffage":
      return v.typeChauffage ? TYPE_CHAUFFAGE_LABELS[v.typeChauffage] : "";
    case "personnes":
      return v.nombrePersonnes ? NOMBRE_PERSONNES_LABELS[v.nombrePersonnes] : "";
    case "facture":
      return `${v.factureMensuelle ?? ""} € / mois`;
    case "toiture":
      return `${v.surfaceToiture ?? ""} m² · ${v.orientationToit ? ORIENTATION_LABELS[v.orientationToit] : ""}`;
    case "revenu":
      return `${v.revenuFiscal ?? ""} €`;
  }
}

const TYPING_DELAY = 550;
const RGE_SEARCH_DELAY = 1200;

function buildScreenOrder(wantsPhotovoltaique: boolean): ScreenId[] {
  const order: ScreenId[] = [
    "travaux",
    "address",
    "contact",
    "logement",
    "statut",
    "chauffage",
    "personnes",
    "facture",
  ];
  if (wantsPhotovoltaique) order.push("toiture");
  order.push("revenu");
  return order;
}

// Partagé entre l'initialisation du formulaire et restartSimulation(), pour
// ne jamais désynchroniser les deux.
const FORM_DEFAULT_VALUES: Partial<LeadFormValues> = {
  typeTravaux: [],
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  adresse: "",
  codePostal: "",
  ville: "",
  factureMensuelle: "",
  surfaceToiture: "",
  revenuFiscal: "",
  consentement: false,
};

export function ChatQualification() {
  const [completed, setCompleted] = useState<ScreenId[]>([]);
  const [currentScreen, setCurrentScreen] = useState<ScreenId | null>(null);
  const [showTyping, setShowTyping] = useState(true);
  const [phase, setPhase] = useState<"chat" | "analyzing" | "teaser" | "result">("chat");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isSubmittingEarly, setIsSubmittingEarly] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [restoredNotice, setRestoredNotice] = useState(false);
  const [rgeStep, setRgeStep] = useState<"idle" | "searching" | "done">("idle");
  const [rgeConfirmed, setRgeConfirmed] = useState(false);
  const submitSucceeded = useRef(false);
  const simulationStarted = useRef(false);
  const attributionRef = useRef<Attribution>({});
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const screenInputRef = useRef<HTMLDivElement>(null);

  // Capturée une seule fois au montage — voir lib/attribution.ts pour la
  // logique de repli sur sessionStorage si l'URL courante ne porte aucun
  // paramètre de tracking (ex. visiteur arrivé sur /pompe-a-chaleur depuis la
  // pub, puis revenu sur l'accueil pour lancer le simulateur).
  useEffect(() => {
    attributionRef.current = captureAttribution();
  }, []);

  const {
    register,
    setValue,
    watch,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onTouched",
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const values = watch();
  const wantsPhotovoltaique = (values.typeTravaux ?? []).includes("photovoltaique");
  const dispositifs = useMemo(
    () => getApplicableDispositifs(values.typeTravaux ?? []),
    [values.typeTravaux]
  );

  // Retour "champ valide" instantané, indépendant des erreurs (qui n'apparaissent
  // qu'après avoir quitté le champ) — pure réassurance positive pendant la saisie.
  const fieldValid = {
    prenom: (values.prenom ?? "").trim().length >= 2,
    email: EMAIL_LOOKS_VALID_REGEX.test(values.email ?? ""),
    telephone: PHONE_REGEX.test(values.telephone ?? ""),
    adresse: (values.adresse ?? "").trim().length >= 5,
    codePostal: POSTAL_CODE_REGEX.test(values.codePostal ?? ""),
    ville: (values.ville ?? "").trim().length >= 2,
    factureMensuelle: Number(values.factureMensuelle) > 0,
    surfaceToiture: Number(values.surfaceToiture) > 0,
    revenuFiscal: values.revenuFiscal !== "" && Number(values.revenuFiscal) >= 0,
  };

  useEffect(() => {
    function handlePreselect(e: Event) {
      const key = (e as CustomEvent<Travaux>).detail;
      const current = getValues("typeTravaux") ?? [];
      if (!current.includes(key)) {
        setValue("typeTravaux", [...current, key], { shouldValidate: true });
      }
    }
    window.addEventListener("soleil:select-travaux", handlePreselect);
    return () => window.removeEventListener("soleil:select-travaux", handlePreselect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Préselection depuis une landing page /aides/[slug] qui redirige vers
  // /?travaux=isolation#eligibilite — équivalent à handlePreselect ci-dessus,
  // mais lu depuis l'URL plutôt qu'un événement, puisqu'il s'agit ici d'une
  // vraie navigation entre pages et non d'un simple clic sur la même page.
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("travaux");
    if (!param || !(TYPE_TRAVAUX_VALUES as readonly string[]).includes(param)) return;
    const key = param as Travaux;
    const current = getValues("typeTravaux") ?? [];
    if (!current.includes(key)) {
      setValue("typeTravaux", [...current, key], { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const saved = loadProgress<LeadFormValues, ScreenId>();
    if (!saved) return;
    const order = buildScreenOrder(saved.values.typeTravaux?.includes("photovoltaique") ?? false);
    // Progression déjà terminée, vide, ou sauvegardée avant une évolution du
    // parcours (anciens écrans "identity"/"contact"/... qui n'existent plus) :
    // on repart simplement sur un formulaire neuf plutôt que de risquer un
    // état invalide ou un plantage au rendu du fil de discussion.
    const isValidScreenSet = saved.completed.every((s) => (order as string[]).includes(s));
    if (!isValidScreenSet || saved.completed.length === 0 || saved.completed.length >= order.length) {
      clearProgress();
      return;
    }
    reset(saved.values);
    setCompleted(saved.completed);
    setCurrentScreen(order[saved.completed.length]);
    setShowTyping(false);
    setRestoredNotice(true);
    simulationStarted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!restoredNotice) return;
    const timeout = setTimeout(() => setRestoredNotice(false), 4000);
    return () => clearTimeout(timeout);
  }, [restoredNotice]);

  const screenOrder = useMemo<ScreenId[]>(
    () => buildScreenOrder(wantsPhotovoltaique),
    [wantsPhotovoltaique]
  );

  useEffect(() => {
    if (!showTyping) return;
    const idx = completed.length;
    const timeout = setTimeout(() => {
      if (idx >= screenOrder.length) {
        setPhase("analyzing");
      } else {
        setCurrentScreen(screenOrder[idx]);
        setShowTyping(false);
      }
    }, TYPING_DELAY);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTyping, completed, screenOrder]);

  useEffect(() => {
    // Scroll only the transcript's own overflow container — never the page.
    // scrollIntoView on a nested marker would otherwise drag the whole
    // viewport down on mount, breaking any #anchor navigation to the page.
    const container = transcriptContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [completed, currentScreen, showTyping]);

  useEffect(() => {
    if (showTyping || !currentScreen) return;
    // Skip the very first screen: auto-focusing here would hijack whatever
    // the visitor already had focused (skip link, nav, browser chrome) a
    // few hundred milliseconds after page load, with no action of theirs to
    // justify it. From the second screen onward, the transition was
    // directly caused by the visitor's own click, so moving focus into the
    // next question is an expected continuation, not a surprise.
    if (completed.length === 0) return;
    const focusable = screenInputRef.current?.querySelector<HTMLElement>(
      "input, button, [tabindex]"
    );
    focusable?.focus({ preventScroll: true });
  }, [currentScreen, showTyping, completed.length]);

  useAddressAutocomplete(currentScreen === "address", "adresse", (result) => {
    setValue("adresse", result.adresse, { shouldValidate: true });
    if (result.codePostal) setValue("codePostal", result.codePostal, { shouldValidate: true });
    if (result.ville) setValue("ville", result.ville, { shouldValidate: true });
  });

  async function goNext(screen: ScreenId, beforeAdvance?: () => Promise<void>) {
    const valid = await trigger(FIELDS_BY_SCREEN[screen]);
    if (!valid) return;
    if (beforeAdvance) await beforeAdvance();
    if (!simulationStarted.current) {
      simulationStarted.current = true;
      trackSimulationStarted();
      trackGa4SimulationStarted();
    }
    const nextCompleted = [...completed, screen];
    setCompleted(nextCompleted);
    setCurrentScreen(null);
    setShowTyping(true);
    saveProgress<LeadFormValues, ScreenId>({ completed: nextCompleted, values: getValues() });
  }

  // Remet le parcours entièrement à zéro — nécessaire car la progression est
  // restaurée automatiquement depuis le stockage local (voir l'effet qui
  // appelle loadProgress ci-dessus) sans qu'aucune action du visiteur ne
  // l'ait demandé : sans ce bouton, impossible de recommencer une simulation
  // propre une fois une progression sauvegardée.
  function restartSimulation() {
    clearProgress();
    reset(FORM_DEFAULT_VALUES);
    setCompleted([]);
    setCurrentScreen(null);
    setShowTyping(true);
    setPhase("chat");
    setRestoredNotice(false);
    setRgeStep("idle");
    setRgeConfirmed(false);
    setSubmitError(false);
    submitSucceeded.current = false;
    simulationStarted.current = false;
  }

  function selectAndAdvance<K extends keyof LeadFormValues>(
    screen: ScreenId,
    field: K,
    value: LeadFormValues[K]
  ) {
    // react-hook-form's generic setValue overload can't resolve a generic
    // field/value pair here even though every call site is correctly typed.
    setValue(field as never, value as never, { shouldValidate: true });
    setTimeout(() => goNext(screen), 250);
  }

  function toggleTravaux(value: Travaux) {
    const current = values.typeTravaux ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("typeTravaux", next, { shouldValidate: true });
  }

  // Raccourci pour "Découvrir toutes les aides possibles" et "Je ne sais pas
  // encore" : sélectionne toutes les catégories plutôt que d'introduire une
  // valeur typeTravaux fictive qui casserait le moteur de dispositifs et le
  // typage. Le second cas est tracé séparément côté pixel pour mesurer la
  // part de trafic publicitaire sans projet précis en tête.
  function selectAllTravauxAndAdvance(undecided = false) {
    setValue("typeTravaux", [...TYPE_TRAVAUX_VALUES], { shouldValidate: true });
    if (undecided) {
      trackProjectUndecided();
      trackGa4ProjectUndecided();
    }
    setTimeout(() => goNext("travaux"), 150);
  }

  function handleAnalyzingComplete() {
    setPhase("teaser");
    trackTeaserViewed();
    trackGa4TeaserViewed();
  }

  // Déclenché dès l'écran "contact" (voir goNext), bien avant la fin du
  // parcours : envoie un lead partiel (projet + ville + coordonnées) à
  // /api/lead-early et déclenche l'événement Meta "Lead" dès ce moment-là.
  // Résilience volontaire : un souci réseau ici ne bloque jamais la suite du
  // parcours — si le visiteur va au bout, submitFinalLead ci-dessous renvoie
  // de toute façon l'intégralité des coordonnées déjà saisies.
  async function submitEarlyLead() {
    setIsSubmittingEarly(true);
    // Identifiant partagé entre le pixel navigateur et Meta Conversions API
    // (voir lib/meta-capi.ts) pour que Meta fusionne les deux en un seul
    // événement Lead au lieu d'en compter deux.
    const eventId = generateEventId();
    try {
      const res = await fetch("/api/lead-early", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...getValues(),
          ...attributionRef.current,
          ...getFacebookCookies(),
          eventId,
          pageUrl: window.location.href,
        }),
      });
      if (res.ok) {
        trackLead(eventId);
        trackGa4Lead();
      }
    } catch {
      // Silencieux — voir commentaire ci-dessus.
    } finally {
      setIsSubmittingEarly(false);
    }
  }

  // Soumission finale, déclenchée par le bouton de l'écran "teaser" une fois
  // le parcours complet terminé — envoie le profil enrichi (chauffage, foyer,
  // revenu...) en plus des coordonnées déjà transmises à l'écran "contact".
  // Ne redéclenche pas trackLead() : l'événement a déjà été envoyé plus tôt,
  // pour ne pas fausser le coût par résultat calculé par Meta.
  async function submitFinalLead() {
    setIsSubmittingLead(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...getValues(), ...attributionRef.current }),
      });
      if (!res.ok) {
        setSubmitError(true);
      } else {
        submitSucceeded.current = true;
        clearProgress();
      }
    } catch {
      setSubmitError(true);
    } finally {
      // On ne bloque jamais l'affichage du résultat pour un souci technique
      // d'envoi : la donnée a été validée côté formulaire, seul l'acheminement
      // a pu échouer — c'est le même principe que sur /api/lead lui-même.
      setIsSubmittingLead(false);
      setPhase("result");
    }
  }

  function startRgeSearch() {
    setRgeStep("searching");
    setTimeout(() => setRgeStep("done"), RGE_SEARCH_DELAY);
  }

  function confirmRgeRequest() {
    setRgeConfirmed(true);
    trackRgeInterest();
    trackGa4RgeInterest();
  }

  const estimate: LiveEstimate = useMemo(() => {
    const cp = values.codePostal;
    const hasRegion = cp && /^\d{5}$/.test(cp);
    const hasSim =
      wantsPhotovoltaique &&
      hasRegion &&
      Number(values.surfaceToiture) > 0 &&
      Number(values.factureMensuelle) > 0;

    // Le taux de prise en charge dépend du revenu fiscal, pas du type de
    // travaux — il s'affiche dès que le revenu est connu, quel que soit le
    // projet (photovoltaïque, pompe à chaleur, isolation...).
    const income = Number(values.revenuFiscal);
    const band = income > 0 ? getIncomeBand(income) : undefined;

    // Facture "avant" : celle déclarée par le client si on l'a déjà, sinon
    // une facture de référence déduite du profil du foyer (dès que logement,
    // chauffage et taille du foyer sont connus) — utile pour montrer une
    // comparaison avant même que la question de la facture soit posée.
    const declaredBill = Number(values.factureMensuelle) || undefined;
    const referenceBill =
      values.nombrePersonnes && values.typeLogement && values.typeChauffage
        ? estimateReferenceMonthlyBill(
            values.nombrePersonnes,
            values.typeLogement,
            values.typeChauffage
          )
        : undefined;
    const currentBill = declaredBill ?? referenceBill;

    let sim: ReturnType<typeof computeSimulation> | undefined;
    if (hasSim) {
      sim = computeSimulation({
        monthlyBill: Number(values.factureMensuelle) || 0,
        codePostal: cp as string,
        roofSurface: Number(values.surfaceToiture) || 0,
        taxIncome: income || 0,
        orientation: values.orientationToit,
      });
    }

    let projectedBill: number | undefined;
    if (currentBill) {
      if (sim) {
        // Photovoltaïque : on réutilise le calcul précis en kWh, avec un
        // plancher réaliste (un foyer garde toujours une conso de base).
        projectedBill = Math.max(
          currentBill - Math.round(sim.estimatedAnnualSavings / 12),
          Math.round(currentBill * 0.2)
        );
      } else {
        const rate = estimateSavingsRate(values.typeTravaux ?? []);
        if (rate > 0) projectedBill = Math.round(currentBill * (1 - rate));
      }
    }

    return {
      region: hasRegion ? regionLabel(cp as string) : undefined,
      installableKwc: sim?.installableKwc,
      eligibilityLabel: band?.eligibilityLabel,
      fundingRateLabel: band?.fundingRateLabel,
      currentBill,
      projectedBill,
    };
  }, [
    wantsPhotovoltaique,
    values.codePostal,
    values.surfaceToiture,
    values.factureMensuelle,
    values.revenuFiscal,
    values.orientationToit,
    values.nombrePersonnes,
    values.typeLogement,
    values.typeChauffage,
    values.typeTravaux,
  ]);

  const primaryTravauxLabel = values.typeTravaux?.[0]
    ? TYPE_TRAVAUX_LABELS[values.typeTravaux[0]]
    : undefined;

  return (
    <section
      id="eligibilite"
      className="anchor-offset relative overflow-hidden bg-night pb-20 pt-28 sm:pb-28 sm:pt-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-mesh-night" />
      <motion.div
        className="pointer-events-none absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-sun-radial opacity-[0.07] blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-volt-500/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(6,11,23,0.4)_70%,#F7F8FC_100%)]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        {/* Contenu au-dessus de la ligne de flottaison, visible dès le
            chargement sans scroll : jamais enveloppé dans <Reveal>, dont
            l'opacité initiale à 0 pilotée par Framer Motion retardait le LCP
            (le <h1> est l'élément LCP de la page) en attendant l'hydratation. */}
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sun-300">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Étude d&apos;éligibilité gratuite
          </span>

          {/* Accroche actuelle = angle B du brief marketing. Autres angles à
              tester en changeant uniquement ce <h1>/<p> :
              A. "Découvrez les aides disponibles pour votre logement"
              C. "Vérifiez gratuitement les aides adaptées à votre situation"
              D. "Rénovation, chauffage, isolation : quelles aides pour vous ?" */}
          <h1 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-[2.75rem]">
            Et si vous passiez à côté{" "}
            <span className="text-gradient-sun">d&apos;aides financières</span> pour votre
            logement ?
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Découvrez en 1 minute les aides qui pourraient correspondre à
            votre situation — rénovation énergétique, solaire, adaptation du
            logement. Vérification gratuite et sans engagement.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              variant="sun"
              size="lg"
              onClick={() =>
                document.getElementById("chat-card")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              Tester mon éligibilité <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              href="/trouver-un-professionnel-rge"
              className={cn(buttonVariants({ variant: "ghost-light", size: "lg" }), "border border-white/15")}
            >
              Trouver un professionnel RGE <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {["Gratuit", "Rapide", "Sans engagement"].map((label) => (
              <li key={label} className="flex items-center gap-1.5 text-sm text-white/60">
                <Check className="h-3.5 w-3.5 text-leaf-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <div id="chat-card" className="mt-8 min-h-[480px] scroll-mt-28 rounded-3xl bg-white p-5 shadow-card sm:p-7">
            <AnimatePresence mode="wait">
              {phase === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnimatePresence>
                    {restoredNotice && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between gap-2 overflow-hidden rounded-xl bg-leaf-500/10 px-3 py-2 text-xs font-medium text-leaf-600"
                      >
                        <span className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          Nous avons retrouvé votre progression, reprenons où vous en étiez.
                        </span>
                        <button
                          type="button"
                          onClick={restartSimulation}
                          className="focus-ring-light shrink-0 rounded-sm font-semibold underline hover:no-underline"
                        >
                          Recommencer
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mb-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-mist">
                      <span>Votre simulation</span>
                      <span className="flex items-center gap-2">
                        {completed.length > 0 && (
                          <button
                            type="button"
                            onClick={restartSimulation}
                            className="focus-ring-light rounded-sm text-mist underline hover:text-ink-soft hover:no-underline"
                          >
                            Recommencer
                          </button>
                        )}
                        {Math.round((completed.length / screenOrder.length) * 100)} %
                      </span>
                    </div>
                    <div className="relative h-1.5 w-full rounded-full bg-line">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sun-400 to-sun-600"
                        animate={{ width: `${(completed.length / screenOrder.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.div
                        className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-sun-600 shadow-card-sm"
                        animate={{
                          left: `${(completed.length / screenOrder.length) * 100}%`,
                          marginLeft: -7,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  <div
                    ref={transcriptContainerRef}
                    className="max-h-[420px] space-y-4 overflow-y-auto py-2 pr-1"
                  >
                    {completed.map((screen) => (
                      <div key={screen} className="space-y-3">
                        <AdvisorBubble>{assistantMessage(screen, values)}</AdvisorBubble>
                        <UserBubble>{userSummary(screen, values)}</UserBubble>
                      </div>
                    ))}

                    {!showTyping && currentScreen && (
                      <AdvisorBubble>{assistantMessage(currentScreen, values)}</AdvisorBubble>
                    )}

                    {showTyping && <TypingIndicator />}
                  </div>

                  {!showTyping && currentScreen && (
                    <div ref={screenInputRef} className="mt-4 border-t border-line pt-5">
                      {currentScreen === "travaux" && (
                        <div className="space-y-4">
                          <p className="text-xs text-mist">
                            Vous pouvez sélectionner plusieurs projets.
                          </p>
                          <MultiChoiceButtons
                            options={TYPE_TRAVAUX_VALUES.map((v) => ({
                              value: v,
                              label: TYPE_TRAVAUX_LABELS[v],
                              sublabel: TYPE_TRAVAUX_BENEFIT_TAGLINE[v],
                              emoji: TYPE_TRAVAUX_EMOJI[v],
                            }))}
                            values={values.typeTravaux ?? []}
                            onToggle={toggleTravaux}
                          />

                          <div className="grid grid-cols-1 gap-2 border-t border-line pt-3 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() => selectAllTravauxAndAdvance()}
                              className="focus-ring-light rounded-xl border border-dashed border-line px-3 py-2.5 text-left text-xs font-semibold text-ink-soft transition-colors hover:border-sun-300 hover:bg-sun-50/50"
                            >
                              🔍 Découvrir toutes les aides possibles
                            </button>
                            <button
                              type="button"
                              onClick={() => selectAllTravauxAndAdvance(true)}
                              className="focus-ring-light rounded-xl border border-dashed border-line px-3 py-2.5 text-left text-xs font-semibold text-ink-soft transition-colors hover:border-sun-300 hover:bg-sun-50/50"
                            >
                              🤔 Je ne sais pas encore
                            </button>
                          </div>

                          <Button
                            className="mt-1 w-full"
                            disabled={(values.typeTravaux ?? []).length === 0}
                            onClick={() => goNext("travaux")}
                          >
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "logement" && (
                        <ChoiceButtons
                          options={[
                            { value: "maison", label: "Maison", emoji: "🏡" },
                            { value: "appartement", label: "Appartement", emoji: "🏢" },
                            { value: "autre", label: "Autre", emoji: "🏘️" },
                          ]}
                          value={values.typeLogement}
                          onSelect={(v) => selectAndAdvance("logement", "typeLogement", v)}
                        />
                      )}

                      {currentScreen === "statut" && (
                        <ChoiceButtons
                          options={[
                            { value: "proprietaire", label: "Propriétaire occupant" },
                            { value: "proprietaire-bailleur", label: "Propriétaire bailleur" },
                            { value: "locataire", label: "Locataire" },
                            { value: "autre", label: "Autre situation" },
                          ]}
                          value={values.statutOccupation}
                          onSelect={(v) => selectAndAdvance("statut", "statutOccupation", v)}
                        />
                      )}

                      {currentScreen === "chauffage" && (
                        <ChoiceButtons
                          options={[
                            { value: "electrique", label: "Électrique" },
                            { value: "gaz", label: "Gaz" },
                            { value: "fioul", label: "Fioul" },
                            { value: "charbon", label: "Charbon" },
                            { value: "bois", label: "Bois" },
                            { value: "pac", label: "Pompe à chaleur" },
                            { value: "autre", label: "Autre" },
                          ]}
                          value={values.typeChauffage}
                          onSelect={(v) => selectAndAdvance("chauffage", "typeChauffage", v)}
                        />
                      )}

                      {currentScreen === "address" && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <Label htmlFor="adresse">Adresse</Label>
                            <Input
                              id="adresse"
                              autoComplete="off"
                              placeholder="Commencez à taper votre adresse…"
                              error={!!errors.adresse}
                              valid={fieldValid.adresse}
                              {...register("adresse")}
                            />
                          </div>
                          <div>
                            <Label htmlFor="codePostal">Code postal</Label>
                            <Input
                              id="codePostal"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              error={!!errors.codePostal}
                              valid={fieldValid.codePostal}
                              {...register("codePostal")}
                            />
                          </div>
                          <div>
                            <Label htmlFor="ville">Ville</Label>
                            <Input
                              id="ville"
                              autoComplete="address-level2"
                              error={!!errors.ville}
                              valid={fieldValid.ville}
                              {...register("ville")}
                            />
                          </div>
                          <Button className="sm:col-span-2 mt-1" onClick={() => goNext("address")}>
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "contact" && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="contact-prenom">Prénom</Label>
                            <Input
                              id="contact-prenom"
                              autoComplete="given-name"
                              error={!!errors.prenom}
                              valid={fieldValid.prenom}
                              {...register("prenom")}
                            />
                          </div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <Label htmlFor="contact-telephone">Téléphone</Label>
                              <Input
                                id="contact-telephone"
                                type="tel"
                                autoComplete="tel"
                                inputMode="tel"
                                placeholder="06 12 34 56 78"
                                error={!!errors.telephone}
                                valid={fieldValid.telephone}
                                {...register("telephone")}
                              />
                            </div>
                            <div>
                              <Label htmlFor="contact-email">Email</Label>
                              <Input
                                id="contact-email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                error={!!errors.email}
                                valid={fieldValid.email}
                                {...register("email")}
                              />
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5 rounded-xl bg-paper p-3">
                            <Checkbox
                              id="contact-consentement"
                              checked={values.consentement === true}
                              onCheckedChange={(v) =>
                                setValue("consentement", v === true, { shouldValidate: true })
                              }
                              error={!!errors.consentement}
                              className="mt-0.5"
                            />
                            <label htmlFor="contact-consentement" className="text-xs leading-relaxed text-ink-soft">
                              J&apos;accepte d&apos;être recontacté(e) par Soleil
                              Pour Tous au sujet de ma demande d&apos;étude gratuite.
                            </label>
                          </div>
                          <Button
                            className="mt-1 w-full"
                            disabled={isSubmittingEarly}
                            onClick={() => goNext("contact", submitEarlyLead)}
                          >
                            {isSubmittingEarly ? "Un instant…" : "Continuer"}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "personnes" && (
                        <ChoiceButtons
                          options={[
                            { value: "1-2", label: "1 à 2 personnes" },
                            { value: "3-4", label: "3 à 4 personnes" },
                            { value: "5+", label: "5 personnes ou plus" },
                          ]}
                          value={values.nombrePersonnes}
                          onSelect={(v) => selectAndAdvance("personnes", "nombrePersonnes", v)}
                        />
                      )}

                      {currentScreen === "facture" && (
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <Label htmlFor="factureMensuelle">Facture mensuelle (€)</Label>
                            <Input
                              id="factureMensuelle"
                              type="number"
                              inputMode="decimal"
                              error={!!errors.factureMensuelle}
                              valid={fieldValid.factureMensuelle}
                              {...register("factureMensuelle")}
                            />
                          </div>
                          <Button className="mt-1" onClick={() => goNext("facture")}>
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "toiture" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="surfaceToiture">Surface de toiture (m²)</Label>
                            <Input
                              id="surfaceToiture"
                              type="number"
                              inputMode="decimal"
                              error={!!errors.surfaceToiture}
                              valid={fieldValid.surfaceToiture}
                              {...register("surfaceToiture")}
                            />
                          </div>
                          <div>
                            <Label>Orientation principale</Label>
                            <ChoiceButtons
                              options={[
                                { value: "sud", label: "Plein sud" },
                                { value: "est-ouest", label: "Est / Ouest" },
                                { value: "nord", label: "Nord" },
                                { value: "inconnue", label: "Je ne sais pas" },
                              ]}
                              value={values.orientationToit}
                              onSelect={(v) => setValue("orientationToit", v, { shouldValidate: true })}
                            />
                          </div>
                          <Button
                            className="mt-1"
                            disabled={!values.surfaceToiture || !values.orientationToit}
                            onClick={() => goNext("toiture")}
                          >
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "revenu" && (
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <Label htmlFor="revenuFiscal">Revenu fiscal de référence (€)</Label>
                            <Input
                              id="revenuFiscal"
                              type="number"
                              inputMode="decimal"
                              error={!!errors.revenuFiscal}
                              valid={fieldValid.revenuFiscal}
                              {...register("revenuFiscal")}
                            />
                          </div>
                          <Button className="mt-1" onClick={() => goNext("revenu")}>
                            Lancer l&apos;analyse <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {phase === "analyzing" && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AnalyzingSequence onComplete={handleAnalyzingComplete} />
                </motion.div>
              )}

              {phase === "teaser" && (
                <motion.div
                  key="teaser"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl bg-white p-6 sm:p-8"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-600">
                    <Sparkles className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-center font-display text-2xl font-bold text-ink">
                    Bonne nouvelle !
                  </h3>
                  <p className="mt-2 text-center text-sm text-ink-soft">
                    Nous avons identifié {dispositifs.length} dispositif
                    {dispositifs.length > 1 ? "s" : ""} susceptible
                    {dispositifs.length > 1 ? "s" : ""} de correspondre à votre
                    projet{estimate.region ? ` à ${estimate.region}` : ""}.
                  </p>

                  <ul className="mt-5 space-y-2">
                    {dispositifs.map((d) => (
                      <li key={d.label} className="flex items-center gap-2 text-sm font-medium text-ink">
                        <Check className="h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
                        {d.label}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 rounded-2xl bg-sun-50 p-4 text-center">
                    <p className="text-sm font-semibold text-sun-800">
                      Votre estimation personnalisée est prête.
                    </p>
                    <p className="mt-1 text-xs text-sun-700">
                      Recevez le détail des aides identifiées, les prochaines
                      étapes et les solutions adaptées à votre projet.
                    </p>
                  </div>

                  <Button
                    className="mt-6 w-full"
                    disabled={isSubmittingLead}
                    onClick={submitFinalLead}
                  >
                    {isSubmittingLead ? "Un instant…" : "Voir mon résultat complet"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-center text-xs text-mist">
                    <span className="inline-flex items-center gap-1">
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      Sécurisées
                    </span>
                    <span>Gratuit</span>
                    <span>Sans engagement</span>
                    <span>Aucune obligation de réaliser les travaux</span>
                  </div>
                </motion.div>
              )}

              {phase === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl bg-white p-6 text-center sm:p-8"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-600">
                    <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-ink">
                    Bonne nouvelle{values.prenom ? `, ${values.prenom}` : ""}.
                  </h3>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {values.typeLogement && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft">
                        {TYPE_LOGEMENT_LABELS[values.typeLogement]}
                      </span>
                    )}
                    {(values.ville || estimate.region) && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        {values.ville || estimate.region}
                      </span>
                    )}
                    {primaryTravauxLabel && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft">
                        {values.typeTravaux?.[0] ? TYPE_TRAVAUX_EMOJI[values.typeTravaux[0]] : ""}
                        {primaryTravauxLabel}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 rounded-2xl bg-paper p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-mist">
                      Résultat de votre analyse
                    </p>
                    <p className="mt-1 font-display text-3xl font-bold text-ink">
                      {dispositifs.length} aide{dispositifs.length > 1 ? "s" : ""} potentielle
                      {dispositifs.length > 1 ? "s" : ""}
                    </p>
                    {estimate.fundingRateLabel && (
                      <p className="mt-1 text-sm text-mist">{estimate.fundingRateLabel}</p>
                    )}
                  </div>

                  <ul className="mt-5 space-y-2 text-left">
                    {dispositifs.map((d) => (
                      <li key={d.label} className="flex items-center gap-2 text-sm font-medium text-ink">
                        <Check className="h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
                        {d.label}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-xs text-mist">
                    Estimation indicative sous réserve de validation de votre
                    dossier. Un conseiller Soleil Pour Tous vous recontacte pour
                    confirmer votre éligibilité.
                  </p>

                  {submitError && (
                    <p className="mt-4 text-sm font-medium text-red-500">
                      Votre estimation a bien été calculée, mais l&apos;envoi de votre
                      dossier a rencontré un souci technique — un conseiller peut ne pas
                      recevoir votre demande automatiquement. Vous pouvez nous
                      recontacter directement pour confirmer.
                    </p>
                  )}

                  <div className="mt-8 border-t border-line pt-6">
                    {rgeStep === "idle" && (
                      <>
                        <p className="font-display text-base font-semibold text-ink">
                          Passez à l&apos;étape suivante
                        </p>
                        <p className="mt-1 text-sm text-mist">
                          Trouvez un installateur partenaire certifié RGE
                          {primaryTravauxLabel ? ` pour votre projet de ${primaryTravauxLabel.toLowerCase()}` : ""}
                          {values.ville ? ` à ${values.ville}` : ""}.
                        </p>
                        <Button className="mt-4 w-full" onClick={startRgeSearch}>
                          Trouver un professionnel <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </>
                    )}

                    {rgeStep === "searching" && (
                      <div className="flex flex-col items-center gap-3 py-2">
                        <Loader2 className="h-6 w-6 animate-spin text-sun-600" aria-hidden="true" />
                        <p className="text-sm text-mist">Recherche dans votre secteur…</p>
                      </div>
                    )}

                    {rgeStep === "done" && (
                      <div>
                        <p className="text-sm text-ink-soft">
                          Un conseiller Soleil Pour Tous vous met en relation
                          avec un installateur partenaire certifié RGE adapté à
                          votre projet{values.ville ? ` à ${values.ville}` : ""}.
                        </p>
                        <ul className="mx-auto mt-3 max-w-xs space-y-1.5 text-left text-sm text-ink-soft">
                          <li className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
                            Travaux correspondant à votre projet
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
                            Qualification RGE vérifiée
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
                            Devis sans engagement
                          </li>
                        </ul>
                        <Button
                          className="mt-4 w-full"
                          disabled={rgeConfirmed}
                          onClick={confirmRgeRequest}
                        >
                          {rgeConfirmed ? (
                            <>
                              <Check className="h-4 w-4" aria-hidden="true" />
                              Demande enregistrée
                            </>
                          ) : (
                            "Demander une mise en relation"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase === "chat" && (
              <p className="mt-6 flex items-center justify-center gap-2 text-xs text-mist">
                <ShieldCheck className="h-4 w-4 text-leaf-600" aria-hidden="true" />
                Gratuit, rapide, sans engagement — aides accordées selon éligibilité.
              </p>
            )}
          </div>
        </div>

        <Reveal delay={0.1} className="lg:sticky lg:top-24">
          <LiveEstimatePanel
            estimate={estimate}
            showSolarMetrics={wantsPhotovoltaique}
            civilite={values.civilite}
            nombrePersonnes={values.nombrePersonnes}
            typeLogement={values.typeLogement}
            statutOccupation={values.statutOccupation}
            typeTravaux={values.typeTravaux}
          />
        </Reveal>
      </div>
    </section>
  );
}

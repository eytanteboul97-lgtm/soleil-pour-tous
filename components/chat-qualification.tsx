"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useAddressAutocomplete } from "@/lib/use-address-autocomplete";
import {
  leadFormSchema,
  type LeadFormValues,
  CIVILITE_LABELS,
  DISPONIBILITE_LABELS,
  NOMBRE_PERSONNES_LABELS,
  ORIENTATION_LABELS,
  STATUT_LABELS,
  TYPE_CHAUFFAGE_LABELS,
  TYPE_LOGEMENT_LABELS,
  TYPE_TRAVAUX_LABELS,
  TYPE_TRAVAUX_VALUES,
} from "@/lib/lead-schema";

type ScreenId =
  | "travaux"
  | "identity"
  | "contact"
  | "address"
  | "statut"
  | "logement"
  | "personnes"
  | "facture"
  | "chauffage"
  | "toiture"
  | "revenu"
  | "disponibilite"
  | "consent";

const FIELDS_BY_SCREEN: Record<ScreenId, (keyof LeadFormValues)[]> = {
  travaux: ["typeTravaux"],
  identity: ["prenom", "nom"],
  contact: ["email", "telephone"],
  address: ["adresse", "codePostal", "ville"],
  statut: ["statutOccupation"],
  logement: ["typeLogement"],
  personnes: ["nombrePersonnes"],
  facture: ["factureMensuelle"],
  chauffage: ["typeChauffage"],
  toiture: ["surfaceToiture", "orientationToit"],
  revenu: ["revenuFiscal"],
  disponibilite: ["disponibiliteRappel"],
  consent: ["consentement"],
};

function assistantMessage(screen: ScreenId, v: Partial<LeadFormValues>): string {
  switch (screen) {
    case "travaux":
      return "Bonjour, je suis ravi de vous accompagner. Sur quel(s) type(s) de travaux souhaitez-vous être conseillé(e) ?";
    case "identity":
      return "Parfait. Pour préparer votre dossier, comment vous appelez-vous ?";
    case "contact":
      return `Merci${v.prenom ? " " + v.prenom : ""}. Sur quelle adresse email et quel numéro de téléphone puis-je vous recontacter ?`;
    case "address":
      return "Quelle est l'adresse du logement concerné par les travaux ?";
    case "statut":
      return "Êtes-vous propriétaire ou locataire de ce logement ?";
    case "logement":
      return "Et de quel type de logement s'agit-il ?";
    case "personnes":
      return "Combien de personnes vivent dans le foyer ? Cela m'aide à mieux estimer votre consommation.";
    case "facture":
      return "Quel est le montant approximatif de votre facture d'électricité mensuelle ?";
    case "chauffage":
      return "Quel type de chauffage utilisez-vous actuellement ?";
    case "toiture":
      return "Parlons de votre toiture pour le projet photovoltaïque : quelle est sa surface approximative, et son orientation principale ?";
    case "revenu":
      return "Quel est votre revenu fiscal de référence ? Cette information sert uniquement à vérifier votre éligibilité aux aides.";
    case "disponibilite":
      return "Dernière question : quelle est votre disponibilité pour être rappelé(e) par un conseiller ?";
    case "consent":
      return "Parfait, j'ai tout ce qu'il me faut pour préparer votre estimation. Une dernière chose avant de lancer l'analyse :";
  }
}

function userSummary(screen: ScreenId, v: Partial<LeadFormValues>): string {
  switch (screen) {
    case "travaux":
      return (v.typeTravaux ?? []).map((t) => TYPE_TRAVAUX_LABELS[t]).join(", ");
    case "identity": {
      const title = v.civilite ? `${CIVILITE_LABELS[v.civilite]} ` : "";
      return `${title}${v.prenom ?? ""} ${v.nom ?? ""}`.trim();
    }
    case "contact":
      return `${v.email ?? ""} · ${v.telephone ?? ""}`;
    case "address":
      return `${v.adresse ?? ""}, ${v.codePostal ?? ""} ${v.ville ?? ""}`;
    case "statut":
      return v.statutOccupation ? STATUT_LABELS[v.statutOccupation] : "";
    case "logement":
      return v.typeLogement ? TYPE_LOGEMENT_LABELS[v.typeLogement] : "";
    case "personnes":
      return v.nombrePersonnes ? NOMBRE_PERSONNES_LABELS[v.nombrePersonnes] : "";
    case "facture":
      return `${v.factureMensuelle ?? ""} € / mois`;
    case "chauffage":
      return v.typeChauffage ? TYPE_CHAUFFAGE_LABELS[v.typeChauffage] : "";
    case "toiture":
      return `${v.surfaceToiture ?? ""} m² · ${v.orientationToit ? ORIENTATION_LABELS[v.orientationToit] : ""}`;
    case "revenu":
      return `${v.revenuFiscal ?? ""} €`;
    case "disponibilite":
      return v.disponibiliteRappel ? DISPONIBILITE_LABELS[v.disponibiliteRappel] : "";
    case "consent":
      return "J'accepte d'être recontacté(e)";
  }
}

const TYPING_DELAY = 550;

export function ChatQualification() {
  const [completed, setCompleted] = useState<ScreenId[]>([]);
  const [currentScreen, setCurrentScreen] = useState<ScreenId | null>(null);
  const [showTyping, setShowTyping] = useState(true);
  const [phase, setPhase] = useState<"chat" | "analyzing" | "result">("chat");
  const [submitError, setSubmitError] = useState(false);
  const pendingSubmit = useRef<Promise<void> | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const screenInputRef = useRef<HTMLDivElement>(null);

  const {
    register,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onTouched",
    defaultValues: {
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
    },
  });

  const values = watch();
  const wantsPhotovoltaique = (values.typeTravaux ?? []).includes("photovoltaique");

  useEffect(() => {
    function handlePreselect(e: Event) {
      const key = (e as CustomEvent<LeadFormValues["typeTravaux"][number]>).detail;
      const current = getValues("typeTravaux") ?? [];
      if (!current.includes(key)) {
        setValue("typeTravaux", [...current, key], { shouldValidate: true });
      }
    }
    window.addEventListener("soleil:select-travaux", handlePreselect);
    return () => window.removeEventListener("soleil:select-travaux", handlePreselect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screenOrder = useMemo<ScreenId[]>(() => {
    const order: ScreenId[] = [
      "travaux",
      "identity",
      "contact",
      "address",
      "statut",
      "logement",
      "personnes",
      "chauffage",
      "facture",
    ];
    if (wantsPhotovoltaique) order.push("toiture");
    order.push("revenu", "disponibilite", "consent");
    return order;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsPhotovoltaique]);

  useEffect(() => {
    if (!showTyping) return;
    const idx = completed.length;
    const timeout = setTimeout(() => {
      if (idx >= screenOrder.length) {
        setPhase("analyzing");
        const finalValues = getValues();
        pendingSubmit.current = (async () => {
          try {
            const res = await fetch("/api/lead", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(finalValues),
            });
            if (!res.ok) setSubmitError(true);
          } catch {
            setSubmitError(true);
          }
        })();
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

  async function goNext(screen: ScreenId) {
    const valid = await trigger(FIELDS_BY_SCREEN[screen]);
    if (!valid) return;
    setCompleted((c) => [...c, screen]);
    setCurrentScreen(null);
    setShowTyping(true);
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

  function toggleTravaux(value: LeadFormValues["typeTravaux"][number]) {
    const current = values.typeTravaux ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("typeTravaux", next, { shouldValidate: true });
  }

  async function handleAnalyzingComplete() {
    if (pendingSubmit.current) await pendingSubmit.current;
    setPhase("result");
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
        <Reveal>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sun-300">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Étude d&apos;éligibilité gratuite
          </span>

          <h1 className="font-display text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-[2.75rem]">
            Passez au solaire et{" "}
            <span className="text-gradient-sun">réduisez vos factures</span>{" "}
            d&apos;électricité
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Discutez avec votre conseiller travaux et découvrez en 2 minutes
            votre éligibilité aux aides disponibles.
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {["Gratuit", "2 minutes", "Sans engagement", "Analyse personnalisée"].map((label) => (
              <li key={label} className="flex items-center gap-1.5 text-sm text-white/60">
                <Check className="h-3.5 w-3.5 text-leaf-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8 min-h-[480px] rounded-3xl bg-white p-5 shadow-card sm:p-7">
            <AnimatePresence mode="wait">
              {phase === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-mist">
                      <span>
                        Question {Math.min(completed.length + 1, screenOrder.length)} sur{" "}
                        {screenOrder.length}
                      </span>
                      <span>{Math.round((completed.length / screenOrder.length) * 100)} %</span>
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
                          <MultiChoiceButtons
                            options={TYPE_TRAVAUX_VALUES.map((v) => ({
                              value: v,
                              label: TYPE_TRAVAUX_LABELS[v],
                            }))}
                            values={values.typeTravaux ?? []}
                            onToggle={toggleTravaux}
                          />
                          <Button
                            className="mt-1 w-full"
                            disabled={(values.typeTravaux ?? []).length === 0}
                            onClick={() => goNext("travaux")}
                          >
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "identity" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="prenom">Prénom</Label>
                              <Input
                                id="prenom"
                                autoComplete="given-name"
                                error={!!errors.prenom}
                                {...register("prenom")}
                              />
                            </div>
                            <div>
                              <Label htmlFor="nom">Nom</Label>
                              <Input
                                id="nom"
                                autoComplete="family-name"
                                error={!!errors.nom}
                                {...register("nom")}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Civilité (facultatif)</Label>
                            <ChoiceButtons
                              options={[
                                { value: "madame", label: "Madame" },
                                { value: "monsieur", label: "Monsieur" },
                              ]}
                              value={values.civilite}
                              onSelect={(v) => setValue("civilite", v, { shouldValidate: true })}
                            />
                          </div>
                          <Button className="w-full" onClick={() => goNext("identity")}>
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "contact" && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              autoComplete="email"
                              inputMode="email"
                              error={!!errors.email}
                              {...register("email")}
                            />
                          </div>
                          <div>
                            <Label htmlFor="telephone">Téléphone</Label>
                            <Input
                              id="telephone"
                              type="tel"
                              autoComplete="tel"
                              inputMode="tel"
                              placeholder="06 12 34 56 78"
                              error={!!errors.telephone}
                              {...register("telephone")}
                            />
                          </div>
                          <Button className="sm:col-span-2 mt-1" onClick={() => goNext("contact")}>
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
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
                              {...register("codePostal")}
                            />
                          </div>
                          <div>
                            <Label htmlFor="ville">Ville</Label>
                            <Input
                              id="ville"
                              autoComplete="address-level2"
                              error={!!errors.ville}
                              {...register("ville")}
                            />
                          </div>
                          <Button className="sm:col-span-2 mt-1" onClick={() => goNext("address")}>
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "statut" && (
                        <ChoiceButtons
                          options={[
                            { value: "proprietaire", label: "Propriétaire" },
                            { value: "locataire", label: "Locataire" },
                          ]}
                          value={values.statutOccupation}
                          onSelect={(v) => selectAndAdvance("statut", "statutOccupation", v)}
                        />
                      )}

                      {currentScreen === "logement" && (
                        <ChoiceButtons
                          options={[
                            { value: "maison", label: "Maison" },
                            { value: "appartement", label: "Appartement" },
                            { value: "autre", label: "Autre" },
                          ]}
                          value={values.typeLogement}
                          onSelect={(v) => selectAndAdvance("logement", "typeLogement", v)}
                        />
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
                              {...register("factureMensuelle")}
                            />
                          </div>
                          <Button className="mt-1" onClick={() => goNext("facture")}>
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "chauffage" && (
                        <ChoiceButtons
                          options={[
                            { value: "electrique", label: "Électrique" },
                            { value: "gaz", label: "Gaz" },
                            { value: "fioul", label: "Fioul" },
                            { value: "autre", label: "Autre" },
                          ]}
                          value={values.typeChauffage}
                          onSelect={(v) => selectAndAdvance("chauffage", "typeChauffage", v)}
                        />
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
                              {...register("revenuFiscal")}
                            />
                          </div>
                          <Button className="mt-1" onClick={() => goNext("revenu")}>
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "disponibilite" && (
                        <ChoiceButtons
                          options={[
                            { value: "matin", label: "Le matin" },
                            { value: "apres-midi", label: "L'après-midi" },
                            { value: "soir", label: "Le soir" },
                            { value: "peu-importe", label: "Peu importe" },
                          ]}
                          value={values.disponibiliteRappel}
                          onSelect={(v) => selectAndAdvance("disponibilite", "disponibiliteRappel", v)}
                        />
                      )}

                      {currentScreen === "consent" && (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 rounded-2xl bg-paper p-4">
                            <Checkbox
                              id="consentement"
                              checked={values.consentement === true}
                              onCheckedChange={(v) =>
                                setValue("consentement", v === true, { shouldValidate: true })
                              }
                              error={!!errors.consentement}
                              className="mt-0.5"
                            />
                            <label htmlFor="consentement" className="text-sm leading-relaxed text-ink-soft">
                              J&apos;accepte d&apos;être recontacté(e) par Soleil Pour Tous dans le
                              cadre de ma demande d&apos;étude gratuite pour mes travaux de
                              rénovation énergétique.
                            </label>
                          </div>
                          <Button className="w-full" onClick={() => goNext("consent")}>
                            Lancer mon analyse <ArrowRight className="h-4 w-4" aria-hidden="true" />
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

              {phase === "result" && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl bg-white p-8 text-center"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-600">
                    <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-bold text-ink">
                    Bonne nouvelle{values.prenom ? `, ${values.prenom}` : ""}.
                  </h3>
                  <p className="mt-3 text-ink-soft">
                    Votre foyer semble éligible à plusieurs dispositifs de soutien
                    {estimate.fundingRateLabel
                      ? `, avec une prise en charge estimée ${estimate.fundingRateLabel.toLowerCase()} selon le barème MaPrimeRénov' 2026`
                      : ""}
                    . Un conseiller Soleil Pour Tous vérifiera tout cela avec vous et
                    vous recontactera {values.disponibiliteRappel ? DISPONIBILITE_LABELS[values.disponibiliteRappel].toLowerCase() : "rapidement"} pour confirmer votre éligibilité.
                  </p>
                  {submitError && (
                    <p className="mt-4 text-sm font-medium text-red-500">
                      Votre estimation a bien été calculée, mais l&apos;envoi de votre
                      dossier a rencontré un souci technique — un conseiller peut ne pas
                      recevoir votre demande automatiquement. Vous pouvez nous
                      recontacter directement pour confirmer.
                    </p>
                  )}
                  <p className="mt-4 text-xs text-mist">
                    Aucune aide n&apos;est garantie avant validation complète de votre dossier.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-mist">
              <ShieldCheck className="h-4 w-4 text-leaf-600" aria-hidden="true" />
              Gratuit, rapide, sans engagement — aides accordées selon éligibilité.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:sticky lg:top-24">
          <LiveEstimatePanel
            estimate={estimate}
            showSolarMetrics={wantsPhotovoltaique}
            civilite={values.civilite}
            nombrePersonnes={values.nombrePersonnes}
          />
        </Reveal>
      </div>
    </section>
  );
}

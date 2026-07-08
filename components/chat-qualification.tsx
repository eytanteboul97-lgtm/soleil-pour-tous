"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceButtons } from "@/components/choice-buttons";
import { AdvisorBubble, UserBubble, TypingIndicator } from "@/components/chat-bubble";
import { LiveEstimatePanel, type LiveEstimate } from "@/components/live-estimate-panel";
import { AnalyzingSequence } from "@/components/analyzing-sequence";
import { Reveal } from "@/components/reveal";
import { computeSimulation, regionLabel } from "@/lib/simulator";
import {
  leadFormSchema,
  type LeadFormValues,
  NOMBRE_PERSONNES_LABELS,
  ORIENTATION_LABELS,
  STATUT_LABELS,
  TYPE_CHAUFFAGE_LABELS,
  TYPE_LOGEMENT_LABELS,
} from "@/lib/lead-schema";

type ScreenId =
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
  | "consent";

const SCREEN_ORDER: ScreenId[] = [
  "identity",
  "contact",
  "address",
  "statut",
  "logement",
  "personnes",
  "facture",
  "chauffage",
  "toiture",
  "revenu",
  "consent",
];

const FIELDS_BY_SCREEN: Record<ScreenId, (keyof LeadFormValues)[]> = {
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
  consent: ["consentement"],
};

function assistantMessage(screen: ScreenId, v: Partial<LeadFormValues>): string {
  switch (screen) {
    case "identity":
      return "Bonjour, je suis ravi de vous accompagner dans votre projet solaire. Pour commencer, comment vous appelez-vous ?";
    case "contact":
      return `Merci${v.prenom ? " " + v.prenom : ""}. Sur quelle adresse email et quel numéro de téléphone puis-je vous recontacter ?`;
    case "address":
      return "Quelle est l'adresse du logement à équiper ?";
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
      return "Parlons de votre toiture : quelle est sa surface approximative, et son orientation principale ?";
    case "revenu":
      return "Dernière question technique : quel est votre revenu fiscal de référence ? Cette information sert uniquement à vérifier votre éligibilité aux aides.";
    case "consent":
      return "Parfait, j'ai tout ce qu'il me faut pour préparer votre estimation. Une dernière chose avant de lancer l'analyse :";
  }
}

function userSummary(screen: ScreenId, v: Partial<LeadFormValues>): string {
  switch (screen) {
    case "identity":
      return `${v.prenom ?? ""} ${v.nom ?? ""}`.trim();
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
    case "consent":
      return "J'accepte d'être recontacté(e) par Soleil Pour Tous";
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
  const transcriptEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!showTyping) return;
    const idx = completed.length;
    const timeout = setTimeout(() => {
      if (idx >= SCREEN_ORDER.length) {
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
        setCurrentScreen(SCREEN_ORDER[idx]);
        setShowTyping(false);
      }
    }, TYPING_DELAY);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTyping, completed]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [completed, currentScreen, showTyping]);

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

  async function handleAnalyzingComplete() {
    if (pendingSubmit.current) await pendingSubmit.current;
    setPhase("result");
  }

  const estimate: LiveEstimate = useMemo(() => {
    const cp = values.codePostal;
    const hasRegion = cp && /^\d{5}$/.test(cp);
    const hasSim =
      hasRegion &&
      Number(values.surfaceToiture) > 0 &&
      Number(values.factureMensuelle) > 0;

    if (!hasSim) {
      return { region: hasRegion ? regionLabel(cp as string) : undefined };
    }

    const sim = computeSimulation({
      monthlyBill: Number(values.factureMensuelle) || 0,
      codePostal: cp as string,
      roofSurface: Number(values.surfaceToiture) || 0,
      taxIncome: Number(values.revenuFiscal) || 0,
      orientation: values.orientationToit,
    });

    return {
      region: regionLabel(cp as string),
      estimatedAnnualSavings: sim.estimatedAnnualSavings,
      installableKwc: sim.installableKwc,
      eligibilityLabel: values.revenuFiscal ? sim.eligibilityLabel : undefined,
    };
  }, [
    values.codePostal,
    values.surfaceToiture,
    values.factureMensuelle,
    values.revenuFiscal,
    values.orientationToit,
  ]);

  return (
    <section id="eligibilite" className="anchor-offset relative bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
            Votre conseiller solaire
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Découvrons ensemble votre éligibilité
          </h2>

          <div className="mt-8 rounded-3xl bg-white p-5 shadow-card sm:p-7">
            <AnimatePresence mode="wait">
              {phase === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-sun-400 to-sun-600"
                      animate={{
                        width: `${(completed.length / SCREEN_ORDER.length) * 100}%`,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div className="max-h-[420px] space-y-4 overflow-y-auto py-2 pr-1">
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
                    <div ref={transcriptEndRef} />
                  </div>

                  {!showTyping && currentScreen && (
                    <div className="mt-4 border-t border-line pt-5">
                      {currentScreen === "identity" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="prenom">Prénom</Label>
                            <Input id="prenom" error={!!errors.prenom} {...register("prenom")} />
                          </div>
                          <div>
                            <Label htmlFor="nom">Nom</Label>
                            <Input id="nom" error={!!errors.nom} {...register("nom")} />
                          </div>
                          <Button className="col-span-2 mt-1" onClick={() => goNext("identity")}>
                            Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      )}

                      {currentScreen === "contact" && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" error={!!errors.email} {...register("email")} />
                          </div>
                          <div>
                            <Label htmlFor="telephone">Téléphone</Label>
                            <Input
                              id="telephone"
                              type="tel"
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
                            <Input id="adresse" error={!!errors.adresse} {...register("adresse")} />
                          </div>
                          <div>
                            <Label htmlFor="codePostal">Code postal</Label>
                            <Input id="codePostal" inputMode="numeric" error={!!errors.codePostal} {...register("codePostal")} />
                          </div>
                          <div>
                            <Label htmlFor="ville">Ville</Label>
                            <Input id="ville" error={!!errors.ville} {...register("ville")} />
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
                              cadre de ma demande d&apos;étude solaire gratuite.
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
                    Votre foyer semble éligible à plusieurs dispositifs de soutien. Un
                    conseiller Soleil Pour Tous vérifiera tout cela avec vous et vous
                    recontactera rapidement pour confirmer votre éligibilité.
                  </p>
                  {submitError && (
                    <p className="mt-4 text-sm font-medium text-red-500">
                      Votre estimation a bien été calculée, mais l&apos;envoi de votre
                      dossier a rencontré un souci technique — un conseiller peut ne pas
                      recevoir votre demande automatiquement. Vous pouvez nous
                      recontacter directement pour confirmer.
                    </p>
                  )}
                  <p className="mt-4 text-xs text-mist/70">
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
          <LiveEstimatePanel estimate={estimate} />
        </Reveal>
      </div>
    </section>
  );
}

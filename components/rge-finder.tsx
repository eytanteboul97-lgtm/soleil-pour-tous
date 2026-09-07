"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceButtons } from "@/components/choice-buttons";
import { MultiChoiceButtons } from "@/components/multi-choice-buttons";
import { trackLead, trackRgeInterest } from "@/lib/meta-pixel";
import {
  EMAIL_LOOKS_VALID_REGEX,
  PHONE_REGEX,
  POSTAL_CODE_REGEX,
  TYPE_TRAVAUX_EMOJI,
  TYPE_TRAVAUX_LABELS,
  TYPE_TRAVAUX_VALUES,
  type LeadFormValues,
} from "@/lib/lead-schema";
import { leadRgeSchema, type LeadRgeValues } from "@/lib/lead-rge-schema";

type Travaux = LeadFormValues["typeTravaux"][number];
type Phase = "travaux" | "logement" | "codepostal" | "searching" | "found" | "leadgate" | "confirmed";

const SEARCH_DELAY = 1300;

function isValidTravaux(value: string | null): value is Travaux {
  return !!value && (TYPE_TRAVAUX_VALUES as readonly string[]).includes(value);
}

export function RgeFinder() {
  const [phase, setPhase] = useState<Phase>("travaux");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const {
    register,
    setValue,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<LeadRgeValues>({
    resolver: zodResolver(leadRgeSchema),
    mode: "onTouched",
    defaultValues: {
      typeTravaux: [],
      codePostal: "",
      prenom: "",
      email: "",
      telephone: "",
      consentement: false,
    },
  });

  const values = watch();

  // Pré-remplissage depuis un lien du type
  // /trouver-un-professionnel-rge?travaux=isolation&logement=maison&cp=69001
  // — utilisé par le CTA "Trouver un professionnel" affiché après le
  // résultat du simulateur principal, pour ne jamais reposer une question
  // déjà répondue.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const travaux = params.get("travaux");
    const logement = params.get("logement");
    const cp = params.get("cp");

    if (isValidTravaux(travaux)) setValue("typeTravaux", [travaux], { shouldValidate: true });
    if (logement === "maison" || logement === "appartement" || logement === "autre") {
      setValue("typeLogement", logement, { shouldValidate: true });
    }
    if (cp && POSTAL_CODE_REGEX.test(cp)) setValue("codePostal", cp, { shouldValidate: true });

    if (isValidTravaux(travaux) && logement && cp && POSTAL_CODE_REGEX.test(cp)) {
      setPhase("searching");
    } else if (isValidTravaux(travaux) && logement) {
      setPhase("codepostal");
    } else if (isValidTravaux(travaux)) {
      setPhase("logement");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "searching") return;
    const timeout = setTimeout(() => setPhase("found"), SEARCH_DELAY);
    return () => clearTimeout(timeout);
  }, [phase]);

  function toggleTravaux(value: Travaux) {
    const current = values.typeTravaux ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("typeTravaux", next, { shouldValidate: true });
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    const valid = await trigger(["prenom", "email", "telephone", "consentement"]);
    if (!valid) return;
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/lead-rge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getValues()),
      });
      if (!res.ok) {
        setSubmitError(true);
      } else {
        trackLead();
        trackRgeInterest();
      }
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
      setPhase("confirmed");
    }
  }

  const fieldValid = {
    codePostal: POSTAL_CODE_REGEX.test(values.codePostal ?? ""),
    prenom: (values.prenom ?? "").trim().length >= 2,
    email: EMAIL_LOOKS_VALID_REGEX.test(values.email ?? ""),
    telephone: PHONE_REGEX.test(values.telephone ?? ""),
  };

  return (
    <div className="min-h-[420px] rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <AnimatePresence mode="wait">
        {phase === "travaux" && (
          <motion.div key="travaux" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="font-display text-lg font-semibold text-ink">Quel est votre projet ?</h2>
            <p className="mt-1 text-xs text-mist">Vous pouvez sélectionner plusieurs projets.</p>
            <div className="mt-4">
              <MultiChoiceButtons
                options={TYPE_TRAVAUX_VALUES.map((v) => ({
                  value: v,
                  label: TYPE_TRAVAUX_LABELS[v],
                  emoji: TYPE_TRAVAUX_EMOJI[v],
                }))}
                values={values.typeTravaux ?? []}
                onToggle={toggleTravaux}
              />
            </div>
            <Button
              className="mt-5 w-full"
              disabled={(values.typeTravaux ?? []).length === 0}
              onClick={() => setPhase("logement")}
            >
              Continuer <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </motion.div>
        )}

        {phase === "logement" && (
          <motion.div key="logement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="font-display text-lg font-semibold text-ink">Quel est votre logement ?</h2>
            <div className="mt-4">
              <ChoiceButtons
                options={[
                  { value: "maison", label: "Maison", emoji: "🏡" },
                  { value: "appartement", label: "Appartement", emoji: "🏢" },
                  { value: "autre", label: "Autre", emoji: "🏘️" },
                ]}
                value={values.typeLogement}
                onSelect={(v) => {
                  setValue("typeLogement", v, { shouldValidate: true });
                  setTimeout(() => setPhase("codepostal"), 200);
                }}
              />
            </div>
          </motion.div>
        )}

        {phase === "codepostal" && (
          <motion.div key="codepostal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="font-display text-lg font-semibold text-ink">
              Dans quel secteur se trouve le logement ?
            </h2>
            <p className="mt-1 text-xs text-mist">
              Cela nous permet de rechercher un professionnel proche de chez vous.
            </p>
            <div className="mt-4">
              <Label htmlFor="rge-cp">Code postal</Label>
              <Input
                id="rge-cp"
                inputMode="numeric"
                autoComplete="postal-code"
                error={!!errors.codePostal}
                valid={fieldValid.codePostal}
                {...register("codePostal")}
              />
            </div>
            <Button
              className="mt-5 w-full"
              disabled={!fieldValid.codePostal}
              onClick={() => setPhase("searching")}
            >
              Rechercher <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </motion.div>
        )}

        {phase === "searching" && (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <Loader2 className="h-8 w-8 animate-spin text-sun-600" aria-hidden="true" />
            <p className="mt-4 text-sm text-mist">Recherche dans votre secteur…</p>
          </motion.div>
        )}

        {phase === "found" && (
          <motion.div
            key="found"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-600">
              <ShieldCheck className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">
              Nous recherchons un installateur partenaire certifié RGE pour
              votre projet.
            </h2>
            <ul className="mx-auto mt-4 max-w-xs space-y-1.5 text-left text-sm text-ink-soft">
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
            <Button className="mt-6 w-full" onClick={() => setPhase("leadgate")}>
              Demander une mise en relation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </motion.div>
        )}

        {phase === "leadgate" && (
          <motion.div key="leadgate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="font-display text-lg font-semibold text-ink">
              Où pouvons-nous vous transmettre les coordonnées ?
            </h2>
            <form onSubmit={submitLead} className="mt-4 space-y-3">
              <div>
                <Label htmlFor="rge-prenom">Prénom</Label>
                <Input
                  id="rge-prenom"
                  autoComplete="given-name"
                  error={!!errors.prenom}
                  valid={fieldValid.prenom}
                  {...register("prenom")}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="rge-telephone">Téléphone</Label>
                  <Input
                    id="rge-telephone"
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
                  <Label htmlFor="rge-email">Email</Label>
                  <Input
                    id="rge-email"
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
                  id="rge-consentement"
                  checked={values.consentement === true}
                  onCheckedChange={(v) =>
                    setValue("consentement", v === true, { shouldValidate: true })
                  }
                  error={!!errors.consentement}
                  className="mt-0.5"
                />
                <label htmlFor="rge-consentement" className="text-xs leading-relaxed text-ink-soft">
                  J&apos;accepte que mes coordonnées soient transmises à un
                  installateur partenaire certifié RGE dans le cadre de ma
                  demande de mise en relation.
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Un instant…" : "Demander une mise en relation"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-center text-xs text-mist">
              <span className="inline-flex items-center gap-1">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Données protégées
              </span>
              <span>Gratuit</span>
              <span>Sans engagement</span>
            </div>
          </motion.div>
        )}

        {phase === "confirmed" && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-600">
              <Check className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">Demande enregistrée.</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Un conseiller Soleil Pour Tous vous met en relation avec un
              installateur partenaire certifié RGE correspondant à votre
              projet.
            </p>
            {submitError && (
              <p className="mt-4 text-sm font-medium text-red-500">
                Votre demande a bien été enregistrée, mais l&apos;envoi de
                notification a rencontré un souci technique — vous pouvez
                nous recontacter directement pour confirmer.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

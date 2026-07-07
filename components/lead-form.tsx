"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/reveal";
import { LeadFormSuccess } from "@/components/lead-form-success";
import { leadFormSchema, stepFields, type LeadFormValues } from "@/lib/lead-schema";

const STEP_TITLES = ["Vos coordonnées", "Votre logement", "Votre habitation", "Votre situation"];

export function LeadForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    trigger,
    handleSubmit,
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
      surfaceToiture: "",
      factureMensuelle: "",
      revenuFiscal: "",
      consentement: false,
    },
  });

  const totalSteps = STEP_TITLES.length;
  const isLastStep = step === totalSteps - 1;

  async function handleNext() {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function handleBack() {
    setServerError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: LeadFormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Échec de l'envoi");
      setSubmitted(true);
    } catch {
      setServerError(
        "Une erreur est survenue lors de l'envoi. Merci de réessayer."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <LeadFormSuccess />;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-9">
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between text-sm font-medium text-mist">
          <span>
            Étape {step + 1} / {totalSteps} — {STEP_TITLES[step]}
          </span>
          <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <Progress value={((step + 1) / totalSteps) * 100} />
      </div>

      <form
        onSubmit={
          isLastStep
            ? handleSubmit(onSubmit)
            : (e) => {
                e.preventDefault();
                handleNext();
              }
        }
        noValidate
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {step === 0 && (
              <>
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" error={!!errors.prenom} {...register("prenom")} />
                  <FieldError message={errors.prenom?.message} />
                </div>
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" error={!!errors.nom} {...register("nom")} />
                  <FieldError message={errors.nom?.message} />
                </div>
                <div>
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    error={!!errors.email}
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                <div>
                  <Label htmlFor="telephone">Numéro de téléphone</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    error={!!errors.telephone}
                    {...register("telephone")}
                  />
                  <FieldError message={errors.telephone?.message} />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="sm:col-span-2">
                  <Label htmlFor="adresse">Adresse postale complète</Label>
                  <Input id="adresse" error={!!errors.adresse} {...register("adresse")} />
                  <FieldError message={errors.adresse?.message} />
                </div>
                <div>
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input
                    id="codePostal"
                    inputMode="numeric"
                    error={!!errors.codePostal}
                    {...register("codePostal")}
                  />
                  <FieldError message={errors.codePostal?.message} />
                </div>
                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input id="ville" error={!!errors.ville} {...register("ville")} />
                  <FieldError message={errors.ville?.message} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label htmlFor="typeLogement">Type de logement</Label>
                  <Controller
                    control={control}
                    name="typeLogement"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="typeLogement" error={!!errors.typeLogement}>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maison">Maison</SelectItem>
                          <SelectItem value="appartement">Appartement</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError message={errors.typeLogement?.message} />
                </div>
                <div>
                  <Label htmlFor="statutOccupation">Propriétaire ou locataire</Label>
                  <Controller
                    control={control}
                    name="statutOccupation"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="statutOccupation" error={!!errors.statutOccupation}>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="proprietaire">Propriétaire</SelectItem>
                          <SelectItem value="locataire">Locataire</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError message={errors.statutOccupation?.message} />
                </div>
                <div>
                  <Label htmlFor="surfaceToiture">Surface approximative de toiture (m²)</Label>
                  <Input
                    id="surfaceToiture"
                    type="number"
                    inputMode="decimal"
                    error={!!errors.surfaceToiture}
                    {...register("surfaceToiture")}
                  />
                  <FieldError message={errors.surfaceToiture?.message} />
                </div>
                <div>
                  <Label htmlFor="factureMensuelle">Facture d&apos;électricité mensuelle (€)</Label>
                  <Input
                    id="factureMensuelle"
                    type="number"
                    inputMode="decimal"
                    error={!!errors.factureMensuelle}
                    {...register("factureMensuelle")}
                  />
                  <FieldError message={errors.factureMensuelle?.message} />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="sm:col-span-2">
                  <Label htmlFor="revenuFiscal">
                    Revenu fiscal de référence (avis d&apos;imposition, €)
                  </Label>
                  <Input
                    id="revenuFiscal"
                    type="number"
                    inputMode="decimal"
                    error={!!errors.revenuFiscal}
                    {...register("revenuFiscal")}
                  />
                  <FieldError message={errors.revenuFiscal?.message} />
                </div>

                <div className="sm:col-span-2 flex items-start gap-3 rounded-2xl bg-paper p-4">
                  <Controller
                    control={control}
                    name="consentement"
                    render={({ field }) => (
                      <Checkbox
                        id="consentement"
                        checked={field.value === true}
                        onCheckedChange={(v) => field.onChange(v === true)}
                        error={!!errors.consentement}
                        className="mt-0.5"
                      />
                    )}
                  />
                  <label htmlFor="consentement" className="text-sm leading-relaxed text-ink-soft">
                    J&apos;accepte d&apos;être recontacté par Soleil Pour Tous
                    dans le cadre de ma demande d&apos;étude solaire gratuite.
                    Vos données sont traitées conformément à notre{" "}
                    <a href="#politique-confidentialite" className="underline">
                      politique de confidentialité
                    </a>
                    .
                  </label>
                </div>
                <FieldError message={errors.consentement?.message} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {serverError && (
          <p className="mt-4 text-sm font-medium text-red-500">{serverError}</p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          ) : (
            <span />
          )}

          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isLastStep ? (
              "Envoyer ma demande"
            ) : (
              <>
                Continuer
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>

      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-mist">
        <ShieldCheck className="h-4 w-4 text-leaf-600" />
        Gratuit, rapide, sans engagement — aides accordées selon éligibilité.
      </p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}

export function LeadFormSection() {
  return (
    <section id="eligibilite" className="anchor-offset relative bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="text-sm font-semibold uppercase tracking-wide text-sun-600">
            Simulateur d&apos;éligibilité
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Découvrez si votre foyer est éligible aux aides solaires
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-mist">
            En 2 minutes, un conseiller Soleil Pour Tous analyse votre profil
            et vous recontacte pour vous proposer une étude personnalisée et
            100% gratuite — sans engagement de votre part.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-ink-soft">
            {[
              "Étude gratuite et personnalisée",
              "Accompagnement administratif complet",
              "Réponse d'un conseiller sous 48h",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-600">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <LeadForm />
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceButtons } from "@/components/choice-buttons";
import {
  leadProSchema,
  type LeadProValues,
  STRUCTURE_TYPE_LABELS,
  STRUCTURE_TYPE_VALUES,
} from "@/lib/lead-pro-schema";
import { POSTAL_CODE_REGEX, PHONE_REGEX } from "@/lib/lead-schema";

const STRUCTURE_OPTIONS = STRUCTURE_TYPE_VALUES.map((value) => ({
  value,
  label: STRUCTURE_TYPE_LABELS[value],
}));

export function ProLeadForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeadProValues>({
    resolver: zodResolver(leadProSchema),
    defaultValues: {
      nomStructure: "",
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      codePostal: "",
      besoin: "",
      consentement: false,
    },
  });

  const values = watch();

  async function onSubmit(data: LeadProValues) {
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/lead-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center rounded-3xl bg-white p-8 text-center shadow-card"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h3 className="mt-4 font-display text-lg font-semibold text-ink">
          Votre demande a bien été transmise
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
          Un conseiller Soleil Pour Tous étudie les dispositifs applicables à
          votre structure et vous recontacte prochainement.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl bg-white p-6 shadow-card sm:p-8"
    >
      <div>
        <Label>Type de structure</Label>
        <ChoiceButtons
          options={STRUCTURE_OPTIONS}
          value={values.typeStructure}
          onSelect={(v) => setValue("typeStructure", v, { shouldValidate: true })}
        />
        {errors.typeStructure && (
          <p className="mt-1.5 text-xs text-red-500">{errors.typeStructure.message}</p>
        )}
      </div>

      <div className="mt-5">
        <Label htmlFor="nomStructure">Nom de la structure</Label>
        <Input
          id="nomStructure"
          {...register("nomStructure")}
          error={!!errors.nomStructure}
          valid={values.nomStructure.trim().length >= 2}
        />
        {errors.nomStructure && (
          <p className="mt-1.5 text-xs text-red-500">{errors.nomStructure.message}</p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input
            id="prenom"
            {...register("prenom")}
            error={!!errors.prenom}
            valid={values.prenom.trim().length >= 2}
          />
          {errors.prenom && <p className="mt-1.5 text-xs text-red-500">{errors.prenom.message}</p>}
        </div>
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input
            id="nom"
            {...register("nom")}
            error={!!errors.nom}
            valid={values.nom.trim().length >= 2}
          />
          {errors.nom && <p className="mt-1.5 text-xs text-red-500">{errors.nom.message}</p>}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email professionnel</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            valid={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone</Label>
          <Input
            id="telephone"
            type="tel"
            autoComplete="tel"
            {...register("telephone")}
            error={!!errors.telephone}
            valid={PHONE_REGEX.test(values.telephone)}
          />
          {errors.telephone && (
            <p className="mt-1.5 text-xs text-red-500">{errors.telephone.message}</p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="codePostal">Code postal</Label>
        <Input
          id="codePostal"
          inputMode="numeric"
          {...register("codePostal")}
          error={!!errors.codePostal}
          valid={POSTAL_CODE_REGEX.test(values.codePostal)}
        />
        {errors.codePostal && (
          <p className="mt-1.5 text-xs text-red-500">{errors.codePostal.message}</p>
        )}
      </div>

      <div className="mt-5">
        <Label htmlFor="besoin">Votre besoin (facultatif)</Label>
        <textarea
          id="besoin"
          rows={3}
          {...register("besoin")}
          className="flex w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-mist/70 transition-colors focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/50"
          placeholder="Ex : décarbonation de notre process, isolation de nos locaux, chaleur renouvelable…"
        />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-paper p-4">
        <Checkbox
          id="consentement-pro"
          checked={values.consentement === true}
          onCheckedChange={(v) => setValue("consentement", v === true, { shouldValidate: true })}
          error={!!errors.consentement}
          className="mt-0.5"
        />
        <label htmlFor="consentement-pro" className="text-sm leading-relaxed text-ink-soft">
          J&apos;accepte d&apos;être recontacté(e) par Soleil Pour Tous dans le
          cadre de ma demande d&apos;étude des aides énergétiques disponibles
          pour ma structure.
        </label>
      </div>

      {submitError && (
        <p className="mt-3 text-sm text-red-500">
          Une erreur est survenue lors de l&apos;envoi. Merci de réessayer.
        </p>
      )}

      <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours…" : "Étudier les aides disponibles pour mon entreprise"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  );
}

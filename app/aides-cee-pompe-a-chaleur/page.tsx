import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, Check, CheckCircle2, ExternalLink, X } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { Reveal } from "@/components/reveal";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { SITE_URL } from "@/lib/site-config";
import {
  COUP_DE_POUCE_CHAUFFAGE,
  FICHES_CEE_PAC_LIST,
  SYSTEMES_ELIGIBLES_COUP_DE_POUCE,
  SYSTEMES_NON_ELIGIBLES_COUP_DE_POUCE,
} from "@/lib/cee-dispositifs";
import { cn } from "@/lib/utils";

const PAGE_URL = `${SITE_URL}/aides-cee-pompe-a-chaleur`;
const title = "CEE et Coup de pouce Chauffage pour la pompe à chaleur en 2026";
const description =
  "Fiches BAR-TH-171, BAR-TH-172, BAR-TH-129 et bonification Coup de pouce Chauffage : comprenez le fonctionnement des Certificats d'Économies d'Énergie pour votre projet de pompe à chaleur, sans montant inventé.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "article", url: PAGE_URL, title, description },
};

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full h-12 px-6 text-[0.95rem] font-display font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-400 focus-visible:ring-offset-2";
const BUTTON_SUN =
  "bg-gradient-to-r from-sun-400 to-sun-600 text-white shadow-glow hover:shadow-[0_0_100px_-15px_rgba(255,138,30,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none";
const BUTTON_OUTLINE =
  "border border-line bg-white/70 text-ink hover:bg-white hover:-translate-y-0.5 active:translate-y-0 active:bg-white";

function coupDePouceBadge(eligible: boolean | "partiel"): { label: string; variant: BadgeProps["variant"] } {
  if (eligible === true) return { label: "Bonification possible", variant: "available" };
  if (eligible === "partiel") return { label: "Bonification sous conditions", variant: "conditional" };
  return { label: "Bonification non applicable", variant: "unavailable" };
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  url: PAGE_URL,
  publisher: { "@type": "Organization", name: "Soleil Pour Tous" },
};

export default function AidesCeePompeAChaleurPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Navbar />

      <main id="main-content">
        <section className="relative overflow-hidden bg-night pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-mesh-night" />
          <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sun-300">
              Module réglementaire 2026
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Les Certificats d&apos;Économies d&apos;Énergie pour votre pompe à chaleur
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
              Comprenez les fiches applicables, la bonification Coup de pouce
              Chauffage, et ce qu&apos;elles signifient réellement pour votre
              projet — sans montant inventé.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal>
              <h2 className="font-display text-xl font-semibold text-ink">
                Comment fonctionnent les CEE ?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Le dispositif des Certificats d&apos;Économies d&apos;Énergie
                oblige les fournisseurs d&apos;énergie (les &quot;obligés&quot;) à
                financer des travaux d&apos;économie d&apos;énergie chez les
                particuliers, directement ou via des délégataires. Chaque
                opération standardisée (une &quot;fiche&quot;, comme BAR-TH-171 pour
                une PAC Air/Eau) donne droit à un volume de CEE exprimé en kWh
                cumac — une unité d&apos;économie d&apos;énergie, pas une somme
                d&apos;argent.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                C&apos;est l&apos;obligé ou le délégataire qui valorise ensuite ce
                volume en une prime en euros, selon son propre barème
                commercial — qui peut varier d&apos;un partenaire à l&apos;autre et
                dans le temps. C&apos;est pourquoi aucun montant précis n&apos;est
                annoncé sur cette page : seul un partenaire habilité peut le
                confirmer pour votre dossier.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-paper py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
                Fiches applicables
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
                BAR-TH-171, BAR-TH-172, BAR-TH-129
              </h2>
            </Reveal>

            <div className="mt-12 space-y-6">
              {FICHES_CEE_PAC_LIST.map((fiche, i) => {
                const coupDePouce = coupDePouceBadge(fiche.coupDePouce.eligible);
                return (
                  <Reveal
                    key={fiche.id}
                    delay={i * 0.08}
                    className="rounded-3xl border border-line bg-white p-7"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-sun-700">
                          {fiche.shortLabel}
                        </p>
                        <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                          {fiche.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={coupDePouce.variant}>{coupDePouce.label}</Badge>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-mist">{fiche.description}</p>

                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                          Conditions techniques
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-mist">
                          {fiche.conditionsTechniques.map((c) => (
                            <li key={c} className="flex items-start gap-2">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sun-600" aria-hidden="true" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                          Points de vigilance
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-mist">
                          {fiche.pointsDeVigilance.map((p) => (
                            <li key={p} className="flex items-start gap-2">
                              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-sun-600" aria-hidden="true" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <p className="mt-5 rounded-2xl bg-paper p-4 text-xs leading-relaxed text-mist">
                      {fiche.coupDePouce.note}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                      <p className="text-xs text-mist">
                        Informations vérifiées le {fiche.derniereVerification}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {fiche.sourceOfficielle.map((source) => (
                          <a
                            key={source.url}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="focus-ring-light inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold text-sun-700 hover:underline"
                          >
                            {source.label}
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
                Bonification
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
                {COUP_DE_POUCE_CHAUFFAGE.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                {COUP_DE_POUCE_CHAUFFAGE.description}
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Reveal className="rounded-3xl border border-leaf-500/20 bg-leaf-500/5 p-6">
                <p className="font-display text-sm font-semibold text-ink">
                  Systèmes remplacés ouvrant droit à la bonification
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                  {SYSTEMES_ELIGIBLES_COUP_DE_POUCE.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.08} className="rounded-3xl border border-line bg-paper p-6">
                <p className="font-display text-sm font-semibold text-ink">
                  Systèmes n&apos;ouvrant pas droit à la bonification
                </p>
                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                  {SYSTEMES_NON_ELIGIBLES_COUP_DE_POUCE.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.12} className="mt-6 rounded-3xl border border-line bg-white p-6">
              <p className="font-display text-sm font-semibold text-ink">Exigences</p>
              <ul className="mt-3 space-y-2 text-sm text-mist">
                {COUP_DE_POUCE_CHAUFFAGE.exigences.map((e) => (
                  <li key={e} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sun-600" aria-hidden="true" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.16} className="mt-6 rounded-3xl bg-night p-6">
              <p className="font-display text-sm font-semibold text-white">Chronologie à respecter</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {COUP_DE_POUCE_CHAUFFAGE.chronologie}
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-6 flex items-start gap-3 rounded-2xl bg-sun-50 p-5 text-sm text-sun-700">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>{COUP_DE_POUCE_CHAUFFAGE.avertissementMontant}</p>
            </Reveal>

            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              {COUP_DE_POUCE_CHAUFFAGE.sourceOfficielle.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring-light inline-flex items-center gap-1.5 rounded-sm font-semibold text-sun-700 hover:underline"
                >
                  {source.label}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Prêt à vérifier votre situation ?
            </h2>
            <p className="mt-3 text-sm text-mist">
              Un conseiller confirme avec vous quelle fiche s&apos;applique à
              votre projet et le partenaire habilité qui peut valoriser vos CEE.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/?travaux=pac-air-eau#eligibilite" className={cn(BUTTON_BASE, BUTTON_SUN)}>
                Simuler mes aides PAC <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/pompe-a-chaleur" className={cn(BUTTON_BASE, BUTTON_OUTLINE)}>
                Voir le dossier complet PAC
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA
        label="Simuler mes aides PAC"
        href="/?travaux=pac-air-eau#eligibilite"
        watchId="__none__"
      />
    </>
  );
}

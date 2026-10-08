import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Droplets, Mountain, Wind } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProcessSection } from "@/components/process-section";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { Reveal } from "@/components/reveal";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PacCostBreakdown } from "@/components/pac-cost-breakdown";
import { SITE_URL } from "@/lib/site-config";
import { FICHES_CEE_PAC } from "@/lib/cee-dispositifs";
import { cn } from "@/lib/utils";

const PAGE_URL = `${SITE_URL}/pompe-a-chaleur`;
const title = "Pompe à chaleur : quelles aides CEE et MaPrimeRénov' en 2026 ?";
const description =
  "Air/Eau, géothermique ou Air/Air : comparez les pompes à chaleur, comprenez les fiches CEE applicables (BAR-TH-171/172/129) et estimez les aides potentiellement disponibles pour votre projet, gratuitement et sans engagement.";

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
const BUTTON_OUTLINE_LIGHT =
  "border border-white/15 bg-white/5 text-white hover:bg-white/10 active:bg-white/15";
const BUTTON_OUTLINE =
  "border border-line bg-white/70 text-ink hover:bg-white hover:-translate-y-0.5 active:translate-y-0 active:bg-white";

function coupDePouceBadge(eligible: boolean | "partiel"): { label: string; variant: BadgeProps["variant"] } {
  if (eligible === true) return { label: "Coup de pouce possible", variant: "available" };
  if (eligible === "partiel") return { label: "Coup de pouce sous conditions", variant: "conditional" };
  return { label: "Coup de pouce non applicable", variant: "unavailable" };
}

const COMPARATIF = [
  {
    icon: Droplets,
    typePac: "air-eau" as const,
    ficheId: "BAR-TH-171" as const,
    title: "PAC Air/Eau",
    fonctionnement:
      "Capte la chaleur de l'air extérieur et la transfère à un circuit d'eau qui alimente radiateurs ou plancher chauffant.",
    usages: "Remplacement d'une chaudière fioul, gaz ou électrique, chauffage principal du logement.",
    installation: "1 à 2 jours, installation d'une unité extérieure et d'un module hydraulique intérieur.",
    travauxQuery: "pac-air-eau",
  },
  {
    icon: Mountain,
    typePac: "eau-eau" as const,
    ficheId: "BAR-TH-172" as const,
    title: "PAC géothermique (Eau/Eau)",
    fonctionnement:
      "Puise la chaleur du sol (capteurs enterrés) ou d'une nappe phréatique — une source plus stable que l'air extérieur toute l'année.",
    usages: "Logements avec terrain disponible pour le captage, projets visant une performance maximale.",
    installation: "Plusieurs jours, avec travaux de forage ou de pose de capteurs enterrés en amont.",
    travauxQuery: "pac-air-eau",
  },
  {
    icon: Wind,
    typePac: "air-air" as const,
    ficheId: "BAR-TH-129" as const,
    title: "PAC Air/Air",
    fonctionnement:
      "Capte la chaleur de l'air extérieur et la restitue directement dans l'air intérieur via une ou plusieurs unités murales.",
    usages: "Chauffage d'appoint ou principal avec rafraîchissement réversible l'été.",
    installation: "1 jour en général, sans réseau hydraulique à poser.",
    travauxQuery: "pac-air-air",
  },
];

const PAC_FAQ = [
  {
    question: "Une PAC Air/Air donne-t-elle droit à MaPrimeRénov' et au Coup de pouce chauffage ?",
    answer:
      "Pas automatiquement. Ces deux dispositifs ciblent en priorité le remplacement d'une chaudière par une PAC à eau (Air/Eau ou géothermique). Une PAC Air/Air peut rester éligible aux CEE \"classiques\" sous conditions, à vérifier précisément avec un partenaire habilité.",
  },
  {
    question: "Le coefficient de bonification \"Coup de pouce\" correspond-il à un montant en euros ?",
    answer:
      "Non. Il multiplie un volume de Certificats d'Économies d'Énergie exprimé en kWh cumac, pas un montant en euros. La valeur réelle en euros dépend du barème propre à l'obligé ou au délégataire qui finance votre prime — elle doit être confirmée auprès d'un partenaire habilité.",
  },
  {
    question: "Dois-je signer mon devis avant ou après l'accord CEE ?",
    answer:
      "L'offre CEE doit être acceptée avant le démarrage des travaux — et, selon les obligés, avant la signature définitive du devis. Un chantier déjà commencé sans cet accord préalable n'est plus éligible à la bonification.",
  },
  {
    question: "Faut-il obligatoirement un installateur certifié RGE ?",
    answer:
      "Oui, pour l'ensemble des aides présentées ici (CEE, MaPrimeRénov'). C'est une condition commune à tous les dispositifs de rénovation énergétique en France.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAC_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function PompeAChaleurPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <main id="main-content">
        <section className="relative overflow-hidden bg-night pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 bg-mesh-night" />
          <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-sun-300">
              Dossier complet
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Remplacez votre ancien chauffage par une{" "}
              <span className="text-gradient-sun">pompe à chaleur</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
              Estimez les aides CEE et MaPrimeRénov&apos; potentiellement
              disponibles pour votre projet — gratuit, rapide, sans engagement.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/?travaux=pac-air-eau#eligibilite" className={cn(BUTTON_BASE, BUTTON_SUN)}>
                Simuler mes aides PAC <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/aides-cee-pompe-a-chaleur" className={cn(BUTTON_BASE, BUTTON_OUTLINE_LIGHT)}>
                Comprendre les CEE et le Coup de pouce
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-paper py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
                Comparatif
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
                Quelle pompe à chaleur pour votre projet ?
              </h2>
              <p className="mt-4 text-mist">
                Fonctionnement, usages, installation et aides possibles —
                chaque technologie a ses propres conditions, à vérifier avec
                votre conseiller.
              </p>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {COMPARATIF.map((item, i) => {
                const fiche = FICHES_CEE_PAC[item.ficheId];
                const coupDePouce = coupDePouceBadge(fiche.coupDePouce.eligible);
                return (
                  <Reveal
                    key={item.title}
                    delay={i * 0.08}
                    className="flex flex-col rounded-3xl border border-line bg-white p-7"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-500/10 text-sun-700">
                      <item.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-mist">
                      Fiche {fiche.id}
                    </p>

                    <dl className="mt-4 space-y-3 text-sm text-mist">
                      <div>
                        <dt className="font-semibold text-ink-soft">Fonctionnement</dt>
                        <dd className="mt-0.5 leading-relaxed">{item.fonctionnement}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-ink-soft">Usages</dt>
                        <dd className="mt-0.5 leading-relaxed">{item.usages}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-ink-soft">Installation</dt>
                        <dd className="mt-0.5 leading-relaxed">{item.installation}</dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Badge variant={coupDePouce.variant}>{coupDePouce.label}</Badge>
                      <Badge variant={fiche.maPrimeRenov.potentiellementMobilisable ? "available" : "unavailable"}>
                        {fiche.maPrimeRenov.potentiellementMobilisable
                          ? "MaPrimeRénov' potentielle"
                          : "MaPrimeRénov' non automatique"}
                      </Badge>
                    </div>

                    <div className="mt-5 flex-1 rounded-2xl bg-paper p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-mist">
                        Points de vigilance
                      </p>
                      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-mist">
                        {fiche.pointsDeVigilance.slice(0, 2).map((point) => (
                          <li key={point} className="flex items-start gap-1.5">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sun-600" aria-hidden="true" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/?travaux=${item.travauxQuery}#eligibilite`}
                      className={cn(BUTTON_BASE, BUTTON_OUTLINE, "mt-6 w-full")}
                    >
                      Vérifier mon éligibilité
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-mist">
              La PAC géothermique est aujourd&apos;hui qualifiée dans notre
              simulateur au sein du même parcours que la PAC Air/Eau — un
              conseiller affine le type exact avec vous lors de l&apos;étude.
            </p>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <PacCostBreakdown typePac="air-eau" />
          </div>
        </section>

        <ProcessSection />

        <section className="bg-paper py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal className="text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
                Questions fréquentes
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
                Pompe à chaleur : ce qu&apos;il faut savoir
              </h2>
            </Reveal>

            <Reveal delay={0.1} className="mt-14">
              <Accordion type="single" collapsible className="space-y-4">
                {PAC_FAQ.map((item, i) => (
                  <AccordionItem key={item.question} value={`item-${i}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-night py-24 sm:py-32">
          <div className="pointer-events-none absolute inset-0 bg-mesh-night" />
          <Reveal className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Et si votre PAC pouvait être aidée ?
            </h2>
            <p className="mt-5 text-lg text-white/60">
              Quelques minutes suffisent pour obtenir une première analyse personnalisée.
            </p>
            <Link href="/?travaux=pac-air-eau#eligibilite" className={cn(BUTTON_BASE, BUTTON_SUN, "mt-9")}>
              Simuler mes aides PAC <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
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

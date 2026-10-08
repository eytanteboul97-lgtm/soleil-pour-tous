import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/footer";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { SunlightSection } from "@/components/sunlight-section";
import { SITE_URL } from "@/lib/site-config";
import { AIDES_FICHES, AIDES_SLUGS, type AideSlug } from "@/lib/aides-content";
import { cn } from "@/lib/utils";

// Classes reprises de components/ui/button.tsx (variantes "sun"/"outline",
// taille par défaut) : cette page est un composant serveur (generateMetadata
// + generateStaticParams), et buttonVariants() ne peut pas être appelé
// depuis le serveur puisque button.tsx est "use client".
const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full h-12 px-6 text-[0.95rem] font-display font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-400 focus-visible:ring-offset-2";
const BUTTON_SUN =
  "bg-gradient-to-r from-sun-400 to-sun-600 text-white shadow-glow hover:shadow-[0_0_100px_-15px_rgba(255,138,30,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none";
const BUTTON_OUTLINE =
  "border border-line bg-white/70 text-ink hover:bg-white hover:-translate-y-0.5 active:translate-y-0 active:bg-white";

export function generateStaticParams() {
  return AIDES_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fiche = AIDES_FICHES[slug as AideSlug];
  if (!fiche) return {};
  const url = `${SITE_URL}/aides/${fiche.slug}`;
  return {
    title: fiche.title,
    description: fiche.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: fiche.title,
      description: fiche.metaDescription,
    },
  };
}

export default async function AideFichePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fiche = AIDES_FICHES[slug as AideSlug];
  if (!fiche) notFound();

  const otherFiches = AIDES_SLUGS.filter((s) => s !== fiche.slug).map((s) => AIDES_FICHES[s]);
  const eligibiliteHref = `/?travaux=${fiche.travauxKey}#eligibilite`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fiche.title,
    description: fiche.metaDescription,
    url: `${SITE_URL}/aides/${fiche.slug}`,
    publisher: { "@type": "Organization", name: "Soleil Pour Tous" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-line px-5 py-5 sm:px-8">
        <Logo theme="light" className="mx-auto max-w-3xl" />
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <Link
          href="/"
          className="focus-ring-light rounded-sm text-sm font-medium text-sun-700 hover:underline"
        >
          ← Retour à l&apos;accueil
        </Link>

        <span className="mt-6 block text-sm font-semibold uppercase tracking-wide text-sun-700">
          Aides à la rénovation énergétique
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {fiche.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{fiche.heroTagline}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={eligibiliteHref} className={cn(BUTTON_BASE, BUTTON_SUN)}>
            Calculer mes aides
          </Link>
          <a href="#aides" className={cn(BUTTON_BASE, BUTTON_OUTLINE)}>
            Voir toutes les aides
          </a>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf-500/10 px-4 py-1.5 text-xs font-semibold text-leaf-700">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          Informations vérifiées le {fiche.derniereVerification}
        </div>

        {(fiche.slug === "pompe-a-chaleur" || fiche.slug === "chauffage") && (
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <Link
              href="/pompe-a-chaleur"
              className="focus-ring-light inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-semibold text-ink hover:border-sun-300"
            >
              Voir le dossier complet pompe à chaleur →
            </Link>
            <Link
              href="/aides-cee-pompe-a-chaleur"
              className="focus-ring-light inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-semibold text-ink hover:border-sun-300"
            >
              Comprendre les CEE et le Coup de pouce →
            </Link>
          </div>
        )}

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-soft">
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Bénéficiaires</h2>
            <p className="mt-3">{fiche.beneficiaires}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Travaux concernés</h2>
            <p className="mt-3">{fiche.travauxConcernes}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Conditions principales</h2>
            <ul className="mt-3 space-y-2">
              {fiche.conditionsPrincipales.map((condition) => (
                <li key={condition} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sun-600" aria-hidden="true" />
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="rounded-2xl bg-paper p-5 text-center">
            <p className="text-sm font-medium text-ink">
              Voulez-vous savoir si votre projet est concerné ?
            </p>
            <Link href={eligibiliteHref} className={cn(BUTTON_BASE, BUTTON_SUN, "mt-3")}>
              Calculer mes aides
            </Link>
          </div>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Montant / mode de calcul</h2>
            <p className="mt-3">{fiche.montant}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Cumul avec d&apos;autres aides</h2>
            <p className="mt-3">{fiche.cumul}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Validité du dispositif</h2>
            <p className="mt-3">{fiche.dateValidite}</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Sources officielles</h2>
            <ul className="mt-3 space-y-2">
              {fiche.sourceOfficielle.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring-light inline-flex items-center gap-1.5 rounded-sm font-medium text-sun-700 hover:underline"
                  >
                    {source.label}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <p className="rounded-2xl bg-sun-50 p-4 text-xs text-sun-700">
            Soleil Pour Tous est un service privé indépendant. Nous ne sommes
            pas un organisme gouvernemental. L&apos;éligibilité et le montant
            définitif des aides dépendent de la réglementation en vigueur et
            de la validation du dossier par les organismes concernés.
          </p>
        </div>

        <section id="aides" className="anchor-offset mt-16 border-t border-line pt-10">
          <h2 className="font-display text-xl font-semibold text-ink">
            Découvrir les autres aides disponibles
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {otherFiches.map((other) => (
              <Link
                key={other.slug}
                href={`/aides/${other.slug}`}
                className="focus-ring-light rounded-2xl border border-line p-5 transition-all hover:-translate-y-0.5 hover:border-sun-300 hover:shadow-card-sm"
              >
                <p className="font-display text-sm font-semibold text-ink">{other.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-mist">{other.heroTagline}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-3xl bg-night p-8 text-center">
          <p className="font-display text-lg font-semibold text-white">
            Et si votre projet pouvait bénéficier de cette aide ?
          </p>
          <p className="mt-1.5 text-sm text-white/60">
            Quelques minutes suffisent pour obtenir une première analyse personnalisée.
          </p>
          <Link href={eligibiliteHref} className={cn(BUTTON_BASE, BUTTON_SUN, "mt-4")}>
            Calculer mes aides
          </Link>
        </div>
      </main>
      {fiche.slug === "solaire" && <SunlightSection />}
      <Footer />
      <StickyMobileCTA label="Calculer mes aides" href={eligibiliteHref} watchId="__none__" />
    </>
  );
}

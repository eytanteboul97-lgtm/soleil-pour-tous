import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/footer";
import { RgeFinder } from "@/components/rge-finder";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Trouver un professionnel RGE",
  description:
    "Trouvez un installateur partenaire certifié RGE correspondant à votre projet — pompe à chaleur, isolation, solaire, chauffe-eau. Mise en relation gratuite et sans engagement.",
  alternates: { canonical: `${SITE_URL}/trouver-un-professionnel-rge` },
};

export default function TrouverProfessionnelRgePage() {
  return (
    <>
      <header className="border-b border-line px-5 py-5 sm:px-8">
        <Logo theme="light" className="mx-auto max-w-5xl" />
      </header>

      <main>
        <section
          id="rge-hero"
          className="anchor-offset relative overflow-hidden bg-night pb-20 pt-16 sm:pb-28 sm:pt-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-mesh-night" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <Link
                href="/"
                className="focus-ring-dark rounded-sm text-sm font-medium text-sun-300 hover:underline"
              >
                ← Retour à l&apos;accueil
              </Link>

              <h1 className="mt-6 font-display text-3xl font-bold leading-[1.1] text-white sm:text-4xl lg:text-[2.6rem]">
                Trouvez un <span className="text-gradient-sun">professionnel RGE</span> pour
                votre projet
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Décrivez votre projet, nous vous mettons en relation avec un
                installateur partenaire certifié RGE correspondant à vos
                travaux.
              </p>

              <ul className="mt-5 space-y-2">
                {[
                  "Qualification RGE vérifiée",
                  "Devis sans engagement",
                  "Gratuit, sans obligation de réaliser les travaux",
                ].map((label) => (
                  <li key={label} className="flex items-center gap-2 text-sm text-white/60">
                    <Check className="h-3.5 w-3.5 shrink-0 text-leaf-400" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <RgeFinder />
          </div>
        </section>

        <section className="bg-paper px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
              Comment fonctionne la mise en relation ?
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Décrivez votre projet",
                  description: "Type de travaux, logement et secteur géographique.",
                },
                {
                  step: "2",
                  title: "Nous identifions un partenaire",
                  description: "Un installateur certifié RGE adapté à votre projet.",
                },
                {
                  step: "3",
                  title: "Vous êtes recontacté(e)",
                  description: "Un conseiller vous transmet ses coordonnées, sans engagement.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-line bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sun-500/10 font-display text-sm font-bold text-sun-700">
                    {item.step}
                  </span>
                  <p className="mt-3 font-display text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-mist">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-xl rounded-2xl bg-sun-50 p-4 text-xs text-sun-700">
              Soleil Pour Tous est un service privé indépendant de mise en
              relation. La qualification RGE d&apos;un installateur partenaire
              correspond au domaine de travaux concerné ; elle n&apos;est pas
              une garantie de résultat et reste à vérifier lors du devis.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <StickyMobileCTA label="Trouver un professionnel" href="#rge-hero" watchId="rge-hero" />
    </>
  );
}

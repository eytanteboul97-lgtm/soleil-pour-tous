import Link from "next/link";
import type { Metadata } from "next";
import { Building2, Factory, Landmark, Store } from "lucide-react";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/footer";
import { ProLeadForm } from "@/components/pro-lead-form";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Aides énergétiques pour les entreprises",
  description:
    "TPE, PME, industrie, commerce, hôtel, restaurant, copropriété, association, collectivité : découvrez les dispositifs d'aide énergétique (CEE, ADEME, Fonds Chaleur, décarbonation) disponibles pour votre structure.",
  alternates: { canonical: `${SITE_URL}/professionnels` },
};

const DISPOSITIFS = [
  {
    icon: Factory,
    title: "Décarbonation & efficacité énergétique",
    description:
      "Dispositifs ADEME pour réduire la consommation énergétique de vos process industriels et tertiaires.",
  },
  {
    icon: Store,
    title: "Certificats d'Économies d'Énergie (CEE)",
    description:
      "Primes versées par les fournisseurs d'énergie pour vos travaux d'efficacité énergétique, quel que soit votre secteur.",
  },
  {
    icon: Landmark,
    title: "Fonds Chaleur & chaleur renouvelable",
    description:
      "Soutien à l'installation d'équipements de production de chaleur renouvelable pour votre structure.",
  },
  {
    icon: Building2,
    title: "Aides aux collectivités et copropriétés",
    description:
      "Dispositifs spécifiques pour la rénovation énergétique de bâtiments collectifs et de patrimoine public.",
  },
];

export default function ProfessionnelsPage() {
  return (
    <>
      <header className="border-b border-line px-5 py-5 sm:px-8">
        <Logo theme="light" className="mx-auto max-w-5xl" />
      </header>

      <main>
        <section className="bg-night px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/"
              className="focus-ring-dark rounded-sm text-sm font-medium text-sun-300 hover:underline"
            >
              ← Retour à l&apos;accueil
            </Link>
            <span className="mt-6 block text-sm font-semibold uppercase tracking-wide text-sun-300">
              Professionnels
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Aides énergétiques pour les entreprises
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              TPE, PME, industrie, commerce, hôtel, restaurant, copropriété,
              association ou collectivité : identifiez les dispositifs d&apos;aide
              énergétique applicables à votre structure.
            </p>
          </div>
        </section>

        <section className="bg-paper px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {DISPOSITIFS.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-line bg-white p-6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-500/10 text-sun-700">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-display text-base font-semibold text-ink">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mist">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-xl">
            <h2 className="text-center font-display text-2xl font-bold text-ink sm:text-3xl">
              Étudier les aides disponibles pour mon entreprise
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-mist">
              Décrivez votre structure, un conseiller Soleil Pour Tous revient
              vers vous avec les dispositifs applicables.
            </p>
            <div className="mt-8">
              <ProLeadForm />
            </div>
            <p className="mt-6 rounded-2xl bg-sun-50 p-4 text-center text-xs text-sun-700">
              Soleil Pour Tous est un service privé indépendant. Nous ne
              sommes pas un organisme gouvernemental. L&apos;éligibilité et le
              montant définitif des aides dépendent de la réglementation en
              vigueur et de la validation du dossier par les organismes
              concernés.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

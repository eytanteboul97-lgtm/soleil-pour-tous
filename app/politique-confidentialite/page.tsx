import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données de Soleil Pour Tous.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <header className="border-b border-line px-5 py-5 sm:px-8">
        <Logo theme="light" className="mx-auto max-w-3xl" />
      </header>

      <main className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <Link href="/" className="text-sm font-medium text-sun-700 hover:underline">
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
          Politique de confidentialité
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft">
          <p>
            Soleil Pour Tous accorde une importance particulière à la
            protection des données personnelles de ses utilisateurs,
            conformément au Règlement Général sur la Protection des Données
            (RGPD).
          </p>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">
              Données collectées
            </h2>
            <p className="mt-3">
              Dans le cadre du simulateur d&apos;éligibilité, nous collectons :
              nom, prénom, adresse postale, adresse email, numéro de
              téléphone, revenu fiscal de référence, informations relatives à
              votre logement (type, surface de toiture, statut d&apos;occupation)
              et à votre consommation électrique.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">
              Finalité du traitement
            </h2>
            <p className="mt-3">
              Ces données sont utilisées exclusivement pour évaluer votre
              éligibilité aux aides à l&apos;installation de panneaux
              photovoltaïques et vous recontacter dans le cadre de votre
              demande d&apos;étude gratuite. Elles ne sont jamais vendues à des
              tiers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">
              Base légale
            </h2>
            <p className="mt-3">
              Le traitement repose sur votre consentement explicite, recueilli
              lors de la validation du formulaire d&apos;éligibilité.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">
              Durée de conservation
            </h2>
            <p className="mt-3">
              Vos données sont conservées le temps nécessaire au traitement de
              votre demande, puis archivées ou supprimées conformément à la
              réglementation en vigueur.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">
              Vos droits
            </h2>
            <p className="mt-3">
              Conformément au RGPD, vous disposez d&apos;un droit
              d&apos;accès, de rectification, d&apos;effacement, de
              limitation et d&apos;opposition au traitement de vos données.
              Pour exercer ces droits, contactez-nous à l&apos;adresse :
              [Adresse email de contact DPO].
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">
              Sécurité
            </h2>
            <p className="mt-3">
              Des mesures techniques et organisationnelles appropriées sont
              mises en œuvre pour protéger vos données contre tout accès non
              autorisé, perte ou divulgation.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

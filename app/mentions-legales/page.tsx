import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de Soleil Pour Tous.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <Link href="/" className="text-sm font-medium text-sun-600 hover:underline">
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
          Mentions légales
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft">
          <p className="rounded-2xl bg-sun-50 p-4 text-sun-700">
            Les informations d&apos;identification ci-dessous ([Raison sociale],
            [SIREN/SIRET], [adresse du siège]…) doivent être complétées avec les
            données réelles de la société avant toute mise en ligne définitive.
          </p>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Éditeur du site</h2>
            <p className="mt-3">
              Raison sociale : [Raison sociale]
              <br />
              Forme juridique : [Forme juridique]
              <br />
              Capital social : [Capital social]
              <br />
              Siège social : [Adresse du siège social]
              <br />
              SIREN/SIRET : [Numéro SIREN/SIRET]
              <br />
              Numéro RCS : [Numéro RCS]
              <br />
              Directeur de la publication : [Nom du directeur de la publication]
              <br />
              Contact : [Adresse email de contact]
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Hébergement</h2>
            <p className="mt-3">
              Hébergeur : [Nom de l&apos;hébergeur]
              <br />
              Adresse : [Adresse de l&apos;hébergeur]
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Propriété intellectuelle</h2>
            <p className="mt-3">
              L&apos;ensemble des contenus présents sur ce site (textes, visuels,
              logos) est la propriété de Soleil Pour Tous, sauf mention
              contraire, et ne peut être reproduit sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-ink">Responsabilité</h2>
            <p className="mt-3">
              Soleil Pour Tous s&apos;efforce d&apos;assurer l&apos;exactitude
              des informations diffusées sur ce site, notamment concernant les
              aides financières mentionnées, qui évoluent régulièrement et sont
              données à titre indicatif. Soleil Pour Tous ne garantit aucune
              aide sans validation complète du dossier du client.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

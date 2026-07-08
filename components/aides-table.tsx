import { AlertTriangle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";

const AIDES: {
  nom: string;
  description: string;
  status: string;
  variant: BadgeProps["variant"];
}[] = [
  {
    nom: "TVA réduite",
    description:
      "TVA réduite applicable sous conditions selon la puissance et la nature de l'installation.",
    status: "Disponible selon conditions",
    variant: "conditional",
  },
  {
    nom: "Obligation d'achat / revente du surplus",
    description:
      "Possibilité de revendre le surplus d'électricité produit à un acheteur obligé via contrat d'achat.",
    status: "Disponible selon conditions",
    variant: "conditional",
  },
  {
    nom: "Exonération d'impôt sur le revenu",
    description:
      "Possible sous conditions pour certaines installations photovoltaïques de faible puissance.",
    status: "Disponible selon conditions",
    variant: "conditional",
  },
  {
    nom: "Aides locales",
    description:
      "Certaines régions, départements ou communes peuvent proposer des aides complémentaires.",
    status: "Variable selon la zone géographique",
    variant: "volt",
  },
  {
    nom: "Prime à l'autoconsommation",
    description:
      "Cette prime a été supprimée pour les nouveaux dossiers depuis juin 2026. Elle peut rester applicable uniquement à certains anciens dossiers déjà validés.",
    status: "Non disponible pour les nouveaux dossiers, sauf cas particulier",
    variant: "unavailable",
  },
];

export function AidesTable() {
  return (
    <section id="aides" className="anchor-offset bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
            Cadre légal
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Les aides disponibles pour le photovoltaïque en France
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-3xl border border-line shadow-card-sm">
          {/* Desktop table */}
          <table className="hidden w-full text-left md:table">
            <thead>
              <tr className="bg-night text-white">
                <th className="px-6 py-4 font-display text-sm font-semibold">Aide</th>
                <th className="px-6 py-4 font-display text-sm font-semibold">Description</th>
                <th className="px-6 py-4 font-display text-sm font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {AIDES.map((aide, i) => (
                <tr
                  key={aide.nom}
                  className={i % 2 === 0 ? "bg-white" : "bg-paper"}
                >
                  <td className="px-6 py-5 align-top font-display text-sm font-semibold text-ink">
                    {aide.nom}
                  </td>
                  <td className="px-6 py-5 align-top text-sm leading-relaxed text-mist">
                    {aide.description}
                  </td>
                  <td className="px-6 py-5 align-top">
                    <Badge variant={aide.variant}>{aide.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile stacked cards */}
          <div className="divide-y divide-line md:hidden">
            {AIDES.map((aide) => (
              <div key={aide.nom} className="bg-white p-6">
                <p className="font-display text-base font-semibold text-ink">
                  {aide.nom}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  {aide.description}
                </p>
                <Badge variant={aide.variant} className="mt-3">
                  {aide.status}
                </Badge>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-6 flex items-start gap-3 rounded-2xl bg-sun-50 p-5 text-sm text-sun-700"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            Les aides évoluent régulièrement. Les informations présentées sont
            données à titre indicatif et doivent être confirmées lors de
            l&apos;étude personnalisée.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

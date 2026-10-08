import { AlertTriangle, Minus, Equal } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { TypePac } from "@/lib/cee-dispositifs";

// Fourchettes de prix indicatives, non contractuelles — fourniture + pose,
// hors aides, à titre pédagogique uniquement. Le prix réel dépend du
// dimensionnement, de l'état du logement et du devis de l'installateur.
const COST_RANGES: Record<TypePac, { range: string; note: string }> = {
  "air-eau": {
    range: "8 000 € – 16 000 €",
    note: "Pose standard en remplacement d'une chaudière, hors travaux annexes (radiateurs, réseau hydraulique).",
  },
  "eau-eau": {
    range: "15 000 € – 25 000 €",
    note: "Inclut le captage (forage ou capteurs enterrés), qui représente une part importante du coût total.",
  },
  "air-air": {
    range: "5 000 € – 10 000 €",
    note: "Selon le nombre d'unités intérieures (mono ou multi-split) et la surface à couvrir.",
  },
};

const ROWS = [
  { label: "Coût estimé du projet", sublabel: "Fourchette indicative, fourniture et pose" },
  { label: "Prime CEE potentielle", sublabel: "Si calcul vérifiable — sinon \"à confirmer\"", operator: "minus" as const },
  { label: "MaPrimeRénov' potentielle", sublabel: "Si éligibilité et barème confirmés", operator: "minus" as const },
  { label: "Reste à charge estimatif", sublabel: "Communiqué précisément après étude", operator: "equal" as const },
];

export function PacCostBreakdown({ typePac }: { typePac: TypePac }) {
  const cost = COST_RANGES[typePac];

  return (
    <Reveal className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
        Reste à charge estimatif
      </span>
      <h3 className="mt-2 font-display text-xl font-semibold text-ink">
        Comment se calcule votre reste à charge
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-mist">
        Aucun montant d&apos;aide n&apos;est garanti avant étude et confirmation
        auprès d&apos;un partenaire habilité. Voici la méthode de calcul, pas un
        résultat chiffré pour votre situation.
      </p>

      <div className="mt-6 space-y-3">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-4 rounded-2xl bg-paper px-4 py-3.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-mist">
              {row.operator === "minus" && <Minus className="h-4 w-4" aria-hidden="true" />}
              {row.operator === "equal" && <Equal className="h-4 w-4" aria-hidden="true" />}
              {!row.operator && <span className="text-xs font-bold">€</span>}
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-ink">{row.label}</p>
              <p className="text-xs text-mist">{row.sublabel}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-sun-50 p-4">
        <p className="text-sm font-semibold text-sun-800">
          Exemple illustratif — {cost.range}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-sun-700">{cost.note}</p>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-paper p-4 text-xs leading-relaxed text-mist">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-sun-600" aria-hidden="true" />
        <p>
          Prix hors devis réel, aides soumises à conditions de ressources et à
          plafonds pouvant entraîner un écrêtement. Votre prime CEE
          potentielle doit être confirmée auprès d&apos;un partenaire habilité.
          Informations vérifiées le 07/09/2026.
        </p>
      </div>
    </Reveal>
  );
}

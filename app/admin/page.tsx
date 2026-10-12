import type { Metadata } from "next";
import { AlertTriangle, TrendingUp, Users } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase";
import { TYPE_TRAVAUX_LABELS } from "@/lib/lead-schema";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  created_at: string;
  kind: "early" | "complet";
  classification: "prioritaire" | "a_approfondir" | "non_qualifie";
  type_travaux: string[];
  prenom: string | null;
  ville: string | null;
  code_postal: string | null;
  departement: string | null;
  telephone: string | null;
  email: string | null;
};

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const CLASSIFICATION_LABELS: Record<LeadRow["classification"], string> = {
  prioritaire: "Prioritaire",
  a_approfondir: "À approfondir",
  non_qualifie: "Non qualifié",
};

const CLASSIFICATION_STYLES: Record<LeadRow["classification"], string> = {
  prioritaire: "bg-leaf-500/10 text-leaf-600",
  a_approfondir: "bg-sun-500/10 text-sun-700",
  non_qualifie: "bg-mist/10 text-mist",
};

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-sun-600" aria-hidden="true" />
        <h1 className="mt-4 font-display text-xl font-bold text-ink">
          Supabase n&apos;est pas encore configuré
        </h1>
        <p className="mt-2 text-sm text-mist">
          Ajoutez <code>SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code> dans
          les variables d&apos;environnement Netlify, exécutez{" "}
          <code>supabase/schema.sql</code> dans l&apos;éditeur SQL Supabase, puis
          redéployez.
        </p>
      </div>
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, created_at, kind, classification, type_travaux, prenom, ville, code_postal, departement, telephone, email"
    )
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-500" aria-hidden="true" />
        <h1 className="mt-4 font-display text-xl font-bold text-ink">
          Erreur de lecture Supabase
        </h1>
        <p className="mt-2 text-sm text-mist">{error.message}</p>
      </div>
    );
  }

  const leads = (data ?? []) as LeadRow[];

  const today = startOfDay(new Date());
  const weekAgo = daysAgo(7);

  const leadsToday = leads.filter((l) => new Date(l.created_at) >= today).length;
  const leadsThisWeek = leads.filter((l) => new Date(l.created_at) >= weekAgo).length;
  const completLeads = leads.filter((l) => l.kind === "complet").length;
  const earlyLeads = leads.filter((l) => l.kind === "early").length;
  const completionRate = earlyLeads + completLeads > 0
    ? Math.round((completLeads / (earlyLeads + completLeads)) * 100)
    : 0;

  const byClassification = {
    prioritaire: leads.filter((l) => l.classification === "prioritaire").length,
    a_approfondir: leads.filter((l) => l.classification === "a_approfondir").length,
    non_qualifie: leads.filter((l) => l.classification === "non_qualifie").length,
  };

  const byCategory = new Map<string, number>();
  for (const lead of leads) {
    for (const t of lead.type_travaux ?? []) {
      byCategory.set(t, (byCategory.get(t) ?? 0) + 1);
    }
  }
  const categoryRows = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
  const maxCategoryCount = categoryRows[0]?.[1] ?? 1;

  const byDepartment = new Map<string, number>();
  for (const lead of leads) {
    if (!lead.departement) continue;
    byDepartment.set(lead.departement, (byDepartment.get(lead.departement) ?? 0) + 1);
  }
  const departmentRows = Array.from(byDepartment.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const recent = leads.slice(0, 30);

  return (
    <div className="min-h-screen bg-paper pb-24">
      <header className="border-b border-line bg-white px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sun-700">
              Soleil Pour Tous
            </p>
            <h1 className="font-display text-xl font-bold text-ink">Tableau de bord leads</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile icon={Users} label="Leads au total" value={leads.length} />
          <StatTile icon={TrendingUp} label="Aujourd'hui" value={leadsToday} />
          <StatTile icon={TrendingUp} label="Cette semaine" value={leadsThisWeek} />
          <StatTile
            icon={TrendingUp}
            label="Taux de complétion"
            value={`${completionRate} %`}
            hint={`${completLeads} complets / ${earlyLeads} partiels`}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-sm font-semibold text-ink">Qualification</h2>
            <div className="mt-4 space-y-3">
              {(["prioritaire", "a_approfondir", "non_qualifie"] as const).map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${CLASSIFICATION_STYLES[key]}`}>
                    {CLASSIFICATION_LABELS[key]}
                  </span>
                  <span className="font-display text-sm font-bold text-ink">
                    {byClassification[key]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-white p-6 lg:col-span-2">
            <h2 className="font-display text-sm font-semibold text-ink">Par catégorie de projet</h2>
            <div className="mt-4 space-y-2.5">
              {categoryRows.length === 0 && <p className="text-sm text-mist">Aucune donnée pour l&apos;instant.</p>}
              {categoryRows.map(([key, count]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 truncate text-xs font-medium text-ink-soft">
                    {TYPE_TRAVAUX_LABELS[key as keyof typeof TYPE_TRAVAUX_LABELS] ?? key}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sun-400 to-sun-600"
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs font-semibold text-ink">{count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-line bg-white p-6">
          <h2 className="font-display text-sm font-semibold text-ink">Top départements</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {departmentRows.length === 0 && <p className="text-sm text-mist">Aucune donnée pour l&apos;instant.</p>}
            {departmentRows.map(([dept, count]) => (
              <span
                key={dept}
                className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft"
              >
                {dept} <span className="text-mist">· {count}</span>
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-line bg-white">
          <h2 className="px-6 pt-6 font-display text-sm font-semibold text-ink">
            Leads récents
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-line bg-paper text-xs uppercase tracking-wide text-mist">
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Prénom</th>
                  <th className="px-6 py-3 font-semibold">Contact</th>
                  <th className="px-6 py-3 font-semibold">Ville</th>
                  <th className="px-6 py-3 font-semibold">Projet</th>
                  <th className="px-6 py-3 font-semibold">Statut</th>
                  <th className="px-6 py-3 font-semibold">Qualification</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((lead) => (
                  <tr key={lead.id} className="border-b border-line last:border-0">
                    <td className="whitespace-nowrap px-6 py-3 text-xs text-mist">
                      {new Date(lead.created_at).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-3 font-medium text-ink">{lead.prenom ?? "—"}</td>
                    <td className="px-6 py-3 text-xs text-ink-soft">
                      {lead.telephone ?? lead.email ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-ink-soft">
                      {lead.ville ?? "—"} {lead.code_postal ? `(${lead.code_postal})` : ""}
                    </td>
                    <td className="px-6 py-3 text-xs text-ink-soft">
                      {(lead.type_travaux ?? [])
                        .map((t) => TYPE_TRAVAUX_LABELS[t as keyof typeof TYPE_TRAVAUX_LABELS] ?? t)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          lead.kind === "complet" ? "bg-leaf-500/10 text-leaf-600" : "bg-volt-500/10 text-volt-600"
                        }`}
                      >
                        {lead.kind === "complet" ? "Complet" : "Partiel"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CLASSIFICATION_STYLES[lead.classification]}`}
                      >
                        {CLASSIFICATION_LABELS[lead.classification]}
                      </span>
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-mist">
                      Aucun lead pour l&apos;instant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sun-500/10 text-sun-700">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-3 font-display text-2xl font-bold text-ink">{value}</p>
      <p className="text-xs font-medium text-mist">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-mist/70">{hint}</p>}
    </div>
  );
}

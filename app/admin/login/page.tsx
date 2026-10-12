"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missingConfig = searchParams.get("missing") === "1";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de connexion.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erreur réseau — réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-card">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-night text-white">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-center font-display text-xl font-bold text-ink">
          Tableau de bord — Soleil Pour Tous
        </h1>
        <p className="mt-1.5 text-center text-sm text-mist">Accès réservé à l&apos;équipe.</p>

        {missingConfig && (
          <p className="mt-4 rounded-xl bg-sun-50 p-3 text-xs text-sun-700">
            La variable d&apos;environnement <code>ADMIN_PASSWORD</code> n&apos;est pas
            configurée sur ce déploiement.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !password}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

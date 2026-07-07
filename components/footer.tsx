import Link from "next/link";
import { Sun } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-night pb-28 pt-16 text-white/60 sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sun-400 to-sun-600">
                <Sun className="h-5 w-5 text-white" strokeWidth={2.5} />
              </span>
              Soleil Pour Tous
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Étude d&apos;éligibilité gratuite pour l&apos;installation de
              panneaux photovoltaïques en France.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-white">
              Politique de confidentialité
            </Link>
            <a href="#eligibilite" className="hover:text-white">
              Consentement RGPD
            </a>
          </nav>
        </div>

        <div className="mt-12 space-y-3 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/40">
          <p>
            Soleil Pour Tous ne garantit aucune aide sans validation complète
            du dossier. Les informations relatives aux aides sont données à
            titre indicatif et peuvent évoluer.
          </p>
          <p>© {new Date().getFullYear()} Soleil Pour Tous. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

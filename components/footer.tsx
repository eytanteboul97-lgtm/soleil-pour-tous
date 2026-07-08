import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-night pb-28 pt-16 text-white/60 sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Simulateur d&apos;éligibilité gratuit pour vos travaux de
              rénovation énergétique — panneaux solaires, pompes à chaleur,
              isolation et plus.
            </p>
          </div>

          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/mentions-legales" className="focus-ring-dark rounded-sm hover:text-white">
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="focus-ring-dark rounded-sm hover:text-white"
            >
              Politique de confidentialité
            </Link>
            <a href="#eligibilite" className="focus-ring-dark rounded-sm hover:text-white">
              Consentement RGPD
            </a>
          </nav>
        </div>

        <div className="mt-12 space-y-3 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/60">
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

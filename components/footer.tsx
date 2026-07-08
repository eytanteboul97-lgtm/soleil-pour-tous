import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="bg-night pb-28 pt-16 text-white/60 sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Simulateur d&apos;éligibilité gratuit pour vos travaux de
              rénovation énergétique — panneaux solaires, pompes à chaleur,
              isolation et plus.
            </p>
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/40">
              Soleil Pour Tous est la plateforme de qualification utilisée
              par HABINNOVA pour évaluer votre éligibilité aux aides.
            </p>
          </div>

          <div className="text-sm">
            <p className="mb-3 font-display font-semibold text-white">HABINNOVA</p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" aria-hidden="true" />
                <span>4 Avenue Laurent-Cély, 92600 Asnières-sur-Seine</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-sun-400" aria-hidden="true" />
                <a href="tel:+33185782775" className="hover:text-white">
                  01 85 78 27 75
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-sun-400" aria-hidden="true" />
                <a href="mailto:contact@habinnova.fr" className="hover:text-white">
                  contact@habinnova.fr
                </a>
              </li>
            </ul>
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

        <div className="mt-12 space-y-3 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/60">
          <p>
            HABINNOVA ne garantit aucune aide sans validation complète du
            dossier. Les informations relatives aux aides sont données à
            titre indicatif et peuvent évoluer.
          </p>
          <p>© {new Date().getFullYear()} HABINNOVA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

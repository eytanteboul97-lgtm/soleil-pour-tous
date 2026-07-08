import { ClipboardCheck, FileBarChart2, UserCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Je teste mon éligibilité",
    description: "Je remplis le simulateur en moins de 2 minutes.",
  },
  {
    icon: UserCheck,
    title: "Un conseiller analyse mon dossier",
    description: "Un expert Soleil Pour Tous étudie mon profil et ma situation.",
  },
  {
    icon: FileBarChart2,
    title: "Je reçois une estimation personnalisée",
    description: "Dimensionnement, économies estimées et aides applicables.",
  },
  {
    icon: Wrench,
    title: "Installation et mise en service",
    description: "Pose par des professionnels qualifiés, puis raccordement.",
  },
];

export function ProcessSection() {
  return (
    <section id="etapes" className="anchor-offset bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-sun-700">
            Comment ça marche
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
            Un parcours simple, en 4 étapes
          </h2>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-line lg:block" />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sun-400 to-sun-600 text-white shadow-glow">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="mt-4 font-display text-xs font-bold uppercase tracking-wide text-sun-700">
                Étape {i + 1}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

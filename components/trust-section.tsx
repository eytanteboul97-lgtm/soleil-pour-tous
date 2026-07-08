import { BadgeCheck, ClipboardList, HardHat, SlidersHorizontal, Wallet } from "lucide-react";
import { Reveal } from "@/components/reveal";

const ITEMS = [
  { icon: Wallet, label: "Étude gratuite" },
  { icon: ClipboardList, label: "Accompagnement administratif" },
  { icon: HardHat, label: "Installation par professionnels qualifiés" },
  { icon: SlidersHorizontal, label: "Simulation personnalisée" },
  { icon: BadgeCheck, label: "Aides vérifiées selon votre profil" },
];

export function TrustSection() {
  return (
    <section aria-label="Nos engagements" className="border-y border-line bg-paper py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 0.05}
              className="group flex flex-col items-center text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sun-700 shadow-card-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-glow">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-medium text-ink-soft">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

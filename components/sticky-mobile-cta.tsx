"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StickyMobileCTA({
  label = "Tester mon éligibilité",
  href = "#eligibilite",
  watchId = "eligibilite",
}: {
  label?: string;
  href?: string;
  watchId?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);

    // Certaines pages (fiches /aides/[slug], /professionnels) n'ont pas
    // l'élément observé par défaut ("eligibilite", propre à la homepage) :
    // dans ce cas on se rabat sur un simple seuil de scroll plutôt que de ne
    // jamais afficher le CTA.
    if (!target) {
      const onScroll = () => setVisible(window.scrollY > 480);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night/95 p-4 backdrop-blur-xl sm:hidden"
        >
          <a href={href} className={cn(buttonVariants({ className: "w-full" }))}>
            {label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

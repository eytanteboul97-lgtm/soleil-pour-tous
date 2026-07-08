"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("eligibilite");
    if (!form) return;

    // The chat is now the first section on the page, so the sticky CTA
    // only needs to appear once the visitor has scrolled past it.
    const formObserver = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.15 }
    );

    formObserver.observe(form);
    return () => formObserver.disconnect();
  }, []);

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
          <Button
            className="w-full"
            onClick={() =>
              document.getElementById("eligibilite")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Tester mon éligibilité
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

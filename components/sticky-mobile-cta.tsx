"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroHeight = window.innerHeight * 0.8;
    const target = document.getElementById("eligibilite");

    const onScroll = () => {
      setVisible((prev) => {
        if (window.scrollY < heroHeight) return false;
        return prev;
      });
      if (window.scrollY >= heroHeight) setVisible(true);
    };

    let observer: IntersectionObserver | undefined;
    if (target) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible(false);
          else if (window.scrollY >= heroHeight) setVisible(true);
        },
        { threshold: 0.3 }
      );
      observer.observe(target);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
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
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

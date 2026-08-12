"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/lib/site";

/**
 * Door-opening intro loader — twin walnut panels part to reveal the page.
 */
export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setDone(true);
      document.documentElement.style.overflow = "";
    }, 2600);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.9 } }}
          aria-hidden
        >
          {/* Left leaf */}
          <motion.div
            className="wood wood-walnut absolute inset-y-0 left-0 w-1/2 origin-left"
            style={{ boxShadow: "inset -30px 0 60px rgba(0,0,0,0.5)" }}
            exit={{
              rotateY: 74,
              transition: { duration: 1.3, delay: 0.15, ease: [0.7, 0, 0.3, 1] },
            }}
          />
          {/* Right leaf */}
          <motion.div
            className="wood wood-walnut absolute inset-y-0 right-0 w-1/2 origin-right"
            style={{ boxShadow: "inset 30px 0 60px rgba(0,0,0,0.5)" }}
            exit={{
              rotateY: -74,
              transition: { duration: 1.3, delay: 0.15, ease: [0.7, 0, 0.3, 1] },
            }}
          />
          {/* Center seam glow */}
          <motion.div
            className="absolute inset-y-[10%] left-1/2 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(255,205,140,0.9), transparent)",
              boxShadow: "0 0 24px 4px rgba(232,168,96,0.5)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          />
          {/* Brand mark */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.5 } }}
          >
            <div className="font-serif text-4xl tracking-[0.16em] text-champagne md:text-6xl">
              {site.shortName.toUpperCase()}
            </div>
            <motion.div
              className="mx-auto mt-4 h-px w-40 bg-gradient-to-r from-transparent via-copper to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            />
            <div className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-ivory-dim">
              Industries · Doors &amp; Plywood · Est. {new Date().getFullYear() - site.stats.years}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

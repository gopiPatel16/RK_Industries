"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/chrome/BrandLogo";
import { site } from "@/lib/site";

/**
 * Door-opening intro loader — twin panels part to reveal the page.
 *
 * The leaves are painted in the site's own background colour rather than the
 * procedural `.wood` texture: that texture is built from CSS gradients, which
 * each browser dithers differently, so the splash read as a different colour on
 * Android, iOS and desktop instead of as part of the site.
 */
export default function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setDone(true);
      document.documentElement.style.overflow = "";
    }, 1100);
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
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.45 } }}
          aria-hidden
        >
          {/* Left leaf */}
          <motion.div
            className="ambient absolute inset-y-0 left-0 w-1/2 origin-left bg-walnut-950"
            style={{ boxShadow: "inset -30px 0 60px rgba(0,0,0,0.45)" }}
            exit={{
              rotateY: 74,
              transition: { duration: 0.75, delay: 0.05, ease: [0.7, 0, 0.3, 1] },
            }}
          />
          {/* Right leaf */}
          <motion.div
            className="ambient absolute inset-y-0 right-0 w-1/2 origin-right bg-walnut-950"
            style={{ boxShadow: "inset 30px 0 60px rgba(0,0,0,0.45)" }}
            exit={{
              rotateY: -74,
              transition: { duration: 0.75, delay: 0.05, ease: [0.7, 0, 0.3, 1] },
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
            transition={{ delay: 0.25, duration: 0.5 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          />
          {/* Brand mark */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.3 } }}
          >
            {/* the navbar wordmark, scaled up — same two-tone lettering and door mark */}
            <BrandLogo
              className="items-center"
              showTagline={false}
              sizeClass="text-4xl md:text-6xl"
            />
            <motion.div
              className="mx-auto mt-4 h-px w-40 bg-gradient-to-r from-transparent via-copper to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <div className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-ivory-dim">
              Plywood · Flush Doors · Block Boards · Est.{" "}
              {new Date().getFullYear() - site.stats.years}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

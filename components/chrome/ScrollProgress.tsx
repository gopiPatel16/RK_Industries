"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--copper), var(--copper-bright))",
        boxShadow: "0 0 12px rgba(232,168,96,0.6)",
      }}
      aria-hidden
    />
  );
}

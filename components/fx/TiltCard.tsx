"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** 3D tilt-on-hover card with lift and dynamic sheen. */
export default function TiltCard({
  children,
  className,
  max = 9,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 140,
    damping: 16,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 140,
    damping: 16,
  });

  return (
    <motion.div
      ref={ref}
      className={cn("group [transform-style:preserve-3d]", className)}
      style={{ rotateX: rx, rotateY: ry, perspective: 1200 }}
      whileHover={{ y: -12, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

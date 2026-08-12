"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient cursor glow — a warm copper halo that trails the pointer
 * and swells over interactive elements. Pointer devices only.
 */
export default function Cursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const glow = glowRef.current!;
    const dot = dotRef.current!;
    let x = -200, y = -200, gx = x, gy = y;
    let hot = false;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      hot = !!t.closest("a, button, [data-cursor]");
    };

    const tick = () => {
      gx += (x - gx) * 0.12;
      gy += (y - gy) * 0.12;
      const s = hot ? 1.8 : 1;
      glow.style.transform = `translate3d(${gx - 160}px, ${gy - 160}px, 0) scale(${s})`;
      dot.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0) scale(${hot ? 2.2 : 1})`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden>
      <div
        ref={glowRef}
        className="absolute h-80 w-80 rounded-full opacity-50 transition-[scale] duration-300 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(232,168,96,0.14), rgba(232,168,96,0.04) 45%, transparent 70%)",
        }}
      />
      <div
        ref={dotRef}
        className="absolute h-1.5 w-1.5 rounded-full bg-copper-bright transition-[scale] duration-200 will-change-transform"
      />
    </div>
  );
}

"use client";

import { useMemo } from "react";

/** Floating wood-dust motes — pure CSS, deterministic seeds. */
export default function Dust({ count = 18 }: { count?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rand = (n: number) => ((seed * (n + 1)) % 997) / 997;
        return {
          left: rand(1) * 100,
          size: 1.5 + rand(2) * 2.5,
          delay: rand(3) * 18,
          duration: 14 + rand(4) * 16,
          dx: (rand(5) - 0.5) * 120,
        };
      }),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute bottom-[-4%] rounded-full bg-copper-bright/60"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            boxShadow: "0 0 6px 1px rgba(232,168,96,0.4)",
            animation: `drift ${m.duration}s linear ${-m.delay}s infinite`,
            ["--dx" as string]: `${m.dx}px`,
          }}
        />
      ))}
    </div>
  );
}

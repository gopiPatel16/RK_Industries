"use client";

import { motion } from "framer-motion";
import { Reveal, SplitText } from "@/components/fx/Reveal";
import { site } from "@/lib/site";
import { scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";

/* Stylized dot-matrix India — 24 × 26 grid ('#' = land) */
const grid = [
  "......##................",
  ".....####...............",
  "....#####...............",
  "....######..............",
  "...########.............",
  "...#########............",
  "..###########...........",
  ".#############..........",
  ".###############........",
  ".################.######",
  "#######################.",
  "###################.....",
  "###################.....",
  "#################.......",
  "..##############........",
  "...############.........",
  "...###########..........",
  "....##########..........",
  "....#########...........",
  ".....########...........",
  ".....#######............",
  "......######............",
  "......#####.............",
  "......####..............",
  ".......###..............",
  ".......##...............",
];

/* Chhattisgarh sits roughly here in the grid */
const isCG = (col: number, row: number) =>
  col >= 10 && col <= 13 && row >= 12 && row <= 15;

type City = {
  name: string;
  x: number; // % of map width
  y: number; // % of map height
  kind: "hq" | "active" | "upcoming";
};

const cities: City[] = [
  { name: "Raipur — HQ & Works", x: 48, y: 56, kind: "hq" },
  { name: "Chhattisgarh", x: 51, y: 53, kind: "active" },
  { name: "Odisha", x: 58, y: 62, kind: "active" },
  { name: "Gondia", x: 44, y: 57, kind: "active" },
  { name: "Nagpur", x: 40, y: 58, kind: "active" },
  { name: "Jabalpur", x: 38, y: 48, kind: "active" },
];

export default function DealerMap() {
  return (
    <section className="relative overflow-hidden border-y border-champagne/8 bg-walnut-900/25 py-28 lg:py-36">
      <div className="ambient pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Reveal>
            <div className="eyebrow mb-5">Customer network</div>
          </Reveal>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
            <SplitText text="Rooted in Chhattisgarh. Reaching across India." />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ivory-dim">
              {site.stats.customers}+ customers stock {site.shortName} today across
              Chhattisgarh, Odisha, Jabalpur, Gondia and Nagpur — all served from our
              works in Birgaon.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-8 space-y-3 text-[0.78rem]">
              <div className="flex items-center gap-3 text-ivory-dim">
                <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-copper-bright/40" />
                  <span className="h-2.5 w-2.5 rounded-full bg-copper-bright shadow-[0_0_10px_rgba(232,168,96,0.9)]" />
                </span>
                Headquarters &amp; factory — Birgaon, Raipur
              </div>
              <div className="flex items-center gap-3 text-ivory-dim">
                <span className="mx-0.5 h-2 w-2 rounded-full bg-champagne/80" />
                Customer cities &amp; states
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <button onClick={() => scrollToSection("#contact")} className="btn-ghost mt-9 inline-flex">
              Become a Customer
            </button>
          </Reveal>
        </div>

        {/* Map */}
        <Reveal className="relative mx-auto w-full max-w-lg">
          <div className="relative" style={{ aspectRatio: "24 / 26" }}>
            {/* land dots */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: "repeat(24, 1fr)",
                gridTemplateRows: "repeat(26, 1fr)",
              }}
              aria-hidden
            >
              {grid.flatMap((row, r) =>
                row.split("").map((cell, c) =>
                  cell === "#" ? (
                    <div key={`${r}-${c}`} className="flex items-center justify-center" style={{ gridColumn: c + 1, gridRow: r + 1 }}>
                      <span
                        className={cn(
                          "block h-[38%] w-[38%] rounded-full",
                          isCG(c, r)
                            ? "bg-copper shadow-[0_0_8px_rgba(201,138,75,0.8)]"
                            : "bg-champagne/20"
                        )}
                      />
                    </div>
                  ) : null
                )
              )}
            </div>

            {/* city markers */}
            {cities.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
              >
                {city.kind === "hq" ? (
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-copper-bright/40" />
                    <span className="h-3 w-3 rounded-full bg-copper-bright shadow-[0_0_14px_rgba(232,168,96,1)]" />
                  </span>
                ) : city.kind === "active" ? (
                  <span className="block h-2 w-2 rounded-full bg-champagne shadow-[0_0_6px_rgba(233,213,184,0.8)]" />
                ) : (
                  <span className="block h-2 w-2 rounded-full border border-copper bg-transparent" />
                )}
                <span className="glass-strong pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-[0.62rem] text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {city.name}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center text-[0.6rem] uppercase tracking-[0.3em] text-ivory-dim/50">
            Stylized network map · not to scale
          </div>
        </Reveal>
      </div>
    </section>
  );
}

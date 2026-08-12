"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DoorVisual, {
  type DoorFinish,
  type DoorHandle,
  type DoorInlay,
} from "@/components/door/DoorVisual";
import { Reveal, SplitText } from "@/components/fx/Reveal";
import { scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const finishes: { id: DoorFinish; label: string; swatch: string }[] = [
  { id: "walnut", label: "Walnut", swatch: "#3a2212" },
  { id: "teak", label: "Golden Teak", swatch: "#6b4a24" },
  { id: "oak", label: "Nordic Oak", swatch: "#8f6c42" },
  { id: "mahogany", label: "Mahogany", swatch: "#4e2415" },
  { id: "wenge", label: "Wengé", swatch: "#241610" },
];

const handles: { id: DoorHandle; label: string }[] = [
  { id: "bar", label: "Copper Bar" },
  { id: "knob", label: "Classic Knob" },
  { id: "recessed", label: "Recessed Pull" },
];

const inlays: { id: DoorInlay; label: string }[] = [
  { id: "plain", label: "Seamless" },
  { id: "twin", label: "Twin Inlay" },
  { id: "quad", label: "Quad Inlay" },
];

const thicknesses = ["25 mm", "30 mm", "32 mm", "35 mm", "38 mm"];
const frames = ["Teak Frame", "Sal Frame", "Frameless"];

function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-ivory-dim">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-[0.75rem] font-medium transition-all duration-300",
        active
          ? "border-copper bg-copper/15 text-copper-bright shadow-[0_0_18px_rgba(201,138,75,0.25)]"
          : "border-champagne/15 text-ivory-dim hover:border-champagne/35 hover:text-ivory"
      )}
    >
      {children}
    </button>
  );
}

/** Live door configurator — every change previews instantly. */
export default function Configurator() {
  const [finish, setFinish] = useState<DoorFinish>("walnut");
  const [handle, setHandle] = useState<DoorHandle>("bar");
  const [inlay, setInlay] = useState<DoorInlay>("twin");
  const [thickness, setThickness] = useState("32 mm");
  const [frame, setFrame] = useState("Teak Frame");

  const finishLabel = finishes.find((f) => f.id === finish)!.label;

  return (
    <section id="configurator" className="relative scroll-mt-20 overflow-hidden py-28 lg:py-36">
      <div className="ambient pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="eyebrow mb-5">Design yours</div>
        </Reveal>
        <h2 className="max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
          <SplitText text="Compose the door. We'll craft it." />
        </h2>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* Live preview */}
          <Reveal className="mx-auto w-full max-w-xs">
            <motion.div
              key={finish + handle + inlay}
              initial={{ opacity: 0.6, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <DoorVisual finish={finish} handle={handle} inlay={inlay} open={6} glow />
            </motion.div>
            <div className="glass mt-10 rounded-2xl p-4 text-center text-[0.72rem] leading-relaxed text-ivory-dim">
              <span className="text-champagne">{finishLabel}</span> · {thickness} ·{" "}
              {frame} · {handles.find((h) => h.id === handle)!.label} ·{" "}
              {inlays.find((i) => i.id === inlay)!.label}
            </div>
          </Reveal>

          {/* Controls */}
          <div className="space-y-8">
            <OptionGroup label="Veneer & Finish">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFinish(f.id)}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 transition-all duration-300",
                    finish === f.id
                      ? "border-copper bg-copper/12 shadow-[0_0_18px_rgba(201,138,75,0.25)]"
                      : "border-champagne/15 hover:border-champagne/35"
                  )}
                  aria-pressed={finish === f.id}
                >
                  <span
                    className="h-7 w-7 rounded-full border border-black/40"
                    style={{
                      background: `linear-gradient(135deg, ${f.swatch}, #1a0d05)`,
                      boxShadow: "inset 0 1px 2px rgba(255,255,255,0.2)",
                    }}
                  />
                  <span
                    className={cn(
                      "text-[0.75rem] font-medium",
                      finish === f.id ? "text-copper-bright" : "text-ivory-dim group-hover:text-ivory"
                    )}
                  >
                    {f.label}
                  </span>
                </button>
              ))}
            </OptionGroup>

            <OptionGroup label="Handle">
              {handles.map((h) => (
                <Chip key={h.id} active={handle === h.id} onClick={() => setHandle(h.id)}>
                  {h.label}
                </Chip>
              ))}
            </OptionGroup>

            <OptionGroup label="Inlay Design">
              {inlays.map((i) => (
                <Chip key={i.id} active={inlay === i.id} onClick={() => setInlay(i.id)}>
                  {i.label}
                </Chip>
              ))}
            </OptionGroup>

            <OptionGroup label="Thickness">
              {thicknesses.map((t) => (
                <Chip key={t} active={thickness === t} onClick={() => setThickness(t)}>
                  {t}
                </Chip>
              ))}
            </OptionGroup>

            <OptionGroup label="Frame">
              {frames.map((f) => (
                <Chip key={f} active={frame === f} onClick={() => setFrame(f)}>
                  {f}
                </Chip>
              ))}
            </OptionGroup>

            <button onClick={() => scrollToSection("#contact")} className="btn-primary mt-2">
              Get This Door Quoted
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

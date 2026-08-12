"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock, Layers, DoorOpen } from "lucide-react";
import DoorVisual from "@/components/door/DoorVisual";
import TiltCard from "@/components/fx/TiltCard";
import { Reveal, SplitText, staggerParent, staggerChild } from "@/components/fx/Reveal";
import { scrollToSection } from "@/lib/lenis";

/* ── Card 1 · Flush Doors — leaf swings open, light leaks out ── */
function DoorsCard() {
  const [hover, setHover] = useState(false);
  return (
    <CardShell
      id="doors"
      onHover={setHover}
      title="Flush Doors"
      kicker="Signature Collection"
      copy="Solid-core flush doors with seasoned hardwood frames, calibrated cores and hand-finished natural veneers. Silent, seasoned, and built to outlive the walls around them."
      cta="Explore Doors"
      icon={DoorOpen}
    >
      <div className="relative mx-auto w-[42%] transition-transform duration-700 group-hover:scale-[1.04]">
        <DoorVisual finish="walnut" handle="bar" open={hover ? 22 : 0} glow={hover} />
      </div>
    </CardShell>
  );
}

/* ── Card 2 · Plywood — exploded layer reveal ── */
const plyLayers = [
  { cls: "wood-oak", h: 10 },
  { cls: "wood-teak", h: 7 },
  { cls: "wood-walnut", h: 9 },
  { cls: "wood-mahogany", h: 7 },
  { cls: "wood-walnut", h: 9 },
  { cls: "wood-teak", h: 7 },
  { cls: "wood-oak", h: 10 },
];

function PlywoodCard() {
  return (
    <CardShell
      id="plywood"
      title="Plywood"
      kicker="Engineered Panels"
      copy="BWP-grade marine and commercial plywood — odd-ply balanced construction, phenolic bonding and 100% composed cores. Every sheet calibrated, every bond boil-proof."
      cta="Explore Plywood"
      icon={Layers}
    >
      <div
        className="mx-auto flex w-[64%] flex-col items-center justify-center gap-[3px] transition-all duration-700 [transform:rotateX(58deg)_rotateZ(-38deg)] [transform-style:preserve-3d] group-hover:gap-[14px]"
        style={{ perspective: "900px" }}
      >
        {plyLayers.map((l, i) => (
          <div
            key={i}
            className={`wood ${l.cls} w-full rounded-[3px] shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-transform duration-700`}
            style={{
              height: l.h * 2.4,
              transform: `translateZ(${(i - 3) * 2}px)`,
              transitionDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>
    </CardShell>
  );
}

/* ── Card 3 · Coming Soon — frosted glass mystery ── */
function ComingSoonCard() {
  return (
    <CardShell
      id="coming-soon"
      title="A Third Chapter"
      kicker="New Division"
      copy="Something new is taking shape on our factory floor. A third craft, engineered with the same obsession. Watch this space."
      cta="Notify Me"
      icon={Lock}
      soon
    >
      <div className="relative mx-auto flex aspect-[10/16] w-[46%] items-center justify-center">
        {/* blurred silhouette */}
        <div className="wood wood-wenge absolute inset-0 rounded-xl opacity-70 blur-md" />
        <div className="glass absolute inset-0 rounded-xl backdrop-blur-2xl" />
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            boxShadow: "0 0 60px 8px rgba(232,168,96,0.25)",
            animation: "pulseGlow 3s ease-in-out infinite",
          }}
        />
        <div className="relative z-10 text-center">
          <div className="font-serif text-5xl text-champagne/80">?</div>
          <div className="mt-2 rounded-full border border-copper/50 bg-walnut-950/70 px-3 py-1 text-[0.58rem] uppercase tracking-[0.22em] text-copper-bright">
            Launching Soon
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/* ── Shared shell ── */
function CardShell({
  id,
  title,
  kicker,
  copy,
  cta,
  icon: Icon,
  children,
  onHover,
  soon = false,
}: {
  id?: string;
  title: string;
  kicker: string;
  copy: string;
  cta: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  onHover?: (v: boolean) => void;
  soon?: boolean;
}) {
  return (
    <motion.div variants={staggerChild} id={id} className="scroll-mt-28">
      <TiltCard className="h-full">
        <div
          className="glass reflect noise group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-8 transition-shadow duration-500 hover:shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
          onMouseEnter={() => onHover?.(true)}
          onMouseLeave={() => onHover?.(false)}
          data-cursor
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(70% 50% at 50% 0%, rgba(201,138,75,0.12), transparent 70%)",
            }}
          />
          <div className="mb-3 flex items-center justify-between">
            <span className="eyebrow">{kicker}</span>
            <Icon size={16} className="text-copper/70" />
          </div>
          <h3 className="font-serif text-3xl text-ivory">{title}</h3>

          <div className="relative my-8 flex h-64 items-center md:h-72">
            {children}
          </div>

          <p className="text-[0.83rem] leading-relaxed text-ivory-dim">{copy}</p>
          <button
            onClick={() => scrollToSection(soon ? "#contact" : "#configurator")}
            className="mt-6 inline-flex items-center gap-2 self-start text-[0.8rem] font-semibold text-copper-bright transition-colors group-hover:text-champagne"
          >
            {cta}
            <ArrowUpRight
              size={15}
              className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </button>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28 lg:py-36">
      <Reveal>
        <div className="eyebrow mb-5">What we make</div>
      </Reveal>
      <h2 className="max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
        <SplitText text="Three crafts. One obsession with permanence." />
      </h2>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-16 grid gap-7 md:grid-cols-3"
        style={{ perspective: "1600px" }}
      >
        <DoorsCard />
        <PlywoodCard />
        <ComingSoonCard />
      </motion.div>
    </section>
  );
}

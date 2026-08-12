"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import DoorVisual from "@/components/door/DoorVisual";
import Dust from "@/components/fx/Dust";
import { Reveal, SplitText } from "@/components/fx/Reveal";
import { scrollToSection } from "@/lib/lenis";

/**
 * "Open the Door to Excellence" — hover leaks light, click flies the
 * camera through the doorway into the next section.
 */
export default function DoorExperience() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [travelling, setTravelling] = useState(false);

  const travel = () => {
    if (travelling || !stageRef.current) return;
    setTravelling(true);
    const tl = gsap.timeline({
      onComplete: () => {
        scrollToSection("#process");
        gsap.to(stageRef.current, {
          scale: 1,
          opacity: 1,
          filter: "brightness(1)",
          duration: 0.8,
          delay: 0.9,
          onComplete: () => setTravelling(false),
        });
      },
    });
    tl.to(stageRef.current, {
      scale: 7,
      opacity: 0,
      filter: "brightness(2.2)",
      transformOrigin: "50% 42%",
      duration: 1.4,
      ease: "power3.in",
    });
  };

  return (
    <section className="noise relative overflow-hidden py-32 lg:py-44">
      {/* deep vignette environment */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 42%, #221207 0%, #130906 55%, #0b0503 100%)",
        }}
      />
      {hover && <Dust count={22} />}

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <div className="eyebrow mb-5">An invitation</div>
        </Reveal>
        <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-tight text-ivory">
          <SplitText text="Open the Door to Excellence." />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ivory-dim">
            Hover to let the light through. Step inside to see how a door is truly made.
          </p>
        </Reveal>

        <div
          ref={stageRef}
          className="relative mx-auto mt-16 w-56 will-change-transform md:w-64"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Radiating light rays */}
          <div
            className="pointer-events-none absolute inset-[-60%] transition-opacity duration-1000"
            style={{
              opacity: hover ? 1 : 0,
              background:
                "conic-gradient(from 180deg at 50% 45%, transparent 0deg, rgba(255,196,120,0.07) 12deg, transparent 26deg, rgba(255,196,120,0.05) 44deg, transparent 60deg, rgba(255,196,120,0.08) 88deg, transparent 108deg, rgba(255,196,120,0.05) 150deg, transparent 175deg, rgba(255,196,120,0.09) 195deg, transparent 220deg, rgba(255,196,120,0.05) 260deg, transparent 290deg, rgba(255,196,120,0.07) 330deg, transparent 360deg)",
              filter: "blur(2px)",
            }}
          />
          {/* Halo */}
          <div
            className="pointer-events-none absolute inset-[-30%] rounded-full transition-opacity duration-1000"
            style={{
              opacity: hover ? 0.9 : 0.25,
              background:
                "radial-gradient(circle, rgba(232,168,96,0.22), transparent 65%)",
              filter: "blur(10px)",
            }}
          />
          <button
            onClick={travel}
            className="relative block w-full"
            aria-label="Enter — see the manufacturing process"
            data-cursor
          >
            <DoorVisual
              finish="mahogany"
              handle="knob"
              inlay="quad"
              open={hover ? 16 : 0}
              glow={hover}
            />
          </button>
        </div>

        <Reveal delay={0.3}>
          <div className="mt-14 text-[0.65rem] uppercase tracking-[0.35em] text-ivory-dim/70">
            {travelling ? "Entering…" : "Click the door to step through"}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

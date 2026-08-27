"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  type MotionValue,
} from "framer-motion";
import { scrollToSection } from "@/lib/lenis";
import { currentTheme } from "@/lib/hero-theme";
import DoorVisual from "@/components/door/DoorVisual";
import Magnetic from "@/components/fx/Magnetic";
import Dust from "@/components/fx/Dust";

/**
 * Homepage hero with two switchable visual themes (see lib/hero-theme.ts):
 *  "artisan"        — THE ARTISAN WORKSHOP: the interior photograph
 *                     (public/images/hero-interior-v5.jpg) shown full-screen and
 *                     uncovered, with drifting dust over it.
 *  "luxury-gallery" — LUXURY PRODUCT GALLERY: dark showroom gradient, a
 *                     glowing golden halo behind the CSS door, drifting
 *                     smoke, idle door rotation.
 * The photograph carries its own headline and callouts, so no copy is laid
 * over it — see the note in the markup.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

type SceneProps = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  sceneY: MotionValue<number>;
};

/* ════════════════════════════════════════════════════════════
   THEME 1 · THE ARTISAN WORKSHOP — photo backdrop
   ════════════════════════════════════════════════════════════ */
function ArtisanScene({ sx, sy, sceneY }: SceneProps) {
  const bgX = useTransform(sx, [-1, 1], [12, -12]);
  const bgY = useTransform(sy, [-1, 1], [8, -8]);

  return (
    <motion.div
      style={{ y: sceneY }}
      /* On phones the banner is a 4:3 block and the only thing in the section's
         flow, so the section is exactly its height: slightly zoomed in from the
         artwork's native 3:2, trimming ~6% from each side — short of the outer
         callouts. From lg up it is the full-bleed background again. */
      className="pointer-events-none relative aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto"
      aria-hidden
    >
      {/*
        The photograph is a 3:2 banner carrying its own product callouts, so it
        is only ever cropped well inside them: on phones a 4:3 frame trims ~6%
        from each side, and from lg up the viewport is wider than 3:2 so `cover`
        fills the screen showing the full width. Over-scaled by 3% so the
        parallax drift never exposes an edge.
      */}
      <motion.div
        className="absolute inset-[-3%]"
        style={{ x: bgX, y: bgY }}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 1.2, ease: easeOut }}
      >
        <Image
          src="/images/hero-interior-v5.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[62%_center]"
        />
      </motion.div>

      {/* Only enough shading to seat the navbar — the photograph carries the hero */}
      <div
        className="absolute inset-x-0 top-0 h-28"
        style={{
          background: "linear-gradient(180deg, rgba(10,7,5,0.55), transparent)",
        }}
      />

      {/* Floating wood dust */}
      <Dust count={18} />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 100% at 50% 45%, transparent 68%, rgba(4,2,1,0.42) 100%)",
        }}
      />

      {/* On phones the copy is overlaid on the artwork rather than stacked
          below it, so the left side is graded down far enough to read against.
          It fades out well before the PLYWOOD callout on the right. */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            "radial-gradient(115% 78% at 0% 16%, rgba(19,9,6,0.95) 0%, rgba(19,9,6,0.86) 26%, rgba(19,9,6,0.55) 46%, rgba(19,9,6,0.18) 64%, transparent 78%)",
        }}
      />

      {/* A short fade at the very bottom so the banner meets Our Story cleanly. */}
      <div
        className="absolute inset-x-0 bottom-0 h-16 lg:hidden"
        style={{ background: "linear-gradient(180deg, transparent, #130906)" }}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   THEME 2 · LUXURY PRODUCT GALLERY — halo showroom
   ════════════════════════════════════════════════════════════ */
function GalleryScene({ sx, sy, sceneY }: SceneProps) {
  const doorRot = useTransform(sx, [-1, 1], [-4.5, 4.5]);
  const doorTilt = useTransform(sy, [-1, 1], [1.2, -1.2]);
  const poolX = useTransform(sx, [-1, 1], [-14, 14]);
  const haloX = useTransform(sx, [-1, 1], [8, -8]);

  return (
    <motion.div
      style={{ y: sceneY }}
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      {/* Dark premium gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 75% at 66% 38%, #1c1109 0%, #100a06 48%, #0A0705 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(20,12,7,0.9) 55%, #0A0705)",
        }}
      />

      {/* ── Showroom rig: halo → smoke → door → reflection ── */}
      <div className="absolute inset-y-0 left-1/2 w-[min(92vw,36rem)] -translate-x-1/2 lg:left-[63%]">
        {/* Golden circular halo behind the door */}
        <motion.div
          className="absolute bottom-[10%] left-1/2 z-[1] w-[21rem] -translate-x-1/2 sm:w-[25rem] xl:w-[29rem]"
          style={{ x: haloX }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 1.8, ease: easeOut }}
        >
          <div className="relative aspect-square">
            {/* soft breathing glow disc */}
            <div
              className="absolute inset-[-12%] rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(212,161,90,0.16), rgba(212,161,90,0.05) 60%, transparent 78%)",
                filter: "blur(18px)",
                animation: "pulseGlow 6s ease-in-out infinite",
              }}
            />
            {/* crisp golden ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1.5px solid rgba(212,161,90,0.55)",
                boxShadow:
                  "0 0 40px rgba(212,161,90,0.25), inset 0 0 40px rgba(212,161,90,0.12)",
              }}
            />
            {/* slowly-rotating shimmer arc */}
            <div
              className="absolute inset-[-2px] rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 6%, rgba(255,216,155,0.9) 16%, transparent 30%, transparent 55%, rgba(212,161,90,0.45) 68%, transparent 82%)",
                WebkitMask:
                  "radial-gradient(closest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
                mask: "radial-gradient(closest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
                animation: "spinSlow 26s linear infinite",
              }}
            />
          </div>
        </motion.div>

        {/* Soft smoke drifting through the showroom */}
        {[
          { left: "8%", bottom: "6%", size: "16rem", dur: "17s", delay: "0s" },
          { left: "46%", bottom: "3%", size: "22rem", dur: "23s", delay: "6s" },
          { left: "68%", bottom: "8%", size: "14rem", dur: "20s", delay: "12s" },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: s.left,
              bottom: s.bottom,
              width: s.size,
              height: s.size,
              background:
                "radial-gradient(closest-side, rgba(235,205,165,0.07), transparent 70%)",
              filter: "blur(30px)",
              animation: `smokeRise ${s.dur} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}

        {/* Golden pool on the floor */}
        <motion.div
          className="absolute bottom-[4%] left-1/2 h-24 w-[125%] -translate-x-1/2"
          style={{ x: poolX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1.6 }}
        >
          <div
            className="absolute inset-0 rounded-[50%]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(212,161,90,0.3), rgba(212,161,90,0.08) 55%, transparent 80%)",
              filter: "blur(14px)",
            }}
          />
        </motion.div>

        {/* Door's reflection in the polished floor */}
        <motion.div
          className="absolute bottom-0 left-1/2 z-[2] h-[12%] w-[11.5rem] -translate-x-1/2 overflow-hidden sm:w-[13rem] xl:w-[14.5rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.28 }}
          transition={{ delay: 3.2, duration: 1.8 }}
        >
          <div
            className="absolute inset-x-0 top-0 aspect-[10/21] origin-top -scale-y-100"
            style={{
              maskImage: "linear-gradient(0deg, transparent 10%, #000 88%)",
              WebkitMaskImage: "linear-gradient(0deg, transparent 10%, #000 88%)",
              filter: "blur(3px) brightness(0.7)",
            }}
          >
            <DoorVisual finish="walnut" handle="bar" inlay="plain" />
          </div>
        </motion.div>

        {/* Contact shadow where the door meets the floor */}
        <motion.div
          className="absolute bottom-[11.4%] left-1/2 h-5 w-[13rem] -translate-x-1/2 sm:w-[14.5rem] xl:w-[16rem]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,0,0,0.85), transparent 78%)",
            filter: "blur(7px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.1, duration: 1.2 }}
        />

        {/* The door — rises, then idles with a slow sway inside the halo */}
        <motion.div
          className="absolute bottom-[12%] left-1/2 z-[3] w-[11.5rem] -translate-x-1/2 sm:w-[13rem] xl:w-[14.5rem]"
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.75, duration: 1.6, ease: easeOut }}
        >
          <motion.div
            style={{ rotateY: doorRot, rotateX: doorTilt, perspective: 1200 }}
            className="relative [transform-style:preserve-3d]"
          >
            <motion.div
              animate={{ rotateY: [-2.5, 2.5] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: 4.4,
              }}
              className="[transform-style:preserve-3d]"
            >
              <DoorVisual finish="walnut" handle="bar" inlay="plain" />
              {/* warm highlight from the halo */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "radial-gradient(95% 60% at 50% 40%, rgba(255,208,140,0.22), rgba(255,190,115,0.06) 55%, transparent 80%)",
                  mixBlendMode: "screen",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating ambient particles */}
      <Dust count={16} />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 55% 40%, transparent 52%, rgba(4,2,1,0.78) 100%)",
        }}
      />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO — shared shell + content (identical across themes)
   ════════════════════════════════════════════════════════════ */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // ── Mouse tracking, shared by both scenes ──
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });

  // ── Scroll parallax ──
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section
      id="home"
      ref={ref}
      /* On phones the height comes from the stacked banner + copy; from lg up
         the copy is overlaid on the full-screen photograph. */
      className="noise relative overflow-hidden bg-[#130906] lg:min-h-svh"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
    >
      {/* ════ SCENE (theme-switched) ════ */}
      {currentTheme === "luxury-gallery" ? (
        <GalleryScene sx={sx} sy={sy} sceneY={sceneY} />
      ) : (
        <ArtisanScene sx={sx} sy={sy} sceneY={sceneY} />
      )}

      {/*
        The copy sits in the empty wall on the left of the photograph, kept to a
        narrow column so it never runs into the artwork's own BLOCK BOARD
        callout. It is overlaid at every width — on phones it is absolutely
        positioned over the banner and stepped down in size, so the section is
        exactly as tall as the artwork and Our Story follows straight after it
        with no empty band between.
      */}
      <div className="absolute inset-0 z-20 flex flex-col justify-start px-3 pt-[4.2rem] lg:inset-y-0 lg:left-0 lg:w-[38%] lg:max-w-xl lg:justify-center lg:px-10 lg:pb-40 lg:pt-0">
        {/* Headline and sub-line share a hairline rule down their left edge.
            Sans-serif and small on purpose: the photograph is the hero, and a
            serif display size at this width sat on top of the artwork. */}
        <motion.div
          className="max-w-[8.5rem] border-l border-champagne/30 pl-3 sm:max-w-[16rem] lg:max-w-none lg:pl-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: easeOut }}
        >
          <h1 className="font-sans text-[clamp(0.72rem,2.6vw,1.6rem)] font-bold uppercase leading-[1.22] tracking-[0.03em] text-[#E8B98A]">
            Built with quality.
            <br />
            Made to last.
          </h1>

          <p className="mt-1.5 max-w-md text-[clamp(0.56rem,1.55vw,0.92rem)] leading-[1.5] text-ivory-dim lg:mt-4">
            Premium Flush Doors, Plywood &amp; Block Boards &mdash; engineered
            for strength, crafted for excellence.
          </p>
        </motion.div>

        <motion.div
          className="mt-2.5 flex flex-wrap items-center gap-3 pl-3 [&_.btn-primary]:!px-3 [&_.btn-primary]:!py-1.5 [&_.btn-primary]:!text-[0.6rem] lg:mt-7 lg:gap-5 lg:pl-6 lg:[&_.btn-primary]:!px-6 lg:[&_.btn-primary]:!py-3 lg:[&_.btn-primary]:!text-[0.82rem]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: easeOut }}
        >
          <Magnetic>
            <button onClick={() => scrollToSection("#configurator")} className="btn-primary">
              Order Your Door
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Blend into the next (walnut) section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] hidden h-24 lg:block"
        style={{ background: "linear-gradient(180deg, transparent, #130906)" }}
        aria-hidden
      />
    </section>
  );
}

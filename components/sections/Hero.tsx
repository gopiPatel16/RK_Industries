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
import { currentTheme } from "@/lib/hero-theme";
import DoorVisual from "@/components/door/DoorVisual";
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
      className="pointer-events-none absolute inset-0"
      aria-hidden
    >
      {/*
        The photograph is a 3:2 banner carrying its own product callouts, so how
        it is fitted has to change with the viewport:
          · narrow/portrait screens — `contain`, so the whole composition and
            all three callouts stay readable instead of being sliced apart;
          · lg and wider, where the viewport is finally wider than 3:2 —
            `cover`, which fills the screen while still showing the full width.
        Over-scaled by 3% so the parallax drift never exposes an edge.
      */}
      <motion.div
        className="absolute inset-[-3%]"
        style={{ x: bgX, y: bgY }}
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 2.4, ease: easeOut }}
      >
        <Image
          src="/images/hero-interior-v5.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-center lg:object-cover lg:object-[62%_center]"
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
      /* shorter on phones/tablets, where the banner is letterboxed rather than
         filling the screen, so it doesn't float in a sea of empty dark */
      className="noise relative min-h-[58svh] overflow-hidden bg-[#0A0705] sm:min-h-[66svh] lg:min-h-svh"
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
        No overlaid copy: the photograph is a finished piece of artwork with its
        own headline and product callouts, so anything laid on top collides with
        it. The navbar's "Request a Quote" carries the call to action.
      */}

      {/* Blend into the next (walnut) section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-24"
        style={{ background: "linear-gradient(180deg, transparent, #130906)" }}
        aria-hidden
      />
    </section>
  );
}

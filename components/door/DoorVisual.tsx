"use client";

import { cn } from "@/lib/utils";

export type DoorFinish = "walnut" | "teak" | "oak" | "wenge" | "mahogany";
export type DoorHandle = "bar" | "knob" | "recessed";
export type DoorInlay = "twin" | "quad" | "plain";

const finishClass: Record<DoorFinish, string> = {
  walnut: "wood-walnut",
  teak: "wood-teak",
  oak: "wood-oak",
  wenge: "wood-wenge",
  mahogany: "wood-mahogany",
};

/**
 * A premium flush door rendered entirely in CSS — wood grain via SVG
 * turbulence, copper hardware, optional warm light-leak when ajar.
 * `open` = degrees the leaf swings toward the viewer (hinged left).
 */
export default function DoorVisual({
  finish = "walnut",
  handle = "bar",
  inlay = "twin",
  open = 0,
  glow = false,
  className,
}: {
  finish?: DoorFinish;
  handle?: DoorHandle;
  inlay?: DoorInlay;
  open?: number;
  glow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("relative aspect-[10/21] select-none", className)}
      style={{ perspective: "1400px" }}
    >
      {/* Warm interior light behind the leaf */}
      <div
        className="absolute inset-[3%] rounded-lg transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, rgba(255,196,120,0.9), rgba(232,150,70,0.5) 55%, transparent 80%)",
          opacity: glow || open > 4 ? 1 : 0,
          filter: "blur(6px)",
        }}
      />

      {/* Door frame */}
      <div className="absolute inset-0 rounded-xl border-[6px] border-[#241208] bg-transparent shadow-[0_30px_80px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(201,138,75,0.25)]" />

      {/* Door leaf */}
      <div
        className="absolute inset-[3%] origin-left rounded-md transition-transform duration-700 [transform-style:preserve-3d]"
        style={{
          transform: `rotateY(${-open}deg)`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className={cn(
            "wood absolute inset-0 overflow-hidden rounded-md",
            finishClass[finish]
          )}
          style={{
            boxShadow:
              "inset 0 0 0 1px rgba(0,0,0,0.5), inset 6px 0 18px rgba(0,0,0,0.35), 0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* vertical grain sheen */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.09), transparent 22%, rgba(0,0,0,0.22) 55%, transparent 78%, rgba(255,255,255,0.05))",
            }}
          />
          {/* copper inlay lines */}
          {inlay !== "plain" && (
            <div className="absolute inset-x-[16%] inset-y-[7%] flex flex-col justify-between">
              {Array.from({ length: inlay === "twin" ? 2 : 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(232,168,96,0.75), transparent)",
                    boxShadow: "0 0 8px rgba(232,168,96,0.35)",
                  }}
                />
              ))}
            </div>
          )}
          {/* Handles (right edge, hinged left) */}
          {handle === "bar" && (
            <div
              className="absolute right-[9%] top-1/2 h-[22%] w-[3.5%] -translate-y-1/2 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, #f0c896, #b87a3e 45%, #8a5626 55%, #d9a566)",
                boxShadow:
                  "0 4px 14px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,240,214,0.8)",
              }}
            />
          )}
          {handle === "knob" && (
            <div
              className="absolute right-[8%] top-1/2 aspect-square w-[9%] -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #f5d3a4, #b87a3e 55%, #7a4a20)",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.55), inset 0 1px 2px rgba(255,240,214,0.9)",
              }}
            />
          )}
          {handle === "recessed" && (
            <div
              className="absolute right-[7%] top-1/2 h-[14%] w-[4.5%] -translate-y-1/2 rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.35))",
                boxShadow:
                  "inset 0 2px 6px rgba(0,0,0,0.9), 0 1px 0 rgba(232,168,96,0.4)",
              }}
            />
          )}
        </div>
        {/* leaf edge (visible when ajar) */}
        <div
          className="absolute right-0 top-0 h-full w-[10px] origin-right rounded-r-sm bg-[#1d0f07]"
          style={{ transform: "rotateY(90deg) translateX(5px)" }}
        />
      </div>

      {/* Light leak through the gap when ajar */}
      <div
        className="pointer-events-none absolute inset-y-[4%] right-[2.5%] w-[3%] rounded-full transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(255,205,140,0.95) 20%, rgba(255,205,140,0.95) 80%, transparent)",
          filter: "blur(4px)",
          opacity: open > 2 ? 1 : 0,
        }}
      />

      {/* Floor reflection */}
      <div
        className="absolute -bottom-[7%] left-[6%] right-[6%] h-[6%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(50% 100% at 50% 0%, rgba(232,168,96,0.18), transparent 75%)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}

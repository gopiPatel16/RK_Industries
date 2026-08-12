"use client";

import { Star } from "lucide-react";
import { Reveal, SplitText } from "@/components/fx/Reveal";

type Quote = { name: string; role: string; text: string };

const dealers: Quote[] = [
  {
    name: "Suresh Agrawal",
    role: "Dealer · Raipur",
    text: "Eleven years of stocking Radha Krishna. Not one warped door returned. My customers ask for the brand by name now.",
  },
  {
    name: "Meena Timber Mart",
    role: "Dealer · Bilaspur",
    text: "Delivery is always on the promised day. In this trade, that alone is worth gold.",
  },
  {
    name: "Vikas Ply House",
    role: "Dealer · Nagpur",
    text: "Their BWP ply survives our monsoon season better than brands that cost thirty percent more.",
  },
  {
    name: "Sharda Traders",
    role: "Dealer · Bhilai",
    text: "Margins are fair, marketing support is real, and the factory picks up the phone. Rare combination.",
  },
];

const customers: Quote[] = [
  {
    name: "Ar. Priya Deshmukh",
    role: "Architect · Pune",
    text: "I specify Radha Krishna flush doors for every residential project. The veneer matching is genuinely editorial-grade.",
  },
  {
    name: "Rohit & Anjali Verma",
    role: "Homeowners · Raipur",
    text: "Seven years, two kids, one very enthusiastic dog — the doors still close like the day they were hung.",
  },
  {
    name: "Hotel Amaltas",
    role: "Hospitality · Jabalpur",
    text: "142 rooms fitted in one order. Zero rejections at site. Our contractor was stunned.",
  },
  {
    name: "Dr. Kavita Rao",
    role: "Clinic Owner · Durg",
    text: "We needed doors that handle sanitisation chemicals daily. Three years in, the finish hasn't dulled.",
  },
];

function Card({ q }: { q: Quote }) {
  return (
    <figure className="glass reflect w-[20rem] shrink-0 rounded-2xl p-6 md:w-[24rem]">
      <div className="flex gap-1 text-copper-bright">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} className="fill-current" />
        ))}
      </div>
      <blockquote className="mt-4 text-[0.85rem] leading-relaxed text-ivory">
        &ldquo;{q.text}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-copper/40 bg-walnut-900 font-serif text-sm text-copper-bright">
          {q.name.charAt(0)}
        </span>
        <span>
          <span className="block text-[0.78rem] font-semibold text-champagne">{q.name}</span>
          <span className="block text-[0.66rem] text-ivory-dim">{q.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Marquee({ quotes, reverse = false, speed = 46 }: { quotes: Quote[]; reverse?: boolean; speed?: number }) {
  const doubled = [...quotes, ...quotes];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className="animate-marquee flex w-max gap-5"
        style={{
          ["--speed" as string]: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((q, i) => (
          <Card key={i} q={q} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="eyebrow mb-5">Word of mouth</div>
        </Reveal>
        <h2 className="max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
          <SplitText text="Trusted by the trade. Loved at home." />
        </h2>
      </div>
      <div className="mt-14 space-y-5">
        <Marquee quotes={dealers} speed={52} />
        <Marquee quotes={customers} reverse speed={46} />
      </div>
    </section>
  );
}

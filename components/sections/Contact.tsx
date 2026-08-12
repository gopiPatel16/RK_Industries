"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, MessageCircle, Send, CheckCircle2, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal, SplitText } from "@/components/fx/Reveal";
import Magnetic from "@/components/fx/Magnetic";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-xl border border-champagne/15 bg-walnut-900/50 px-4 py-3 text-sm text-ivory placeholder:text-ivory-dim/50 outline-none transition-colors focus:border-copper";

export default function Contact() {
  const [kind, setKind] = useState<"product" | "dealer">("product");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Enquiry type: ${kind === "dealer" ? "Dealer partnership" : "Product enquiry"}`,
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `City: ${data.get("city")}`,
      `Interested in: ${data.get("interest")}`,
      "",
      `${data.get("message")}`,
    ].join("\n");
    window.open(
      `mailto:${site.email}?subject=${encodeURIComponent(
        `${kind === "dealer" ? "Dealer" : "Quote"} enquiry — ${data.get("name")}`
      )}&body=${encodeURIComponent(body)}`
    );
    setSent(true);
  };

  return (
    <section id="contact" className="ambient noise relative scroll-mt-20 overflow-hidden py-28 lg:py-36">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="eyebrow mb-5">Get in touch</div>
        </Reveal>
        <h2 className="max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
          <SplitText text="Let's build your entrance." />
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          {/* ── Form ── */}
          <Reveal className="glass reflect rounded-[1.75rem] p-7 md:p-9">
            {/* Enquiry type toggle */}
            <div className="mb-7 inline-flex rounded-full border border-champagne/15 p-1">
              {(
                [
                  ["product", "Product Enquiry"],
                  ["dealer", "Dealer Partnership"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setKind(id)}
                  className={cn(
                    "rounded-full px-5 py-2 text-[0.75rem] font-semibold transition-all duration-300",
                    kind === id
                      ? "bg-gradient-to-r from-copper-bright to-copper text-walnut-950 shadow-[0_4px_16px_rgba(201,138,75,0.35)]"
                      : "text-ivory-dim hover:text-ivory"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center py-16 text-center"
                >
                  <CheckCircle2 size={40} className="text-copper-bright" />
                  <div className="mt-4 font-serif text-2xl text-ivory">Draft opened in your mail app</div>
                  <p className="mt-2 max-w-sm text-sm text-ivory-dim">
                    Hit send there, or ping us on WhatsApp — we reply within one working day.
                  </p>
                  <button onClick={() => setSent(false)} className="btn-ghost mt-7 text-xs">
                    Send another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={onSubmit}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <input required name="name" placeholder="Your name" className={inputCls} />
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="Phone / WhatsApp"
                    className={inputCls}
                  />
                  <input name="city" placeholder="City" className={inputCls} />
                  <select name="interest" className={inputCls} defaultValue="Flush Doors">
                    <option>Flush Doors</option>
                    <option>Plywood</option>
                    <option>Both</option>
                    <option>New Division (waitlist)</option>
                  </select>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={
                      kind === "dealer"
                        ? "Tell us about your business — location, current brands, monthly volume…"
                        : "Tell us about your project — sizes, quantity, finish…"
                    }
                    className={cn(inputCls, "sm:col-span-2")}
                  />
                  <div className="sm:col-span-2">
                    <Magnetic>
                      <button type="submit" className="btn-primary">
                        Send Enquiry <Send size={14} />
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>

          {/* ── Direct channels + map ── */}
          <div className="flex flex-col gap-5">
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-5">
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi ${site.shortName} Industries, I'd like a quote`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="glass reflect group flex flex-col gap-2 rounded-2xl p-5"
                >
                  <MessageCircle size={18} className="text-[#3ddc71]" />
                  <div className="text-sm font-semibold text-ivory">WhatsApp Us</div>
                  <div className="text-[0.7rem] text-ivory-dim">Fastest reply · {site.phone}</div>
                </a>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="glass reflect group flex flex-col gap-2 rounded-2xl p-5"
                >
                  <Phone size={18} className="text-copper-bright" />
                  <div className="text-sm font-semibold text-ivory">Call the Works</div>
                  <div className="text-[0.7rem] text-ivory-dim">{site.hours}</div>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="glass rounded-2xl p-5">
                <div className="flex gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-copper-bright" />
                  <div>
                    <div className="text-sm font-semibold text-ivory">Factory &amp; Office</div>
                    <p className="mt-1 text-[0.78rem] leading-relaxed text-ivory-dim">{site.address}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-ivory-dim">
                      <Clock size={11} className="text-copper" /> {site.hours}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3} className="min-h-56 flex-1 overflow-hidden rounded-2xl border border-champagne/12">
              <iframe
                title={`${site.name} factory location — Birgaon, Raipur`}
                src={`https://www.google.com/maps?q=${site.mapsQuery}&output=embed`}
                className="h-full min-h-56 w-full"
                style={{ filter: "invert(0.88) hue-rotate(185deg) saturate(0.4) brightness(0.9)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

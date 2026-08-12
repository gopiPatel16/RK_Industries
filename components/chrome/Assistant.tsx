"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { site } from "@/lib/site";
import { scrollToSection } from "@/lib/lenis";

/**
 * Radha Krishna concierge — a client-side product assistant.
 * Keyword-matched answers built from the site config + product knowledge,
 * with WhatsApp/call fallbacks. No backend required (works static on Vercel).
 * Swap `reply()` for a server route + LLM later if a live AI is wanted.
 */

type Action = { label: string; kind: "scroll" | "wa" | "call"; target?: string };
type Msg = { id: number; role: "user" | "bot"; text: string; actions?: Action[] };

const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  `Hi ${site.shortName} Industries, I'd like some help`
)}`;
const telHref = `tel:${site.phone.replace(/\s/g, "")}`;
const inr = new Intl.NumberFormat("en-IN");

const QUICK = [
  "Your products",
  "Sizes & thickness",
  "Pricing",
  "Warranty",
  "Visit / contact",
];

function reply(raw: string): { text: string; actions?: Action[] } {
  const q = raw.toLowerCase();
  const has = (...k: string[]) => k.some((x) => q.includes(x));
  // Whole-word match — for short acronyms that would over-match as substrings
  // (e.g. "isi" inside "visit", "ply" inside "supply").
  const word = (...k: string[]) =>
    k.some((x) => new RegExp(`\\b${x}\\b`).test(q));

  if (has("hi ", "hello", "hey", "namaste", "namaskar") || q === "hi")
    return {
      text: `Namaste! 🙏 Ask me about our flush doors, plywood, sizes, finishes, pricing, warranty or where to find us.`,
    };

  if (has("product", "what do you", "what all", "offer", "catalog", "catalogue", "range"))
    return {
      text: "We craft three things: premium solid-core flush doors, BWP-grade plywood, and a third division launching soon. Which would you like to explore?",
      actions: [
        { label: "Flush doors", kind: "scroll", target: "#doors" },
        { label: "Plywood", kind: "scroll", target: "#plywood" },
      ],
    };

  if (has("pric", "cost", "rate", "quote", "budget", "kitna", "kitne"))
    return {
      text: "Every order is quoted to spec — price depends on size, core, veneer and finish. Share your requirement and we'll send an exact quote, usually within a working day.",
      actions: [
        { label: "Request a quote", kind: "scroll", target: "#contact" },
        { label: "WhatsApp us", kind: "wa" },
      ],
    };

  if (has("configur", "customi", "design my", "build my", "compose"))
    return {
      text: "You can compose your door live — veneer, finish, handle, inlay, thickness and frame — in our configurator.",
      actions: [{ label: "Open configurator", kind: "scroll", target: "#configurator" }],
    };

  if (word("ply") || has("plywood"))
    return {
      text: "We make BWP-grade marine & commercial plywood — odd-ply balanced construction, phenolic (boil-proof) bonding and 100% composed cores. It shrugs off monsoon humidity and daily wear.",
      actions: [{ label: "Explore plywood", kind: "scroll", target: "#plywood" }],
    };

  if (has("flush door", "door", "darwaza"))
    return {
      text: "Our flush doors are solid-core with kiln-seasoned hardwood frames, calibrated cores and hand-finished natural veneers — silent, warp-resistant and built to last generations. Finishes: walnut, teak, oak, mahogany, wengé; thickness 25–38 mm.",
      actions: [
        { label: "Explore doors", kind: "scroll", target: "#doors" },
        { label: "Customise one", kind: "scroll", target: "#configurator" },
      ],
    };

  if (has("size", "dimension", "height", "width", "measure"))
    return {
      text: "Standard door heights run 6'6\" to 8' and widths 2' to 4', plus fully custom sizes to your opening. Thickness: 25, 30, 32, 35 and 38 mm.",
      actions: [
        { label: "Pick a size", kind: "scroll", target: "#configurator" },
        { label: "Ask the team", kind: "wa" },
      ],
    };

  if (has("thick"))
    return {
      text: "Flush doors come in 25, 30, 32, 35 and 38 mm. 30–35 mm suits most rooms; 38 mm is popular for main entrances.",
      actions: [{ label: "Choose thickness", kind: "scroll", target: "#configurator" }],
    };

  if (has("finish", "veneer", "colour", "color", "texture", "shade", "laminate"))
    return {
      text: "Choose from walnut, golden teak, nordic oak, mahogany and wengé finishes, with twin, quad or seamless copper inlays. See them live in the configurator.",
      actions: [{ label: "Preview finishes", kind: "scroll", target: "#configurator" }],
    };

  if (has("warrant", "guarantee"))
    return {
      text: "Our flush doors carry a 10-year warranty against delamination and warping.",
    };

  if (word("isi", "iso") || has("certif", "quality", "standard", "grade"))
    return {
      text: "We're ISI marked and ISO 9001:2015 certified, and every door is inspected twice before dispatch.",
    };

  if (has("waterproof", "bwp", "water", "monsoon", "humid", "bathroom", "kitchen"))
    return {
      text: "Our plywood is BWP (Boiling Water Proof) grade with phenolic bonding — it stays true through monsoons and wet areas like kitchens and bathrooms.",
      actions: [{ label: "Explore plywood", kind: "scroll", target: "#plywood" }],
    };

  if (has("deliver", "ship", "dispatch", "transport", "courier", "supply"))
    return {
      text: `We dispatch across ${site.stats.cities}+ cities through ${site.stats.dealers}+ dealer partners. Share your city and we'll point you to the nearest one.`,
      actions: [{ label: "WhatsApp us", kind: "wa" }],
    };

  if (has("dealer", "distributor", "partner", "franchise", "wholesale", "reseller"))
    return {
      text: "We'd love to add you to our dealer network. Send your business details and city, and our team will follow up on margins and support.",
      actions: [
        { label: "Dealer enquiry", kind: "scroll", target: "#contact" },
        { label: "WhatsApp us", kind: "wa" },
      ],
    };

  if (has("where", "location", "address", "factory", "visit", "map", "direction", "come to"))
    return {
      text: `You'll find our works at ${site.address}. Open ${site.hours}.`,
      actions: [
        { label: "Get in touch", kind: "scroll", target: "#contact" },
        { label: "Call us", kind: "call" },
      ],
    };

  if (has("hour", "timing", "open", "close", "time"))
    return { text: `We're open ${site.hours}.` };

  if (has("contact", "phone", "call", "number", "email", "whatsapp", "reach"))
    return {
      text: `Reach us on ${site.phone} (call or WhatsApp) or ${site.email}.`,
      actions: [
        { label: "WhatsApp us", kind: "wa" },
        { label: "Call us", kind: "call" },
      ],
    };

  if (has("human", "agent", "person", "someone", "team", "sales", "representative", "talk to"))
    return {
      text: "Of course — our team is one tap away.",
      actions: [
        { label: "WhatsApp us", kind: "wa" },
        { label: "Call us", kind: "call" },
      ],
    };

  if (has("thank", "shukriya", "dhanyawad"))
    return { text: "Anytime! 🙏 Anything else I can help with?" };

  if (has("who", "about", "company", "history", "experience", "year"))
    return {
      text: `${site.shortName} Industries has crafted flush doors and plywood in Birgaon, Raipur for ${site.stats.years} years — ${inr.format(
        site.stats.doors
      )}+ doors made, ${site.stats.dealers}+ dealers, ${site.stats.cities}+ cities.`,
      actions: [{ label: "Our story", kind: "scroll", target: "#about" }],
    };

  return {
    text: "I can help with our flush doors, plywood, sizes, finishes, thickness, pricing, warranty, delivery, becoming a dealer, or visiting us. For anything specific, our team is one tap away.",
    actions: [
      { label: "WhatsApp us", kind: "wa" },
      { label: "Call us", kind: "call" },
    ],
  };
}

export default function Assistant({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: 0,
      role: "bot",
      text: `Namaste! 🙏 I'm the ${site.shortName} assistant — ask me about our doors, plywood, sizes, finishes, pricing or visiting us.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the thread pinned to the latest message (scrolls the panel, not the page).
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const runAction = (a: Action) => {
    if (a.kind === "scroll" && a.target) {
      onClose();
      scrollToSection(a.target);
    } else if (a.kind === "wa") {
      window.open(waHref, "_blank", "noopener");
    } else if (a.kind === "call") {
      window.location.href = telHref;
    }
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { id: idRef.current++, role: "user", text }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const r = reply(text);
      setMessages((m) => [
        ...m,
        { id: idRef.current++, role: "bot", text: r.text, actions: r.actions },
      ]);
      setTyping(false);
    }, 460 + Math.random() * 280);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="glass-strong flex w-[min(21rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
          role="dialog"
          aria-label={`${site.shortName} assistant`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-champagne/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-copper/40 bg-walnut-900">
                <Sparkles size={14} className="text-copper-bright" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-ivory">
                  {site.shortName} Assistant
                </div>
                <div className="flex items-center gap-1.5 text-[0.62rem] text-ivory-dim">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc71]" />
                  Online · replies instantly
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close assistant"
              className="text-ivory-dim transition-colors hover:text-ivory"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            data-lenis-prevent
            className="flex max-h-[46vh] min-h-[10rem] flex-col gap-2.5 overflow-y-auto px-4 py-4"
            role="log"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div className="max-w-[85%]">
                  <div
                    className={
                      m.role === "user"
                        ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-copper-bright to-copper px-3.5 py-2 text-[0.8rem] leading-relaxed text-walnut-950"
                        : "rounded-2xl rounded-bl-sm bg-champagne/8 px-3.5 py-2 text-[0.8rem] leading-relaxed text-ivory"
                    }
                  >
                    {m.text}
                  </div>
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {m.actions.map((a) => (
                        <button
                          key={a.label}
                          onClick={() => runAction(a)}
                          className="rounded-full border border-copper/45 bg-copper/10 px-3 py-1 text-[0.68rem] font-semibold text-copper-bright transition-colors hover:bg-copper/20"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-champagne/8 px-3.5 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-ivory-dim"
                      style={{ animation: `pulseGlow 1s ease-in-out ${i * 0.15}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {QUICK.map((qr) => (
              <button
                key={qr}
                onClick={() => send(qr)}
                className="rounded-full border border-champagne/15 px-2.5 py-1 text-[0.66rem] text-ivory-dim transition-colors hover:border-copper/50 hover:text-copper-bright"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-champagne/10 p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about doors, ply, sizes…"
              aria-label="Message the assistant"
              className="min-w-0 flex-1 rounded-full border border-champagne/15 bg-walnut-900/50 px-4 py-2 text-[0.8rem] text-ivory outline-none transition-colors placeholder:text-ivory-dim/50 focus:border-copper"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-copper-bright to-copper text-walnut-950 transition-opacity disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

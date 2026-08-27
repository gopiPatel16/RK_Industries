"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, MessageCircle, Plus, X } from "lucide-react";
import { Reveal, SplitText } from "@/components/fx/Reveal";
import { formatQuote, type QuotePayload } from "@/lib/quote";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Quote builder for what the works actually makes:
 *   hard wood + hard wood frame  → Hard Wood Door
 *   pine wood + pine wood frame  → Pine Wood Door
 *   hard wood + pine wood frame  → Pine Frame Inside Hardwood
 * The fourth pairing isn't produced, so the panel says so rather than
 * quoting something that can't be built.
 *
 * One quotation can carry several size lines (6×8 ×10, 7×8 ×20 …). The single
 * button first asks who's enquiring, then POSTs the whole thing to /api/quote,
 * which delivers it to the works' WhatsApp server-side — the visitor never
 * leaves the page and no WhatsApp window opens.
 */
type Wood = "hard" | "pine";
type Frame = "hard" | "pine";

/** One line in the quotation — size in inches, thickness in millimetres. */
type Line = {
  id: number;
  width: string;
  height: string;
  thickness: string;
  qty: string;
};

const woods: { id: Wood; label: string }[] = [
  { id: "hard", label: "Hard Wood" },
  { id: "pine", label: "Pine Wood" },
];

const frames: { id: Frame; label: string }[] = [
  { id: "hard", label: "Hard Wood Frame" },
  { id: "pine", label: "Pine Wood Frame" },
];

/** Resolve the pairing to a product the factory actually builds. */
function productOf(wood: Wood, frame: Frame): string | null {
  if (wood === "hard" && frame === "hard") return "Hard Wood Door";
  if (wood === "pine" && frame === "pine") return "Pine Wood Door";
  if (wood === "hard" && frame === "pine") return "Pine Frame Inside Hardwood";
  return null; // pine leaf on a hardwood frame is not made
}

const lineLabel = (l: Line) =>
  `${l.width} × ${l.height} in · ${l.thickness} mm thick — ${l.qty} nos`;

type SendState = "idle" | "sending" | "sent" | "error";

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
      aria-pressed={active}
      className={cn(
        "rounded-full border px-5 py-2.5 text-[0.78rem] font-medium transition-all duration-300",
        active
          ? "border-copper bg-copper/15 text-copper-bright shadow-[0_0_18px_rgba(201,138,75,0.25)]"
          : "border-champagne/15 text-ivory-dim hover:border-champagne/35 hover:text-ivory"
      )}
    >
      {children}
    </button>
  );
}

const fieldCls =
  "rounded-xl border border-champagne/15 bg-walnut-900/50 px-3 py-2.5 text-sm text-ivory outline-none transition-colors placeholder:text-ivory-dim/40 focus:border-copper";

export default function Configurator() {
  const [wood, setWood] = useState<Wood>("hard");
  const [frame, setFrame] = useState<Frame>("hard");

  // pending size line
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [thickness, setThickness] = useState("");
  const [qty, setQty] = useState("");

  const [lines, setLines] = useState<Line[]>([]);
  const nextId = useRef(1);

  // contact step
  const [askDetails, setAskDetails] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<SendState>("idle");
  const [error, setError] = useState("");
  /** How the order actually reached the works — the confirmation copy differs. */
  const [via, setVia] = useState<"server" | "whatsapp">("server");

  const product = productOf(wood, frame);
  const pendingReady = Boolean(width && height && thickness && qty);

  /** Commit the pending inputs as a size line. Returns the resulting list. */
  const commitPending = (): Line[] => {
    if (!pendingReady) return lines;
    const line: Line = { id: nextId.current++, width, height, thickness, qty };
    const next = [...lines, line];
    setLines(next);
    setWidth("");
    setHeight("");
    setThickness("");
    setQty("");
    return next;
  };

  const removeLine = (id: number) => setLines((ls) => ls.filter((l) => l.id !== id));

  const totalDoors = lines.reduce((n, l) => n + (parseInt(l.qty, 10) || 0), 0);
  const hasSize = lines.length > 0 || pendingReady;
  const detailsOk = name.trim().length > 1 && phone.replace(/\D/g, "").length >= 10;

  /**
   * The one button. It never greys out — a dead button tells the visitor
   * nothing — so each press either advances the flow or says exactly what is
   * missing and puts the cursor there. First press banks any pending size and
   * asks who's enquiring; the next one sends, server-side, so no WhatsApp
   * window opens and the visitor stays on the page.
   */
  /**
   * Opens WhatsApp and nothing else. This is the route for someone who does not
   * want to fill a form, so it never validates and never blocks — whatever the
   * visitor happens to have picked rides along as context, and the rest of the
   * order is settled in the conversation.
   */
  const handleWhatsAppOrder = () => {
    setState("idle");
    setError("");

    const all = commitPending();
    const spec: string[] = [];
    if (product) spec.push(`Product: ${product}`);
    spec.push(`Wood type: ${woods.find((w) => w.id === wood)!.label}`);
    spec.push(`Frame type: ${frames.find((f) => f.id === frame)!.label}`);
    if (all.length) {
      spec.push("", "Sizes:");
      all.forEach((l, i) =>
        spec.push(
          `${i + 1}. ${l.width} × ${l.height} in · ${l.thickness} mm thick — ${l.qty} nos`
        )
      );
    }

    const text = [
      `Hi ${site.shortName}, I'd like to order a flush door.`,
      "",
      ...spec,
    ].join("\n");

    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleQuote = async () => {
    if (state === "sending") return;
    setState("idle");

    if (!product) {
      setError("We don't build a Pine Wood with a hard wood frame — pick another pairing.");
      setState("error");
      return;
    }
    if (!hasSize) {
      setError(
        "Add a size first — width and height in inches, thickness in mm, and how many doors."
      );
      setState("error");
      widthRef.current?.focus();
      return;
    }

    if (!askDetails) {
      commitPending();
      setAskDetails(true);
      setError("");
      setTimeout(() => nameRef.current?.focus(), 120);
      return;
    }
    if (!detailsOk) {
      setError("Please enter your name and a phone number of at least 10 digits.");
      setState("error");
      nameRef.current?.focus();
      return;
    }

    const all = commitPending();
    const payload: QuotePayload = {
      name: name.trim(),
      phone: phone.trim(),
      product,
      wood: woods.find((w) => w.id === wood)!.label,
      frame: frames.find((f) => f.id === frame)!.label,
      lines: all.map(({ width, height, thickness, qty }) => ({
        width,
        height,
        thickness,
        qty,
      })),
    };

    setState("sending");
    setError("");

    /**
     * Fallback delivery: open WhatsApp with the order already written out and
     * addressed to the works. Used whenever the server-side send is unavailable,
     * so the button always ends with the order reaching the admin's WhatsApp.
     */
    const handOffToWhatsApp = () => {
      window.open(
        `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(formatQuote(payload))}`,
        "_blank",
        "noopener"
      );
      setVia("whatsapp");
      setState("sent");
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        handOffToWhatsApp();
        return;
      }
      setVia("server");
      setState("sent");
    } catch {
      handOffToWhatsApp();
    }
  };

  return (
    <section id="configurator" className="relative scroll-mt-20 overflow-hidden py-28 lg:py-36">
      <div className="ambient pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="eyebrow mb-5">Order your door</div>
        </Reveal>
        <h2 className="max-w-2xl font-serif text-[clamp(2rem,4.5vw,3.4rem)] leading-tight text-ivory">
          <SplitText text="Compose the door. We'll craft it." />
        </h2>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          {/* ── Preview ── */}
          <Reveal className="mx-auto w-full max-w-sm">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-champagne/12">
              <Image
                src="/gallery/12-final-product.jpg"
                alt="Finished वanWood flush doors stacked at the works"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="h-auto w-full"
                priority={false}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-walnut-950/70 via-transparent to-transparent" />
            </div>
            <div className="glass mt-6 rounded-2xl p-4 text-center text-[0.78rem] leading-relaxed text-ivory-dim">
              {product ? (
                <>
                  <span className="text-champagne">{product}</span>
                  {lines.length > 0 ? (
                    <span className="block text-[0.7rem] opacity-80">
                      {lines.length} size{lines.length > 1 ? "s" : ""} · {totalDoors} door
                      {totalDoors === 1 ? "" : "s"}
                    </span>
                  ) : (
                    <span className="block text-[0.7rem] opacity-70">
                      Add a size, thickness and quantity to complete the spec
                    </span>
                  )}
                </>
              ) : (
                <span className="text-copper-bright">
                  We don&apos;t build a Pine Wood with a hard wood frame — pick another pairing.
                </span>
              )}
            </div>
          </Reveal>

          {/* ── Controls ── */}
          <div className="space-y-8">
            <OptionGroup label="Wood Type">
              {woods.map((w) => (
                <Chip key={w.id} active={wood === w.id} onClick={() => setWood(w.id)}>
                  {w.label}
                </Chip>
              ))}
            </OptionGroup>

            <OptionGroup label="Frame Type">
              {frames.map((f) => (
                <Chip key={f.id} active={frame === f.id} onClick={() => setFrame(f.id)}>
                  {f.label}
                </Chip>
              ))}
            </OptionGroup>

            <div>
              <div className="mb-3 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-ivory-dim">
                Size, Thickness &amp; Quantity
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={widthRef}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  inputMode="decimal"
                  placeholder="Width"
                  aria-label="Width in inches"
                  className={cn(fieldCls, "w-24 text-center")}
                />
                <span className="text-ivory-dim">×</span>
                <input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  inputMode="decimal"
                  placeholder="Height"
                  aria-label="Height in inches"
                  className={cn(fieldCls, "w-24 text-center")}
                />
                <span className="text-[0.72rem] font-semibold text-ivory-dim">inch</span>
                <input
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  inputMode="decimal"
                  placeholder="Thickness"
                  aria-label="Thickness in millimetres"
                  className={cn(fieldCls, "w-28 text-center")}
                />
                <span className="text-[0.72rem] font-semibold text-ivory-dim">mm</span>
                <input
                  value={qty}
                  onChange={(e) => setQty(e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  placeholder="Qty"
                  aria-label="Quantity of doors in this size"
                  className={cn(fieldCls, "w-20 text-center")}
                />
                <button
                  onClick={commitPending}
                  disabled={!pendingReady}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-champagne/20 px-4 py-2 text-[0.72rem] font-semibold text-ivory transition-colors hover:border-copper hover:text-copper-bright",
                    !pendingReady && "cursor-not-allowed opacity-40 hover:border-champagne/20 hover:text-ivory"
                  )}
                >
                  <Plus size={13} /> Add Size
                </button>
              </div>
              <p className="mt-2 text-[0.7rem] text-ivory-dim/70">
                Width × height in inches, thickness in millimetres, and how many doors —
                add as many sizes as you need.
              </p>

              {/* added lines */}
              {lines.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {lines.map((l, i) => (
                    <li
                      key={l.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-champagne/12 bg-walnut-900/40 px-4 py-2.5 text-[0.78rem] text-ivory"
                    >
                      <span>
                        <span className="mr-2 text-ivory-dim">{i + 1}.</span>
                        {l.width} × {l.height} in · {l.thickness} mm
                        <span className="text-copper-bright"> · {l.qty} doors</span>
                      </span>
                      <button
                        onClick={() => removeLine(l.id)}
                        aria-label={`Remove ${lineLabel(l)}`}
                        className="rounded-full p-1 text-ivory-dim transition-colors hover:text-copper-bright"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                  <li className="pt-1 text-right text-[0.72rem] text-ivory-dim">
                    Total · <span className="text-champagne">{totalDoors} doors</span>
                  </li>
                </ul>
              )}
            </div>

            {/* ── Who we're quoting for ── */}
            {askDetails && (
              <div>
                <div className="mb-3 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-ivory-dim">
                  Your Details
                </div>
                <div className="flex flex-wrap gap-3">
                  <input
                    ref={nameRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    aria-label="Your name"
                    className={cn(fieldCls, "w-52")}
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    placeholder="Phone number"
                    aria-label="Your phone number"
                    className={cn(fieldCls, "w-52")}
                  />
                </div>
                <p className="mt-2 text-[0.7rem] text-ivory-dim/70">
                  We&apos;ll send this quotation straight to the works and call you back on this
                  number.
                </p>
              </div>
            )}

            {state === "sent" ? (
              <div className="glass flex items-start gap-3 rounded-2xl p-5">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-copper-bright" />
                <div>
                  <div className="font-serif text-lg text-ivory">
                    {via === "server" ? "Quotation sent" : "Your order is ready to send"}
                  </div>
                  <p className="mt-1 text-[0.78rem] leading-relaxed text-ivory-dim">
                    {via === "server" ? (
                      <>
                        It&apos;s with the works now — we&apos;ll call you on {phone.trim()} within
                        one working day.
                      </>
                    ) : (
                      <>
                        WhatsApp is open with your full order written out and addressed to us —
                        press send there and we&apos;ll call you on {phone.trim()}.
                      </>
                    )}
                  </p>
                  <button
                    onClick={() => {
                      setLines([]);
                      setName("");
                      setPhone("");
                      setAskDetails(false);
                      setState("idle");
                    }}
                    className="btn-ghost mt-4 text-xs"
                  >
                    Build another quotation
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleQuote}
                  disabled={state === "sending"}
                  className={cn("btn-primary mt-2", state === "sending" && "cursor-wait opacity-70")}
                  title={
                    askDetails
                      ? "Send this quotation to the works"
                      : "Add your name and number, then send"
                  }
                >
                  {state === "sending" ? "Sending…" : "Get This Door Quoted"}
                  {state === "sending" && <Loader2 size={15} className="animate-spin" />}
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="mt-2 ml-0 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[#3ddc71]/35 bg-[#3ddc71]/10 px-6 py-3 text-[0.85rem] font-semibold text-[#5fe08c] transition-colors hover:border-[#3ddc71]/70 hover:bg-[#3ddc71]/15 sm:ml-3"
                  title="Open WhatsApp and order in chat — nothing to fill in first"
                >
                  <MessageCircle size={16} />
                  Order via WhatsApp
                </button>

                {state === "error" && (
                  <p role="alert" className="mt-3 text-[0.75rem] text-copper-bright">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The shape of a quotation as it travels from the configurator to the works,
 * plus the validator and formatter the API route uses. Shared so the browser
 * and the server agree on the payload without duplicating the rules.
 */
export type QuoteLine = {
  width: string;
  height: string;
  unit: "ft" | "mm";
  qty: string;
};

export type QuotePayload = {
  name: string;
  phone: string;
  product: string;
  wood: string;
  frame: string;
  lines: QuoteLine[];
};

const str = (v: unknown, max: number) =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max ? v.trim() : null;

/**
 * Validate an untrusted body from the network. Returns null on anything
 * malformed — the route replies 400 rather than forwarding junk to WhatsApp.
 */
export function validateQuote(input: unknown): QuotePayload | null {
  if (typeof input !== "object" || input === null) return null;
  const b = input as Record<string, unknown>;

  const name = str(b.name, 80);
  const phone = str(b.phone, 24);
  const product = str(b.product, 60);
  const wood = str(b.wood, 40);
  const frame = str(b.frame, 40);
  if (!name || !phone || !product || !wood || !frame) return null;
  if (name.length < 2) return null;
  if (phone.replace(/\D/g, "").length < 10) return null;

  if (!Array.isArray(b.lines) || b.lines.length === 0 || b.lines.length > 20) return null;
  const lines: QuoteLine[] = [];
  for (const raw of b.lines) {
    if (typeof raw !== "object" || raw === null) return null;
    const l = raw as Record<string, unknown>;
    const width = str(l.width, 10);
    const height = str(l.height, 10);
    const qty = str(l.qty, 6);
    if (!width || !height || !qty) return null;
    if (l.unit !== "ft" && l.unit !== "mm") return null;
    if (!/^\d+(\.\d+)?$/.test(width) || !/^\d+(\.\d+)?$/.test(height)) return null;
    if (!/^\d+$/.test(qty) || Number(qty) < 1) return null;
    lines.push({ width, height, unit: l.unit, qty });
  }

  return { name, phone, product, wood, frame, lines };
}

/** The message the works receives on WhatsApp. */
export function formatQuote(q: QuotePayload): string {
  const total = q.lines.reduce((n, l) => n + Number(l.qty), 0);
  return [
    "New quotation request",
    "",
    `Name: ${q.name}`,
    `Phone: ${q.phone}`,
    "",
    `Product: ${q.product}`,
    `Wood type: ${q.wood}`,
    `Frame type: ${q.frame}`,
    "",
    "Sizes:",
    ...q.lines.map((l, i) => `${i + 1}. ${l.width} × ${l.height} ${l.unit} — ${l.qty} nos`),
    "",
    `Total: ${total} doors`,
  ].join("\n");
}

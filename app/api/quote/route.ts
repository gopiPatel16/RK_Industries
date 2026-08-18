import { validateQuote, formatQuote } from "@/lib/quote";
import { site } from "@/lib/site";

/**
 * Delivers a configurator quotation to the works' WhatsApp without the visitor
 * ever leaving the page.
 *
 * The message is sent server-side through the WhatsApp Cloud API, so it arrives
 * FROM the business number configured in Meta — WhatsApp gives no way to send
 * as the customer's own number, which is why the customer's name and number
 * are carried inside the message body instead.
 *
 * Required environment variables (see .env.example):
 *   WHATSAPP_TOKEN            — permanent access token from Meta
 *   WHATSAPP_PHONE_NUMBER_ID  — the sending number's ID in Meta
 *   WHATSAPP_TO               — recipient (defaults to site.whatsapp)
 */
const API_VERSION = process.env.WHATSAPP_API_VERSION ?? "v21.0";

/** Crude per-IP throttle — a speed bump against a public endpoint being hammered. */
const hits = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "local";
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests — please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const quote = validateQuote(body);
  if (!quote) {
    return Response.json(
      { ok: false, error: "Please check the sizes, name and phone number." },
      { status: 400 }
    );
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO ?? site.whatsapp;

  if (!token || !phoneNumberId) {
    // Nothing to send with — say so plainly rather than pretending it went out.
    console.error("[quote] WhatsApp credentials missing; quotation not sent:\n" + formatQuote(quote));
    return Response.json(
      {
        ok: false,
        error: "Sending isn't switched on yet. Please call or WhatsApp us directly.",
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { preview_url: false, body: formatQuote(quote) },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`[quote] WhatsApp API ${res.status}: ${detail}`);
      return Response.json(
        { ok: false, error: "We couldn't send it just now. Please call or WhatsApp us." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[quote] send failed", err);
    return Response.json(
      { ok: false, error: "We couldn't send it just now. Please call or WhatsApp us." },
      { status: 502 }
    );
  }
}

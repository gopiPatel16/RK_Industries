import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Manrope,
  Noto_Serif_Devanagari,
  Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

/**
 * The wordmark opens with व (Devanagari), which the Latin faces above don't
 * carry. These sit after them in the font stacks so only that glyph falls
 * through — keeping the brand mark in key instead of hitting a system font.
 */
const notoSerifDeva = Noto_Serif_Devanagari({
  variable: "--font-deva-serif",
  subsets: ["devanagari"],
});

const notoSansDeva = Noto_Sans_Devanagari({
  variable: "--font-deva-sans",
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vanwood.in"),
  title: {
    default: `${site.name} — Premium Flush Doors & Plywood | Raipur, Chhattisgarh`,
    template: `%s — ${site.name}`,
  },
  description: `${site.tagline} ${site.sub} Manufactured in Birgaon, Raipur, Chhattisgarh.`,
  keywords: [
    "flush doors manufacturer",
    "plywood manufacturer",
    "Raipur",
    "Birgaon",
    "Chhattisgarh",
    "premium doors India",
    "waterproof plywood",
  ],
  openGraph: {
    title: `${site.name} — Premium Flush Doors & Plywood`,
    description: site.tagline,
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#130906",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  description: site.sub,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Industrial Area, Birgaon",
    addressLocality: "Raipur",
    addressRegion: "Chhattisgarh",
    postalCode: "493221",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${notoSerifDeva.variable} ${notoSansDeva.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

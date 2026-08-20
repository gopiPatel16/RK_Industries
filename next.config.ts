import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    /**
     * The image optimizer caches into `.next/dev/cache/images`. This project
     * lives on an exFAT drive, where macOS writes a 4 KB AppleDouble
     * "._<name>" file beside every cache entry — Next then reads the sidecar
     * back and serves 4 KB of application/octet-stream, so the image never
     * decodes. Serving originals in development sidesteps that cache entirely.
     * Production builds (Vercel) keep full optimization.
     */
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Temporary food-photo placeholders (tag-based, no API key needed) —
      // swap every one of these for the client's real Jackpot photography
      // before launch. See README "Image Workflow" section.
      { protocol: "https", hostname: "loremflickr.com" },
      // Real client photos will live in Firebase Storage once uploaded.
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;

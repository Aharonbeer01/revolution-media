import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Retired page: permanently redirect the old URL to the services list
        // so old links and stale search results never hit a 404.
        source: "/services/web-design-development",
        destination: "/services",
        permanent: true,
      },
      {
        // Consolidation: this older Google Ads post was a near-duplicate of the
        // stronger 2026 pillar and was crawled-not-indexed for cannibalisation.
        // Permanently redirect it to the pillar so link equity consolidates.
        source: "/blog/google-ads-for-hotels-complete-guide",
        destination: "/blog/google-ads-for-hotels-guide-2026",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

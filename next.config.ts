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
      // Legacy seed posts, each roughly 650 to 800 words with no tables and no
      // FAQ section, superseded by a modern pillar on the same topic. Google
      // refused to index all three. Consolidate rather than rewrite.
      {
        source: "/blog/5-ways-to-reduce-ota-dependency",
        destination: "/blog/how-to-reduce-ota-commissions",
        permanent: true,
      },
      {
        source: "/blog/why-your-hotel-needs-tiktok",
        destination: "/blog/tiktok-marketing-hotels-vs-instagram",
        permanent: true,
      },
      {
        // Its sections were on-page SEO, local SEO and Google Business Profile,
        // content strategy and technical SEO, so the closest modern successor is
        // the answer-engine guide, which covers the same "how do we get found"
        // question as search has evolved. The direct booking pillar was the
        // alternative but covers booking engine and rate strategy instead.
        source: "/blog/hotel-seo-rank-higher-direct-bookings",
        destination: "/blog/aeo-for-hotels-ai-recommendations",
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

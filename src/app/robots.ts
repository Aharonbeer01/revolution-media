import { MetadataRoute } from "next";

// Private areas that should never be crawled by any bot.
const disallow = [
  "/api/",
  "/studio",
  "/ambassador/dashboard",
  "/ambassador/profile",
  "/ambassador/referrals",
];

// AI search and answer-engine crawlers. Allowing these explicitly (in addition
// to the wildcard rule) makes our content eligible for citation in generative
// search: ChatGPT Search, Perplexity, Claude, Gemini and others.
const aiBots = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      ...aiBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: "https://revolutionmedia.agency/sitemap.xml",
  };
}

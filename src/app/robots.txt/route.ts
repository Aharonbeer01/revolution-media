import { SITE_URL } from "@/lib/constants";

/**
 * robots.txt is served from a route handler rather than Next's robots.ts
 * helper because we emit Content-Signal directives, which the MetadataRoute
 * helper cannot express.
 *
 * The policy is deliberately two-sided:
 *   - AI crawlers are ALLOWED to read the site, so our content stays eligible
 *     for citation in ChatGPT, Claude, Perplexity, AI Overviews and Siri.
 *   - Content-Signal reserves rights against model TRAINING, which is a
 *     separate use from citation.
 *
 * Content-Signal must be repeated inside every group: a crawler obeys only the
 * most specific group that matches its user agent, so a signal declared only
 * under "*" would never reach GPTBot or ClaudeBot.
 */

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

// search:   indexing and returning links and short excerpts.
// ai-input: using content to ground a generated answer (this is what produces
//           citations, so we grant it).
// ai-train: training or fine-tuning models (we reserve rights against this).
const CONTENT_SIGNAL = "search=yes,ai-input=yes,ai-train=no";

const preamble = `# Content signals below express how this site's content may be used.
#
# search:   building a search index and returning links or short excerpts.
# ai-input: using content to ground or inform a generated answer.
# ai-train: training or fine-tuning AI models.
#
# We permit search and AI answer grounding, and we do not permit use of this
# content for AI model training. Any restriction expressed via content signals
# is an express reservation of rights under Article 4 of European Union
# Directive 2019/790 on copyright in the Digital Single Market.
`;

function group(userAgent: string) {
  return [
    `User-agent: ${userAgent}`,
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "Allow: /",
    ...disallow.map((path) => `Disallow: ${path}`),
  ].join("\n");
}

export function GET() {
  const body = [
    preamble,
    group("*"),
    ...aiBots.map(group),
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].join("\n\n");

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Matches the previous ISR behaviour: cache at the edge, refresh daily.
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}

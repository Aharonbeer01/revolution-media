import { sanityClient } from "@/sanity/client";
import { FEED_POSTS_QUERY } from "@/sanity/queries";
import { SITE_URL } from "@/lib/constants";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Revalidate the feed hourly so new posts appear without a redeploy.
export const revalidate = 3600;

const FEED_TITLE = "Revolution Media Blog";
const FEED_DESCRIPTION =
  "Digital marketing insights for hotels and hospitality brands: direct bookings, OTA strategy, paid media, SEO and more.";

function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: any[] = [];
  try {
    posts = await sanityClient.fetch(FEED_POSTS_QUERY);
  } catch {
    posts = [];
  }

  const lastBuildDate = new Date().toUTCString();
  const items = posts
    .map((p: any) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const pubDate = p.publishedAt
        ? new Date(p.publishedAt).toUTCString()
        : lastBuildDate;
      return `    <item>
      <title>${escapeXml(p.title || "")}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${p.category ? `<category>${escapeXml(p.category)}</category>` : ""}
      ${p.author ? `<dc:creator>${escapeXml(p.author)}</dc:creator>` : ""}
      <description>${escapeXml(p.excerpt || "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

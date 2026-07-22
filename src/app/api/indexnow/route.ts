import { NextRequest } from "next/server";
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";
import { SITE_URL } from "@/lib/constants";
import { services } from "@/lib/services";
import { caseStudies } from "@/lib/case-studies";

/* eslint-disable @typescript-eslint/no-explicit-any */

// On-demand IndexNow submission. Trigger after a deploy:
//   GET /api/indexnow?secret=<INDEXNOW_TRIGGER_SECRET>
// Broadcasts all current URLs to IndexNow (Bing, Yandex and partners such as
// ChatGPT Search and Perplexity).

const HOST = "revolutionmedia.agency";
const INDEXNOW_KEY = "69d26c471fb84d1f83feffe9a86bb6f8";
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const staticPaths = [
  "/",
  "/about",
  "/services",
  "/case-studies",
  "/blog",
  "/packages",
  "/contact",
  "/referral-program",
  "/privacy-policy",
  "/terms",
];

// Fresh (non-CDN) client so newly published posts are included immediately.
const client = createClient({ projectId, dataset, apiVersion, useCdn: false });

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.INDEXNOW_TRIGGER_SECRET;

  // Require a secret so the endpoint cannot be spammed publicly.
  if (!expected || secret !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  const urls = new Set(staticPaths.map((p) => `${SITE_URL}${p}`));

  // Service and case study detail pages (kept in sync with the sitemap).
  for (const s of services) urls.add(`${SITE_URL}/services/${s.slug}`);
  for (const cs of caseStudies) urls.add(`${SITE_URL}/case-studies/${cs.slug}`);

  try {
    const slugs: any[] = await client.fetch(
      `*[_type=="post" && publishedAt <= now()]{ "slug": slug.current }`,
    );
    for (const s of slugs) {
      if (s?.slug) urls.add(`${SITE_URL}/blog/${s.slug}`);
    }
  } catch {
    // Fall through with whatever URLs we have.
  }

  const urlList = [...urls];

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  return Response.json({
    submitted: urlList.length,
    indexNowStatus: res.status,
    ok: res.status === 200 || res.status === 202,
  });
}

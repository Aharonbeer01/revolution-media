// Broadcasts all current site URLs to IndexNow (Bing, Yandex and partners
// such as ChatGPT Search and Perplexity). Run after a deploy that adds or
// updates content:  node scripts/indexnow-submit.mjs
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@sanity/client";

const HOST = "revolutionmedia.agency";
const SITE_URL = `https://${HOST}`;
const INDEXNOW_KEY = "69d26c471fb84d1f83feffe9a86bb6f8";
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// Static routes that always exist.
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

const client = createClient({
  projectId: "xoemestg",
  dataset: "production",
  apiVersion: "2026-03-26",
  useCdn: false,
});

async function collectUrls() {
  const urls = new Set(staticPaths.map((p) => `${SITE_URL}${p}`));

  try {
    const slugs = await client.fetch(
      `*[_type=="post" && publishedAt <= now()]{ "slug": slug.current }`,
    );
    for (const s of slugs) {
      if (s?.slug) urls.add(`${SITE_URL}/blog/${s.slug}`);
    }
  } catch (e) {
    console.error("Could not fetch posts:", e.message);
  }

  return [...urls];
}

async function main() {
  const urlList = await collectUrls();
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

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

  // IndexNow returns 200 or 202 on success.
  console.log(`IndexNow responded: ${res.status} ${res.statusText}`);
  if (res.status !== 200 && res.status !== 202) {
    const text = await res.text().catch(() => "");
    console.error("Body:", text);
    process.exit(1);
  }
  console.log("Done.");
}

main();

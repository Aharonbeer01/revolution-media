import { config } from "dotenv";
config({ path: ".env.local" });
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@sanity/client";

// Retire three legacy seed posts that Google refused to index. Each is roughly
// 650 to 800 words with no tables and no FAQ section, and each is superseded by
// a modern pillar covering the same ground. Permanent redirects live in
// next.config.ts; deleting the documents removes them from the blog index,
// category listings, sitemap and feed in one move.
//
// RUN THIS AT DEPLOY TIME, after the redirects are live, not before: while the
// documents still exist the posts stay reachable, and once they are gone the
// redirects take over. Full documents are written to scripts/backups/ first,
// and Sanity retains document history, so this is recoverable either way.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xoemestg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const RETIRE = [
  {
    slug: "5-ways-to-reduce-ota-dependency",
    to: "/blog/how-to-reduce-ota-commissions",
  },
  {
    slug: "why-your-hotel-needs-tiktok",
    to: "/blog/tiktok-marketing-hotels-vs-instagram",
  },
  {
    slug: "hotel-seo-rank-higher-direct-bookings",
    to: "/blog/aeo-for-hotels-ai-recommendations",
  },
];

const backup = [];
for (const { slug, to } of RETIRE) {
  const doc = await client.fetch(`*[_type=="post" && slug.current==$slug][0]`, {
    slug,
  });
  if (!doc) {
    console.log(`  already retired: ${slug}`);
    continue;
  }
  backup.push({ retiredTo: to, document: doc });
}

if (backup.length) {
  mkdirSync("scripts/backups", { recursive: true });
  const file = "scripts/backups/retired-legacy-posts.json";
  writeFileSync(file, JSON.stringify(backup, null, 2));
  console.log(`Backed up ${backup.length} document(s) to ${file}`);

  for (const { document, retiredTo } of backup) {
    await client.delete(document._id);
    console.log(`  deleted ${document._id}  ->  301 ${retiredTo}`);
  }
} else {
  console.log("Nothing to retire.");
}

const total = await client.fetch(`count(*[_type=="post"])`);
const live = await client.fetch(`count(*[_type=="post" && publishedAt<=now()])`);
console.log(`\nSanity now: ${total} posts total, ${live} live.`);

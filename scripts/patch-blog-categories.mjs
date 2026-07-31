import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@sanity/client";

// Reassigns every blog post to exactly one of the five topic categories.
// This mapping overrides whatever category a post currently carries. Only the
// category field changes: slugs, publish dates and scheduling are untouched.
// Missing slugs (future posts not yet created) are skipped and reported.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xoemestg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// slug -> exact category name (must match src/lib/blog-categories.ts and the
// post schema enum).
const mapping = {
  // Direct Bookings & Revenue
  "ota-dependency-risks-south-african-lodges": "Direct Bookings & Revenue",
  "how-to-reduce-ota-commissions": "Direct Bookings & Revenue",
  "direct-booking-strategy-lodges-boutique-hotels": "Direct Bookings & Revenue",
  "best-digital-marketing-agencies-hotels-2026": "Direct Bookings & Revenue",
  "email-marketing-hotels-loyalty-repeat-bookings": "Direct Bookings & Revenue",
  "5-ways-to-reduce-ota-dependency": "Direct Bookings & Revenue",
  "festive-season-hotel-marketing-playbook": "Direct Bookings & Revenue",

  // Paid Media & Search
  "google-ads-for-hotels-guide-2026": "Paid Media & Search",
  "google-ads-for-hotels-complete-guide": "Paid Media & Search",
  "meta-ads-fill-empty-rooms-off-peak": "Paid Media & Search",
  "google-ads-campaign-types-hotels": "Paid Media & Search",
  "meta-ads-campaign-types-hotels": "Paid Media & Search",
  "hotel-seo-rank-higher-direct-bookings": "Paid Media & Search",
  "aeo-for-hotels-ai-recommendations": "Paid Media & Search",

  // Social & Content
  "tiktok-marketing-hotels-vs-instagram": "Social & Content",
  "hotel-content-creation-drives-bookings": "Social & Content",
  "content-marketing-hotels-attract-guests": "Social & Content",
  "social-media-strategy-hotels-beyond-likes": "Social & Content",
  "why-your-hotel-needs-tiktok": "Social & Content",
  "whatsapp-marketing-for-hotels": "Social & Content",

  // Hospitality Tech
  "booking-engine-setup-direct-reservations": "Hospitality Tech",
  "best-pms-independent-boutique-hotels": "Hospitality Tech",
  "meta-tech-setup-hotels-pixel-capi-catalogue": "Hospitality Tech",

  // Strategy & Measurement
  "measure-hotel-marketing-roi": "Strategy & Measurement",
  "google-search-console-platform-properties-hotels": "Strategy & Measurement",
  "ga4-events-vs-key-events-hotels": "Strategy & Measurement",
};

const UNLISTED_FLAGS = new Set([
  "hotel-seo-rank-higher-direct-bookings",
  "5-ways-to-reduce-ota-dependency",
  "google-ads-for-hotels-complete-guide",
  "why-your-hotel-needs-tiktok",
]);

async function run() {
  const existing = await client.fetch(
    `*[_type=="post"]{ "slug": slug.current, _id, category }`,
  );
  const existingBySlug = new Map(existing.map((p) => [p.slug, p]));

  const updated = [];
  const skipped = [];
  const flagged = [];

  for (const [slug, category] of Object.entries(mapping)) {
    const post = existingBySlug.get(slug);
    if (!post) {
      skipped.push(slug);
      continue;
    }
    await client.patch(post._id).set({ category }).commit();
    updated.push({ slug, from: post.category, to: category });
    if (UNLISTED_FLAGS.has(slug)) flagged.push({ slug, to: category });
  }

  // Any post in the dataset that the mapping does not cover at all.
  const uncovered = existing
    .map((p) => p.slug)
    .filter((s) => !(s in mapping));

  console.log("\n=== CATEGORY REASSIGNMENT REPORT ===\n");
  console.log(`Updated ${updated.length} posts:`);
  for (const u of updated) {
    console.log(`  ${u.slug}\n     ${u.from}  ->  ${u.to}`);
  }

  if (skipped.length) {
    console.log(
      `\nSkipped ${skipped.length} mapped slugs not yet in the dataset (future posts):`,
    );
    for (const s of skipped) console.log(`  ${s}`);
  }

  if (flagged.length) {
    console.log(
      `\nFLAGGED (not in the original prompt mapping, assigned to closest category):`,
    );
    for (const f of flagged) console.log(`  ${f.slug}  ->  ${f.to}`);
  }

  if (uncovered.length) {
    console.log(
      `\nWARNING: ${uncovered.length} posts in the dataset are not in the mapping at all:`,
    );
    for (const s of uncovered) console.log(`  ${s}`);
  } else {
    console.log(`\nEvery post in the dataset is covered by the mapping.`);
  }

  // Final tally per category.
  const after = await client.fetch(
    `*[_type=="post"]{ "slug": slug.current, category }`,
  );
  const counts = {};
  for (const p of after) counts[p.category] = (counts[p.category] || 0) + 1;
  console.log(`\nPosts per category now:`);
  for (const [cat, n] of Object.entries(counts).sort()) {
    console.log(`  ${cat}: ${n}`);
  }
  console.log("");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

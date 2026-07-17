import { config } from "dotenv";
config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "xoemestg",
  dataset: "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Verified official URLs (checked with HTTP requests / web search 2026-07-16).
const PMS_URLS = {
  Cloudbeds: "https://www.cloudbeds.com",
  Mews: "https://www.mews.com",
  RoomRaccoon: "https://roomraccoon.com",
  NightsBridge: "https://www.nightsbridge.com",
  "Little Hotelier": "https://www.littlehotelier.com",
  Semper: "https://semper.co.za",
  eviivo: "https://eviivo.com",
  Guestline: "https://www.guestline.com",
  Hotelogix: "https://www.hotelogix.com",
  Preno: "https://prenohq.com",
};

// Order longest-first so "Little Hotelier" is matched before any shorter name.
const NAMES = Object.keys(PMS_URLS).sort((a, b) => b.length - a.length);

const TARGET_SLUGS = [
  "best-pms-independent-boutique-hotels",
  "booking-engine-setup-direct-reservations",
];

/**
 * If a bullet's single text span begins with a known PMS name, split that span
 * into a linked span (the name) + an unlinked span (the remainder), and add a
 * link markDef. The renderer auto-applies target=_blank rel=noopener for http links.
 * Returns true if the block was modified.
 */
function linkifyBlock(block, report) {
  if (block._type !== "block" || block.listItem !== "bullet") return false;
  if (!Array.isArray(block.children) || block.children.length !== 1) return false;
  const span = block.children[0];
  if (typeof span.text !== "string") return false;
  if (Array.isArray(span.marks) && span.marks.length > 0) return false; // already marked

  const name = NAMES.find((n) => span.text.startsWith(n));
  if (!name) return false;

  const rest = span.text.slice(name.length);
  const markKey = randomUUID().replace(/-/g, "").slice(0, 12);

  block.markDefs = block.markDefs || [];
  block.markDefs.push({ _key: markKey, _type: "link", href: PMS_URLS[name] });

  const linkedSpan = {
    _type: "span",
    _key: randomUUID().replace(/-/g, "").slice(0, 12),
    text: name,
    marks: [markKey],
  };
  const restSpan = {
    _type: "span",
    _key: randomUUID().replace(/-/g, "").slice(0, 12),
    text: rest,
    marks: [],
  };
  block.children = [linkedSpan, restSpan];
  report.push(`${name} -> ${PMS_URLS[name]}`);
  return true;
}

for (const slug of TARGET_SLUGS) {
  const post = await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]`,
    { slug }
  );
  if (!post) {
    console.error(`POST NOT FOUND: ${slug}`);
    continue;
  }

  const doc = JSON.parse(JSON.stringify(post));
  const report = [];
  const changedKeys = [];
  for (const block of doc.body || []) {
    if (linkifyBlock(block, report)) changedKeys.push(block._key);
  }

  console.log(`\n===== ${slug} =====`);
  if (changedKeys.length === 0) {
    console.log("  (no unlinked PMS bullets found - already linked?)");
    continue;
  }
  report.forEach((r) => console.log(`  ${r}`));

  // Patch each changed block's children + markDefs by _key. The write token
  // has "update" (patch) permission but not create, so we avoid createOrReplace.
  for (const key of changedKeys) {
    const block = doc.body.find((b) => b._key === key);
    await client
      .patch(doc._id)
      .set({
        [`body[_key=="${key}"].children`]: block.children,
        [`body[_key=="${key}"].markDefs`]: block.markDefs,
      })
      .commit();
  }
  console.log(`  linked ${changedKeys.length} platform name(s).`);
}

console.log("\nDone.");

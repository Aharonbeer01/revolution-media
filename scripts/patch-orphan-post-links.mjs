import { config } from "dotenv";
config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

// Two live posts sat in Search Console as "Crawled, currently not indexed"
// with almost no internal support: social-media-strategy-hotels-beyond-likes
// had no inbound links from any other post, and ota-dependency-risks-south-
// african-lodges had one. This adds contextual links from their closest
// siblings. Natural phrases are linked in place; where none exists a single
// sentence is appended to the most relevant paragraph. Idempotent.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xoemestg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);
const text = (b) => (b.children || []).map((c) => c.text).join("");

function linkInPlace(block, phrase, href) {
  const i = (block.children || []).findIndex(
    (c) => c._type === "span" && !(c.marks || []).length && c.text.includes(phrase),
  );
  if (i === -1) return false;
  const span = block.children[i];
  const at = span.text.indexOf(phrase);
  const linkKey = key();
  const parts = [];
  if (at > 0) parts.push({ ...span, _key: key(), text: span.text.slice(0, at) });
  parts.push({ ...span, _key: key(), text: phrase, marks: [linkKey] });
  const tail = span.text.slice(at + phrase.length);
  if (tail) parts.push({ ...span, _key: key(), text: tail });
  block.children.splice(i, 1, ...parts);
  block.markDefs = [...(block.markDefs || []), { _type: "link", _key: linkKey, href }];
  return true;
}

function appendSentence(block, before, linkText, after, href) {
  const linkKey = key();
  block.markDefs = [...(block.markDefs || []), { _type: "link", _key: linkKey, href }];
  block.children.push(
    { _type: "span", _key: key(), text: before, marks: [] },
    { _type: "span", _key: key(), text: linkText, marks: [linkKey] },
    { _type: "span", _key: key(), text: after, marks: [] },
  );
  return true;
}

const SOCIAL = "/blog/social-media-strategy-hotels-beyond-likes";
const OTA = "/blog/ota-dependency-risks-south-african-lodges";

const JOBS = [
  {
    slug: "tiktok-marketing-hotels-vs-instagram",
    href: SOCIAL,
    find: (t) => t.startsWith("What can you sustain?"),
    apply: (b) =>
      appendSentence(b, " Who owns it, and what it is expected to deliver, belongs in your ", "social media strategy", " before a single video is shot.", SOCIAL),
  },
  {
    slug: "hotel-content-creation-drives-bookings",
    href: SOCIAL,
    find: (t) => t.startsWith("Systems fail on effort"),
    apply: (b) =>
      appendSentence(b, " The goals, platforms and budget this calendar serves are set one level up, in your ", "social media strategy", ".", SOCIAL),
  },
  {
    slug: "best-digital-marketing-agencies-hotels-2026",
    href: OTA,
    find: (t) => t.includes("Ask any candidate how they think about OTA dependency"),
    apply: (b) => linkInPlace(b, "OTA dependency", OTA),
  },
  {
    slug: "direct-booking-strategy-lodges-boutique-hotels",
    href: OTA,
    find: (t) => t.includes("90% OTA reliance"),
    apply: (b) => linkInPlace(b, "OTA reliance", OTA),
  },
];

for (const job of JOBS) {
  const doc = await client.fetch(`*[_type=="post" && slug.current==$s][0]{ _id, body }`, { s: job.slug });
  if (!doc?._id) { console.log(`  not found: ${job.slug}`); continue; }
  if (JSON.stringify(doc.body).includes(job.href)) { console.log(`  already links ${job.href}: ${job.slug}`); continue; }
  const body = JSON.parse(JSON.stringify(doc.body));
  const block = body.find((b) => b._type === "block" && b.style === "normal" && job.find(text(b)));
  if (!block || !job.apply(block)) { console.log(`  anchor not found, skipped: ${job.slug}`); continue; }
  await client.patch(doc._id).set({ body }).commit();
  console.log(`  ${job.slug}  ->  ${job.href}`);
}
console.log("Done.");

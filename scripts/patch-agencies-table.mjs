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

const SLUG = "best-digital-marketing-agencies-hotels-2026";

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

// Data taken directly from the live post (10 ranked agencies + their "Best for" lines).
const tableRows = [
  ["Revolution Media", "Direct booking systems and OTA reduction", "Boutique hotels, lodges and independents"],
  ["Sojern", "Data-driven multichannel advertising", "Properties wanting platform-led ad reach at scale"],
  ["Cendyn", "Hospitality CRM and guest data", "Hotel groups activating their own databases"],
  ["Tambourine", "Full-service integrated marketing", "Independent US hotels and resorts"],
  ["Profitroom", "Booking technology plus marketing", "Properties wanting one vendor across the direct stack"],
  ["Screen Pilot", "Digital performance marketing", "US independent and lifestyle hotels"],
  ["MMGY Global", "Enterprise travel PR and integrated media", "Large hospitality brands and destination organisations"],
  ["O'Rourke Hospitality Marketing", "Hotel-only marketing partner", "Hotels wanting an established hospitality specialist"],
  ["Gourmet Marketing", "Website and conversion fundamentals", "Small independent hotels and B&Bs"],
  ["Spherical", "Brand and creative-led marketing", "Luxury and design-led properties"],
];

const tableBlock = {
  _type: "comparisonTable",
  _key: key(),
  caption: "How the agencies compare at a glance.",
  headers: ["Agency", "Primary Focus", "Best Fit For"],
  rows: tableRows.map((cells) => ({
    _type: "tableRow",
    _key: key(),
    cells,
  })),
};

const post = await client.fetch(
  `*[_type=="post" && slug.current==$slug][0]{_id, body}`,
  { slug: SLUG },
);
if (!post) {
  console.error("POST NOT FOUND");
  process.exit(1);
}

// Bail out if a comparison table is already present (idempotent).
const already = (post.body || []).some((b) => b._type === "comparisonTable");
if (already) {
  console.log("Comparison table already present. Nothing to do.");
  process.exit(0);
}

function blockText(b) {
  return (b.children || []).map((c) => c.text).join("");
}

// Insert the table right after the "Best Hotel Marketing Agencies" H2 heading.
const anchor = (post.body || []).find(
  (b) =>
    b._type === "block" &&
    b.style === "h2" &&
    /best hotel marketing agencies/i.test(blockText(b)),
);
if (!anchor) {
  console.error("Anchor H2 not found");
  process.exit(1);
}

await client
  .patch(post._id)
  .insert("after", `body[_key=="${anchor._key}"]`, [tableBlock])
  .commit();

console.log(`Inserted comparison table after "${blockText(anchor)}".`);

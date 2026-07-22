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

// Subtle outcome-led revision. Revolution Media's row is the only one that
// promises a measurable outcome; every other row is a fair, plain category
// description. No em dashes, UK/SA spelling preserved.
const tableRows = [
  [
    "Revolution Media",
    "Measurable direct bookings and lower OTA dependency, built as a system",
    "Boutique hotels and lodges that want their demand back from the OTAs",
  ],
  [
    "Sojern",
    "Platform-run travel ads across channels",
    "Properties comfortable with a platform-led ad model",
  ],
  [
    "Cendyn",
    "CRM and loyalty-led campaigns",
    "Groups activating an existing guest database",
  ],
  [
    "Tambourine",
    "Integrated websites and paid media",
    "Independent US hotels wanting one full-service firm",
  ],
  [
    "Profitroom",
    "Bundled booking tech and demand generation",
    "Hotels wanting a single vendor, mainly in Europe",
  ],
  [
    "Screen Pilot",
    "Paid media, SEO and analytics",
    "US independent and lifestyle hotels",
  ],
  [
    "MMGY Global",
    "Enterprise PR and integrated media",
    "Large brands and destination organisations",
  ],
  [
    "O'Rourke Hospitality Marketing",
    "Websites, SEO and paid media",
    "Hotels wanting an established hotel-only partner",
  ],
  [
    "Gourmet Marketing",
    "Conversion fundamentals before ad spend",
    "Small independents and B&Bs",
  ],
  [
    "Spherical",
    "Brand, story and creative",
    "Luxury, design-led properties",
  ],
];

const post = await client.fetch(
  `*[_type=="post" && slug.current==$slug][0]{_id, body}`,
  { slug: SLUG },
);
if (!post) {
  console.error("POST NOT FOUND");
  process.exit(1);
}

const table = (post.body || []).find((b) => b._type === "comparisonTable");
if (!table) {
  console.error("No comparisonTable block found in the post body.");
  process.exit(1);
}

const newRows = tableRows.map((cells) => ({
  _type: "tableRow",
  _key: key(),
  cells,
}));

await client
  .patch(post._id)
  .set({ [`body[_key=="${table._key}"].rows`]: newRows })
  .commit();

console.log(`Updated table rows (${newRows.length}) on "${SLUG}".`);

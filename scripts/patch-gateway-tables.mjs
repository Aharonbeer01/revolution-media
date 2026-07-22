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

const SLUG = "booking-engine-setup-direct-reservations";
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

const link = (name, url) => `[${name}](${url})`;

// REGIONAL: African / South African gateways.
const regionalHeaders = [
  "Gateway",
  "Coverage",
  "Typical Card Fee",
  "Best For",
];
const regionalRows = [
  [
    link("Payfast", "https://payfast.io"),
    "South Africa",
    "3.2% + R2 per card (Instant EFT ~2%)",
    "The most widely used SA gateway, broadest local methods",
  ],
  [
    link("Peach Payments", "https://www.peachpayments.com"),
    "South Africa and pan-African",
    "~2.95% per card, often negotiated on volume",
    "Recurring billing and higher-volume properties",
  ],
  [
    link("Yoco", "https://www.yoco.com"),
    "South Africa",
    "~2.95% per card, no monthly fee",
    "Smaller properties wanting one provider for online and in-person",
  ],
  [
    link("DPO Pay", "https://www.dpopay.com"),
    "20+ African countries",
    "Negotiated case by case",
    "Properties needing coverage across multiple African markets",
  ],
];

// INTERNATIONAL: global gateways for overseas guests.
const intlHeaders = [
  "Gateway",
  "Coverage",
  "Typical Card Fee",
  "Best For",
];
const intlRows = [
  [
    link("Stripe", "https://stripe.com"),
    "45+ countries",
    "~2.9% + fixed fee (higher for international cards)",
    "Multi-currency checkout and clean booking-engine integrations",
  ],
  [
    link("PayPal", "https://www.paypal.com"),
    "200+ countries",
    "~3.49% + fixed fee, plus cross-border fee",
    "Guest familiarity and the widest overseas reach",
  ],
  [
    link("Adyen", "https://www.adyen.com"),
    "Global, direct acquirer",
    "Interchange plus markup, suited to scale",
    "Larger groups optimising cost and authorisation rates",
  ],
];

const caption =
  "Figures are typical published rates and move often. Peach and DPO Pay negotiate individually, so confirm current pricing directly with each provider for your turnover and payment mix.";

const post = await client.fetch(
  `*[_type=="post" && slug.current==$slug][0]{_id, body}`,
  { slug: SLUG },
);
if (!post) {
  console.error("POST NOT FOUND");
  process.exit(1);
}

const existing = (post.body || []).find((b) => b._type === "comparisonTable");
if (!existing) {
  console.error("No existing gateway table found.");
  process.exit(1);
}

// 1) Turn the existing table into the REGIONAL (Africa) table.
const regionalTable = {
  _type: "comparisonTable",
  _key: existing._key,
  caption:
    "Regional gateways for South African and African properties. " + caption,
  headers: regionalHeaders,
  rows: regionalRows.map((cells) => ({
    _type: "tableRow",
    _key: key(),
    cells,
  })),
};

await client
  .patch(post._id)
  .set({ [`body[_key=="${existing._key}"]`]: regionalTable })
  .commit();
console.log("Updated existing table -> regional (Africa) gateways.");

// 2) Insert the INTERNATIONAL table right after it.
const intlTable = {
  _type: "comparisonTable",
  _key: key(),
  caption:
    "International gateways for properties with overseas guests. " + caption,
  headers: intlHeaders,
  rows: intlRows.map((cells) => ({
    _type: "tableRow",
    _key: key(),
    cells,
  })),
};

await client
  .patch(post._id)
  .insert("after", `body[_key=="${existing._key}"]`, [intlTable])
  .commit();
console.log("Inserted international gateways table after the regional one.");

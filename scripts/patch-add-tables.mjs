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

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

// Each job: which post, which H2 to insert after (regex), and the table data.
// NO em dashes. UK/SA spelling preserved. Figures taken directly from each post.
const jobs = [
  {
    slug: "how-to-reduce-ota-commissions",
    anchor: /the real math/i,
    caption:
      "What OTA commissions cost three example properties over a year, at 80% OTA share and an 18% effective rate.",
    headers: [
      "Property",
      "Rooms",
      "ADR",
      "Occupancy",
      "Annual Revenue",
      "Annual Commission",
    ],
    rows: [
      ["Guesthouse", "6", "$80", "65%", "$114,000", "$16,400"],
      ["Boutique lodge", "12", "$160", "60%", "$420,000", "$60,500"],
      ["Small resort", "30", "$125", "70%", "$958,000", "$138,000"],
    ],
  },
  {
    slug: "google-ads-for-hotels-guide-2026",
    anchor: /average google ads spend/i,
    caption:
      "Practical starting budgets by property size, assuming branded search plus one other campaign type. Adjust to your market's click costs and conversion rate.",
    headers: ["Property Size", "Rooms", "Starting Monthly Budget"],
    rows: [
      ["Guesthouse or B&B", "Under 10", "$250 to $500"],
      ["Boutique hotel or lodge", "10 to 25", "$500 to $1,200"],
      ["Larger independent", "25 to 60", "$1,200 to $3,000"],
    ],
  },
  {
    slug: "best-pms-independent-boutique-hotels",
    anchor: /the best pms options/i,
    caption:
      "PMS platforms that consistently make boutique and small-property shortlists. This is a research starting point, not a ranking. Confirm current features and pricing on a demo.",
    headers: ["Platform", "Best For", "Notes"],
    rows: [
      ["Cloudbeds", "Small international properties", "All-in-one PMS, channel manager and booking engine"],
      ["Mews", "Design-led boutiques", "Automation-heavy with a large integration marketplace"],
      ["RoomRaccoon", "South African independents", "All-in-one with strong local market fit"],
      ["NightsBridge", "South African properties", "Deep local channel connections and support"],
      ["Little Hotelier", "Small properties and B&Bs", "SiteMinder's product, simple and quick to learn"],
      ["Semper", "Guesthouses and lodges", "South African system popular with smaller operators"],
      ["eviivo", "European-facing small properties", "Small-property suite with strong European distribution"],
      ["Guestline", "Slightly larger independents", "Established platform for growing properties"],
      ["Hotelogix", "Budget-conscious small hotels", "Affordable cloud PMS"],
      ["Preno", "Boutique operators", "Lightweight, clean system"],
    ],
  },
  {
    slug: "booking-engine-setup-direct-reservations",
    anchor: /best payment gateways/i,
    caption:
      "Commonly shortlisted payment gateways for small to medium hotels. Choose on total cost per transaction, supported currencies, booking-engine compatibility and support quality.",
    headers: ["Gateway", "Region", "Best For"],
    rows: [
      ["PayFast", "South Africa", "Local cards, EFT and rand settlement"],
      ["Peach Payments", "South Africa", "Local cards and rand settlement"],
      ["DPO Pay", "South Africa and Africa", "Regional card and payment coverage"],
      ["Yoco", "South Africa", "Simple setup for smaller properties"],
      ["Stripe", "International", "Multi-currency and familiarity for overseas guests"],
      ["Adyen", "International", "Enterprise-grade multi-currency processing"],
      ["PayPal", "International", "Guest familiarity where supported"],
    ],
  },
  {
    slug: "tiktok-marketing-hotels-vs-instagram",
    anchor: /so where should your budget go/i,
    caption:
      "How the two platforms compare for hotels. TikTok drives discovery at the top of the funnel; Instagram validates and converts shortlisted guests.",
    headers: ["", "TikTok", "Instagram"],
    rows: [
      ["Primary job", "Discovery, reaching new travellers", "Validation and closing shortlisted guests"],
      ["Reach model", "Earned by the video, not follower count", "Grid and Stories, reach harder-won for small accounts"],
      ["Audience", "Skews younger, ageing upward", "Older, higher-spending on average"],
      ["Conversion tools", "Longer path from view to booking", "Profile links, Stories, DMs and offers"],
      ["Best weighting for", "New or unknown properties", "Established properties losing guests to OTAs"],
    ],
  },
];

function blockText(b) {
  return (b.children || []).map((c) => c.text).join("");
}

for (const job of jobs) {
  const post = await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]{_id, body}`,
    { slug: job.slug },
  );
  if (!post) {
    console.error(`[${job.slug}] POST NOT FOUND`);
    continue;
  }

  // Idempotent: skip if a comparison table already exists.
  if ((post.body || []).some((b) => b._type === "comparisonTable")) {
    console.log(`[${job.slug}] table already present, skipping.`);
    continue;
  }

  const anchor = (post.body || []).find(
    (b) => b._type === "block" && b.style === "h2" && job.anchor.test(blockText(b)),
  );
  if (!anchor) {
    console.error(`[${job.slug}] anchor H2 not found for ${job.anchor}`);
    continue;
  }

  const tableBlock = {
    _type: "comparisonTable",
    _key: key(),
    caption: job.caption,
    headers: job.headers,
    rows: job.rows.map((cells) => ({ _type: "tableRow", _key: key(), cells })),
  };

  await client
    .patch(post._id)
    .insert("after", `body[_key=="${anchor._key}"]`, [tableBlock])
    .commit();

  console.log(
    `[${job.slug}] inserted ${job.rows.length}-row table after "${blockText(anchor)}".`,
  );
}

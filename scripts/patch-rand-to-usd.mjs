import "dotenv/config";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "xoemestg",
  dataset: "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

/**
 * Each entry: { slug, replacements: [ [oldSubstring, newSubstring], ... ] }
 * The old substrings match the ACTUAL flattened text stored in Sanity
 * (the source "table rows" were rendered as normal sentences). Replacement
 * is done span-by-span: the span whose text contains oldSubstring is edited.
 */
const patches = [
  {
    slug: "ota-dependency-risks-south-african-lodges",
    replacements: [
      ["Average daily rate: R2,500", "Average daily rate: $150"],
      ["Annual room revenue: about R5.47 million", "Annual room revenue: about $328,000"],
      ["the lodge pays roughly R788,000 a year in commission", "the lodge pays roughly $47,000 a year in commission"],
      ["Now compare that with what R788,000 buys", "Now compare that with what $47,000 buys"],
      ["Add rand volatility, seasonal demand swings", "Add currency volatility, seasonal demand swings"],
    ],
  },
  {
    slug: "how-to-reduce-ota-commissions",
    replacements: [
      ["Percentages hide the pain. Rand amounts reveal it.", "Percentages hide the pain. Dollar amounts reveal it."],
      // Table row -> flattened sentence
      ["Guesthouse: 6 rooms, R1,400 ADR, 65% occupancy, R2.0m annual revenue, R287,000 annual commission", "Guesthouse: 6 rooms, $80 ADR, 65% occupancy, $114,000 annual revenue, $16,400 annual commission"],
      ["Boutique lodge: 12 rooms, R2,800 ADR, 60% occupancy, R7.4m annual revenue, R1.06m annual commission", "Boutique lodge: 12 rooms, $160 ADR, 60% occupancy, $420,000 annual revenue, $60,500 annual commission"],
      ["Small resort: 30 rooms, R2,200 ADR, 70% occupancy, R16.9m annual revenue, R2.43m annual commission", "Small resort: 30 rooms, $125 ADR, 70% occupancy, $958,000 annual revenue, $138,000 annual commission"],
      ["paying over a million rand a year for bookings", "paying over $60,000 a year for bookings"],
      ["the commission bill drops by around R400,000 a year", "the commission bill drops by around $22,500 a year"],
    ],
  },
  {
    slug: "google-ads-for-hotels-guide-2026",
    replacements: [
      ["if clicks in your market cost around R15 and your website converts 2% of visitors, a booking costs roughly R750 in ad spend. Against a R7,500 booking, that is a 10% acquisition cost", "if clicks in your market cost around $1 and your website converts 2% of visitors, a booking costs roughly $50 in ad spend. Against a $500 booking, that is a 10% acquisition cost"],
      ["Reaching that person costs a few rand per click", "Reaching that person costs a dollar or two per click"],
      ["Guesthouse or B&B (under 10 rooms): R4,000 to R8,000 per month", "Guesthouse or B&B (under 10 rooms): $250 to $500 per month"],
      ["Boutique hotel or lodge (10 to 25 rooms): R8,000 to R20,000 per month", "Boutique hotel or lodge (10 to 25 rooms): $500 to $1,200 per month"],
      ["Larger independent (25 to 60 rooms): R20,000 to R50,000 per month", "Larger independent (25 to 60 rooms): $1,200 to $3,000 per month"],
      ["a focused budget in the R4,000 to R8,000 monthly range", "a focused budget in the $250 to $500 monthly range"],
      ["outperforms broad search campaigns rand for rand", "outperforms broad search campaigns dollar for dollar"],
    ],
  },
  {
    slug: "meta-ads-fill-empty-rooms-off-peak",
    replacements: [
      ["viable from a few thousand rand per month", "viable from a few hundred dollars per month"],
      ["Every rand of Meta spend is wasted", "Every dollar of Meta spend is wasted"],
      ["Start with a focused test in the low thousands of rand per month", "Start with a focused test of a few hundred dollars a month"],
    ],
  },
  {
    slug: "measure-hotel-marketing-roi",
    replacements: [
      ["Make Every Rand Report for Duty", "Make Every Dollar Report for Duty"],
    ],
  },
];

let applied = 0;
let missing = [];

for (const { slug, replacements } of patches) {
  // Fetch the FULL document. The write token can createOrReplace (create-type)
  // but lacks the "update"/patch permission, so we replace the whole doc.
  const post = await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]`,
    { slug }
  );
  if (!post) {
    console.error(`POST NOT FOUND: ${slug}`);
    continue;
  }

  const doc = JSON.parse(JSON.stringify(post));
  let changedInPost = 0;

  for (const [oldStr, newStr] of replacements) {
    let done = false;
    for (const block of doc.body || []) {
      if (block._type !== "block") continue;
      for (const child of block.children || []) {
        if (typeof child.text === "string" && child.text.includes(oldStr)) {
          child.text = child.text.replace(oldStr, newStr);
          done = true;
          applied++;
          changedInPost++;
          break;
        }
      }
      if (done) break;
    }
    if (!done) missing.push({ slug, oldStr });
  }

  if (changedInPost > 0) {
    // Strip system fields that createOrReplace rejects / re-derives.
    const { _rev, _createdAt, _updatedAt, ...clean } = doc;
    await client.createOrReplace(clean);
    console.log(`  patched ${slug}: ${changedInPost} replacement(s)`);
  }
}

console.log(`\nTotal replacements applied: ${applied} / 22`);
if (missing.length) {
  console.log("\nNOT FOUND (needs attention):");
  for (const m of missing) console.log(`  [${m.slug}] "${m.oldStr}"`);
} else {
  console.log("All 22 target strings found and replaced.");
}

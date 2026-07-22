import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "xoemestg",
  dataset: "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const SLUG = "best-pms-independent-boutique-hotels";

// Official homepage for each PMS. First cell becomes a "[Name](url)" link.
const URLS = {
  Cloudbeds: "https://www.cloudbeds.com",
  Mews: "https://www.mews.com",
  RoomRaccoon: "https://roomraccoon.com",
  NightsBridge: "https://www.nightsbridge.com",
  "Little Hotelier": "https://www.littlehotelier.com",
  Semper: "https://semperpms.com",
  eviivo: "https://eviivo.com",
  Guestline: "https://www.theaccessgroup.com/en-gb/hotels/",
  Hotelogix: "https://www.hotelogix.com",
  Preno: "https://prenohq.com",
};

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
  console.error("No comparisonTable found in PMS post.");
  process.exit(1);
}

let linked = 0;
const newRows = (table.rows || []).map((row) => {
  const cells = [...(row.cells || [])];
  const name = cells[0];
  const url = URLS[name];
  if (url && !/^\[/.test(name)) {
    cells[0] = `[${name}](${url})`;
    linked++;
  }
  return { ...row, cells };
});

await client
  .patch(post._id)
  .set({ [`body[_key=="${table._key}"].rows`]: newRows })
  .commit();

console.log(`Linked ${linked} PMS name(s) in the table.`);

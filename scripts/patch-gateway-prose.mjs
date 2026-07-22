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

const SLUG = "booking-engine-setup-direct-reservations";

const post = await client.fetch(
  `*[_type=="post" && slug.current==$slug][0]{_id, body}`,
  { slug: SLUG },
);
if (!post) {
  console.error("POST NOT FOUND");
  process.exit(1);
}

const body = post.body || [];

// Find the H2 and the intro paragraph that starts "For South African properties".
const h2 = body.find(
  (b) =>
    b._type === "block" &&
    b.style === "h2" &&
    /best payment gateways/i.test((b.children || []).map((c) => c.text).join("")),
);
const intro = body.find(
  (b) =>
    b._type === "block" &&
    /^For South African properties/.test(
      (b.children || []).map((c) => c.text).join(""),
    ),
);
if (!h2 || !intro) {
  console.error("Could not locate H2 or intro paragraph.");
  process.exit(1);
}

// New lead-in copy that sets up the two-table split (regional then international)
// without re-listing every gateway in prose.
const newText =
  "Your shortlist depends on where your guests pay from. Properties selling mostly to local and regional travellers should start with a South African or African gateway that settles in rand and supports local methods. Properties with a strong overseas guest base usually add or choose a global provider for multi-currency handling and familiarity. The two tables below split the commonly shortlisted options along exactly that line.";

const newIntro = {
  ...intro,
  children: (intro.children || []).map((c, i) =>
    i === 0 ? { ...c, text: newText } : { ...c, text: "" },
  ),
};

// 1) Update the intro paragraph text in place.
await client
  .patch(post._id)
  .set({ [`body[_key=="${intro._key}"].children`]: newIntro.children })
  .commit();
console.log("Rewrote intro paragraph as a two-table lead-in.");

// 2) Move it to directly after the H2 (before the tables): remove then re-insert.
await client
  .patch(post._id)
  .unset([`body[_key=="${intro._key}"]`])
  .commit();
await client
  .patch(post._id)
  .insert("after", `body[_key=="${h2._key}"]`, [newIntro])
  .commit();
console.log("Moved lead-in to directly after the H2.");

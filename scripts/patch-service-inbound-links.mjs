import { config } from "dotenv";
config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

// Three service pages had no inbound blog links at all, which is part of why
// Search Console left them at "Discovered, not crawled". This adds one
// contextual link each, from the most topically relevant post.
//
// Where the post already contains a natural anchor phrase we link it in place;
// otherwise we add a single closing sentence rather than bolting a link onto
// unrelated copy. Idempotent: re-running makes no further changes.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xoemestg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

/** Wrap an existing phrase in a link, splitting the span that contains it. */
function linkPhraseInPlace(block, phrase, href) {
  const i = (block.children || []).findIndex(
    (ch) => ch._type === "span" && ch.text.includes(phrase),
  );
  if (i === -1) return false;

  const span = block.children[i];
  const at = span.text.indexOf(phrase);
  const linkKey = key();

  const parts = [];
  if (at > 0) {
    parts.push({ ...span, _key: key(), text: span.text.slice(0, at) });
  }
  parts.push({
    ...span,
    _key: key(),
    text: phrase,
    marks: [...(span.marks || []), linkKey],
  });
  const tail = span.text.slice(at + phrase.length);
  if (tail) parts.push({ ...span, _key: key(), text: tail });

  block.children.splice(i, 1, ...parts);
  block.markDefs = [
    ...(block.markDefs || []),
    { _type: "link", _key: linkKey, href },
  ];
  return true;
}

/** Append a sentence, with one linked phrase, to the end of a block. */
function appendSentence(block, before, linkText, after, href) {
  const linkKey = key();
  block.markDefs = [
    ...(block.markDefs || []),
    { _type: "link", _key: linkKey, href },
  ];
  block.children.push(
    { _type: "span", _key: key(), text: before, marks: [] },
    { _type: "span", _key: key(), text: linkText, marks: [linkKey] },
    { _type: "span", _key: key(), text: after, marks: [] },
  );
  return true;
}

const JOBS = [
  {
    slug: "measure-hotel-marketing-roi",
    href: "/services/marketing-strategy",
    apply(body) {
      const block = [...body].reverse().find(
        (b) => b._type === "block" && b.style === "normal",
      );
      return appendSentence(
        block,
        " That measurement layer is where our ",
        "marketing strategy",
        " work begins for every property we take on.",
        this.href,
      );
    },
  },
  {
    slug: "hotel-content-creation-drives-bookings",
    href: "/services/photography",
    apply(body) {
      const block = [...body].reverse().find(
        (b) => b._type === "block" && b.style === "normal",
      );
      return appendSentence(
        block,
        " Where the anchor stills need to be done properly, that starts with professional ",
        "hospitality photography",
        ".",
        this.href,
      );
    },
  },
  {
    slug: "aeo-for-hotels-ai-recommendations",
    href: "/services/seo-google-business-profile",
    apply(body) {
      const block = body.find(
        (b) =>
          b._type === "block" &&
          b.style === "normal" &&
          (b.children || []).some((ch) =>
            (ch.text || "").includes("Google Business Profile"),
          ),
      );
      if (!block) return false;
      return linkPhraseInPlace(block, "Google Business Profile", this.href);
    },
  },
];

for (const job of JOBS) {
  const doc = await client.fetch(
    `*[_type=="post" && slug.current==$s][0]{ _id, body }`,
    { s: job.slug },
  );
  if (!doc?._id) {
    console.log(`  post not found: ${job.slug}`);
    continue;
  }

  if (JSON.stringify(doc.body).includes(job.href)) {
    console.log(`  already links ${job.href}: ${job.slug}`);
    continue;
  }

  const body = JSON.parse(JSON.stringify(doc.body));
  if (!job.apply(body)) {
    console.log(`  no anchor found, skipped: ${job.slug}`);
    continue;
  }

  await client.patch(doc._id).set({ body }).commit();
  console.log(`  ${job.slug}  ->  ${job.href}`);
}

console.log("\nDone.");

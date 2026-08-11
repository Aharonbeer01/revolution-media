import { config } from "dotenv";
config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

// FIX 1 of the reindex remediation: full rewrite of
// /blog/social-media-strategy-hotels-beyond-likes. Keeps the slug, title,
// category, and original published date; replaces only the excerpt and body.
// Updating the body bumps Sanity's _updatedAt, which the sitemap uses for
// lastmod and the detail page now exposes as Article dateModified.
// FAQPage JSON-LD is generated automatically by the detail page from the
// "Frequently Asked Questions" H2 section. No em dashes. UK/SA spelling.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xoemestg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const randomKey = () => randomUUID().replace(/-/g, "").slice(0, 12);

function normaliseHref(href) {
  if (!href) return href;
  const m = href.match(/^https?:\/\/\/?(.*)$/);
  if (m && (m[1].startsWith("/") || !m[1].includes("."))) {
    return m[1].startsWith("/") ? m[1] : `/${m[1]}`;
  }
  return href;
}

function parseInline(text) {
  const children = [];
  const markDefs = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  const pushText = (segment, extraMarks) => {
    if (!segment) return;
    const parts = segment.split(/(\*\*[^*]+\*\*)/g);
    for (const part of parts) {
      if (!part) continue;
      if (part.startsWith("**") && part.endsWith("**")) {
        children.push({
          _type: "span",
          _key: randomKey(),
          text: part.slice(2, -2),
          marks: ["strong", ...(extraMarks || [])],
        });
      } else {
        children.push({
          _type: "span",
          _key: randomKey(),
          text: part,
          marks: [...(extraMarks || [])],
        });
      }
    }
  };

  while ((match = linkRegex.exec(text)) !== null) {
    pushText(text.slice(lastIndex, match.index));
    const linkKey = randomKey();
    markDefs.push({
      _type: "link",
      _key: linkKey,
      href: normaliseHref(match[2]),
    });
    pushText(match[1], [linkKey]);
    lastIndex = linkRegex.lastIndex;
  }
  pushText(text.slice(lastIndex));

  if (children.length === 0) {
    children.push({ _type: "span", _key: randomKey(), text: "", marks: [] });
  }
  return { children, markDefs };
}

function makeBlock(style, text) {
  const { children, markDefs } = parseInline(text);
  return { _type: "block", _key: randomKey(), style, markDefs, children };
}

function makeListItem(text, listItem, level) {
  const { children, markDefs } = parseInline(text);
  return {
    _type: "block",
    _key: randomKey(),
    style: "normal",
    level,
    listItem,
    markDefs,
    children,
  };
}

function parseTable(lines) {
  const splitRow = (line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());

  const headers = splitRow(lines[0]);
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = splitRow(lines[i]);
    rows.push({ _type: "tableRow", _key: randomKey(), cells });
  }
  return { _type: "comparisonTable", _key: randomKey(), headers, rows };
}

function isTableSeparator(line) {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line.trim());
}

function isTableRow(line) {
  return /^\s*\|.*\|\s*$/.test(line);
}

function markdownToPortableText(markdown) {
  const blocks = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      i++;
      continue;
    }

    if (
      isTableRow(raw) &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      const tableLines = [];
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push(parseTable(tableLines));
      continue;
    }

    if (line.startsWith("# ")) {
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(makeBlock("h3", line.slice(4).trim()));
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push(makeBlock("h2", line.slice(3).trim()));
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      blocks.push(makeListItem(line.replace(/^[-*]\s+/, ""), "bullet", 1));
      i++;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      blocks.push(makeListItem(line.replace(/^\d+\.\s+/, ""), "number", 1));
      i++;
      continue;
    }

    blocks.push(makeBlock("normal", line));
    i++;
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// New content, copied verbatim from revolution-media-reindex-fix.md.
// ---------------------------------------------------------------------------

const slug = "social-media-strategy-hotels-beyond-likes";

const excerpt =
  "Content ideas are everywhere. What most properties lack is the layer above them: a strategy that decides the goals, the platforms, the people, and the budget before a single post is made. This is that layer, with a platform selection table and a 90-day rollout, ending where hotel social media should always end: in bookings.";

const body = `Picture the monthly social report: followers up, likes up, reach up, and a property that cannot point to one booking any of it produced. That report is not describing a content problem. It is describing a strategy vacuum, because content was being made before anyone decided what it was for.

We have published detailed guides on the tactical layer of hotel social media: [what to create](/blog/hotel-content-creation-drives-bookings), [where TikTok beats Instagram](/blog/tiktok-marketing-hotels-vs-instagram), and [how to run the ads](/blog/meta-ads-campaign-types-hotels). This post is the layer above all of them: the operating strategy a GM or owner signs off, covering goals, platforms, people, budget, and rollout. Get this layer right and every tactical guide beneath it compounds. Skip it and you are decorating the internet.

## Start With Revenue Goals, Not Content Ideas

A social strategy begins by naming the business outcomes it serves, in numbers. Not awareness. Numbers: direct booking enquiries per month from social, database sign-ups, remarketing pool growth, assisted bookings. Pick two or three, set quarterly targets, and let every downstream decision answer to them. The properties that skip this step are the ones whose reports lead with likes, because likes are what you measure when nobody decided what mattered.

The goals also settle the oldest argument in hotel social media, organic versus paid, by dissolving it. Organic builds the audiences and proof; paid converts them. They are one system with one budget, judged together against the same targets.

## Choose Platforms Like You Choose Markets

Platforms are feeder markets with algorithms. Choose them the way you choose where to advertise: by where your actual guests are and what job each platform can do for your goals.

| Platform | Strongest role for hotels | Best guest fit | Realistic time cost |
|---|---|---|---|
| Instagram | Validation: the profile guests check before booking, plus Reels discovery | Broad, skews 28 to 55, international leisure | 4 to 6 hours weekly |
| TikTok | Discovery: reaching travellers who have never heard of you | Under 40, growing older yearly | 4 to 6 hours weekly |
| Facebook | Paid infrastructure and remarketing; community for older markets | 45 plus, domestic and group travel | 1 to 2 hours weekly beyond ads |
| YouTube | Long-form destination research and Shorts reach | Planners of long-haul, high-value trips | Batch-produced monthly |
| LinkedIn | Corporate, conference, and trade relationships | Business travel and MICE buyers | 1 hour weekly, if relevant at all |

The strategic rule sits under the table: two platforms done consistently beat five done sporadically. For most independent properties that means Instagram as the anchor, TikTok or Facebook as the second seat depending on guest age, and the rest only when capacity genuinely exists. The full budget logic between the top two lives in our [TikTok vs Instagram comparison](/blog/tiktok-marketing-hotels-vs-instagram).

## Decide Who Actually Does This

The most common point of failure in hotel social media is not creativity. It is ownership. Someone specific must own the channel, with hours allocated, or it becomes everyone's eleventh priority. The workable models: a trained in-house person running the monthly batch workflow from our [content guide](/blog/hotel-content-creation-drives-bookings), roughly a day a month of shooting plus scheduling and daily community management; an agency running strategy, production, and ads with the property feeding raw moments; or the hybrid most of our clients land on, professional anchor content quarterly with in-house authenticity between. Whichever model you choose, write it down: who shoots, who posts, who answers DMs within the hour, and who reports the numbers monthly.

## Split the Budget Deliberately

A defensible starting split for an independent property: roughly 40% of the social budget to content production, 40% to paid amplification, and 20% to tools, training, and testing. The paid portion follows the objective playbook in our [Meta campaign guide](/blog/meta-ads-campaign-types-hotels): always-on Sales campaigns to warm audiences first, with awareness bursts reserved for launches and seasonal pushes like the [festive window](/blog/festive-season-hotel-marketing-playbook). The discipline that protects the whole budget: nothing gets boosted on feel. If a post earns amplification, it earns it into a proper campaign with an objective, an audience, and a tracked outcome.

## Build the Conversion Layer Before You Grow

Growth without plumbing produces the likes-but-no-bookings report. Before scaling anything, the conversion layer must exist: the bio link landing on live rates, offer posts carrying promo codes your [booking engine](/blog/booking-engine-setup-direct-reservations) honours, DMs and WhatsApp answered inside the hour, and every link UTM-tagged so social traffic is visible in analytics. This is a week of setup, and it is the difference between a channel that entertains and a channel that sells.

## The 90-Day Rollout

| Phase | Focus | What gets done |
|---|---|---|
| Days 1 to 30 | Foundation | Goals and targets agreed, platforms chosen, ownership assigned, conversion layer built, first batch shoot completed |
| Days 31 to 60 | Rhythm | Consistent posting begins, community management daily, first Sales campaign live to warm audiences, baseline numbers recorded |
| Days 61 to 90 | Optimisation | Double down on formats earning saves and enquiries, cut what is not, first monthly report against the revenue targets, budget split adjusted |

By day 90 the question "is social media working" has a numerical answer, which is the entire point of having a strategy.

## Measure Like an Owner

The monthly report leads with the goal metrics: enquiries, database growth, tracked bookings and assisted revenue, cost per result on the paid layer, all held against the OTA-commission benchmark from our [ROI guide](/blog/measure-hotel-marketing-roi). Engagement and reach appear as diagnostics beneath, never as headlines. Two newer tools complete the picture: the booking-intent key events in GA4 that make social's contribution visible, and [Search Console platform properties](/blog/google-search-console-platform-properties-hotels), which now show exactly how your Instagram and TikTok content surfaces in Google Search.

## Frequently Asked Questions

### How much should a hotel spend on social media marketing?

Set the budget from the goals: enough production to sustain your chosen platforms and enough paid spend to convert the audiences they build, then judge the total by cost per enquiry and booking against your OTA commission. For most independents that starts at a few hundred dollars a month plus the time of one accountable owner.

### Which social media platforms should a hotel be on?

Two, chosen from the table by guest fit: usually Instagram as the anchor with TikTok or Facebook second. Add further platforms only when the first two are consistent and converting.

### How do I know if my hotel's social media strategy is working?

Within 90 days you should see the goal metrics moving: enquiries from social, database growth, and tracked or assisted bookings, at a cost per result that beats OTA commission. If the only things growing are followers and likes, the conversion layer is missing, not the audience.

## Strategy First. Content Second. Bookings as the Score.

Set the goals, pick two platforms, name an owner, build the conversion layer, and run the 90 days. Every tactical guide on this blog then has a strategy to serve. If you would rather have the whole operating system built and run for you, that is our [social media management service](/services/social-media-management), and it reports in the metrics this post just taught you to demand. [Book a discovery call](/contact).`;

async function run() {
  const existing = await client.fetch(
    `*[_type=="post" && slug.current==$slug][0]{ _id, title, publishedAt }`,
    { slug },
  );
  if (!existing) {
    console.error(`Post with slug "${slug}" not found. Aborting.`);
    process.exit(1);
  }

  const portableBody = markdownToPortableText(body);
  const tableCount = portableBody.filter(
    (b) => b._type === "comparisonTable",
  ).length;
  const linkCount = portableBody.reduce(
    (n, b) => n + ((b.markDefs && b.markDefs.length) || 0),
    0,
  );

  await client
    .patch(existing._id)
    .set({ excerpt, body: portableBody })
    .commit();

  console.log("\n=== FIX 1: SOCIAL STRATEGY REWRITE ===\n");
  console.log(`Patched ${existing._id}`);
  console.log(`  title (unchanged):     ${existing.title}`);
  console.log(`  publishedAt (unchanged): ${existing.publishedAt}`);
  console.log(`  tables rendered:       ${tableCount}`);
  console.log(`  internal links:        ${linkCount}`);
  console.log(
    `  em dashes in body:     ${body.includes("\u2014") ? "FOUND" : 0}`,
  );
  console.log(
    "\ndateModified/_updatedAt auto-bumped by this patch. Sitemap lastmod will refresh on next revalidate.\n",
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

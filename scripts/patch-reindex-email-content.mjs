import { config } from "dotenv";
config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

// Reindex remediation, second pair. Full rewrites of two crawled-not-indexed
// posts. Each keeps its slug, title, category, and original published date;
// only excerpt and body change. Updating the body bumps Sanity's _updatedAt,
// which the sitemap uses for lastmod and the detail page exposes as Article
// dateModified. FAQPage JSON-LD is generated automatically by the detail page
// from the "Frequently Asked Questions" H2 section. No redirects needed:
// neither topic is duplicated elsewhere. No em dashes. UK/SA spelling.
//
// Two internal links were unlinked (targets do not exist yet, per approval):
//   - /blog/whatsapp-marketing-for-hotels   (Rewrite 1: "WhatsApp threads")
//   - /blog/ga4-events-vs-key-events-hotels (both rewrites: "key events")

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
// POST A: Email Marketing for Hotels
// ---------------------------------------------------------------------------

const postA = {
  slug: "email-marketing-hotels-loyalty-repeat-bookings",
  excerpt:
    "The cheapest booking your property will ever win is a repeat guest, and email is the machine that produces them. This is the complete system: how to build the database, the eight automations that run themselves, the campaigns worth sending, and how to measure it all against the commission you would have paid instead.",
  body: `Every property owner knows the statistic by feel, even before seeing it written down: email delivers the highest return of any marketing channel. And yet walk into most hotels and the "email programme" is a rate sheet blasted to an old list twice a year, from an inbox, with no idea what it earned.

The gap between that and a real email system is not budget. Email is the one channel with almost no marginal cost, because you already own the audience. The gap is structure, and structure is what this guide provides: the database, the automations, the campaigns, the segments, and the measurement, in the order to build them.

## Why Email Beats Every Channel You Pay For

Three structural advantages, and they all trace back to ownership. The audience is yours: no algorithm decides who sees your message, and no platform can change the rules or the price. The cost is near zero: once the system exists, a booking generated by email costs cents against the 15 to 25% an OTA charges for the same guest, the benchmark from our [commission breakdown](/blog/how-to-reduce-ota-commissions). And the timing is perfect by design: automations reach each guest at the exact moment in their journey when the message is relevant, which no broadcast channel can do.

The prerequisite is the thing OTAs deliberately withhold: the guest's email address. Which is where the system starts.

## Build the Database Before the Campaigns

Hotels have more natural email touchpoints than almost any business, and most waste all of them. Capture at every one: the booking engine opt-in, digital registration at check-in (including for OTA guests, where the platform's rules permit collection at the property), the WiFi portal, a website lead magnet worth wanting (a genuinely good destination guide beats "join our newsletter" every time), spa and restaurant bookings, and the WhatsApp threads where enquiries already live.

Two rules keep the asset healthy. Consent first: proper opt-in, easy unsubscribe, and compliance with POPIA, GDPR, and whatever governs your guests' home markets, because international properties email international inboxes. And quality over size: five hundred engaged past guests out-earn ten thousand cold addresses, and they protect your sender reputation instead of burning it.

## The Automation Map: Eight Emails That Run Themselves

Automations are where email earns its reputation, because they are built once and work forever. The full map:

| Automation | Trigger | Timing | Its job |
|---|---|---|---|
| Booking confirmation | Direct booking made | Immediately | Reassure, confirm details, set the tone |
| Pre-arrival guide | Upcoming stay | 7 days before | Build anticipation, sell add-ons and upgrades |
| Arrival day note | Check-in day | That morning | Directions, check-in details, one warm touch |
| Mid-stay check-in | During stay (opted in) | Day 2 or 3 | Surface spa, dining, activities; intercept problems early |
| Post-stay thank you | Checkout | Within 24 hours | Gratitude plus the review ask while the glow is real |
| Return offer | Checkout | 30 to 60 days after | A direct-only reason to come back |
| Win-back | No return stay | 12 to 18 months after | Reactivate lapsed guests with memory and an offer |
| Abandoned booking | Booking engine started, not finished | Within hours | Recover the warmest lead your website produces |

Start with three if eight feels heavy: confirmation, post-stay, and the return offer. Those alone put the flywheel in motion, and the abandoned booking email, which depends on your [booking engine](/blog/booking-engine-setup-direct-reservations) supporting it, is usually the highest-converting message a property ever sends.

## The Campaign Layer: Fewer, Better, Seasonal

On top of the automations sit the campaigns you send by choice, and restraint is the strategy. A seasonal rhythm works for almost every property: the green season offer, the early festive access that anchors our [festive playbook](/blog/festive-season-hotel-marketing-playbook), a midyear escape, and the occasional genuinely newsworthy update. Two to four quality campaigns a quarter keeps the list warm without training it to ignore you, and past festive guests hearing about December first, as a privilege, is the single highest-leverage campaign of the year.

## Segment Like the Revenue Depends on It

Because it does. The minimum viable segmentation: booking source (direct versus OTA-acquired, who need converting to direct), geography (international guests book months ahead and need offers earlier than domestic ones), stay purpose (the honeymoon couple and the family reunion should never get the same email), and value tier (your top guests deserve recognition, not the generic blast). Even two segments, international and domestic, sent the same offer on different timelines, measurably outperforms one list treated as one audience. Build segments as fields captured at source rather than a cleanup project later: the check-in form and booking engine can tag most of this automatically from day one.

## Deliverability: The Unglamorous 20%

None of it matters if the emails land in spam. The basics that keep you in the inbox: send from your own authenticated domain (your email platform will walk you through the DNS records), never buy or import lists you did not build, clean out subscribers who have not opened in a year, and keep a steady sending rhythm rather than months of silence broken by a blast. A smaller list that opens is an asset; a big list that ignores you is a liability with your domain's name on it.

## Measure It Against the Commission

Email reports love open rates, but the numbers that matter are further down: revenue per automation, revenue per campaign, database growth rate, and cost per email-attributed booking against your average OTA commission, tracked through the key events and promo codes your measurement stack already uses. For most properties that run the full system, email settles the ROI argument faster than any other channel, because the acquisition cost rounds to zero and every booking it produces is direct by definition.

## Frequently Asked Questions

### How often should a hotel email past guests?

Automations run on the guest's own timeline, so frequency takes care of itself. For campaigns, two to four well-made sends a quarter is the sweet spot: enough to stay remembered, restrained enough to stay welcome.

### Which email platform should a hotel use?

Any modern platform (Mailchimp, Klaviyo, Brevo, and similar) handles everything in this guide. The deciding factors are integration with your booking engine or PMS, so bookings trigger automations without manual work, and pricing at your list size. The system matters far more than the software.

### Is my list too small to bother with email marketing?

No. A few hundred past guests is a revenue asset: they know you, they opted in, and one good return-offer campaign to them routinely outperforms thousands of dollars of cold advertising. Small lists are where the habit, and the compounding, begin.

## The Channel You Own Outright

Build the capture points, switch on three automations, and send one good seasonal campaign. From there the system compounds every month, at a cost that embarrasses every other channel. If you would rather have the whole engine built and written for you, that is exactly what our [email marketing service](/services/email-marketing) does for hospitality brands. [Book a discovery call](/contact).`,
};

// ---------------------------------------------------------------------------
// POST B: Content Marketing for Hotels
// ---------------------------------------------------------------------------

const postB = {
  slug: "content-marketing-hotels-attract-guests",
  excerpt:
    "Paid channels capture travellers who are already searching. Content marketing reaches them earlier, while they are still dreaming, and it does it through the one asset that compounds: your website. This is the publishing playbook for a property's own site, from destination guides to answer pages, with a quarterly content plan.",
  body: `There are two ways to win a guest. Capture them while they search, which is what advertising does and what our paid media guides cover in depth. Or reach them earlier, while they are still deciding whether to travel at all, so that by the time they search, you are the property they are checking on rather than discovering.

That second, upstream game is content marketing, and one distinction matters before anything else: this is about what your website publishes. The reels and posts that fill your social feeds are their own system, covered in our [content creation guide](/blog/hotel-content-creation-drives-bookings). This guide is the owned layer underneath it: the destination guides, seasonal pieces, and answer pages that live on your domain, rank in search, get cited by AI assistants, and keep working years after you hit publish.

## Why the Property Website Just Became More Valuable, Not Less

The AI shift could have killed the hotel blog. Instead it did the opposite. When a traveller asks Google or an AI assistant about your region, the answer is assembled from published pages, and the assistants disproportionately cite content that answers questions directly, carries structure, and comes from a source with genuine local authority. Nobody on earth has more genuine authority on your area than the property that lives there. A lodge's guide to its own valley, written properly, outranks and out-cites a content farm every time, and every citation introduces your property at the exact moment someone is falling in love with your destination.

The economics compound too. An ad stops the moment the budget does. A destination guide that ranks delivers researchers to your website every day, at a marginal cost of nothing, for years. Content is the only marketing asset on your books that appreciates.

## The Four Content Types That Win for Hotels

| Content type | The job it does | Example |
|---|---|---|
| Destination guides | Authority and discovery: own the area's big questions | "The Complete Guide to [Your Region]" |
| Seasonal and event content | Capture date-driven planning searches early | "What [Destination] Is Like in December" |
| Planning resources | Reach first-timers casting a wide net | "How to Plan a Week in [Destination]" |
| Answer pages | Win the specific questions AI assistants lift | "When Is the Best Time to Visit [Region]?" |

### Destination Guides: The Cornerstones

One comprehensive, honestly useful guide to your area is worth fifty thin posts: where to eat, what to do, how to get around, what each season offers, what only locals know. Structure it for citation, not just reading: clear question-based headings, a direct answer opening each section, and tables for the practical facts (distances, seasons, transfer times), because structured facts are what search engines and assistants extract. Refresh it twice a year so it never goes stale, and let it link to every other piece you publish.

### Seasonal and Event Content: Publish Ahead of the Wave

Date-anchored pieces catch travellers planning around specific times, and timing is the whole trick: content must be live and indexed before the research wave, not during it. A December guide publishes in August, which is precisely the logic our [festive playbook](/blog/festive-season-hotel-marketing-playbook) applies to campaigns. Build the annual rhythm once and repeat it every year with updates.

### Planning Resources: The Wide Net

Itineraries and how-to pieces reach travellers before they have shortlisted anything. The craft is weaving your property in naturally: a line like "many of our guests spend their first morning at the waterfront market" plants the idea without a hard sell, and every resource ends with a genuine next step toward your site's booking path.

### Answer Pages: The AEO Layer

The newest and fastest-growing type: pages built around the exact questions travellers ask assistants. Is the region safe? Best time to visit? How do you get there? Is it worth visiting with kids? One question per page, a direct answer in the first two sentences, detail beneath, FAQ schema on top. This is the mechanics of our [AEO guide](/blog/aeo-for-hotels-ai-recommendations) applied to your destination, and it is the least competitive high-value content a property can publish right now.

## The Quarterly Content Plan

Consistency beats volume, and a property team can sustain this cadence indefinitely:

| Each quarter | Pieces | What they are |
|---|---|---|
| Cornerstone care | 1 | Create or refresh one destination guide |
| Seasonal | 2 | Next season's guide plus one event or holiday piece, published a quarter ahead |
| Answer pages | 2 | Two traveller questions, one page each |
| Planning resource | 1 | One itinerary or how-to |

Six pieces a quarter, two a month, each with a clear job. Within a year the site carries a cornerstone, a full seasonal cycle, eight answer pages, and four resources: a genuine destination library, built at a pace that never breaks.

## One Production, Every Channel

Nothing you publish should live once. The destination guide becomes the pre-arrival email your [email system](/blog/email-marketing-hotels-loyalty-repeat-bookings) sends, the seasonal piece becomes the month's reel scripts and story series, the answer pages become caption material, and every campaign gets a content-rich landing page instead of a bare offer. The website layer and the social layer are one production line viewed from two ends, which is why properties that run both together produce more with less.

## Measure the Upstream Game Properly

Content works on a longer clock than ads, so measure it on the right terms: organic traffic growth to the content pages, the key events each page produces (enquiries, booking engine entries, WhatsApp taps), rankings for the destination queries you targeted, and a monthly spot-check of what AI assistants now say when asked about your region. Add [Search Console](/blog/google-search-console-platform-properties-hotels) to see the queries surfacing your pages, and give the programme two to three quarters before judging: the assets this builds are the slowest to mature and the last to die.

## Frequently Asked Questions

### Does blogging still matter for hotels now that AI answers questions directly?

More than before. AI answers are assembled from published pages and cite their sources, so the properties publishing structured, authoritative destination content are the ones the assistants name. The format changed; the need for the underlying pages grew.

### What content should a small property publish first?

One genuinely excellent destination guide, then two answer pages built on the questions guests actually ask before booking. Those three pages alone put a small property ahead of most of its market.

### How often should a hotel publish new content?

Two pieces a month on the quarterly plan above is enough, provided it is sustained. A steady year of publishing beats a burst of ten posts followed by silence, both for rankings and for the library you end up owning.

## Be the Answer Before They Ask

Publish the cornerstone, work the quarterly plan, and let the library compound while your ads do the short-term work. If you want the whole engine written for you, in your property's voice and structured for the way travellers now search, that is what our [copywriting and content service](/services/copywriting) exists for. [Book a discovery call](/contact).`,
};

// ---------------------------------------------------------------------------
// Apply
// ---------------------------------------------------------------------------

function report(label, post, body) {
  const tables = (body.match(/\n\|/g) || []).length > 0;
  const tableCount = body
    .split("\n")
    .filter((l, idx, arr) => /^\s*\|/.test(l) && /^\|?\s*:?-{2,}/.test((arr[idx + 1] || "").trim()))
    .length;
  const linkCount = (body.match(/\]\(/g) || []).length;
  const emDashes = (body.match(/—/g) || []).length;
  const deadLinks = (body.match(/whatsapp-marketing-for-hotels|ga4-events-vs-key-events-hotels/g) || []).length;
  console.log(`\n[${label}] ${post.slug}`);
  console.log(`  tables: ${tableCount}, links: ${linkCount}, em dashes: ${emDashes}, dead-slug links: ${deadLinks}`);
}

async function patchPost(post) {
  const doc = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{ _id, title }`, {
    slug: post.slug,
  });
  if (!doc?._id) {
    throw new Error(`Post not found for slug: ${post.slug}`);
  }
  const body = markdownToPortableText(post.body);
  await client.patch(doc._id).set({ excerpt: post.excerpt, body }).commit();
  console.log(`  patched _id=${doc._id} ("${doc.title}") -> ${body.length} blocks`);
}

for (const post of [postA, postB]) {
  report("PRECHECK", post, post.body);
  await patchPost(post);
}

console.log("\nDone. Both posts rewritten.");

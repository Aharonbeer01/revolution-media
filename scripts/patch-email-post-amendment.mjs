import { config } from "dotenv";
config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

// Amendment to the rewritten email marketing post:
//   CHANGE A: new "Choosing Your Email Platform" section with a six-column
//             comparison table (platform names link to official sites), placed
//             immediately before "Measure It Against the Commission".
//   CHANGE B: concise replacement for the "Which email platform should a hotel
//             use?" FAQ answer, so the auto-generated FAQPage schema carries
//             the short answer, not the table.
// Prices appear only inside the table and its caveat line. No em dashes.
// UK/SA spelling. Internal links untouched.

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
    markDefs.push({ _type: "link", _key: linkKey, href: normaliseHref(match[2]) });
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
  return { _type: "block", _key: randomKey(), style: "normal", level, listItem, markDefs, children };
}

function parseTable(lines) {
  const splitRow = (line) =>
    line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  const headers = splitRow(lines[0]);
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    rows.push({ _type: "tableRow", _key: randomKey(), cells: splitRow(lines[i]) });
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
    if (!line) { i++; continue; }
    if (isTableRow(raw) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && isTableRow(lines[i])) { tableLines.push(lines[i]); i++; }
      blocks.push(parseTable(tableLines));
      continue;
    }
    if (line.startsWith("# ")) { i++; continue; }
    if (line.startsWith("### ")) { blocks.push(makeBlock("h3", line.slice(4).trim())); i++; continue; }
    if (line.startsWith("## ")) { blocks.push(makeBlock("h2", line.slice(3).trim())); i++; continue; }
    if (/^[-*]\s+/.test(line)) { blocks.push(makeListItem(line.replace(/^[-*]\s+/, ""), "bullet", 1)); i++; continue; }
    if (/^\d+\.\s+/.test(line)) { blocks.push(makeListItem(line.replace(/^\d+\.\s+/, ""), "number", 1)); i++; continue; }
    blocks.push(makeBlock("normal", line));
    i++;
  }
  return blocks;
}

// ---------------------------------------------------------------------------
// Full amended email body. Identical to the prior rewrite, with the new
// platform section inserted before "Measure It Against the Commission" and the
// "Which email platform should a hotel use?" FAQ answer replaced.
// ---------------------------------------------------------------------------

const slug = "email-marketing-hotels-loyalty-repeat-bookings";

const excerpt =
  "The cheapest booking your property will ever win is a repeat guest, and email is the machine that produces them. This is the complete system: how to build the database, the eight automations that run themselves, the campaigns worth sending, and how to measure it all against the commission you would have paid instead.";

const body = `Every property owner knows the statistic by feel, even before seeing it written down: email delivers the highest return of any marketing channel. And yet walk into most hotels and the "email programme" is a rate sheet blasted to an old list twice a year, from an inbox, with no idea what it earned.

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

## Choosing Your Email Platform: The Big Four Compared

The honest starting point: any of these four runs every automation in this guide. The differences are pricing model, depth, and fit for how a property actually sends.

| Platform | Entry pricing | Standout features | Pros | Cons | Ideal for |
|---|---|---|---|---|---|
| [Mailchimp](https://mailchimp.com) | From $13/month (Essentials); free plan now limited to 250 contacts with no automation | Templates, landing pages, the broadest integration ecosystem | Familiar, easy to use, easy to hire help for | Multi-step automation only unlocks on the $20/month Standard plan, and pricing creeps as lists grow | Teams that want the familiar all-rounder they already know |
| [Klaviyo](https://www.klaviyo.com) | From $20/month at 500 contacts; free up to 250 | Revenue-attributed automations, deep segmentation, peer benchmarks | The strongest automation and revenue reporting of the four; treats bookings like orders when integrated | The priciest as your database grows, with a steeper learning curve | Properties that want revenue tracked per email and have the list size to justify it |
| [Brevo](https://www.brevo.com) | Starter from $9/month for 5,000 emails; free tier of roughly 9,000 emails per month | Priced per email sent with unlimited contacts, plus SMS and WhatsApp campaigns in the same tool | The economical choice for large databases emailed occasionally; WhatsApp campaigns fit a chat-first funnel | Interface and templates are less polished, and heavy senders need to watch volume pricing | Properties with big guest databases, seasonal sending rhythms, or a WhatsApp-led enquiry flow |
| [MailerLite](https://www.mailerlite.com) | Free up to 1,000 subscribers; paid from around $10/month | Clean editor, automations, landing pages, and forms | The easiest and cheapest serious option, with the most generous free plan | Lighter automation depth and fewer integrations than the others | Guesthouses and small properties building their first list and first three automations |

Pricing verified at the time of writing, and it changes often, so confirm current rates before committing. Whichever way you lean, the deciding question is the same for every property: does it integrate with your booking engine or PMS, so bookings trigger automations without manual work? Ask that first, and let budget settle the rest.

## Measure It Against the Commission

Email reports love open rates, but the numbers that matter are further down: revenue per automation, revenue per campaign, database growth rate, and cost per email-attributed booking against your average OTA commission, tracked through the key events and promo codes your measurement stack already uses. For most properties that run the full system, email settles the ROI argument faster than any other channel, because the acquisition cost rounds to zero and every booking it produces is direct by definition.

## Frequently Asked Questions

### How often should a hotel email past guests?

Automations run on the guest's own timeline, so frequency takes care of itself. For campaigns, two to four well-made sends a quarter is the sweet spot: enough to stay remembered, restrained enough to stay welcome.

### Which email platform should a hotel use?

Most independent properties choose between Mailchimp, Klaviyo, Brevo, and MailerLite, compared in the table in this guide. The deciding factor is integration with your booking engine or PMS, so bookings trigger automations automatically. The system matters far more than the software.

### Is my list too small to bother with email marketing?

No. A few hundred past guests is a revenue asset: they know you, they opted in, and one good return-offer campaign to them routinely outperforms thousands of dollars of cold advertising. Small lists are where the habit, and the compounding, begin.

## The Channel You Own Outright

Build the capture points, switch on three automations, and send one good seasonal campaign. From there the system compounds every month, at a cost that embarrasses every other channel. If you would rather have the whole engine built and written for you, that is exactly what our [email marketing service](/services/email-marketing) does for hospitality brands. [Book a discovery call](/contact).`;

// --- report + apply ---
const emDashes = (body.match(/—/g) || []).length;
const platformLinks = (body.match(/\[(Mailchimp|Klaviyo|Brevo|MailerLite)\]\((https?:\/\/[^)]+)\)/g) || []);
const dollarLines = body.split("\n").filter((l) => l.includes("$"));
console.log("Amendment precheck:");
console.log("  em dashes:", emDashes);
console.log("  platform links:", platformLinks.length, platformLinks);
console.log("  lines containing '$':", dollarLines.length, "(expected: table rows + caveat only)");
dollarLines.forEach((l) => console.log("    $-line:", l.slice(0, 60) + "..."));

const doc = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{ _id, title }`, { slug });
if (!doc?._id) throw new Error(`Post not found: ${slug}`);
const blocks = markdownToPortableText(body);
await client.patch(doc._id).set({ excerpt, body: blocks }).commit();
console.log(`\nPatched ${doc._id} ("${doc.title}") -> ${blocks.length} blocks`);

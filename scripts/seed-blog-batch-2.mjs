/**
 * Seed script: pushes Batch 2 (Posts 4 to 6) into Sanity.
 * Run with: node scripts/seed-blog-batch-2.mjs
 *
 * Requires env vars (from .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN (must have write permissions)
 *
 * Notes:
 *  - Converts markdown (headings, paragraphs, bullet/number lists, bold, links)
 *    to Sanity Portable Text.
 *  - Internal links use relative paths. Any http:///path in source is normalised
 *    to a relative /path.
 *  - Post 6's budget table is rendered as a bullet list (renderer has no table type).
 *  - Cover images are NOT set here (Sanity image upload is manual). Upload via
 *    /studio after seeding.
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Normalise a link href. Source content uses malformed "http:///path" for
 * internal links; convert those to relative "/path". Leave real external
 * (http(s)://host) and mailto links untouched.
 */
function normaliseHref(href) {
  const trimmed = href.trim();
  // http:///path  or  https:///path  -> /path
  const tripleSlash = trimmed.match(/^https?:\/\/\/(.*)$/);
  if (tripleSlash) return "/" + tripleSlash[1];
  return trimmed;
}

/**
 * Parse inline markdown for a single line of text into Portable Text spans.
 * Supports **bold** and [text](href) links. Links become markDefs entries.
 * Returns { children, markDefs }.
 */
function parseInline(text) {
  const children = [];
  const markDefs = [];

  // Tokenise by links first, then handle bold within each non-link segment.
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  const pushText = (segment, extraMarks = []) => {
    if (!segment) return;
    // Handle **bold** inside the plain segment.
    const boldRegex = /\*\*(.+?)\*\*/g;
    let li = 0;
    let bm;
    while ((bm = boldRegex.exec(segment)) !== null) {
      if (bm.index > li) {
        children.push({
          _type: "span",
          _key: randomKey(),
          text: segment.slice(li, bm.index),
          marks: [...extraMarks],
        });
      }
      children.push({
        _type: "span",
        _key: randomKey(),
        text: bm[1],
        marks: [...extraMarks, "strong"],
      });
      li = boldRegex.lastIndex;
    }
    if (li < segment.length) {
      children.push({
        _type: "span",
        _key: randomKey(),
        text: segment.slice(li),
        marks: [...extraMarks],
      });
    }
  };

  while ((match = linkRegex.exec(text)) !== null) {
    // Text before the link
    if (match.index > lastIndex) {
      pushText(text.slice(lastIndex, match.index));
    }
    // The link itself
    const linkKey = randomKey();
    markDefs.push({
      _type: "link",
      _key: linkKey,
      href: normaliseHref(match[2]),
    });
    pushText(match[1], [linkKey]);
    lastIndex = linkRegex.lastIndex;
  }

  // Remaining text after last link
  if (lastIndex < text.length) {
    pushText(text.slice(lastIndex));
  }

  if (children.length === 0) {
    children.push({ _type: "span", _key: randomKey(), text, marks: [] });
  }

  return { children, markDefs };
}

function makeBlock(style, line) {
  const { children, markDefs } = parseInline(line);
  return {
    _type: "block",
    _key: randomKey(),
    style,
    markDefs,
    children,
  };
}

function makeListItem(listItem, line) {
  const { children, markDefs } = parseInline(line);
  return {
    _type: "block",
    _key: randomKey(),
    style: "normal",
    level: 1,
    listItem,
    markDefs,
    children,
  };
}

/**
 * Convert markdown to Portable Text blocks.
 * Supports: h2 (##), h3 (###), paragraphs, bullet lists (- ), number lists (1. ).
 * The first "# " H1 (post title) is skipped.
 */
function markdownToPortableText(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let skipFirstH1 = true;

  for (const raw of lines) {
    const line = raw.replace(/\s+$/g, ""); // trim trailing whitespace
    if (line.trim() === "") continue;

    if (line.startsWith("### ")) {
      blocks.push(makeBlock("h3", line.slice(4)));
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(makeBlock("h2", line.slice(3)));
      continue;
    }
    if (line.startsWith("# ")) {
      if (skipFirstH1) {
        skipFirstH1 = false;
        continue;
      }
      blocks.push(makeBlock("h2", line.slice(2)));
      continue;
    }
    // Bullet list item
    if (/^[-*]\s+/.test(line.trim())) {
      blocks.push(makeListItem("bullet", line.trim().replace(/^[-*]\s+/, "")));
      continue;
    }
    // Numbered list item
    if (/^\d+\.\s+/.test(line.trim())) {
      blocks.push(makeListItem("number", line.trim().replace(/^\d+\.\s+/, "")));
      continue;
    }
    blocks.push(makeBlock("normal", line));
  }

  return blocks;
}

// ────────────────────────────────────────────────────────────────
// Batch 2 post data (Posts 4 to 6). Copy is final; no em dashes.
// Internal links are relative. Post 6's budget table is a bullet list.
// Category mapping: Posts 4 and 5 -> "Hotel Technology" (added to enum);
// Post 6 -> "Paid Advertising" (exact existing match).
// ────────────────────────────────────────────────────────────────

const posts = [
  {
    title:
      "How to Set Up a Booking Engine That Drives More Direct Reservations",
    slug: "booking-engine-setup-direct-reservations",
    excerpt:
      "A booking engine is the difference between a website that markets your property and a website that sells it. This guide covers the essential features, the setup process step by step, the software worth shortlisting, and how to integrate a secure payment gateway.",
    publishedAt: "2026-04-28T08:00:00Z",
    author: "Revolution Media",
    category: "Hotel Technology",
    content: `# How to Set Up a Booking Engine That Drives More Direct Reservations

Plenty of properties have beautiful websites that cannot take a booking. The guest falls in love with the photos, looks for a price, finds an enquiry form, and leaves. Two clicks later they book the same room on an OTA, and the property pays commission on a guest its own website created.

The fix is a booking engine: the software that shows live rates and availability on your site and takes secure payment on the spot. Setting one up properly is one of the highest-return projects an independent property can do. Here is how to do it right.

## What Is a Booking Engine, and What Is It Not?

A booking engine is the reservation checkout for your own website. It displays your rooms, rates, and availability in real time and lets guests confirm and pay without leaving your site. It is not a PMS (the system that runs your property's operations) and not a channel manager (the system that syncs availability to OTAs), although the three need to work together. We unpack that trio properly in our [PMS guide for boutique hotels](http:///blog/best-pms-independent-boutique-hotels).

## What Features Are Essential for a Direct Booking Website?

Whether you are choosing your first engine or replacing one, judge every option against this list:

- Live rates and availability, with no enquire-to-book step in the way
- Mobile-first design, because most travel research and a growing share of bookings happen on a phone
- A checkout of two to three steps at most, with guest details kept to the minimum
- Secure, familiar payment options built in, covered in detail below
- Direct-booking perks displayed beside the rate, so the OTA comparison is settled on your site
- Multi-currency display for international guests, essential for South African properties selling to overseas travellers
- Promo codes and packages, so email and social campaigns have somewhere to land
- Abandoned booking recovery, which emails guests who started but did not finish
- Analytics and tracking support, so Google Ads and Meta campaigns can measure real bookings, not clicks

If an engine fails on mobile experience or checkout length, stop evaluating. Those two kill more direct bookings than everything else combined.

## How Do I Set Up a Booking Engine to Get More Direct Reservations?

The setup sequence matters more than the brand you choose:

1. Start from your PMS. Choose an engine that integrates natively with your property management system, or use the engine your PMS provides. Two-way sync between PMS, channel manager, and engine is what keeps availability accurate everywhere.
2. Configure rooms, rates, and policies. Load room types with strong photography, set your rate plans, and make cancellation terms clear before payment. Ambiguity at checkout is where guests bail.
3. Connect your payment gateway. Covered fully in the next section. Test a live transaction before launch, including a refund.
4. Embed it properly on your site. The engine should open seamlessly from a persistent Book Now button on every page, not hide behind a menu. Keep guests on your domain or a branded subdomain so trust carries through.
5. Install tracking. Fire a conversion event on the confirmation page for Google Ads and Meta. Without this, you cannot measure or scale your marketing, a theme we return to in our [Google Ads guide](http:///blog/google-ads-for-hotels-guide-2026).
6. Test like a guest. Book a room on your own phone, on mobile data, start to finish. Time it. If it takes more than three minutes or any step feels uncertain, fix it before spending a cent on traffic.

## What Are the Best Software Options to Boost Direct Bookings for Small Hotels?

The right shortlist depends on your size and existing systems, but for small independent properties these platforms come up consistently, and all include or integrate a booking engine:

- NightsBridge: widely used across South Africa, strong local support and channel connections
- RoomRaccoon: all-in-one PMS, channel manager, and booking engine with South African roots
- Cloudbeds: popular international all-in-one for small and mid-size properties
- Little Hotelier: SiteMinder's product built specifically for small properties and B&Bs
- Mews: modern cloud platform, strongest for properties that want automation and integrations

Treat any list like this as a starting point, not a verdict. Pricing, features, and integrations change often, so demo at least two options against the feature checklist above and confirm current pricing directly. The deciding factor is usually which one plays best with your PMS and your payment gateway.

## Integrating a Secure Payment Gateway Into Your Booking Site

The payment gateway is what moves money from the guest's card to your account, and it carries the trust burden of the whole transaction. Non-negotiables:

- PCI DSS compliance handled by the provider, so card data never touches your own systems
- 3D Secure support, which authenticates cards and dramatically reduces fraud and chargebacks
- Flexible capture options: full prepayment, deposit only, or card guarantee with balance at check-in, matched to your cancellation policy
- Payout terms you understand, including settlement time and per-transaction fees
- Currency handling that lets international guests pay without surprises

Integration itself is usually straightforward: most booking engines list their supported gateways, you open a merchant account with one, and connect it with API keys inside the engine's settings. The real work is choosing the right provider.

## What Are the Best Payment Gateways for Small to Medium Hotels?

For South African properties, the commonly shortlisted options are PayFast, Peach Payments, DPO Pay, and Yoco, all of which handle local cards, EFT options, and rand settlement. Properties with a strong international guest base often add or choose a global provider such as Stripe, Adyen, or PayPal where supported, primarily for familiarity and multi-currency handling.

Choose on four criteria: total cost per transaction (fees plus settlement terms), supported currencies and payment methods, native compatibility with your booking engine, and quality of support when a payment fails at 21:00 on a Friday. That last one gets ignored until it matters.

## PMS vs Booking Engine: How to Prevent Overbookings on Your Hotel Website

Overbookings almost always come from disconnected systems: the engine sells a room the PMS already gave to an OTA, or vice versa. Prevention is architectural, not behavioural. Availability must live in one place (the PMS), the channel manager must push it to every OTA, and the booking engine must read from the same source in real time. If any link in that chain updates manually or on a delay, you will eventually sell the same room twice. When evaluating software, ask one question: is the integration two-way and real-time? Anything else is a spreadsheet with extra steps.

## Frequently Asked Questions

### How much does a booking engine cost?

Models vary: monthly subscriptions, per-booking fees, or a small commission, typically far below OTA rates. Confirm current pricing with providers directly, and compare total annual cost against what the same bookings would cost in OTA commission. The engine usually pays for itself within months.

### Can I add a booking engine to my existing website?

Yes. Modern engines embed into any website platform via a link, widget, or subdomain. A full site rebuild is not required, although a slow or dated site will still drag conversion down.

### Do I need a channel manager if I have a booking engine?

If you sell on any OTA alongside your website, yes. The channel manager is what keeps availability synced and prevents double bookings across channels.

## Turn Your Website Into Your Best-Performing Channel

A properly set up booking engine converts the traffic you already have before you spend anything on more. If you want your setup audited, or the whole stack chosen and implemented for you, [book a discovery call](http:///contact). This is the foundation of the system in our [direct booking strategy guide](http:///blog/direct-booking-strategy-lodges-boutique-hotels), and it is where every successful client engagement starts.`,
  },
  {
    title:
      "The Best PMS for Independent Boutique Hotels (And How to Choose Yours)",
    slug: "best-pms-independent-boutique-hotels",
    excerpt:
      "Your PMS is the operating system of your property, and the wrong one quietly costs you bookings every day. This guide explains what a PMS and channel manager actually do, how to know which PMS is best for your business, and which platforms boutique hotels should shortlist.",
    publishedAt: "2026-05-12T08:00:00Z",
    author: "Revolution Media",
    category: "Hotel Technology",
    content: `# The Best PMS for Independent Boutique Hotels (And How to Choose Yours)

Ask ten hoteliers what they think of their PMS and at least half will sigh. The system was chosen years ago, nobody remembers why, and now every workaround is just how things are done. Meanwhile the modern platforms have quietly become direct booking machines: synced availability, integrated booking engines, automated guest emails, and payment processing in one place.

If you are choosing your first system or finally replacing the one you tolerate, this guide will get you to a confident shortlist.

## What Is a PMS and Channel Manager?

A Property Management System (PMS) is the software that runs your property's daily operations: reservations, check-ins and check-outs, room assignments, housekeeping status, guest profiles, billing, and reporting. Think of it as the single source of truth for what is happening in every room on every date.

A channel manager is the software that distributes your availability and rates to external channels (Booking.com, Expedia, Airbnb and others) and pulls their bookings back in, updating everything in real time. When a room sells anywhere, the channel manager closes it everywhere else.

The third piece is the booking engine, the checkout on your own website, which we covered in our [booking engine setup guide](http:///blog/booking-engine-setup-direct-reservations). In a healthy stack the PMS holds the truth, the channel manager syndicates it, and the booking engine sells it commission-free. Many modern platforms bundle all three.

## How Do I Know Which PMS Is Best for Me or My Business?

There is no universally best PMS. There is a best PMS for a 9-room boutique lodge in Mpumalanga, and it differs from the best PMS for a 60-room city hotel. Work through six questions:

1. Does it fit your property type and size? Systems built for large hotels drown small teams in features and fees. Systems built for B&Bs strain when you add a restaurant or spa billing.
2. Is it cloud-based? In 2026 the answer must be yes. Cloud systems mean no servers, automatic updates, and managing your property from anywhere, which matters when the owner is not always on site.
3. What does it bundle? An all-in-one with native channel manager and booking engine removes integration risk. A best-of-breed approach gives more choice but makes you the integrator. For most independents, all-in-one wins.
4. Does it integrate with what you keep? Your payment gateway, accounting software, door locks, and revenue tools. Ask for the integration list in writing.
5. What does support actually look like? Time zones, response times, onboarding, and training. A cheaper system with support nine hours away gets expensive the first time check-in breaks.
6. What is the true total cost? Monthly fee plus per-booking fees, payment margins, setup, and paid add-ons. Model a year at your real booking volume, not the brochure price.

Score your shortlist against these six and the decision usually makes itself.

## The Best PMS Options for Independent Boutique Hotels

These platforms consistently earn places on boutique and small-property shortlists. Capabilities and pricing change frequently, so treat this as a research starting point and confirm details on current demos:

- Cloudbeds: all-in-one PMS, channel manager, and booking engine, a favourite among small international properties
- Mews: modern, automation-heavy platform with a large integration marketplace, strong for design-led boutiques
- RoomRaccoon: all-in-one with South African roots and good local market fit
- NightsBridge: a South African staple with deep local channel connections and support
- Little Hotelier: SiteMinder's small-property product, simple and quick to learn
- Semper: South African system popular with guesthouses and lodges
- eviivo: small-property suite with strong European distribution
- Guestline: established platform suited to slightly larger independents
- Hotelogix: budget-friendly cloud PMS for small hotels
- Preno: lightweight, clean system aimed at boutique operators

Notice what this list is not: a ranking. Two or three of these will fit your property well and the rest will not, which is exactly why the six questions above come first.

## How to Integrate Your PMS and Channel Manager to Automate Direct Bookings

The stack only pays off when the pieces automate each other. Configured properly, the flow looks like this: a guest books on your website, the booking engine writes the reservation straight into the PMS, the PMS updates availability, and the channel manager instantly closes that room across every OTA. No re-typing, no overbookings, no 22:00 spreadsheet sessions.

Then the automation compounds. Confirmation and pre-arrival emails send themselves, payment is captured per your policy, housekeeping sees the arrival, and after checkout the guest lands in your database for the return campaign. Every manual step you remove is a step where errors and lost bookings used to live. When we build [direct booking systems](http:///blog/direct-booking-strategy-lodges-boutique-hotels) for clients, fixing this plumbing is frequently worth more than the first three months of advertising.

## Five Signs You Have Outgrown Your Current PMS

Not sure whether switching is worth the disruption? These are the symptoms we see most often in properties whose system is actively costing them bookings:

1. Availability is updated manually anywhere, on any channel, for any reason
2. Your website cannot show live rates because the PMS cannot feed a booking engine properly
3. Guest emails, invoices, or payment capture happen outside the system, by hand
4. Reporting cannot tell you your direct booking share without an export and a spreadsheet
5. The team has built workarounds that new staff need weeks to learn

One of these is friction. Three or more means the system is shaping your operations around its limitations, and the monthly fee you are saving is being spent several times over in labour and lost direct bookings.

## Switching PMS: What to Ask Before You Sign

Migration fear keeps properties on bad systems for years, but the questions that de-risk it are simple. Ask every vendor: Who migrates our reservation and guest data, and what does it cost? How long is onboarding and who trains the team? What happens to our data if we leave? Can we run the old and new systems in parallel over a quiet fortnight? A vendor with confident answers to those four has done this a thousand times. A vendor who hedges is telling you something.

## Frequently Asked Questions

### What is the difference between a PMS and a channel manager?

The PMS manages operations inside your property: reservations, rooms, guests, and billing. The channel manager manages distribution outside it, syncing rates and availability with OTAs. Most modern small-property platforms include both.

### Do small properties really need a PMS?

Once you pass a handful of rooms or list on more than one channel, yes. The alternative is manual syncing, and manual syncing eventually means double bookings, refunds, and review damage that costs far more than the software.

### How much does a PMS cost for a small hotel?

Pricing models vary widely: per room, per month, or bundled with payments and booking fees. Rather than anchoring on a number that will be outdated next quarter, model the total annual cost of your top two options at your real occupancy and compare it against a single month of OTA commission. It reframes the decision quickly.

## Get the Stack Right Once

The right PMS, channel manager, and booking engine combination removes the operational excuses between your property and direct bookings. If you want a second opinion on your shortlist, or your whole tech stack assessed as part of a direct booking strategy, [book a discovery call](http:///contact).`,
  },
  {
    title: "Google Ads for Hotels: The Complete 2026 Guide",
    slug: "google-ads-for-hotels-guide-2026",
    excerpt:
      "Google Ads puts your property in front of travellers at the exact moment they are ready to book, which is why it out-earns almost every other channel when it is run properly. This 2026 guide covers the campaigns that matter, realistic budgets by property size, Google Hotel Ads, and the geotargeting tactics that fill last-minute rooms.",
    publishedAt: "2026-05-26T08:00:00Z",
    author: "Revolution Media",
    category: "Paid Advertising",
    content: `# Google Ads for Hotels: The Complete 2026 Guide

Every night, travellers search Google for accommodation exactly like yours, credit card within reach. The only question is whose property they see first: yours, or an OTA advert charging you 20% for the introduction.

Google Ads is how independent properties win that moment. It is also where independent properties burn the most money when campaigns are set up carelessly. This guide covers the structure, budgets, and targeting that separate the two outcomes.

## Why Google Ads Works So Well for Hotels

Unlike social advertising, which creates demand, Google Ads captures demand that already exists. Someone searching for a safari lodge with your region's name attached is not browsing. They are planning, comparing, and close to booking. Reaching that person costs a few rand per click. Losing them to an OTA costs a fifth of the booking.

The prerequisite is a website that converts, with a proper booking engine and tracking installed. If that is not in place yet, start with our [booking engine setup guide](http:///blog/booking-engine-setup-direct-reservations), because sending paid traffic to a site that cannot take a booking is the most expensive mistake in hotel marketing.

## The Four Campaign Types That Matter

### 1. Branded Search: Protect Your Own Name

OTAs bid on your property's name. When a guest who already chose you searches for your lodge and clicks the Booking.com advert above your site, you pay full commission on a booking you had won. A branded campaign puts your website back on top for pennies per click, and it is the single highest-return campaign any property can run. Start here, always.

### 2. Destination Search: Capture Planners

These campaigns target the searches travellers make before they know your name: lodges, hotels, and stays in your area, near key attractions, or matching your niche. Costs per click are higher and competition includes the OTAs themselves, so tight keyword themes, strong ad copy, and landing pages that match the search are what keep it profitable.

### 3. Google Hotel Ads: Your Rates in the Comparison Box

Google Hotel Ads are the price listings that appear on your property's profile and in map results, exactly where guests compare your direct rate against OTA rates. Setup requires your rates and availability to be fed to Google, which most modern booking engines and channel managers can do through an integration. Covered in detail below, because this is where the budget-conscious wins live in 2026.

### 4. Remarketing: Recover the Undecided

Most visitors leave without booking. Display and Performance Max remarketing keeps your property in front of them as they continue researching, and it pairs with the Meta remarketing we cover in our [off-peak occupancy guide](http:///blog/meta-ads-fill-empty-rooms-off-peak). Modest budgets, outsized returns.

## What Is the Average Google Ads Spend for a Property With Different Room Sizes?

There is no official benchmark, and anyone quoting one number is guessing. Spend should follow from maths, not averages: how many extra bookings do you want, what does a click cost in your market, and what share of clicks become bookings?

Worked example: if clicks in your market cost around R15 and your website converts 2% of visitors, a booking costs roughly R750 in ad spend. Against a R7,500 booking, that is a 10% acquisition cost, half of a typical OTA commission, and the guest is yours to remarket.

As practical starting ranges we see across property sizes, assuming branded search plus one other campaign type:

- Guesthouse or B&B (under 10 rooms): R4,000 to R8,000 per month
- Boutique hotel or lodge (10 to 25 rooms): R8,000 to R20,000 per month
- Larger independent (25 to 60 rooms): R20,000 to R50,000 per month

Treat these as starting points to be adjusted by your market's click costs and your conversion rate, not targets. The discipline that matters: start narrow, measure cost per booking against your OTA commission, and scale only what beats it.

## How to Set Up Google Hotel Ads Without Breaking Your Budget

Hotel Ads intimidate independents because they feel enterprise-grade. They are not, if you approach them in this order:

1. Claim and complete your Google Business Profile, since Hotel Ads attach to it.
2. Connect your rates through an integration partner. Check whether your booking engine or channel manager supports a Hotel Ads feed; most major platforms now do.
3. Start with commission-style or conservative bidding where available, so cost scales with bookings rather than clicks.
4. Ensure rate parity in the comparison box. If your direct rate shows higher than OTA rates on your own profile, the whole channel works against you.
5. Watch the free booking links. Google also shows unpaid direct rate listings on hotel profiles, which means a correctly connected feed earns visibility even at zero bid.

For many properties, the combination of free booking links plus a small Hotel Ads budget outperforms broad search campaigns rand for rand.

## Hyper-Local Geotargeting: The Underused Advantage

Everyone knows Google Ads can filter by location. Almost nobody uses it strategically. Location targeting is not a setting to switch on, it is a source of campaign ideas:

- Feeder cities: target the metros your guests actually come from, discoverable in your analytics, with tailored messaging for each
- Last-minute radius campaigns: reach travellers already within driving distance searching for tonight or this weekend, ideal for filling sudden gaps
- Airport targeting: international arrivals at nearby airports searching for stays are among the highest-intent audiences available
- Exclusions that save money: remove regions that click but never book, and stop paying to advertise to your own town's job seekers and suppliers
- Bid adjustments by geography: pay more for the locations that convert, less for the ones that do not

Layer geotargeting with seasonality and the campaigns stop being generic. A rainy-season offer aimed at a specific feeder city outperforms a national campaign every time.

## Common Mistakes That Burn Hotel Ad Budgets

One campaign with every keyword in it. No conversion tracking, so decisions run on clicks. Sending traffic to the homepage instead of the room or offer the ad promised. Ignoring search term reports, where irrelevant queries quietly drain budget. And giving up after four weeks, before the account has data to optimise on. Every one of these is avoidable, and together they explain most stories that end with Google Ads does not work for hotels.

## Frequently Asked Questions

### How much should a small hotel spend on Google Ads to start?

Enough to gather data: for most small properties that means a focused budget in the R4,000 to R8,000 monthly range on branded search plus one campaign, measured against cost per booking, then scaled based on results rather than a calendar.

### Are Google Hotel Ads worth it for independent properties?

Yes, increasingly so. Free booking links cost nothing once your rate feed is connected, and paid placements put your direct price beside OTA prices at the exact decision moment.

### Should I run Google Ads myself or hire an agency?

Branded search is manageable in-house. Destination campaigns, Hotel Ads feeds, and geotargeting strategy reward specialist attention, where mistakes cost real money. Whichever route you choose, insist on booking-level tracking so you can see cost per booking, not just clicks. That is the standard we hold our own [Google Ads management](http:///services/google-ads) to.

## Put Your Property in Front of Guests Ready to Book

Run the maths, start with branded search, and let the data decide what scales. Or skip the learning curve: Revolution Media runs Google Ads exclusively for hospitality businesses, measured in bookings, not clicks. [Book a discovery call](http:///contact) and we will show you what your market's numbers look like.`,
  },
];

// ────────────────────────────────────────────────────────────────
// Seed
// ────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding Batch 2 (Posts 4 to 6)...\n");

  for (const post of posts) {
    const body = markdownToPortableText(post.content);

    const doc = {
      _type: "post",
      _id: `post-${post.slug}`,
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      body,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`  ok  ${post.title}`);
    } catch (err) {
      console.error(`  FAIL  ${post.title}: ${err.message}`);
    }
  }

  console.log("\nDone. Cover images must be uploaded via Sanity Studio at /studio.");
}

seed();

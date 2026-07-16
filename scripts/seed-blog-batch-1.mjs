/**
 * Seed script: pushes Batch 1 (Posts 1 to 3) into Sanity.
 * Run with: node scripts/seed-blog-batch-1.mjs
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
// Batch 1 post data (Posts 1 to 3). Copy is final; no em dashes.
// Internal links are relative. Table in Post 2 is rendered as a bullet list.
// ────────────────────────────────────────────────────────────────

const posts = [
  {
    title:
      "OTA Dependency: The Hidden Risk Facing South African Lodges",
    slug: "ota-dependency-risks-south-african-lodges",
    excerpt:
      "Most South African lodges hand 15 to 25% of every booking to an OTA and call it the cost of doing business. It is not. It is a structural risk to your revenue, your guest relationships, and your brand. Here is what OTA dependency really costs, and how to fix it.",
    publishedAt: "2026-03-24T08:00:00Z",
    author: "Revolution Media",
    category: "Direct Bookings",
    content: `# OTA Dependency: The Hidden Risk Facing South African Lodges

Walk into almost any lodge in South Africa and ask where the bookings come from. The answer is usually the same: Booking.com, Expedia, Airbnb, maybe a tour operator or two. The lodge is full, the calendar looks healthy, and everyone assumes the system is working.

It is working. Just not for you.

When the majority of your reservations arrive through Online Travel Agencies, you are not running a hospitality business with a marketing engine. You are running a supplier to someone else's marketing engine, and paying handsomely for the privilege.

## What Is OTA Dependency?

OTA dependency is when a property relies on third-party booking platforms for the majority of its reservations, typically anything above 60 to 70% of total bookings. The property has little or no ability to fill rooms on its own, which means the OTAs, not the owner, control the flow of guests.

Dependency is not the same as distribution. Listing on OTAs is smart. Needing them to survive is not. The difference is whether you could still fill rooms if an OTA changed its algorithm, raised its commission, or suspended your listing tomorrow.

## How Much Are OTAs Really Costing South African Lodges?

OTA commissions typically run between 15 and 25% per reservation, and visibility programmes can push the effective rate higher.

Run the numbers on a typical ten-room lodge:

- Average daily rate: R2,500
- Occupancy: 60%, or roughly 2,190 room nights a year
- Annual room revenue: about R5.47 million

If 80% of those bookings come through OTAs at an average 18% commission, the lodge pays roughly R788,000 a year in commission. That is not a marketing expense with an upside. It is rent paid on your own rooms, every year, forever, with nothing owned at the end of it.

Now compare that with what R788,000 buys as a marketing budget: a professional booking engine, a year of Google Ads targeting high-intent travellers, content that showcases the property properly, and email campaigns to past guests. The difference is that this spend builds an asset you own. Commission builds Booking.com.

## The Five Biggest Risks of OTA Dependency

### 1. You Do Not Own the Guest Relationship

When a guest books through an OTA, the platform owns the relationship. In many cases you receive a masked email address, limited contact details, and strict rules about direct communication. That guest cannot be emailed a return offer, invited back for the green season, or added to your database. They belong to the platform, and the platform will happily remarket your past guests to your competitors.

### 2. Algorithm and Policy Changes Hit Without Warning

Your OTA ranking is not fixed. It shifts with commission tiers, review velocity, cancellation policies, and whatever the platform decides to prioritise next quarter. A lodge that ranks on page one today can slide to page three after a single policy update, and occupancy follows. When your revenue depends on a ranking you do not control, every algorithm update is a business risk.

### 3. Rate Parity Squeezes Your Margins

Most OTA agreements include rate parity clauses that stop you advertising cheaper rates on your own website. So the platform takes up to a quarter of the booking value, and you are contractually limited in how aggressively you can compete with it. You can still win on value through direct perks, but only if you have a direct channel worth booking on.

### 4. Commission Creep and Pay-to-Play Visibility

The headline commission is rarely the whole story. Preferred partner programmes, sponsored placements, and visibility boosters all raise your effective cost per booking. Once a property depends on OTA volume, declining these programmes feels impossible, and the platform knows it.

### 5. Your Brand Becomes a Commodity

On an OTA results page, your lodge is a thumbnail, a price, and a review score sandwiched between fifteen competitors. The story of your property, the sundowners, the guides, the reason guests should choose you, is flattened into a comparison grid where the cheapest option usually wins. Long term, that erodes the very thing that lets a boutique property charge what it is worth.

## Why South African Lodges Are Especially Exposed

International guests make up a large share of bookings for South African lodges, and long-haul travellers plan months in advance, researching heavily before they commit. That is a double-edged sword. It makes OTAs a convenient default, but it also means there is a long window in which a lodge with strong content, search visibility, and a proper booking engine can intercept that guest before the OTA does.

Add rand volatility, seasonal demand swings between peak and green season, and the remoteness of many properties, and the temptation to outsource all marketing to the platforms is understandable. It is also exactly why the lodges that build direct channels gain such an outsized advantage over neighbours who do not.

## What Does a Healthy Booking Mix Look Like?

There is no single perfect ratio, but a resilient property typically aims for 50 to 70% direct bookings, with OTAs used deliberately for incremental demand, new markets, and shoulder periods rather than as the primary engine.

It is achievable. One boutique safari lodge we work with started at 90% OTA reliance and now takes over 80% of bookings direct. The full breakdown is in our [case study](http:///case-studies/boutique-safari-lodge), but the short version is that dependency is a strategy problem, not a law of nature.

## How Do You Start Reducing OTA Dependency?

You do not delist. You rebalance, in roughly this order:

1. Fix the foundation: a fast website with a seamless booking engine and mobile-friendly checkout.
2. Capture every guest: email addresses at enquiry, booking, and check-in, including OTA guests where permitted.
3. Give guests a reason to book direct: perks, flexible policies, and best-value guarantees that respect parity rules.
4. Build your own demand: Google Ads for high-intent searches, content that sells the experience, and remarketing that brings researchers back.
5. Measure the shift monthly and reduce OTA allotment as direct volume grows.

We cover the commission maths in detail in [How to Reduce OTA Commissions](http:///blog/how-to-reduce-ota-commissions) and the full playbook in our [direct booking strategy guide](http:///blog/direct-booking-strategy-lodges-boutique-hotels).

## Frequently Asked Questions

### Should my lodge delist from OTAs entirely?

No. OTAs are a useful distribution channel, especially for new markets and low season. The goal is to stop depending on them, not to abandon them. Treat them as one channel in a mix you control.

### Is OTA dependency still a risk if my occupancy is full?

Yes, arguably more so. Full occupancy at 20% commission means you are leaving your largest possible sum on the table, and a single algorithm or policy change can empty a calendar that has no direct pipeline behind it.

### How long does it take to shift from OTA to direct bookings?

Most properties see meaningful movement within three to six months of consistent work on their website, booking engine, and paid campaigns, with the mix continuing to improve over 12 to 18 months.

## Take Back Control of Your Bookings

If most of your revenue flows through platforms you do not control, the fix starts with a plan, not a bigger ad budget. Revolution Media builds direct-booking engines exclusively for hospitality businesses. [Book a discovery call](http:///contact) and we will show you exactly where your revenue is leaking.`,
  },
  {
    title:
      "How to Reduce OTA Commissions: The Real Math Behind 15 to 25% Fees",
    slug: "how-to-reduce-ota-commissions",
    excerpt:
      "OTA commissions look like a line item until you do the maths across a full year. Then they look like your biggest supplier invoice. Here is what 15 to 25% really costs your property, and seven practical ways to reduce it without losing the visibility OTAs provide.",
    publishedAt: "2026-03-31T08:00:00Z",
    author: "Revolution Media",
    category: "Direct Bookings",
    content: `# How to Reduce OTA Commissions: The Real Math Behind 15 to 25% Fees

Nobody signs up for an OTA thinking they are taking on their largest annual expense. It happens gradually. A listing here, a visibility booster there, a busy season where the platform delivers, and suddenly a fifth of your revenue leaves the business before it ever reaches your account.

The good news: reducing OTA commissions does not mean deleting your listings and hoping for the best. It means changing the mix. This guide covers the real numbers first, then the seven levers that actually move them.

## What Commission Do OTAs Actually Charge?

Standard OTA commissions range from 15 to 25% per booking, depending on the platform, your market, and your participation in visibility programmes. Preferred partner schemes and sponsored placement can push the effective rate several points higher, and payment processing or currency conversion may add more on top.

The number on your contract is the floor, not the ceiling. The honest question is not what your commission rate is, but what your effective cost per booking is once every programme and fee is counted.

## The Real Math: What OTA Commissions Cost Over a Year

Percentages hide the pain. Rand amounts reveal it. Take three example properties, each with 80% of bookings arriving via OTA at an effective 18% commission:

- Guesthouse: 6 rooms, R1,400 ADR, 65% occupancy, R2.0m annual revenue, R287,000 annual commission
- Boutique lodge: 12 rooms, R2,800 ADR, 60% occupancy, R7.4m annual revenue, R1.06m annual commission
- Small resort: 30 rooms, R2,200 ADR, 70% occupancy, R16.9m annual revenue, R2.43m annual commission

The boutique lodge in the middle is paying over a million rand a year for bookings, and owns nothing at the end of it. No guest database, no channel, no asset. Shift that lodge to 50% direct and the commission bill drops by around R400,000 a year, every year, before counting the higher lifetime value of guests it can now remarket to.

Do this calculation for your own property before reading further. It changes how you see every recommendation below.

## Do OTAs Bring Value? An Honest Answer

Yes. OTAs offer reach that no independent property can replicate, especially in new international markets. There is also a genuine billboard effect, where guests discover a property on an OTA and then search for its website.

The problem is not that OTAs charge for value. It is that most properties pay OTA rates on bookings they could have won directly: past guests, brand searchers, and travellers already on their website. Reducing commissions is mostly about stopping those avoidable leaks, not fighting the platforms for cold demand.

## Seven Ways to Reduce OTA Commissions Without Losing Visibility

### 1. Give Guests a Reason to Book Direct

Rate parity clauses may limit undercutting OTA prices, but they do not stop you offering better value. Free airport transfers, room upgrades, late checkout, a sundowner on arrival, or flexible cancellation for direct bookers all tip the decision without touching the headline rate. Make the perks visible on your website and at every guest touchpoint.

### 2. Capture the Billboard Effect With a Booking Engine Worth Using

Guests who discover you on an OTA will check your website. If your site is slow, your rates are hidden, or your booking process is clunky, they go straight back and the platform earns its commission for a guest you had in hand. A fast, mobile-friendly booking engine with live rates and a two-minute checkout converts that traffic. Our [booking engine setup guide](http:///blog/booking-engine-setup-direct-reservations) covers exactly what to look for.

### 3. Win Your Own Brand Searches

Search your property's name right now. If an OTA advert sits above your website, you are paying commission on guests who were already looking for you. A modest branded Google Ads campaign protects that traffic at a fraction of commission cost, and it is usually the fastest win on this list. Our [Google Ads service](http:///services/google-ads) exists for precisely this.

### 4. Build and Use Your Guest Database

Every enquiry, booking, and check-in should capture an email address, including OTA guests where the platform's rules allow direct collection at the property. A past guest who rebooks through your email campaign costs you a fraction of what the same booking costs through a platform. Repeat business is the cheapest revenue in hospitality, and OTAs cannot touch it if you own the relationship.

### 5. Use Free and Low-Cost Distribution Channels

A complete Google Business Profile with live availability, active social channels, and listings on niche directories all generate commission-free demand. None of them replaces an OTA individually, but together they diversify where guests find you, which is the entire point.

### 6. Retarget the Researchers

Most visitors do not book on their first visit. Meta remarketing campaigns that follow up with the guests who viewed your rooms are among the highest-return campaigns a property can run, and they recover bookings that would otherwise close on an OTA days later. See how we approach this in our [Meta Ads service](http:///services/meta-ads).

### 7. Rebalance Allotment Gradually

As direct volume grows, reduce the inventory you release to OTAs during high-demand periods and keep them working for shoulder season and last-minute gaps. This is the endgame: OTAs filling the rooms your own channels do not, rather than the other way around.

## How to Track Your Effective Commission Rate

You cannot reduce a number you do not measure. Once a month, take every cost tied to OTA distribution: base commission, visibility programmes, sponsored placement, payment and currency fees, and any parity-driven rate concessions. Divide the total by your OTA-generated revenue. That is your effective commission rate, and for most properties it lands two to five points above the contract rate.

Then track it against your direct booking share. As the seven levers above take effect, both numbers should move: direct share up, effective rate down as you cut the programmes you no longer need. Put the two figures on the same monthly dashboard as occupancy and ADR, because together they tell you whether your marketing is building your asset or the platform's.

## What Not to Do

Do not delist overnight. Properties that cut OTAs before their direct channel can replace the volume simply trade commission savings for empty rooms. Reduce dependency in sequence: build the direct engine first, prove it converts, then shift inventory. The transition is measured in months, and the order of operations matters more than the speed.

## Frequently Asked Questions

### Can I offer lower prices on my own website than on OTAs?

Most OTA contracts include rate parity clauses restricting this, and the rules vary by market. The compliant approach is to match the headline rate and win on added value: perks, flexibility, and packages that OTAs cannot list.

### Which commission costs can I negotiate?

Larger or high-performing properties can sometimes negotiate commission tiers, and any property can decline visibility boosters and preferred programmes. Review which paid programmes actually change your ranking and cut the ones that do not pay for themselves.

### How much of my booking mix should stay with OTAs?

Most independent properties do well with OTAs providing 30 to 50% of bookings, used for incremental demand. Below that, you are resilient. Above 70%, you are dependent, and the risks in our [OTA dependency guide](http:///blog/ota-dependency-risks-south-african-lodges) apply.

## Stop Renting Your Own Rooms

Run the commission maths for your property, then let us show you which of the seven levers will move it fastest. Revolution Media helps hospitality businesses shift revenue from commission to direct, measurably. [Book a discovery call](http:///contact) to get your numbers assessed.`,
  },
  {
    title:
      "The Complete Direct Booking Strategy for Lodges and Boutique Hotels",
    slug: "direct-booking-strategy-lodges-boutique-hotels",
    excerpt:
      "Direct bookings do not come from a single tactic. They come from a system: a website that converts, a booking engine that works, campaigns that capture demand, and a database that brings guests back. This is the complete strategy, including a 90-day rollout plan.",
    publishedAt: "2026-04-14T08:00:00Z",
    author: "Revolution Media",
    category: "Direct Bookings",
    content: `# The Complete Direct Booking Strategy for Lodges and Boutique Hotels

Every property owner wants more direct bookings. Most attack the problem with a single tactic: a website refresh, a boosted post, a month of Google Ads. The tactic underperforms, the owner concludes direct bookings do not work for properties like theirs, and the OTAs quietly absorb another year of commission.

Direct bookings are not a tactic. They are a system with five parts, and the system only compounds when the parts work together. This guide lays out the full strategy we use with lodges and boutique hotels, in the order it should be built.

## Why a Direct Booking Strategy Pays for Itself

A direct booking is worth more than the 15 to 25% commission it saves. Direct guests can be remarketed, upsold before arrival, and converted into repeat visitors. You control the cancellation terms, own the data, and keep the relationship. Over a guest's lifetime, the gap between a direct guest and an OTA guest is far larger than one commission fee.

If you have not yet calculated what OTAs cost your property annually, start with our breakdown of [the real math behind OTA commissions](http:///blog/how-to-reduce-ota-commissions). The number makes the rest of this guide feel urgent.

## The Five Pillars of a Direct Booking Strategy

### Pillar 1: A Website and Booking Engine That Actually Convert

Your website is your only salesperson that works while you sleep, and most property websites are quietly terrible at the job. The non-negotiables:

- Loads in under three seconds on mobile, where most travel research happens
- Shows live rates and availability without forcing an enquiry form
- Books a room in two to three steps with a secure, familiar payment process
- Displays direct-booking perks next to the rate, so the OTA comparison is settled on the spot

The booking engine is the heart of this. Choosing and configuring one properly is a topic of its own, covered in our [booking engine setup guide](http:///blog/booking-engine-setup-direct-reservations).

### Pillar 2: Be Found When Guests Search

High-intent demand already exists for your property and your area. The job is to capture it before a platform does:

- Branded search: own your own name in Google, ahead of OTA adverts bidding on it
- Destination search: rank and advertise for the searches travellers actually make, like safari lodges in your region or accommodation near key attractions
- Google Business Profile: complete, current, reviewed, and linked to your booking engine
- Answer engine visibility: structure content so AI assistants cite your pages when travellers ask for recommendations, which is fast becoming the new first page of Google

Paid search accelerates all of this. Our [Google Ads for hotels guide](http:///blog/google-ads-for-hotels-guide-2026) covers budgets, targeting, and the campaigns that matter.

### Pillar 3: Create Demand With Content and Social

Search captures existing demand. Content creates it. Travellers scroll Instagram and TikTok for inspiration months before they type anything into Google, and the properties showing up in that scroll enter the shortlist first. What works:

- Short-form video showing rooms, food, and experiences as guests actually live them
- Consistent posting that keeps the property visible between stays
- Content built to travel: reels and posts people send to their travel companions

This is awareness with a purpose. Every piece should make booking direct one tap away. See how this converts in our guide to [hotel content creation that drives bookings](http:///blog/hotel-content-creation-drives-bookings).

### Pillar 4: Retarget and Nurture

Most website visitors leave without booking, and most of them were genuinely interested. Two systems recover them:

- Remarketing ads: Meta campaigns that follow up with visitors who viewed rooms or started a booking, ideal for filling specific gaps. Our guide to [Meta ads for off-peak occupancy](http:///blog/meta-ads-fill-empty-rooms-off-peak) goes deep on this.
- Email marketing: automated pre-arrival, post-stay, and seasonal campaigns to a database you own. Email is consistently the highest-ROI channel in hospitality because the audience already knows you.

### Pillar 5: Turn Every Guest Into the Next Booking

The cheapest direct booking is a repeat guest. Capture contact details at every touchpoint, ask for reviews while the memory is fresh, and give past guests reasons to return: green season offers, anniversary invitations, referral perks. A property that systematically works its past-guest list builds a demand engine no algorithm can take away.

## Which Marketing Strategies Improve Direct Bookings on My Hotel Website?

If you need a shortlist, these move the needle fastest for most independent properties, in rough order of speed to impact:

1. Branded Google Ads protecting your own name
2. Visible direct-booking perks beside your rates
3. Booking engine and checkout fixes that lift conversion
4. Meta remarketing to recent website visitors
5. Email automation to past guests and enquiries
6. Destination content and social presence that build the long-term pipeline

Notice the pattern: the fastest wins capture demand you already have. The long-term wins create new demand. A complete strategy does both.

## How Can I Increase Direct Bookings for My Vacation Rental Using Online Tools?

The system above scales down to vacation rentals and small guesthouses. The toolkit: a direct booking website with an integrated booking engine and secure payments, a channel manager to sync availability with the platforms you keep, a Google Business Profile, one social channel done consistently, and a simple email tool for past guests. Owners who implement even this lean stack routinely shift 30 to 50% of volume away from platform fees.

## The 90-Day Rollout Plan

- Days 1 to 30: Foundation. Audit the website, install or fix the booking engine, set up tracking, launch branded search ads, and start capturing every email address.
- Days 31 to 60: Demand capture. Launch destination search campaigns and Meta remarketing, complete your Google Business Profile, publish your first conversion-focused content.
- Days 61 to 90: Momentum. Switch on email automations, scale the campaigns that are converting, review the booking mix, and begin rebalancing OTA allotment.

By day 90 you should see the direct share climbing month on month. From there, the system compounds.

## How Do You Measure Whether It Is Working?

Track four numbers monthly: direct booking share, website conversion rate, cost per direct booking versus your average OTA commission, and repeat guest rate. If direct share and conversion are rising while cost per booking stays below commission cost, the strategy is paying for itself. We unpack this properly in [how to measure hotel marketing ROI](http:///blog/measure-hotel-marketing-roi).

## Frequently Asked Questions

### How long before a direct booking strategy shows results?

Branded search and remarketing often produce direct bookings within weeks. The full system, including content and email, typically shows a clear shift in booking mix within three to six months.

### Do I need a big budget to start?

No. The sequence is designed so early wins fund later stages. Branded ads and booking engine fixes cost little and recover revenue immediately, which is why they come first.

### Can I run this myself or do I need an agency?

Owners can absolutely run the lean version. The trade-off is time and specialist depth, particularly in paid campaigns. Many of our clients start themselves, prove the concept, then hand over scaling. Either path beats staying dependent.

## Build the System Once. Benefit Every Season.

This is the exact system behind the lodge in our [case study](http:///case-studies/boutique-safari-lodge) that moved from 90% OTA reliance to more than 80% direct bookings. If you want it built for your property, [book a discovery call](http:///contact) and we will map the 90 days to your calendar.`,
  },
];

// ────────────────────────────────────────────────────────────────
// Seed
// ────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding Batch 1 (Posts 1 to 3)...\n");

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

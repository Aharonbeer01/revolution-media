/**
 * Seed script: pushes Batch 3 (Posts 7 to 9) into Sanity.
 * Run with: node scripts/seed-blog-batch-3.mjs
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
 *  - Category mapping: Post 7 -> "Paid Advertising"; Posts 8 & 9 -> "Social Media"
 *    (batch's "Social Media & Content" mapped to existing category).
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
// Batch 3 post data (Posts 7 to 9). Copy is final; no em dashes.
// Internal links are relative. Service routes verified: /services/meta-ads,
// /services/tiktok-ads, /services/content-creation all exist.
// Category mapping: Post 7 -> "Paid Advertising"; Posts 8 & 9 -> "Social Media".
// ────────────────────────────────────────────────────────────────

const posts = [
  {
    title:
      "Meta Ads for Hotels: How to Fill Empty Rooms in Off-Peak Season",
    slug: "meta-ads-fill-empty-rooms-off-peak",
    excerpt:
      "An empty room tonight is revenue you never get back. Meta ads are the most controllable tool a property has for filling off-peak gaps, because they create demand instead of waiting for it. Here are the audiences, creative angles, and campaign structure that make quiet months pay.",
    publishedAt: "2026-06-09T08:00:00Z",
    author: "Revolution Media",
    category: "Paid Advertising",
    content: `# Meta Ads for Hotels: How to Fill Empty Rooms in Off-Peak Season

Every property has the same graph. Peak season sells itself, shoulder season limps, and there is a stretch of the calendar where the rooms sit empty while the fixed costs carry on regardless. The staff are paid, the generator runs, the pool gets cleaned, and nobody sleeps in half the beds.

Here is the uncomfortable truth about that graph: an unsold room night is the most perishable product in commerce. It cannot be stored, discounted tomorrow, or sold twice next month. When the night passes, the revenue is gone permanently.

Meta ads, across Facebook and Instagram, are the most direct lever an independent property has for changing the off-peak side of that graph. Not because the platforms are magic, but because of what they do that search cannot: create demand in people who were not looking.

## Why Meta Ads Suit the Off-Peak Problem

Google Ads captures travellers already searching, which makes it brilliant in high-demand periods and weaker when nobody is searching for your low season at all. We cover that channel fully in our [Google Ads guide](http:///blog/google-ads-for-hotels-guide-2026).

Meta works the opposite way. It puts your property in front of precisely chosen people while they scroll, and plants the idea of a getaway they had not planned. For off-peak occupancy, that is exactly the mechanism you need: you are not competing for existing demand, you are manufacturing it, on dates you choose, for audiences you choose, with an offer you control.

## The Audiences That Fill Off-Peak Rooms

Off-peak campaigns live or die on audience selection. Four audiences consistently outperform:

### 1. Past Guests

People who have already stayed are the easiest sell in hospitality. Upload your guest email database as a custom audience and put a return offer in front of them: the green season rate, the anniversary invitation, the midweek escape. This is another reason the email capture habits in our [direct booking strategy](http:///blog/direct-booking-strategy-lodges-boutique-hotels) matter so much: the database you build there becomes an advertising asset here.

### 2. Website Visitors Who Did Not Book

Remarketing to recent visitors is the highest-converting campaign type on Meta. These people already looked at your rooms. A gentle follow-up with an off-peak offer recovers bookings that would otherwise be lost, or closed days later on an OTA.

### 3. The Drive Market

Off-peak stays are disproportionately booked by people within driving distance making spontaneous decisions. Target the metros within a few hours of your property with midweek and weekend-escape messaging. For most South African lodges that means Johannesburg, Pretoria, Cape Town, or Durban audiences, matched to your location.

### 4. Lookalikes of Your Best Guests

Once your database and website traffic have enough volume, lookalike audiences let Meta find new people who resemble your existing direct bookers. This is the scaling layer, and it works best after the first three audiences have proven the offer.

## Creative That Sells the Quiet Season

The biggest off-peak mistake is apologising for the season. Rain, mist, and empty decks are not defects to discount away. They are a different product: privacy, romance, sightings without the crowds, fires and slow mornings, the lodge to yourself. Reframe the season and the creative writes itself.

What performs:

- Short vertical video over static images, showing the actual off-peak experience rather than stock-style peak photography
- Real moments: the storm rolling in over the deck, the empty pool at golden hour, the chef plating for a table of two
- Value-led offers rather than naked discounts: a third night, a spa treatment, a game drive included. Perks protect your rate integrity while discounts train guests to wait for sales
- Specific dates and urgency: a campaign for the actual gap you need filled beats a permanent generic advert every time

## Campaign Structure and Timing

A simple two-layer structure covers most properties: an awareness layer running video to cold audiences (drive market, lookalikes, interest targets) and a conversion layer remarketing to engagers, site visitors, and the guest database with the offer and a direct path to book.

Timing matters as much as structure. Off-peak campaigns should launch six to eight weeks before the gap, when your drive market is deciding what to do with those weekends. Launching the week rooms sit empty is a rescue mission, not a strategy.

On budget, the same discipline from our Google Ads guide applies: measure cost per booking against the OTA commission you would otherwise pay. Most properties find meaningful off-peak campaigns viable from a few thousand rand per month, scaled by results rather than hope.

## Send the Click Somewhere That Converts

Every rand of Meta spend is wasted if the click lands on a homepage with no offer in sight. Send campaign traffic to a page showing the specific offer, the dates, and a live booking option, with the promo code pre-applied where your [booking engine](http:///blog/booking-engine-setup-direct-reservations) supports it. And make sure conversion events fire on the booking confirmation, so the campaign optimises for bookings rather than clicks.

## How to Measure Off-Peak Campaign Success

Judge campaigns on three numbers: cost per direct booking against your average OTA commission, occupancy lift on the targeted dates versus the same period last year, and the share of bookings from returning guests, which tells you the database is working. If cost per booking beats commission and the calendar gaps are closing, scale. If not, the offer usually needs work before the targeting does.

## Common Mistakes That Waste Off-Peak Budgets

Four errors sink most off-peak campaigns before targeting ever gets a chance. Discounting instead of adding value, which erodes rate integrity and teaches your market to wait for sales every year. Running one generic advert to one broad audience, when the entire advantage of Meta is matching a specific offer to a specific audience for specific dates. Boosting posts instead of building campaigns, which spends money on engagement rather than bookings because boosted posts cannot optimise for conversions properly. And switching campaigns off after a quiet first week, before the platform has enough data to find the buyers. Off-peak advertising is a system that improves monthly, not a coin flipped once a season. Properties that run it consistently enter each low season with warm audiences, proven offers, and historical data, while their neighbours start from zero every year.

## Frequently Asked Questions

### How much should a small property spend on Meta ads for off-peak dates?

Start with a focused test in the low thousands of rand per month on remarketing and past guests, where conversion is highest, then expand to cold audiences once cost per booking is proven against your OTA commission benchmark.

### How far in advance should off-peak campaigns start?

Six to eight weeks before the dates you need to fill, giving the awareness layer time to build audiences the conversion layer can close.

### Do Meta ads work for luxury lodges, or do they cheapen the brand?

They work when the creative matches the brand. Luxury off-peak campaigns should sell exclusivity and privacy with value-added perks, never slash headline rates. The medium is neutral; the offer sets the tone.

## Turn Your Quiet Months Into a Campaign

Pick the gap that hurts most, build the offer, and put it in front of the four audiences above. Or have it done for you: Revolution Media builds [Meta campaigns](http:///services/meta-ads) exclusively for hospitality, measured in filled rooms. [Book a discovery call](http:///contact) and bring your occupancy calendar.`,
  },
  {
    title:
      "TikTok Marketing for Hotels vs Instagram: Where Should Your Budget Go?",
    slug: "tiktok-marketing-hotels-vs-instagram",
    excerpt:
      "TikTok reaches travellers who have never heard of you. Instagram convinces the ones who have. Treating the two platforms as interchangeable wastes budget on both. Here is how travellers actually use each, and a practical framework for deciding where your money and effort should go.",
    publishedAt: "2026-06-23T08:00:00Z",
    author: "Revolution Media",
    category: "Social Media",
    content: `# TikTok Marketing for Hotels vs Instagram: Where Should Your Budget Go?

Somewhere right now, a hotelier is being told they absolutely must be on TikTok, by the same person who insisted three years ago that Instagram was everything. Both claims miss the point, because the two platforms do fundamentally different jobs in a traveller's journey.

Here is the short answer, since you came for one: TikTok is a discovery engine that puts your property in front of people who were not looking for it, and Instagram is a validation engine where travellers who have shortlisted you decide whether you are real. Discovery fills the top of your funnel. Validation closes it. Where your budget goes depends on which of those two jobs your property needs done.

Now the longer answer, because the details decide the split.

## How Travellers Actually Use TikTok

TikTok functions less like a social network and more like a search and recommendation engine for experiences. Younger travellers increasingly search for destinations and hotels there before they ever open Google, and the For You feed pushes content from accounts of any size to audiences of any size. That is the platform's defining trait for hotels: reach is earned by the video, not the follower count. A lodge with 200 followers can put a single room-tour video in front of half a million people if the content connects.

The trade-offs are real. TikTok rewards volume, authenticity, and trend fluency, which means polished brand content often underperforms a staff member's handheld walkthrough. The audience skews younger, though it is ageing upward every year. And discovery-driven demand has a longer path to a booking: the viewer saves the video for a trip they have not planned yet.

## How Travellers Actually Use Instagram

Instagram is where the shortlist gets interrogated. A traveller who found you anywhere (an OTA, a friend, a TikTok) will open your Instagram profile and scroll it like a brochure. Recent posts signal the property is alive and well run. Tagged photos and Stories show what guests actually experience. The grid answers the quiet question behind every booking: is this place what it claims to be?

Instagram also retains the strongest toolkit for closing: profile links to your booking engine, Stories with countdowns for offers, DMs where enquiries become reservations, and an older, higher-spending audience relative to TikTok. Reels give it a discovery layer of its own, though organic reach for small accounts remains harder-won than on TikTok.

## The Overlap That Makes This Affordable: Vertical Video

Here is the good news hiding inside the comparison: both platforms now run on the same fuel. Short vertical video is the native format of TikTok, Instagram Reels, and YouTube Shorts alike, which means one well-planned shoot produces a month of content for both platforms at once.

This is also where the most interesting shift in luxury hospitality is happening. High-end resorts have discovered that a compelling POV arrival video or suite reveal does the persuasion work that used to require a website visit, so the booking journey compresses: the viewer goes from video to DM to reservation without ever comparing you on an OTA grid. Vertical video is not just awareness content anymore. Done well, it is a direct booking channel. We go deeper on this in our guide to [hotel content creation that drives bookings](http:///blog/hotel-content-creation-drives-bookings).

## So Where Should Your Budget Go?

Use three questions to set the split:

1. Who is your guest? If your bookings skew under 35 or you want them to, TikTok deserves serious weight. If your guests are established professionals, honeymooners, and international leisure travellers, Instagram remains the workhorse.
2. What job needs doing? A new or unknown property needs discovery: weight TikTok. An established property losing shortlisted guests to OTAs needs validation and conversion: weight Instagram.
3. What can you sustain? TikTok punishes inconsistency more than Instagram does. An honest two videos a week on one platform beats an abandoned presence on two.

As practical starting points: an established boutique lodge with an older international guest base might run 70/30 in favour of Instagram, using TikTok as a discovery experiment. A city property chasing younger domestic travellers might sit at 50/50 or tilt toward TikTok. Review the split quarterly against actual results, not sentiment.

On paid budgets specifically, Instagram advertising runs through the Meta system we covered in our [off-peak occupancy guide](http:///blog/meta-ads-fill-empty-rooms-off-peak), with mature targeting built on your guest data. TikTok's ad platform is improving quickly and its costs are often lower, but its targeting depth is younger. Most properties get better returns starting paid spend on Meta and going organic-first on TikTok, then introducing TikTok ad budget once organic results show which videos, offers, and audiences the platform responds to. Let proof lead the spend, in that order.

## You Can Finally Measure This in Google

For years the standard objection to social investment was that it could not be measured beyond likes. That era is ending: Google Search Console now lets you connect your Instagram and TikTok accounts as platform properties and see exactly which Google searches surface your social content, with real click and impression data. It is one of the most significant measurement shifts in years for hospitality marketing, and we have a full walkthrough in our [Search Console platform properties guide](http:///blog/google-search-console-platform-properties-hotels).

## A 30-Day Test to Settle the Question for Your Property

Frameworks are useful; your own data is decisive. Run this test before committing a year of budget. Produce eight vertical videos from one planned shoot, covering rooms, food, experience, and people. Post all eight to both platforms natively over thirty days, at the same times, with the same captions adapted to each platform's tone. Track four numbers per platform: reach, profile visits, link clicks to your booking page, and enquiries received. At the end of the month you will know which platform sends your property actual booking intent rather than applause, and the budget split stops being a debate. Most properties are surprised at least once by the result, which is precisely why the test beats the assumption.

## Frequently Asked Questions

### Should a small hotel be on both TikTok and Instagram?

Only if you can sustain both. A consistent, well-run presence on one platform outperforms a neglected presence on two. Start where your guests are, repurpose vertical video to the second platform with minimal extra effort, and expand properly when capacity allows.

### Does TikTok work for luxury lodges and five-star properties?

Yes, and often spectacularly, because aspirational content travels furthest there. The caution is tonal: luxury properties win on TikTok with quality storytelling and access behind the scenes, not by chasing every trend.

### How often should a hotel post on each platform?

Sustainable consistency beats bursts. As a working baseline: three to five TikToks a week if TikTok is a priority, and three to four Instagram posts a week with regular Stories. Calibrate to what your team can genuinely maintain.

## Stop Guessing the Split

Audit where your current guests actually found you, answer the three questions above, and set a split you will review quarterly. Or let us do it with you: Revolution Media runs [TikTok](http:///services/tiktok-ads) and [Meta](http:///services/meta-ads) campaigns exclusively for hospitality brands. [Book a discovery call](http:///contact) and we will map your budget to where your next guests are scrolling.`,
  },
  {
    title: "Hotel Content Creation That Drives Bookings, Not Just Likes",
    slug: "hotel-content-creation-drives-bookings",
    excerpt:
      "A thousand likes that produce zero bookings is decoration, not marketing. The difference between content that entertains and content that converts is not production budget. It is giving every piece a job in the journey from scroll to stay. Here is the complete system.",
    publishedAt: "2026-07-07T08:00:00Z",
    author: "Revolution Media",
    category: "Social Media",
    content: `# Hotel Content Creation That Drives Bookings, Not Just Likes

Every property has posted it: the sunset shot that earned a thousand likes, a dozen fire emojis, and not one booking. Multiply that by a year of posting and you get the quiet frustration behind most hospitality social media: plenty of applause, no measurable revenue.

The problem is rarely the content quality. It is that the content has no job. Content that drives bookings is built as a system, where every piece moves a viewer one step closer to a reservation, and the steps are connected. This guide is that system.

## Why Most Hotel Content Fails to Convert

Three failure patterns account for almost all of it. The content is generic: interchangeable pretty shots that could be any property anywhere, giving a viewer nothing to remember or choose. The content is disconnected: even when a video creates genuine desire, there is no path from that moment to a rate, a date, or a booking button. And the content is aimed at nobody: posted to please the algorithm or the owner, rather than to answer what a future guest actually wants to know.

Fixing those three is the whole game, and none of the fixes requires a film crew.

## The Journey: From Scroll to Stay

Travellers move through three stages, and content must be assigned to one of them:

- Inspiration: the viewer does not know you exist. Content here creates desire and stops the scroll: the arrival POV, the wildlife moment, the suite reveal.
- Validation: the viewer is deciding whether you are real and worth it. Content here builds proof: guest experiences, staff, reviews, the honest behind-the-scenes.
- Action: the viewer is ready. Content here removes friction: the offer, the dates, the link, the answer to the question holding them back.

Most properties produce only inspiration content and wonder why nothing converts. The bookings live in the second and third stages.

## The Five Content Pillars That Drive Bookings

Structure your calendar around five pillars, and the mix stays balanced automatically:

### 1. Experience

Not the room: the feeling of the stay. The outdoor shower in the rain, the first coffee on the deck, dinner under the stars. Short vertical video is the format here, and as we covered in our [TikTok vs Instagram comparison](http:///blog/tiktok-marketing-hotels-vs-instagram), one shoot serves every platform.

### 2. Place

Content about your destination, not just your property: the drive in, what to do nearby, when the wildflowers arrive, which month has the best sightings. Place content wins twice: it reaches travellers researching the area before they choose accommodation, and it is precisely the material AI assistants and search engines cite when someone asks what to do in your region. Your blog and your social feeds should share this pillar.

### 3. People

Guests book from humans. The guide who has tracked leopards for twenty years, the chef at the market, the housekeeper's flower arrangements. People content consistently outperforms property content on engagement, and it builds the trust that validation-stage viewers are looking for.

### 4. Proof

Guest-generated content, reposted stories, reviews turned into visuals, the honeymooners' reel from their stay. Proof converts because it is testimony rather than advertising. Build the habit of asking happy guests to tag the property, and make reposting their content a weekly ritual.

### 5. Offer

The pillar most properties are too shy about: the green season rate, the midweek escape, the last two suites in March. Offer content should be the smallest share of the mix, roughly one piece in five, but it must exist, because it is the pillar that converts the audience the other four built.

## Make Every Piece Bookable

This is the disconnected-content fix, and it is mechanical:

- The link in every bio goes to a page with live rates, not a homepage
- Offer content carries a promo code that your [booking engine](http:///blog/booking-engine-setup-direct-reservations) honours, so the path from post to payment is two taps
- Captions tell viewers what to do next: check dates, send a DM, tap the link. Politeness costs bookings; clarity earns them
- DM enquiries get answered fast, with a booking link, because a DM is a walk-in at the front desk
- Links carry UTM tags so bookings can be traced back to the content that produced them

## Production Without a Production Budget

The honest hierarchy of content quality is: planned phone content beats unplanned professional content, and planned professional content beats both. A modern phone, natural light, and a monthly shot list built from the five pillars will outperform sporadic expensive shoots every time.

Professional production earns its cost at specific moments: the anchor films for your website and ads, a seasonal campaign, a property launch or renovation reveal. That is exactly the split we run for clients through Revolution Motion, our [video production division](http:///services/content-creation): a professional content foundation, refreshed by a simple in-house system the property's own team can sustain.

## The Monthly Workflow That Makes It Sustainable

Systems fail on effort, so compress the effort into one repeatable rhythm. Week one: plan a shot list of fifteen to twenty pieces across the five pillars, matched to what the coming two months need to sell. Week two: shoot it all in one half-day batch, while operations are quiet. Weeks three and four: edit, caption, and schedule everything, then spend the remaining time on the work that cannot be batched: reposting guest content, answering DMs, and engaging with the accounts your future guests follow. One planned half-day of filming a month produces a more consistent, more bookable feed than daily improvisation ever will, and it is a workload a small team can actually sustain through peak season.

## Measuring Content by Bookings, Not Likes

Three layers of measurement replace vanity metrics. UTM-tagged links show which posts produce site visits and bookings. Promo code redemptions tie revenue to specific campaigns. And Google Search Console's new platform properties now show which searches surface your Instagram and TikTok content on Google itself, closing a measurement gap that existed for a decade. Our [full walkthrough](http:///blog/google-search-console-platform-properties-hotels) covers the setup.

Review monthly: which pillar drove traffic, which formats earned saves and shares (the intent signals), and which offers redeemed. Then make more of what booked and less of what merely pleased.

## Frequently Asked Questions

### How often should a hotel post content?

Three to five pieces a week across your chosen platforms is a sustainable, effective baseline, drawn from a monthly batch shoot. Consistency over months beats intensity over weeks.

### Do I need professional video to compete?

Not to start. Planned phone content following the five pillars will outperform most properties' current output. Bring in professionals for anchor content and campaigns once the system is running.

### What content works for a small guesthouse with no wildlife or views?

People and place carry small properties: the host's story, breakfast rituals, neighbourhood guides, guest moments. Proof and offers convert exactly the same way they do for a five-star lodge.

## Build the System, Not Just the Feed

Audit your last thirty posts against the five pillars and the three journey stages. The gaps you find are your next month's calendar. Or have the whole system built and filmed for you: [book a discovery call](http:///contact) and we will show you what a booking-driven content engine looks like for your property.`,
  },
];

// ────────────────────────────────────────────────────────────────
// Seed
// ────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding Batch 3 (Posts 7 to 9)...\n");

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

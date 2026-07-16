/**
 * Seed script: pushes Batch 4 (Posts 10 to 12) into Sanity. Final batch.
 * Run with: node scripts/seed-blog-batch-4.mjs
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
 *  - Category mapping: Posts 10 & 11 -> "Marketing Strategy"; Post 12 ->
 *    "Industry News" (both added to schema enum).
 *  - Post 12 (google-search-console-platform-properties-hotels) is dated
 *    2026-07-28 (future). It is seeded as a DRAFT (drafts. _id prefix) so it
 *    stays hidden from the live site until manually published in /studio on or
 *    after the 28th. Posts 10 & 11 are published immediately.
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
// Batch 4 post data (Posts 10 to 12). Copy is final; no em dashes.
// Internal links are relative. Post 11's agencies 2-10 are unlinked text
// (money page rule). Post 12 has draft: true and is dated 2026-07-28.
// Category mapping: Posts 10 & 11 -> "Marketing Strategy"; Post 12 ->
// "Industry News".
// ────────────────────────────────────────────────────────────────

const posts = [
  {
    title: "How to Measure Hotel Marketing ROI (And Stop Guessing)",
    slug: "measure-hotel-marketing-roi",
    excerpt:
      "Most properties cannot answer the simplest question in marketing: which spend produced which bookings? This guide fixes that with a tracking foundation, the metrics that matter for each channel, and a one-page monthly dashboard that turns marketing from a cost into an accountable investment.",
    publishedAt: "2026-07-14T08:00:00Z",
    author: "Revolution Media",
    category: "Marketing Strategy",
    draft: false,
    content: `# How to Measure Hotel Marketing ROI (And Stop Guessing)

Ask a property owner what they spent on marketing last quarter and you will get a number. Ask which bookings that money produced and the room goes quiet. Marketing without measurement is not really marketing at all. It is donating, hopefully, in the general direction of guests.

The uncomfortable flip side: when properties cannot measure ROI, the channel that looks cheapest wins by default, and that channel is usually the OTAs, whose 15 to 25% commission never appears on a marketing report because it is deducted before the revenue lands. Proper measurement is how you see that cost clearly, and how you prove your own marketing beats it.

## Why Hotel Marketing ROI Is Harder Than Most Industries

Four honest reasons the guesswork persists. Booking windows are long: a guest sees a video in January, visits the website in March, and books in May, so the last click rarely tells the whole story. The journey is multi-touch: social inspires, search validates, email closes, and each channel claims the credit. OTA attribution muddies everything: a guest who discovered you on Instagram but booked on Booking.com registers as an OTA guest. And some conversions happen offline, in phone calls, DMs, and email threads that never touch analytics.

None of this makes measurement impossible. It makes a deliberate setup non-negotiable, because the default reports will mislead you.

## The Benchmark That Makes ROI Simple

Formal ROI is revenue attributable to marketing, minus the cost, divided by the cost. Useful, but abstract. For hospitality there is a sharper benchmark hiding in plain sight: your average OTA commission per booking.

Every OTA booking already costs you 15 to 25% of its value. That is your ceiling. If a channel delivers direct bookings for less than that per booking, it is beating your existing acquisition cost while also building your database and guest relationships. If it cannot, fix it or cut it. This single comparison, cost per direct booking versus average commission per booking, settles more budget arguments than any dashboard ever will.

## The Tracking Foundation: Five Pieces, Set Up Once

1. Analytics with real conversion events. Google Analytics 4 installed on the website and, critically, a purchase or booking event firing on your booking engine's confirmation page, carrying the booking value. If your engine sits on a separate domain, cross-domain tracking must be configured or half your bookings will report as coming from your own website. Our [booking engine guide](http:///blog/booking-engine-setup-direct-reservations) covers choosing software that supports this properly.
2. Ad platform conversion tracking. The Google Ads tag and Meta pixel (or Conversions API) receiving those same booking events, so campaigns optimise toward bookings rather than clicks.
3. UTM discipline. Every link you control, in ads, emails, bios, and posts, tagged with source, medium, and campaign. Untagged links are bookings you paid for and cannot claim.
4. Promo codes as attribution. A unique code per campaign or channel ties revenue to its source even when tracking fails or the guest books by phone.
5. A home for offline conversions. A simple log of bookings that arrive via calls, DMs, and email, with a required question: how did you hear about us? Imperfect, but far better than a blind spot.

## The Metrics That Matter, Channel by Channel

Judge every channel on the same currency, bookings and revenue, then add one or two channel-specific health metrics:

- Overall: direct booking share of total bookings, and blended cost per direct booking. These two headline numbers tell you whether the whole system is working
- Website: conversion rate from visitor to booking. Small movements here multiply every other channel's ROI
- Google Ads: cost per booking and return on ad spend, per campaign, as covered in our [Google Ads guide](http:///blog/google-ads-for-hotels-guide-2026)
- Meta: cost per booking on conversion campaigns; treat awareness campaigns as an input and judge them by the remarketing bookings they feed, per our [off-peak guide](http:///blog/meta-ads-fill-empty-rooms-off-peak)
- Email: revenue per campaign and database growth rate, since the list is the asset
- Organic social: link clicks, promo redemptions, and assisted bookings rather than likes

And the metrics to demote: followers, impressions, and engagement rate are diagnostics, not results. They explain performance; they are not performance.

## Attribution Without a Data Science Degree

Perfect multi-touch attribution is beyond most independent properties, and chasing it wastes energy. A practical stance: use your analytics' default data-driven attribution for direction, check first-click reports quarterly to see which channels start journeys (social and content usually earn more credit here), and let promo codes arbitrate disputes. Consistency beats sophistication: measured the same way every month, even imperfect numbers reveal true trends.

## The Social Measurement Gap Just Closed

Organic social was always the hardest channel to defend in an ROI conversation. That changed this month: Google Search Console's new platform properties let you connect your Instagram and TikTok accounts and see which Google searches surface your social content, with real impression and click data. For the first time, the content you post feeds the same measurement conversation as your website. Setup takes minutes, and our [full walkthrough](http:///blog/google-search-console-platform-properties-hotels) covers it.

## Your One-Page Monthly Dashboard

Eight numbers, reviewed on the same day each month: direct booking share, total direct revenue, website conversion rate, cost per direct booking (blended, and per paid channel), return on ad spend per channel, email revenue, repeat guest rate, and average OTA commission per booking as the standing benchmark. Add last month and last year alongside for context. Twenty minutes with this page each month outperforms any amount of scattered report-checking, because every budget decision now has a number attached.

## The Mistakes That Corrupt the Numbers

A measurement system is only as good as its hygiene, and four habits quietly poison most of them. Changing what you track mid-quarter, which breaks every comparison. Counting revenue booked instead of revenue stayed, so cancellations flatter the report. Letting each platform grade its own homework, since ad platforms will happily claim the same booking twice; your analytics and booking engine are the referees. And ignoring the OTA line because it is not on the marketing budget, which is precisely how a 20% acquisition cost hides in plain sight for years. Fix these four and even a modest setup produces numbers you can bet a budget on.

## Frequently Asked Questions

### What is a good return on ad spend for hotel marketing?

It depends on your margins, but the working floor is simple: a channel must acquire direct bookings for less than your average OTA commission per booking. Most healthy hotel paid campaigns run well past that, but the commission benchmark is the honest minimum.

### How do I measure ROI on social media content?

Through the actions you control: UTM-tagged link clicks, promo code redemptions, DM enquiries logged as offline conversions, and now Google Search Console platform properties showing how your content performs in search.

### How long should I run a channel before judging its ROI?

Paid search and remarketing can be judged within one to two months. Content, social, and email compound and deserve at least a quarter, measured monthly, before verdicts. What matters is deciding the review date before the spend starts.

## Make Every Rand Report for Duty

Set up the five-piece foundation, adopt the commission benchmark, and run the one-page dashboard for three months. The guesswork ends quickly. If you would rather have the measurement built for you, and campaigns held to it, [book a discovery call](http:///contact). Booking-level reporting is the standard every Revolution Media client gets by default.`,
  },
  {
    title: "The Best Digital Marketing Agencies for Hotels in 2026",
    slug: "best-digital-marketing-agencies-hotels-2026",
    excerpt:
      "Choosing a hotel marketing agency is a high-stakes decision dressed up as a procurement task. This guide compares the leading agencies for 2026 by specialisation and property fit, sets out the selection criteria that actually matter, and gives you the questions that separate partners from vendors.",
    publishedAt: "2026-07-21T08:00:00Z",
    author: "Revolution Media",
    category: "Marketing Strategy",
    draft: false,
    content: `# The Best Digital Marketing Agencies for Hotels in 2026

Let us get the disclosure out of the way first: Revolution Media is on this list, at the top of it, and we wrote the list. Rather than pretend otherwise, we have done the more useful thing: set out the criteria any hotel should judge an agency by, applied them to the market honestly, and included agencies that are a better fit than us for certain properties. Hold us to the same standard you hold everyone below.

## What Actually Matters When Choosing a Hotel Marketing Agency

Five criteria separate agencies that grow properties from agencies that produce reports:

1. Hospitality specialisation. Hotel marketing has mechanics generalists do not know: OTA economics, booking engines, rate parity, seasonality, booking windows. An agency learning these on your budget is expensive education.
2. A direct booking philosophy. The agency's job is to shift your booking mix and reduce your acquisition costs, not to decorate your feed. Ask any candidate how they think about OTA dependency and listen for a real answer.
3. Booking-level reporting. Clicks and impressions are weather. Bookings, revenue, and cost per booking are results. If an agency's sample report leads with reach, keep looking.
4. Fluency in how guests search now. Travellers increasingly ask AI assistants for recommendations and discover properties through social search. Agencies still selling 2019 SEO playbooks will fall behind, and so will their clients.
5. Fit for your size and market. The best agency for a 400-room chain property is rarely the best agency for a 12-room lodge. Match the partner to the property.

## The Best Hotel Marketing Agencies in 2026

### 1. Revolution Media

Best for: boutique hotels, lodges, and independent properties that want a direct booking system, not just campaigns.

Revolution Media is a hospitality-only digital marketing agency working with boutique properties in South Africa and internationally. The focus is singular: more direct bookings and lower OTA dependency, delivered through the full stack covered across this blog, from [booking engine foundations](http:///blog/booking-engine-setup-direct-reservations) to [Google Ads](http:///blog/google-ads-for-hotels-guide-2026), [Meta campaigns](http:///blog/meta-ads-fill-empty-rooms-off-peak), and [content that converts](http:///blog/hotel-content-creation-drives-bookings), with in-house video production through Revolution Motion. Reporting is booking-level by default, and the working proof is a boutique safari lodge moved from 90% OTA reliance to more than 80% direct bookings, documented in our [case study](http:///case-studies/boutique-safari-lodge). If your property is independent and your priority is owning your demand, this is what we build. [Book a discovery call](http:///contact).

### 2. Sojern

Best for: properties and groups wanting data-driven multichannel advertising at scale.

A travel-focused advertising platform more than a classic agency, Sojern uses traveller intent data to run campaigns across display, metasearch, social, and connected TV, with strong industry recognition among hoteliers. Suits properties comfortable with a platform-led model.

### 3. Cendyn

Best for: hotel groups that want marketing driven by their own guest data.

Cendyn pairs a hospitality CRM and loyalty platform with digital marketing services, so campaigns run on actual guest behaviour. A natural fit for multi-property groups with databases worth activating.

### 4. Tambourine

Best for: independent US hotels and resorts wanting full-service marketing under one roof.

A long-established hotel marketing firm known for combining websites, booking engine optimisation, creative, and paid media in integrated programmes aimed at direct revenue.

### 5. Profitroom

Best for: properties that want booking technology and marketing from one provider.

Profitroom pairs its booking platform with demand-generation services, an appealing bundle for hotels that prefer a single vendor across the direct booking stack, particularly in Europe.

### 6. Screen Pilot

Best for: US independent and lifestyle hotels focused on digital performance.

A digital-first agency with a hospitality specialisation, covering paid media, SEO, creative, and analytics for independent and branded properties.

### 7. MMGY Global

Best for: large hospitality brands and destination organisations.

The heavyweight of travel marketing, with research, PR, and integrated campaigns across a family of agency brands. Far more firepower than an independent property needs, and priced accordingly, but the reference point for enterprise-scale work.

### 8. O'Rourke Hospitality Marketing

Best for: hotels wanting an established, hotel-only marketing partner.

A hospitality-dedicated agency with a long track record across websites, SEO, and paid media, frequently praised for pairing marketing performance with an understanding of hotel operations.

### 9. Gourmet Marketing

Best for: small independent hotels and B&Bs, particularly in the US.

A small-property specialist known for insisting on website and conversion fundamentals before scaling ad spend, which is the correct order of operations.

### 10. Spherical

Best for: luxury and design-led properties where brand and creative lead.

A creative studio serving luxury hospitality, strongest where storytelling, photography, and positioning matter as much as performance metrics.

## How to Choose Between Them

Shortlist two or three whose best-for line matches your property, then ask each the same five questions. Which properties like ours have you grown, and what happened to their direct booking share? What will you measure, and can we see a sample report? Who exactly will work on our account? What do the first ninety days look like? And what are the contract terms if it is not working? The answers, and the speed and honesty with which they arrive, tell you most of what the case studies do not.

Beware of two red flags everywhere: guarantees of specific rankings or occupancy, which nobody can honestly promise, and reporting built on impressions rather than bookings. An agency confident in its work will happily be measured in revenue, because that is the number it expects to move. If you want the measurement framework first, our guide to [hotel marketing ROI](http:///blog/measure-hotel-marketing-roi) gives you the dashboard to hold any agency to, including us.

## When You Should Not Hire an Agency Yet

An honest addition few of these lists include: some properties are not ready for any agency, ours included. If your website cannot take a booking, if rates and availability are managed by hand, or if nobody on your side can spend an hour a month reviewing results, agency spend will leak straight through those holes. Fix the foundation first: a working [booking engine](http:///blog/booking-engine-setup-direct-reservations), basic tracking, and a named owner for the relationship. The properties that get the most from an agency are the ones that could limp along without one. That is also why our own engagements start with an audit rather than a retainer.

## Frequently Asked Questions

### How much does a hotel marketing agency cost?

Models vary from monthly retainers to percentage-of-spend and performance components, and pricing shifts with scope, so treat any published number as indicative. The better question is whether the agency's cost per direct booking, all fees included, beats your average OTA commission. That comparison keeps every proposal honest.

### Should I hire an agency or build in-house?

In-house suits properties with the volume to keep a specialist busy year-round. Most independents get better economics from an agency carrying specialist depth across channels, with one owner-side person coordinating. Whichever route you take, own your accounts, data, and creative.

### What should a hotel marketing agency report on?

Direct booking share, direct revenue, cost per booking and return on ad spend per channel, website conversion rate, and database growth, monthly, against agreed targets. Anything less is activity, not accountability.

## The Shortlist Is the Easy Part

Match the best-for lines to your property, ask the five questions, and demand booking-level proof. And if your property is a boutique hotel or lodge that wants its demand back from the OTAs, start the conversation with us: [book a discovery call](http:///contact) and bring your booking mix. We will show you what we would do with it before you sign anything.`,
  },
  {
    title:
      "Google Search Console Now Tracks Your Instagram and TikTok: A Hotel Marketer's Guide",
    slug: "google-search-console-platform-properties-hotels",
    excerpt:
      "In July 2026 Google quietly shipped one of the most useful measurement features hotel marketers have seen in years: Search Console platform properties, which show exactly how your Instagram, TikTok, X, and YouTube content performs in Google Search. Here is what it is, how to set it up, and how to use it to win bookings.",
    publishedAt: "2026-07-28T08:00:00Z",
    author: "Revolution Media",
    category: "Industry News",
    draft: true,
    content: `# Google Search Console Now Tracks Your Instagram and TikTok: A Hotel Marketer's Guide

Every hotelier who has ever questioned the value of social media just received an answer from an unexpected source: Google.

In July 2026, Google launched platform properties in Search Console, a new property type that lets you connect your Instagram, TikTok, X, and YouTube accounts and see how that content performs in Google Search and Discover. Which searches surface your Reels. How many people saw your TikToks in results. How many clicked. For a decade, the search performance of social content was a black box. It just opened.

For hospitality brands, which pour effort into exactly these platforms, this is not a minor analytics update. It is the missing measurement layer, and being early to it is an advantage. Here is the full picture.

## What Are Platform Properties in Google Search Console?

Until now, Search Console only understood websites: properties you own and verify at the domain level. Platform properties break that pattern. You can now add a social account as its own property, even though you do not own instagram.com or tiktok.com, and Google reports how that account's content performs in its search results.

Four platforms are supported at launch: Instagram, TikTok, X, and YouTube. Each account you connect becomes its own property with its own reports:

- Performance report: total clicks, impressions, click-through rate, and position for your content in Google Search, filterable to see which posts and which search queries drive the traffic, with export available
- Insights report: a high-level view of traffic trends, top-performing posts, and how people discover your account through Google

Worth knowing: Google experimented with surfacing social channel data inside Search Console Insights in late 2025, and platform properties are the full realisation of that idea. They are also distinct from Search profiles, Google's public-facing creator pages. Platform properties are pure analytics.

## Why This Matters for Hotels Specifically

Three reasons this lands harder in hospitality than almost any other industry.

First, travellers already search this way. A meaningful share of accommodation discovery now starts on social platforms or surfaces social content in Google results: room tours, guest videos, destination Reels. Your social content has been ranking in Google searches without you being able to see it.

Second, it ends the ROI stalemate. The oldest objection to social investment is that it cannot be measured beyond likes. Now the content your team produces feeds the same measurement conversation as your website: real queries, real impressions, real clicks. It slots directly into the dashboard from our [hotel marketing ROI guide](http:///blog/measure-hotel-marketing-roi).

Third, it reveals demand you did not know you had. When the query report shows searches like your lodge's name plus honeymoon, or your region plus where to stay, surfacing your Instagram content, you are looking at booking intent, mapped to content you already know how to make.

## How to Add Instagram and TikTok to Google Search Console

Setup takes minutes per account:

1. Sign in to Google Search Console with the Google account you want to manage reporting under.
2. Open the property selector (the dropdown in the top left) and click Add property.
3. Choose the platform: Instagram, TikTok, X, or YouTube.
4. Follow the on-screen steps to sign in to that social account and authorise the connection. This is how Google verifies you own the account.
5. Repeat for each account. Every profile becomes its own separate property, so a lodge with an Instagram and a TikTok adds two.

Three practical notes. The rollout is gradual, so if the platform options have not appeared in your account yet, check back rather than assuming an error. Data collects from the time you connect, so add your accounts now to start building history even if you will only analyse it later. And ownership is re-checked periodically: if the social login expires, reporting pauses until you re-verify, after which your data is intact.

## What It Shows, and What It Does Not

Platform properties measure one thing: how your content performs on Google Search and Discover. Impressions count when your content appears in results, including Instagram Stories, and clicks count when a searcher opens it, including video plays in Google's own viewer.

What it does not show is in-platform performance: TikTok views, Instagram reach, follower growth, or engagement. Your native platform analytics still own that. Think of it as a new window, not a replacement dashboard. Facebook and LinkedIn are also not included at launch, so measurement for those channels stays as it was.

## How Hotels Should Actually Use It

Treat the query data as a content brief. Once a month, open each platform property and ask three questions. Which searches surface our content? Make more content that answers those exact queries, using the five-pillar system from our [content creation guide](http:///blog/hotel-content-creation-drives-bookings). Which posts earn impressions but no clicks? Their thumbnails, captions, or hooks need work, because Google is offering visibility your content is not converting. And which queries surface our social content but not our website? Those are pages your site is missing, and your blog should fill them.

Then close the loop commercially: content that ranks for a booking-intent query should always carry a path to book, per the make-every-piece-bookable mechanics we use across [our social strategy work](http:///blog/tiktok-marketing-hotels-vs-instagram). Visibility is the input. Direct bookings remain the score.

## What This Signals About Where Search Is Going

Zoom out and the feature is a statement of direction. Google building first-class analytics for content it does not host is an admission that discovery no longer belongs to websites alone: a traveller's journey now runs through short video, social profiles, AI assistants, and search results interchangeably, and Google intends to measure all of it. For hotels, the strategic read is simple. Your Instagram and TikTok are no longer side channels feeding a website; they are search-visible assets in their own right, and they deserve the same intentionality your site gets: consistent naming, location signals, content mapped to real queries, and a booking path never more than a tap away. The properties that treat social content as searchable inventory, rather than decoration, will compound this advantage for years. The measurement layer arriving first is your invitation to be one of them.

## Frequently Asked Questions

### Is Google Search Console free, and does this cost anything?

Yes, Search Console is free, including platform properties. The only requirement is admin access to the social accounts you want to connect.

### Why can I not see the option to add Instagram or TikTok yet?

The feature is rolling out gradually across accounts. If the platform options are missing from your Add property screen, wait and check again rather than troubleshooting a setup that is not broken.

### Does this show my TikTok views or Instagram engagement?

No. Platform properties report Google Search and Discover performance only: impressions, clicks, queries, and position. In-app metrics stay in each platform's native analytics.

## Be Early to the New Scoreboard

Connect your accounts this week, let the data accumulate, and bring the query report into your monthly content planning. Early adopters get months of insight their competitors will not have. And if you want your social content built, measured, and converted into direct bookings as one system, that is exactly what Revolution Media does for hospitality brands. [Book a discovery call](http:///contact) and we will bring the scoreboard.`,
  },
];

// ────────────────────────────────────────────────────────────────
// Seed
// ────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Seeding Batch 4 (Posts 10 to 12)...\n");

  for (const post of posts) {
    const body = markdownToPortableText(post.content);

    // All posts are seeded as normal published documents. Post 12 is dated
    // 2026-07-28 (future); the site's GROQ queries filter `publishedAt <= now()`,
    // so it stays hidden everywhere until that date, then auto-appears on the
    // next ISR revalidate. Native scheduling, no manual publish step needed.
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
      const future = new Date(post.publishedAt) > new Date();
      console.log(`  ok${future ? " (scheduled)" : ""}  ${post.title}`);
    } catch (err) {
      console.error(`  FAIL  ${post.title}: ${err.message}`);
    }
  }

  console.log(
    "\nDone. Post 12 is dated 2026-07-28 and hidden by the publishedAt<=now() " +
      "query filter until then. Cover images must be uploaded via /studio.",
  );
}

seed();

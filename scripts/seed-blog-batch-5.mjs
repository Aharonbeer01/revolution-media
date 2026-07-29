import { config } from "dotenv";
config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xoemestg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-26",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const randomKey = () => randomUUID().replace(/-/g, "").slice(0, 12);

// Convert http:///relative or http://relative back to a clean relative path.
function normaliseHref(href) {
  if (!href) return href;
  const m = href.match(/^https?:\/\/\/?(.*)$/);
  if (m && (m[1].startsWith("/") || !m[1].includes("."))) {
    return m[1].startsWith("/") ? m[1] : `/${m[1]}`;
  }
  return href;
}

// Parse inline markdown: **bold** and [text](href). Returns { children, markDefs }.
function parseInline(text) {
  const children = [];
  const markDefs = [];
  // Tokenise on links first, then bold within each segment.
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  const pushText = (segment, extraMarks) => {
    if (!segment) return;
    // Split segment on bold markers.
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
  return {
    _type: "block",
    _key: randomKey(),
    style,
    markDefs,
    children,
  };
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

// Parse a markdown table region into a comparisonTable block.
// Expects lines: | h | h |, |---|---|, | c | c |, ...
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
  return {
    _type: "comparisonTable",
    _key: randomKey(),
    headers,
    rows,
  };
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

    // Table detection: current line is a row and the next is a separator.
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

    // Skip the top-level H1 (post title) if present.
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

    // Bullet list.
    if (/^[-*]\s+/.test(line)) {
      blocks.push(makeListItem(line.replace(/^[-*]\s+/, ""), "bullet", 1));
      i++;
      continue;
    }

    // Numbered list.
    if (/^\d+\.\s+/.test(line)) {
      blocks.push(makeListItem(line.replace(/^\d+\.\s+/, ""), "number", 1));
      i++;
      continue;
    }

    // Normal paragraph.
    blocks.push(makeBlock("normal", line));
    i++;
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Post bodies. Copied verbatim from revolution-media-blog-batch-5.md.
// No em dashes. UK/SA spelling. USD figures. Internal links as relative paths.
// The unlinked prose references in posts 15 and 16 are intentional (Batch 6).
// ---------------------------------------------------------------------------

const post13Body = `## How AI Assistants Actually Choose Hotels

Understanding the mechanics tells you exactly what to optimise. When someone asks an assistant for hotel recommendations, the answer is assembled from two sources. The first is the model's training knowledge: what the assistant learned about your property from the open web. The second, increasingly dominant one is live search: modern assistants search the web in real time, read the top results, and cite them in their answers.

That second mechanism is the opportunity. Assistants disproportionately cite content that answers questions directly, states facts cleanly, uses structured formats like tables and FAQs, and comes from sources that look authoritative on the topic. They also lean heavily on comparison articles and listicles when asked which is best, and on review signals when asked whether somewhere is good. Every tactic below follows from those preferences.

## AEO vs SEO: What Actually Changes

| Dimension | Traditional SEO | AEO |
|---|---|---|
| Goal | Rank a page in results | Be cited inside an AI answer |
| Winning format | Keyword-optimised pages | Direct answers, FAQs, tables, comparisons |
| Who wins | Highest authority at scale | Clearest authoritative answer to the specific question |
| Measurement | Rankings and clicks | Citations, AI referrals, assistant spot-checks |
| Competition | Saturated | Early and open, especially in hospitality |

The overlap matters too: strong SEO fundamentals (fast site, crawlable content, good structure) remain the entry ticket. AEO decides who gets quoted once you are in the room.

## The Seven Moves That Get Hotels Recommended

### 1. Answer Real Questions, Verbatim

Assistants match questions to content that answers them. Build pages and posts around the exact questions travellers ask: what is the best area to stay for a first safari, which lodges are good for families, when is green season worth it. Open each answer with a direct two-to-three sentence response before elaborating. This entire blog series is built that way deliberately.

### 2. Use Structured Data Everywhere

FAQPage, Article, and Hotel schema tell machines precisely what your content is. Every post on this site carries FAQ schema for exactly this reason, and your property pages should carry hotel markup with amenities, geo coordinates, and ratings.

### 3. Make Your Entity Consistent Across the Web

Assistants cross-reference. Your property name, location, description, and contact details must match across your website, Google Business Profile, social profiles, and directories. Inconsistency reads as uncertainty, and uncertain entities do not get recommended.

### 4. Win the Review Layer

When a traveller asks an assistant whether a property is good, the answer is assembled largely from review volume, recency, and sentiment, plus how management responds. A steady stream of fresh reviews with thoughtful responses is AEO fuel, not just social proof. Responses matter doubly, because assistants read how management handles criticism and factor it into the character of their recommendation.

### 5. Get Into the Comparisons

Ask any assistant for the best lodges in a region and it will lean on published listicles and comparison articles. Audit which ones exist for your area and category, and work on being included. Publishing your own honest comparison content works the same way, which is precisely why our [agency comparison](/blog/best-digital-marketing-agencies-hotels-2026) exists.

### 6. Publish Tables

Assistants extract and reproduce tables more readily than prose: rate comparisons, season guides, room type breakdowns, distance charts. A well-structured table on your site can be lifted wholesale into an AI answer, with your property named as the source.

### 7. Measure It

Spot-check monthly: ask the major assistants the questions your guests would ask, and record whether and how you appear. Watch AI referral traffic in your analytics, and use [Search Console platform properties](/blog/google-search-console-platform-properties-hotels) to see how your social content surfaces in search, since social results increasingly feed assistant answers too.

## A 30-Day AEO Starter Plan

If the seven moves feel like a lot, here is the first month, sequenced. Week one: run the baseline. Ask ChatGPT, Gemini, and Claude the ten questions your ideal guest would ask, screenshot every answer, and note where you appear, who appears instead, and which sources get cited. Week two: fix the entity layer. Align your name, description, location, and contact details across your website, Google Business Profile, and social bios, and confirm your schema markup validates. Week three: publish your first true answer piece, built on the most valuable question from week one where you did not appear, opening with the direct answer and carrying a table and an FAQ block. Week four: work the review layer, responding to everything recent and putting a review request into your post-stay flow. Then repeat the week one spot-check monthly and watch the answers shift. The baseline screenshots matter more than they seem: they are the before photo, and in our experience the before and after comparison is what turns AEO from an abstract idea into a board-level priority.

## What This Looks Like as a Monthly Habit

AEO is not a project you finish. Once the structural work above is in place, the ongoing rhythm is light: one genuinely useful question-answering piece of content a month, review responses kept current, a quarterly consistency check on your entity details, and the monthly assistant spot-check with results logged in the same dashboard as your [marketing ROI numbers](/blog/measure-hotel-marketing-roi). Properties that sustain that rhythm compound authority while competitors debate whether AI search is real.

## Frequently Asked Questions

### Do AI assistants really send hotels bookings today?

Yes, and the share is growing. Assistant recommendations increasingly include links and citations, and travellers act on them. The more honest framing: the shortlist is being formed there, and properties absent from it lose bookings that never show up in any report.

### Is AEO different from GEO (generative engine optimisation)?

They describe the same discipline: optimising to be cited and recommended by AI systems. The label matters less than the practice.

### Can a small independent lodge compete with OTAs in AI answers?

More easily than in classic search. Assistants favour the clearest specific authority over generic scale, and a lodge with precise, structured, well-reviewed content about its niche frequently gets cited where an OTA category page does not.

## Get on the Shortlist Before It Gets Crowded

Every tactic above is standard practice in how we build content and campaigns for hospitality clients, including this site itself. If you want your property optimised for the way travellers now actually choose, [book a discovery call](/contact) and ask us to show you what the assistants currently say about you. That conversation is usually persuasive on its own.`;

const post14Body = `Open the campaign creation screen in Google Ads and you are offered a menu of campaign types, each promising results. Most hotel marketing advice muddles this menu with strategy talk: branded campaigns, destination campaigns, remarketing campaigns. Useful concepts, but here is the thing: branded and destination are not campaign types. They are keyword strategies that both live inside one campaign type, Search. If you do not know the actual taxonomy, you cannot read your own account.

So let us do this properly: every campaign type Google offers, what it actually is, and an honest hospitality verdict for each. The strategy layer from our [complete Google Ads guide](/blog/google-ads-for-hotels-guide-2026) then sits on top of the right foundations.

## The Full Line-Up at a Glance

| Campaign type | Where ads appear | Intent level | Hospitality verdict |
|---|---|---|---|
| Search | Google results, Maps, search partners | Very high | Fund first |
| Hotel campaigns | Search, Maps, Google Travel price boxes | Very high | Fund second |
| Display | Millions of sites and apps on the Display Network | Low to medium | Remarketing only |
| Performance Max | Every Google surface at once | Medium to high | Test once data is strong |
| Video (YouTube) | YouTube videos, Shorts, video partners | Medium | Awareness, with good assets |
| Demand Gen | YouTube feeds and Shorts, Discover, Gmail | Medium | The one to watch for travel |
| Smart | Search, Maps and more, fully automated | Mixed | Skip |
| Shopping | Shopping tab, Search, Images | High | Not for rooms |
| App | Play Store and across Google | App-specific | Groups with apps only |
| Local Services Ads | Top of Search results | Very high | Not available to hotels |

## The Core Types Hotels Should Fund

### Search Campaigns

The original and still the workhorse: text ads triggered by keywords, shown on Google results, Maps, and partner sites. Everything depends on the keywords you choose, which is where strategy enters. A Search campaign on your own property name is your branded defence against OTA ads. A Search campaign on area and category terms is your destination play for travellers who do not know you yet. Same campaign type, different keyword strategies, very different budgets, and the branded version is the first money any property should spend on Google.

### Hotel Campaigns

The industry-specific type, and the reason hotels have an advantage most industries lack. Hotel campaigns connect your live rates and availability, fed through Hotel Center from your booking engine or channel manager, into the price comparison boxes on your Google profile, Maps, and Google Travel. Your direct rate appears beside the OTA rates at the exact decision moment, and free booking links give you unpaid placements in the same box once the feed exists. If your property funds only two campaign types ever, it is Search plus this.

## The Supporting Types

### Display Campaigns

Visual banner ads across the Google Display Network's millions of sites and apps. For hotels, Display earns its budget in exactly one job: remarketing to people who already visited your website, keeping the property visible through long international booking windows. Broad Display prospecting to cold audiences is where hotel budgets go to produce impressive impression counts and nothing else.

### Video (YouTube) Campaigns

Skippable in-stream ads, six-second bumpers, and Shorts placements on YouTube. Video is the strongest awareness format Google offers for a visual product like hospitality, with one honest prerequisite: footage that earns attention. Properties with strong video assets should aim modest campaigns at their top feeder markets; properties without should make the footage first, per our [content system](/blog/hotel-content-creation-drives-bookings).

### Demand Gen Campaigns

The newest type, evolved from Discovery: visually led ads, carousels, and short video shown in YouTube feeds and Shorts, the Discover feed, and Gmail. It is Google's answer to social-style browsing, reaching people exploring interests before they ever type a search. That is precisely how holiday inspiration works, which makes Demand Gen the most interesting emerging type for hospitality. Treat it as the mid-funnel test slot once your core is funded, with the same vertical video your Meta campaigns run.

### Performance Max Campaigns

One automated campaign across every Google surface: Search, Display, YouTube, Discover, Gmail, and Maps, with Google's systems mixing your creative assets and hunting conversions. The power is real and so is the catch: PMax optimises toward whatever your conversion data tells it, so thin or broken tracking produces confident spend toward the wrong outcome. Earn it with verified booking tracking and real conversion volume, then test it against your manual campaigns rather than instead of them.

## The Types Hotels Should Skip

Three types exist that hospitality mostly should not touch, and knowing why saves awkward conversations. Smart campaigns are the set-and-forget option for local businesses, trading away the keyword, geographic, and bidding control that hotel profitability depends on; if you can read this blog, you have outgrown them. Shopping campaigns sell physical products from a Merchant Center feed, so rooms do not qualify; the only hotel use is a side store selling vouchers or merchandise. App campaigns drive app installs, relevant only to groups with a booking app. And Local Services Ads, the pay-per-lead placements above Search results, are limited to eligible local service categories, which accommodation is not, so any agency proposing them for your lodge has told you something important about their attention to detail.

## The Funding Order and Three Scenarios

The verdicts above collapse into a simple sequence: Search on your brand name, Hotel campaigns with the free links switched on, Display remarketing, then Search on destination terms in proven feeder markets, then Demand Gen or Video as the awareness test, then a Performance Max trial once data is deep. In practice:

| Scenario | Monthly budget | Campaign types funded |
|---|---|---|
| 8-room guesthouse, mostly domestic | $300 | Search (brand), Hotel campaigns with free links, small Display remarketing |
| 15-room lodge, international feeders | $1,000 | The above, plus Search (destination) in top two feeder markets |
| 40-room independent resort | $2,500+ | All of the above, plus Demand Gen or Video in the strongest market, plus a PMax test |

Every layer is held to one benchmark, cost per direct booking against your OTA commission, using the measurement discipline in our [ROI guide](/blog/measure-hotel-marketing-roi).

## Frequently Asked Questions

### What is the difference between a branded campaign and a Search campaign?

A Search campaign is the campaign type; branded is a keyword strategy inside it, targeting your own property name. Destination campaigns are the same type pointed at area and category keywords. Structure them as separate Search campaigns so budgets and results stay legible.

### Are Demand Gen campaigns worth it for hotels?

They are the most promising newer type for travel, because they reach people in browse-and-dream mode with visual content. Fund them after your Search, Hotel, and remarketing core, and feed them your best short vertical video.

### Why can hotels not use Local Services Ads or Shopping campaigns?

Local Services Ads are restricted to eligible service categories like trades and legal, which excludes accommodation. Shopping requires a physical product feed, so it only applies if your property retails vouchers or merchandise through an online store.

## Read Your Account Like You Built It

Ten types, four worth funding, two worth testing, and a clear order to fund them in. Audit your account against the table, and anything spending outside it needs a reason. Or let us do the audit with you: [Google Ads for hospitality](/services/google-ads) is what we run daily, and mislabelled campaign types are usually the first thing we find. [Book a discovery call](/contact).`;

const post15Body = `Every Meta campaign starts with one dropdown: the objective. It is the most consequential setting in the account, because it tells the algorithm what to hunt. Choose Engagement and Meta finds people who love reacting to posts. Choose Sales and it finds people who complete bookings. Same advert, same budget, completely different outcomes.

But the objective is only half the machine. The other half is the creative: the format, the visual, and the words, and each objective rewards different creative choices. This guide covers both halves properly: what each objective actually is, then exactly what to put in front of it.

First, thirty seconds of structure. A Meta campaign has three levels: the campaign, where you set the objective; the ad set, where you choose audiences, placements, and budget; and the ad, where format, graphic, and copy live. Objective decides what Meta optimises for. Creative decides whether anyone cares. Get both right and the audiences from our [off-peak guide](/blog/meta-ads-fill-empty-rooms-off-peak) do the rest.

## The Six Objectives at a Glance

| Objective | What Meta actually optimises for | Hotel job | Monthly floor |
|---|---|---|---|
| Awareness | Reach and ad recall among people likely to remember you | Launches, new feeder markets | $150 |
| Traffic | Link clicks or landing page views | Feeding remarketing pools, distributing offers | $100 |
| Engagement | Reactions, comments, shares, video views, messages | Stacking social proof, building video audiences | $100 |
| Leads | Form fills or started conversations | Properties that book by enquiry, DM, or WhatsApp | $150 |
| Sales | Completed bookings tracked by your pixel | The core: converting warm audiences | $200 |
| Advantage+ | Conversions, with automated targeting and creative mixing | Scaling, once data and creative volume exist | $500 |

## Awareness: Being Remembered in the Right Market

What it is: Meta shows your ads to people in your chosen market who are statistically likely to remember them, measured in reach and estimated ad recall, not clicks. Use it in defined bursts: a renovation launch, a new feeder city, the September festive push.

Formats and graphics: short vertical video rules here, six to fifteen seconds, one striking idea per clip: the drone reveal, the leopard crossing the road, the storm over the deck. Motion beats static in every awareness test we run; if you must use stills, use one cinematic hero shot, never a collage.

Copy: almost none. One evocative line anchored to place, like Ten suites. One river. No neighbours. No offer, no paragraph, no hashtags. The video is the message; the copy is the caption on a painting.

## Traffic: Filling the Pool

What it is: Meta finds people likely to click through to your site. Always optimise for landing page views rather than link clicks, which filters out the misclicks. Its hotel job is honest but unglamorous: distributing content and offers, and filling the remarketing pool your Sales campaigns fish from. Judge it by pool growth, never by bookings.

Formats and graphics: carousels earn the click here: five to seven cards walking through rooms, experiences, or a sample itinerary, each card one clean image with a short label. Reels also work when the video ends on a reason to tap.

Copy: a specific promise beats cleverness. See the five suites and this season's rates does more than Discover paradise. One sentence, one idea, Learn More button.

## Engagement: Proof, On Purpose

What it is: Meta finds people who interact: reactions, comments, shares, video views, or messages. Used alone it is the vanity objective; used deliberately it has two real hotel jobs. First, stacking visible social proof onto the exact posts your cold audiences will later see as ads. Second, the video views variant builds audiences of people who watched your content, which become warm targeting pools.

Formats and graphics: guest-shot UGC outperforms polished content here by a distance, because engagement follows authenticity. Behind-the-scenes clips, staff moments, the honeymooners' own reel reposted with permission.

Copy: prompts, not pitches. A question that invites an answer, or the classic tag who you would bring. Keep it human; this is the objective where sounding like a brand costs you.

## Leads: For Properties That Book by Conversation

What it is: Meta optimises for enquiries, through two routes with a real trade-off. Instant forms open natively with details prefilled, producing more leads of lower average intent. Message ads open a Messenger, Instagram, or WhatsApp conversation, producing fewer, warmer enquiries. Lodges closing bookings by conversation should usually choose messages, and remember the rule from our off-peak guide: response time is the conversion rate.

Formats and graphics: one specific image or clip of the exact thing being enquired about: the family unit, the honeymoon suite deck, the festive table. Specificity signals that a real conversation awaits, not a mailing list.

Copy: qualify inside the ad so the leads arrive half-closed. Name the dates, the offer, and what to send: Message us your dates and group size for December availability. Then promise the response time you will actually keep.

## Sales: The Core of the Account

What it is: Meta optimises for completed bookings, tracked by your pixel and Conversions API firing on the booking confirmation page. This is the always-on heart of a hotel account, aimed at warm audiences: site visitors, engagers, and your guest database. It is also where catalogue-powered dynamic ads live, automatically showing people the exact rooms they viewed, which depends entirely on the tracking plumbing our next tech post covers.

Formats and graphics: carousels of room types with rates on the cards, collection ads that open a full-screen browse on mobile, and Reels with dates and the offer overlaid in the first two seconds. Add one review-led static: a five-star quote over a guest photo converts sceptics the pretty shots cannot.

Copy: the full stack in three lines: the offer, the dates, the perk, then one line of proof. Third night free for December midweek stays. Includes sunset game drive. Rated 4.9 by 300 guests. Book Now button, always, landing on the offer page with the code applied.

## Advantage+: Automation You Must Earn

What it is: Meta's automated campaign type, pooling your creatives and finding converters with minimal targeting input. It amplifies whatever your data says, which is the whole point and the whole risk. The entry requirements are verified tracking, real conversion history from a manual Sales campaign, and six to ten genuinely different creatives for the system to mix. Run it alongside your manual Sales campaign as a test, and let cost per booking pick the winner.

## The Creative Cheat Sheet

| Objective | Best formats | Graphic rule | Copy rule | Button |
|---|---|---|---|---|
| Awareness | Reels 6 to 15s | One striking moment, motion first | One evocative line, no offer | None or Learn More |
| Traffic | Carousel, Reels | One clean image per card | Specific promise, one sentence | Learn More |
| Engagement | UGC video | Authentic beats polished | A prompt or question | None |
| Leads | Single image or clip | Show the exact thing enquired about | Qualify: dates, group, next step | Send Message |
| Sales | Carousel, collection, Reels | Rooms, rates, offer overlaid early | Offer, dates, perk, proof | Book Now |
| Advantage+ | All of the above | Six to ten distinct creatives | Multiple angles for the system to mix | Book Now |

## Frequently Asked Questions

### Which Meta campaign objective is best for a small hotel?

Sales, aimed at warm audiences, with a carousel of rooms and offer-led copy. It is the smallest audience, the cheapest spend, and the shortest path to bookings, provided the pixel and booking tracking are installed correctly first.

### What ad format performs best for hotels on Meta right now?

Short vertical video in Reels placements earns the cheapest attention across objectives, with carousels the strongest converter at the Sales stage. The deciding factor is matching format to objective, which is what the cheat sheet is for.

### How many creatives should each campaign have?

Three genuinely different creatives minimum for manual campaigns, refreshed every four to six weeks before fatigue doubles your costs, and six to ten for Advantage+ to mix properly.

## Match the Hunt to the Creative

The dropdown decides what your budget hunts; the creative decides whether the hunt succeeds. Build from the cheat sheet, fund Sales on warm audiences first, and hold everything to the commission benchmark. Or have the whole account built properly once: our [Meta advertising service](/services/meta-ads) runs exactly this playbook for hospitality brands. [Book a discovery call](/contact) and bring your Ads Manager; the objectives column tells us most of what we need to know.`;

const post16Body = `Here is a pattern we see every year. In November, a property owner looks at a December calendar with more gaps than expected and reaches for the discount lever. The gaps fill, at 20% off, through OTAs charging another 18% on top. Peak season arrives and the property earns shoulder-season money from it.

The owners who avoid that November are the ones who treated festive season as a campaign with a start date in August. Peak demand is the easiest demand you will ever market to; the only way to lose it is to be late. This playbook is the calendar that keeps you early.

## Why the Clock Starts in August

Booking windows decide everything. International long-haul travellers, the guests who anchor Southern Hemisphere festive seasons, commit three to five months out: their December is decided between August and early October. Domestic and regional guests book one to three months out, filling October and November. Last-minute drive-market bookings mop up December itself.

Miss the international window and no amount of November spending buys it back, because those travellers are not undecided anymore. They are booked, somewhere else.

## The Month-by-Month Playbook

| Month | Focus | Key actions |
|---|---|---|
| August | Foundation | Audit tracking and booking engine, set festive rates and minimum stays, build packages, segment the guest database, brief content and creative |
| September | International push | Launch campaigns in feeder markets, email past international guests first, ensure Hotel Ads rate feed and parity are correct, publish festive content |
| October | Domestic push | Shift campaign weight to domestic and regional audiences, second email wave, remarketing on all festive page visitors, review pace weekly |
| November | Close the gaps | Targeted offers on remaining dates only, last-minute radius campaigns, WhatsApp-ready enquiry handling, hold rate on high-demand dates |
| December | Capture the future | Collect every guest detail at check-in, ask for reviews in the glow, photograph everything, seed January and green season offers |

## August: Build Before You Broadcast

Everything in September depends on August. Verify that your booking engine, payment flow, and conversion tracking survive a real test booking, per our [booking engine guide](/blog/booking-engine-setup-direct-reservations). Set festive rates and minimum stays now, with deposit and cancellation terms that protect peak dates, and load them into every channel in the same week so parity never becomes a December surprise. Pricing set in August reads as confidence; pricing improvised in November reads as panic, and guests can tell the difference. Build two or three packages that add value instead of cutting price: festive dinners, guided experiences, family bundles. And segment your database into past festive guests, international, and domestic lists, because they get different messages at different times.

## September: The International Window

Email goes first, and it goes to past guests: the people most likely to return, at zero acquisition cost, with early access framed as a privilege rather than a promotion. The same week, paid campaigns open in your proven international feeder markets, using the funding order from our [Google Ads campaign comparison](/blog/google-ads-campaign-types-hotels) and warm-audience structure from the [Meta objectives guide](/blog/meta-ads-campaign-types-hotels). Check one unglamorous thing twice: that your direct festive rates are live and correct in the Hotel Ads comparison box, because a parity error during your highest-intent season is a commission machine.

## October: The Domestic Wave and the Weekly Pace Check

Campaign weight shifts to domestic and regional audiences as their booking window opens, with the drive-market targeting from our [off-peak guide](/blog/meta-ads-fill-empty-rooms-off-peak) repurposed at peak intent. Domestic festive shoppers move faster and compare harder than international planners, so creative should lead with dates, availability, and the package, not the brand film. From here, run a weekly pace review: this year's bookings on the books for each festive week versus last year same time. Pace, not hope, decides November.

## November: Precision, Not Panic

If pace is healthy, hold your rate and let scarcity work. If specific dates lag, aim offers at those dates only, as packages and perks rather than visible discounts, through remarketing audiences and last-minute radius campaigns. This is also the month enquiry handling becomes revenue: festive shoppers compare quickly and book whoever answers first, which is where WhatsApp earns its place on your site, a topic our next post covers in full.

## December: The Season That Pays Twice

The guests are here; peak season's second job is filling next year. Capture every contact detail at check-in, request reviews while the experience is vivid, shoot the content your [five pillars](/blog/hotel-content-creation-drives-bookings) will run on all year, since a full property photographs best exactly when you have no time to think about it, and put January and green season offers in front of departing guests before they land home. A festive season that markets the off-season is the flywheel working as intended.

## The One Rule Across All Five Months

Never discount peak. Demand is coming regardless; your job is to be visible early enough to capture it direct, at full value, before the OTAs sell it back to you. Every discount you avoid in December funds a quarter of proper marketing next year, and the maths of that trade lives in our [OTA commission breakdown](/blog/how-to-reduce-ota-commissions).

## The Five Festive Mistakes That Repeat Every Year

Reading a playbook is easier than escaping a pattern, so name the patterns. Starting in November, the original sin, which turns peak season into a rescue operation. Releasing all inventory to OTAs early for safety, which guarantees maximum commission on your easiest bookings; hold direct inventory and release to OTAs late and deliberately. One generic campaign for every market, when the international and domestic windows need different messages months apart. Loose cancellation terms on peak dates, which invite speculative bookings that evaporate in December, too late to resell; deposits and fair but firm terms exist for exactly this. And going quiet after the season instead of harvesting it, leaving reviews unrequested, contacts uncaptured, and January unfilled while the goodwill is at its annual peak. Every one of these is a decision made or missed in August and September, which is the quiet argument of this entire playbook: the festive season rewards whoever shows up earliest, prepared.

## Frequently Asked Questions

### When should hotels start marketing for the festive season?

August for preparation and September for launch, because international travellers commit three to five months ahead. Campaigns starting in November compete only for leftover demand.

### Should hotels discount to fill December dates?

Almost never on peak dates. Use value-adding packages and target soft dates specifically. Visible peak-season discounting erodes rate integrity and trains guests to book late every year after.

### How do I know if my festive campaign is working?

Weekly pace against last year, direct share of festive bookings, and cost per direct booking against your OTA commission, on the same dashboard as the rest of your [marketing measurement](/blog/measure-hotel-marketing-roi).

## December Is Decided in September

Run the August audit this week, load the calendar, and let the season come to you early and direct. Or hand us the playbook: we build and run festive campaigns for hospitality brands every year, start to finish. [Book a discovery call](/contact) before September does what September does.`;

const posts = [
  {
    slug: "aeo-for-hotels-ai-recommendations",
    title:
      "How to Get Your Hotel Recommended by ChatGPT, Gemini, and Claude: AEO for Hospitality",
    excerpt:
      "A growing share of travellers no longer search for hotels. They ask ChatGPT, Gemini, or Claude to recommend one, and the assistant answers with a shortlist. Answer engine optimisation is how your property gets onto that shortlist, and this guide covers the complete playbook.",
    category: "Marketing Strategy",
    publishedAt: "2026-08-04T08:00:00Z",
    body: post13Body,
  },
  {
    slug: "google-ads-campaign-types-hotels",
    title: "Every Google Ads Campaign Type Explained (and Rated for Hotels)",
    excerpt:
      "Google Ads offers ten campaign types, and hotel budgets regularly die in the wrong ones. This guide explains what each campaign type actually is, where the ads appear, and then rates every one for hospitality: fund it, test it, or skip it, with a comparison table and a clear funding order.",
    category: "Paid Advertising",
    publishedAt: "2026-08-11T08:00:00Z",
    body: post14Body,
  },
  {
    slug: "meta-ads-campaign-types-hotels",
    title:
      "Meta Ads for Hotels: Every Campaign Objective, and the Creative That Works for Each",
    excerpt:
      "Meta gives you six campaign objectives, and each one hunts for something different with your money. This guide explains exactly what every objective does, then gets practical: the ad formats, the graphics, and the copy that work for each, summarised in a creative cheat sheet you can build campaigns from.",
    category: "Paid Advertising",
    publishedAt: "2026-08-18T08:00:00Z",
    body: post15Body,
  },
  {
    slug: "festive-season-hotel-marketing-playbook",
    title:
      "The Festive Season Playbook: Fill Your December Calendar Before October",
    excerpt:
      "Festive season occupancy is not won in November. It is won in September, when international travellers commit, and defended in October and November as domestic bookings arrive. This month-by-month playbook takes a property from August audit to a December calendar that filled itself early, direct, and at full rate.",
    category: "Marketing Strategy",
    publishedAt: "2026-08-25T08:00:00Z",
    body: post16Body,
  },
];

async function run() {
  const now = Date.now();
  for (const post of posts) {
    const body = markdownToPortableText(post.body);
    const tableCount = body.filter((b) => b._type === "comparisonTable").length;
    const doc = {
      _type: "post",
      _id: `post-${post.slug}`,
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      body,
      category: post.category,
      author: "Revolution Media",
      publishedAt: post.publishedAt,
    };
    await client.createOrReplace(doc);
    const scheduled =
      new Date(post.publishedAt).getTime() > now ? " (scheduled, hidden until publish date)" : "";
    console.log(
      `Seeded post-${post.slug} [${post.category}] publishedAt ${post.publishedAt}${scheduled}, ${tableCount} table(s).`,
    );
  }
  console.log("\nDone. Cover images must be uploaded manually via /studio.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

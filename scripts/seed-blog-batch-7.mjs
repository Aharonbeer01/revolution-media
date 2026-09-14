import { config } from "dotenv";
config({ path: ".env.local" });
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

// Batch 7 (Q4 slate, posts 20 to 22). All future-dated and scheduled; the
// site's queries filter publishedAt <= now(), so each stays hidden from the
// blog index, sitemap, feed, and its own detail route until its publish date.
// USD throughout, UK/SA spelling, no em dashes, tables as comparisonTable.
//
// Category mapping (to the site's five categories):
//   Post 20 -> Social & Content
//   Post 21 -> Strategy & Measurement
//   Post 22 -> Strategy & Measurement
//
// Dead internal link handling: /blog/ga4-events-vs-key-events-hotels does not
// exist and is not a planned target in this series, so its two references
// (post 21, post 22) are unlinked (text kept). The three forward links in
// post 21 (bing-for-hotels, apple-business-connect-hotels,
// microsoft-clarity-for-hotels) are kept as relative links per the brief and
// resolve when Batches 8 and 9 ship.

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
        children.push({ _type: "span", _key: randomKey(), text: part.slice(2, -2), marks: ["strong", ...(extraMarks || [])] });
      } else {
        children.push({ _type: "span", _key: randomKey(), text: part, marks: [...(extraMarks || [])] });
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
  if (children.length === 0) children.push({ _type: "span", _key: randomKey(), text: "", marks: [] });
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
  const splitRow = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  const headers = splitRow(lines[0]);
  const rows = [];
  for (let i = 2; i < lines.length; i++) rows.push({ _type: "tableRow", _key: randomKey(), cells: splitRow(lines[i]) });
  return { _type: "comparisonTable", _key: randomKey(), headers, rows };
}
function isTableSeparator(line) { return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line.trim()); }
function isTableRow(line) { return /^\s*\|.*\|\s*$/.test(line); }

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
// POST 20
// ---------------------------------------------------------------------------
const post20 = {
  slug: "phone-filming-kit-hotels-gear-by-budget",
  title: "The Complete Phone Filming Kit for Hotels: Gear by Budget",
  category: "Social & Content",
  publishedAt: "2026-09-22T08:00:00Z",
  excerpt:
    "You do not need a film crew to run a professional content programme. You need a recent phone, one or two well-chosen accessories, and technique. This guide breaks the full kit down by budget, from the phone already in your pocket to a complete travelling studio for under $800, with the settings that matter more than any of it.",
  body: `Here is a fact that surprises every property owner we tell: some of the most polished hospitality content programmes running today are filmed entirely on a smartphone. Not as a compromise. As the deliberate choice, because a phone with a gimbal produces exactly what Reels, TikTok, and Shorts reward: authentic, stable, vertical video, shot in minutes by whoever is on shift, on the day the light is perfect.

One remote private-island property we run a full programme for films its entire monthly reel calendar on precisely the setup in tier two below, guided by shot lists we send remotely. If a phone and a gimbal can carry a luxury island, they can carry your lodge. This is the complete kit, by budget, plus the part most gear guides skip: the settings and technique that outweigh all of it.

## The Three Tiers at a Glance

| Tier | Budget | What you use | What it unlocks |
|---|---|---|---|
| 1: The phone you have | $0 | A recent smartphone and technique | Every static and handheld shot, food, rooms, wildlife, guests |
| 2: The working kit | $150 to $350 | Add a mobile gimbal and a wireless mic | Walking tours, smooth reveals, spoken pieces, wind-proof audio |
| 3: The full travelling studio | $500 to $800 | Add lighting, a tripod, and backup audio | Interviews, night and interior work, two-person pieces, all-weather shoots |

Prices shift with releases and region, so treat the figures as accurate at the time of writing and confirm current pricing before buying.

## Tier 1: The Phone You Already Own ($0)

Any iPhone from roughly the 12 onward, or an equivalent recent Android, shoots better video than the cameras hotels hired professionals for a decade ago. What separates good phone footage from bad is almost never the phone. It is these habits:

- Shoot 9:16 vertical for Reels and TikTok, set before you start, not cropped after
- 4K at 30fps for standard shots; 1080p at 60fps when you want slow motion
- Skip HDR formats like Dolby Vision, which fight most editing apps
- Tap and hold to lock exposure on your subject before recording, so golden hour does not flicker mid-shot
- Wipe the lens every time; half of all "soft" phone footage is a fingerprint
- Record five seconds before and after every shot for editing room
- Stabilise against what is there: a table, a railing, a wall

Master tier one before spending a cent, because tiers two and three amplify technique; they do not replace it.

## Tier 2: The Working Kit ($150 to $350)

This is the tier that changes what your content looks like, and the tier our island client runs on.

**A mobile gimbal ($90 to $160).** The DJI Osmo Mobile line is the standard, and it is what our own shot guides are calibrated to. A gimbal turns walking shots into gliding reveals: the villa entrance, the path to the spa, the plate carried to the table. Learn three modes and you have ninety percent of it: pan follow for tracking, lock for tripod-steady frames, and POV for energy.

**A wireless microphone ($90 to $190).** The DJI Mic Mini or an equivalent clip-on transforms every spoken piece: the chef's intro, the guide's briefing, the owner's welcome. The rule that saves more footage than any gear: if there is no external mic, the speaker stands within an arm's length of the phone, and outdoors you either fit a foam windshield or shoot for music overlay, because built-in mics lose to wind every single time.

With this tier, one person films an entire reel calendar. It fits in a jacket pocket, charges overnight, and pays for itself against a single hour of hired videography.

## Tier 3: The Full Travelling Studio ($500 to $800)

Add tier three when your calendar includes interviews, consistent night work, or two speakers:

- A small LED panel with adjustable warmth ($60 to $120) rescues interiors, kitchens, and blue-hour shots
- A proper phone tripod with a fluid head ($40 to $80) for static beauty shots, time-lapses, and locked interview frames
- A dual-transmitter wireless mic system ($250 to $350) for two-person conversations and guest features
- A neutral density filter kit ($30 to $60) for bright-sun shooting at cinematic settings

That is the ceiling. Beyond this tier you are buying a camera department, and for social-first content the returns genuinely diminish, because platforms reward authenticity and frequency over cinema.

## The Mistakes That Waste Good Gear

Four habits undo more phone footage than any missing accessory. Filming everything handheld once the gimbal arrives, because unpacking it felt like effort; the gimbal only works from inside the bag if you never open it. Shooting horizontally out of old habit, which turns every clip into a cropped compromise. Recording spoken pieces from across the room with no mic, then blaming the phone. And filming without a shot list, which produces three hundred clips of the pool and nothing usable for the reel you actually planned. Gear is the cheap part; the discipline around it is where the quality lives.

## What Professionals Are Still For

Phone-first does not mean pro-never. The split that works: professional shoots for the anchor assets (the website films, the campaign hero footage, the drone work, a seasonal refresh), and the phone kit for the always-on layer between. Our clients run exactly that split through [Revolution Motion](/services/content-creation), and for international properties the phone kit is the entire on-site half of our Remote Content System: we send shot-by-shot guides calibrated to this exact equipment, your team films, we direct, edit, and publish.

## Make the Kit Earn Bookings, Not Just Footage

Gear produces clips; systems produce revenue. The kit above feeds the five content pillars and monthly batch workflow from our [content creation guide](/blog/hotel-content-creation-drives-bookings), the platform decisions from [TikTok vs Instagram](/blog/tiktok-marketing-hotels-vs-instagram), and the make-every-piece-bookable mechanics that turn a pretty reel into a reservation. Buy tier two, block one half-day a month, and film against a shot list. That combination outperforms every property still waiting for the budget to hire a crew.

## Frequently Asked Questions

### Which phone is good enough for hotel content?

Any iPhone from around the 12 onward or a recent flagship Android. If your phone shoots 4K at 30fps and 1080p at 60fps, the limiting factor is technique and light, not the device.

### Do I really need an external microphone?

Only for spoken content. Ambient, music-led reels work fine on the built-in mic with a windshield outdoors. The moment anyone talks to camera from more than arm's length, a wireless mic stops being optional.

### Is an iPhone or Android better for filming hotels?

Either, provided it is recent. iPhones have the edge in editing-app compatibility and consistency between shots; flagship Androids match them on image quality. Use whichever your team already owns and knows.

## Start Filming This Week

Tier one costs nothing and starts today. Tier two costs less than one professional half-day and runs a private island. If you want the shot lists, calendars, and remote direction that turn the kit into a system, that is exactly what our Remote Content System delivers. [Book a discovery call](/contact) and we will build your first month's shot guide with you.`,
};

// ---------------------------------------------------------------------------
// POST 21  (GA4 key events reference unlinked: target does not exist)
// ---------------------------------------------------------------------------
const post21 = {
  slug: "hotel-marketing-beyond-google",
  title: "Hotel Marketing Beyond Google: The Channels Everyone Forgets",
  category: "Strategy & Measurement",
  publishedAt: "2026-09-29T08:00:00Z",
  excerpt:
    "Ask any hotel marketer about search and you will hear the same four letters: GBP, GSC, GA4. All Google, all essential, and all only half the picture. Bing quietly feeds ChatGPT's search results, Apple Maps answers your richest guests' phones, and Microsoft Clarity shows you why bookings die. This is the map of everything beyond Google, ranked by effort and payoff.",
  body: `Here is a question that catches almost every property and most agencies: your Google Business Profile is polished, your Search Console is verified, your GA4 is tracking, so where does ChatGPT get its search results when a traveller asks it to find hotels?

Not from Google.

ChatGPT's live web search draws substantially on Bing's index, and so do Microsoft Copilot, DuckDuckGo, and Yahoo. Which means the industry's total fixation on one search engine has quietly created a blind spot running straight through the middle of the AI answers everyone claims to be optimising for. And Bing is only the first of the forgotten channels. This guide maps all of them, ranks the effort against the payoff, and ends with a setup plan that takes about an hour.

## Why the Google Trilogy Became a Blindfold

Google earned its dominance and nothing here argues against it: the Business Profile, Search Console, and GA4 remain the foundation, and our guides on [Search Console's new social tracking](/blog/google-search-console-platform-properties-hotels) and GA4 key events sit at the centre of this blog for good reason. The problem is what "Google-only" silently excludes: the second-largest search index in the West, the default maps app on the world's most affluent phone, and a free behaviour tool Google does not even offer. For most industries those are rounding errors. For hospitality, where the guest is international, iPhone-carrying, and increasingly asking AI where to stay, they are booking channels.

## The Forgotten Channels, Ranked

| Channel | What it actually is | Who it reaches | Setup effort | Payoff for hotels |
|---|---|---|---|---|
| Bing Webmaster Tools + Bing Places | The index behind ChatGPT search, Copilot, DuckDuckGo, Yahoo | AI-assisted travellers, desktop and corporate searchers | 30 minutes | High: visibility in AI answers and an uncontested second index |
| Apple Business Connect | Your listing on Apple Maps, Siri, and Spotlight | iPhone users, who skew toward high-spending international guests | 30 minutes | High: the navigation and "near me" layer of your richest segment |
| Microsoft Clarity | Free session recordings and heatmaps of your website | Not guests; you, watching real booking attempts | 15 minutes | High: shows why visitors do not book, which GA4 cannot |
| AI crawler access (robots.txt) | Letting GPTBot, ClaudeBot, PerplexityBot read your site | Every AI assistant answering travel questions | 10 minutes | Foundational: blocked crawlers mean absent citations |
| Microsoft Ads | Paid search on Bing and partners | Older, wealthier, desktop-heavy searchers | 1 to 2 hours | Medium: cheaper clicks on your brand and destination terms |

Three of the five are free forever, and none requires ongoing work after setup. That ratio of effort to coverage is why this cluster exists.

## Bing: The Index That Feeds the Assistants

Treat Bing as two quick jobs. First, Bing Webmaster Tools: verify your site (it imports straight from Search Console), submit your sitemap, and your pages join the index that AI search actually reads. Second, Bing Places: claim your business listing the way you claimed your Google profile, because Copilot and Bing local results draw on it. There is also a quiet technical bonus called IndexNow, which pings Bing the moment you publish, and a paid layer where brand-term clicks routinely cost a fraction of Google's because nobody in hospitality bids there. The full walkthrough is coming in our [dedicated Bing guide](/blog/bing-for-hotels), but the verification and sitemap alone close most of the gap.

## Apple: The Maps Your Best Guests Actually Open

The traveller stepping off a long-haul flight with your booking confirmation is statistically holding an iPhone, and when they ask Siri for directions, coffee nearby, or a hotel tonight, the answer comes from Apple Maps, powered by Apple Business Connect. Claiming your place there takes half an hour: verified details, proper photos, your booking link, and Apple's "Showcase" features for offers. Most properties have never touched it, which means the ones that do stand alone in front of the single highest-spending device demographic in travel. Our [Apple Business Connect walkthrough](/blog/apple-business-connect-hotels) covers every step.

## Microsoft Clarity: Watch the Bookings Die, Then Fix Why

GA4 tells you a visitor left at the rates page. Clarity shows you the recording: the rage-clicks on a date picker that would not load, the mobile menu covering the book button, the guest who scrolled the gallery four times looking for a price. It is completely free, takes one tag to install, and pairs with GA4 the way an X-ray pairs with a blood test. For properties spending real money driving traffic to a website that quietly leaks, fifteen minutes of Clarity recordings is routinely worth more than a month of dashboard reports. Full guide coming in our [Clarity for hotels post](/blog/microsoft-clarity-for-hotels).

## Open the Door to the AI Crawlers

One ten-minute check with outsized consequences: your robots.txt file decides whether AI systems can read your site at all. Some hosting platforms and security plugins block GPTBot, ClaudeBot, PerplexityBot, and their peers by default, which means everything our [AEO guide](/blog/aeo-for-hotels-ai-recommendations) teaches gets silenced at the door. Check yours at yourdomain.com/robots.txt, confirm the AI crawlers are not disallowed, and if you use a firewall service, whitelist them explicitly. An assistant cannot cite a page it was never allowed to read.

## The One-Hour Setup Plan

In order: verify Bing Webmaster Tools by importing from Search Console and submit the sitemap (15 minutes). Claim Bing Places (15 minutes). Claim Apple Business Connect and load photos plus the booking link (20 minutes). Install Clarity (10 minutes). Check robots.txt for AI crawler blocks (5 minutes). Then diarise one monthly glance: Bing's performance report, Apple's insights, and three Clarity recordings of abandoned bookings. That is the entire maintenance load, and it is how we run it, because every channel in this post is live on our own site.

## Where This Layer Fits in the Bigger System

None of this replaces the core: the direct booking engine, the Google foundation, the content system, and the measurement stack stay exactly where our earlier guides put them. The forgotten channels are coverage, not strategy: one hour of setup that makes everything you already publish visible to the indexes, maps, and assistants the industry ignores. The properties that add this layer now inherit an uncontested position, because their competitors' agencies are still reporting on one search engine while travellers quietly ask their phones and their assistants everything.

## Frequently Asked Questions

### Is Bing really worth it for a hotel when Google has more searches?

Yes, for one modern reason above the old ones: Bing's index substantially powers ChatGPT search and Copilot, so Bing visibility is AI visibility. The half hour of setup buys presence in answers Google-only properties never enter.

### Do I need Apple Business Connect if I have a Google Business Profile?

They are separate systems. Your Google profile does nothing on Apple Maps, Siri, or Spotlight, which is where iPhone-carrying travellers navigate. Claiming both takes an hour combined and covers effectively every phone in your car park.

### Does Microsoft Clarity replace Google Analytics?

No, it completes it. GA4 counts what happened; Clarity shows why. Run both: GA4 for the numbers and key events, Clarity for the recordings and heatmaps that explain them.

## Cover the Whole Board

Keep the Google foundation, then spend one hour claiming everything beside it: Bing for the AI answers, Apple for the iPhones, Clarity for the truth about your website. The next three posts in this series walk through each one step by step. Or have the whole layer set up for you as part of a proper visibility audit: [book a discovery call](/contact) and ask us what the assistants and the maps currently say about your property.`,
};

// ---------------------------------------------------------------------------
// POST 22  (GA4 measurement reference unlinked: target does not exist)
// ---------------------------------------------------------------------------
const post22 = {
  slug: "hotel-digital-marketing-audit",
  title: "The 8-Point Hotel Digital Marketing Audit (Run It Yourself)",
  category: "Strategy & Measurement",
  publishedAt: "2026-10-06T08:00:00Z",
  excerpt:
    "Before we propose anything to any property, we run the same audit: eight categories, each scored one to five, forty points on the table. This post publishes the entire framework, what a five looks like, what a two looks like, and what your total actually means, so you can grade your own property before anyone grades it for you.",
  body: `Every property owner suspects their marketing has gaps. Almost none can name them precisely, which is why the conversation defaults to feelings: the Instagram feels quiet, the website feels dated, the OTAs feel expensive. Feelings do not prioritise, and they certainly do not budget.

An audit replaces feelings with a score. This is the exact framework we run on every property before we propose a cent of work: eight categories, one to five points each, forty on the table. We are publishing the whole thing, criteria included, because an owner who scores their own property honestly makes better decisions with us or without us. Grade yours as you read; it takes twenty minutes and a straight face.

## The Eight Categories

| # | Category | What we examine | A 5 looks like | A 1 or 2 looks like |
|---|---|---|---|---|
| 1 | Content consistency | Posting rhythm across the last 90 days | Steady weekly cadence, planned around seasons | Bursts and silences; last post weeks ago |
| 2 | Reels and video | Share and quality of short vertical video | Regular reels showing the real experience | Static images only, or video shot landscape |
| 3 | Photo and visual quality | Sharpness, light, and honesty of imagery | Recent, natural, consistent with the brand | Dark interiors, stretched logos, stock filler |
| 4 | Profile and bio | Names, bios, links, and contact details across platforms | Consistent everywhere, booking link one tap away | Mismatched names, dead links, no way to book |
| 5 | Captions and CTAs | Whether posts ask for anything | Clear next steps, offers, and booking paths | Emoji strings and hashtags with no ask |
| 6 | Google Business Profile | Completeness, photos, reviews, and responses | Claimed, current, reviewed, every review answered | Unclaimed or stale, reviews ignored |
| 7 | Paid ads presence | Whether the property defends and creates demand | Branded search live, seasonal campaigns tracked | Zero ads while OTAs bid on the property's name |
| 8 | Website and direct booking | Speed, mobile experience, and path to payment | Live rates, two-minute mobile booking | Enquiry-form-only, slow, no visible prices |

Score each category one to five, honestly. Half points are cowardice; commit.

## How to Score Without Fooling Yourself

Three rules keep the exercise honest. Audit as a guest, not as the owner: open your Instagram and website on your phone, on mobile data, as a stranger would, and try to get from discovery to a booked room. Use the ninety-day window: what you posted last year does not count, and neither does what you plan to post. And name what works first: our own rule internally is that any category scoring four or five gets said out loud before any weakness does, because an audit that only finds problems is a sales trick, not an assessment.

## What Your Total Means

**32 to 40: Optimise.** The foundation works. Your gains now come from the top of the stack: sharper [campaign structure](/blog/google-ads-campaign-types-hotels), deeper measurement, and squeezing conversion from traffic you already earn.

**20 to 31: Rebalance.** The most common band, and the most profitable to fix: strength in two or three categories propping up real leaks elsewhere. The order of operations matters more than effort here, and it almost always starts with category eight, because fixing demand before fixing the [booking path](/blog/booking-engine-setup-direct-reservations) pours water into a cracked glass.

**Below 20: Foundation.** No shame in it; most independent properties start here, including some now taking eighty percent of bookings direct. The sequence is the [direct booking strategy](/blog/direct-booking-strategy-lodges-boutique-hotels) run from the top: website and booking engine, profiles and consistency, then content, then paid.

## From Score to Fix: The Category Map

Each weak category has a specific playbook already on this blog. Content consistency and reels: the [five-pillar content system](/blog/hotel-content-creation-drives-bookings) and the [phone filming kit](/blog/phone-filming-kit-hotels-gear-by-budget). Visual quality: the same kit plus professional anchor shoots. Profiles and bios: the entity consistency work from our [AEO guide](/blog/aeo-for-hotels-ai-recommendations). Captions and CTAs: the make-every-piece-bookable mechanics in the content guide. Google Business Profile: reviews and responses per our [review layer thinking](/blog/aeo-for-hotels-ai-recommendations), with the profile feeding [Hotel Ads](/blog/google-ads-for-hotels-guide-2026). Paid presence: branded search first, always. Website and booking: the [booking engine guide](/blog/booking-engine-setup-direct-reservations) end to end. The audit tells you where; those posts tell you how.

## The Ninth Category Most Audits Miss

Everything above examines the Google-and-Meta world, which is where every agency audit stops. Ours no longer does: the forgotten layer from our [Beyond Google guide](/blog/hotel-marketing-beyond-google), Bing and the AI assistants it feeds, Apple Maps for the iPhone travellers, and session recordings of your booking flow, has become a genuine scoring category, because a property invisible to ChatGPT in 2026 is leaking bookings no Google report will ever show. Add it as your bonus category: five points for a property present on all of it, one for a property that has never heard of any of it.

## Use the Score in Every Agency Conversation

The framework doubles as a procurement tool. Whether you talk to us or anyone else, ask the agency to score your property on these eight categories before they propose, and to show their reasoning per point. A partner who audits before prescribing, names your strengths first, and sequences fixes by revenue impact has told you how they will treat your budget. A partner who proposes a package before scoring anything has told you too.

## What the DIY Version Cannot See

An honest limit: self-audits see symptoms. The full version of this framework looks under the surface at the parts that need tools and practised eyes: whether your conversion tracking actually fires, what your effective OTA commission really is, how your ads account is structured, what the AI assistants currently say when asked about properties like yours, and which of the forty possible points would move revenue first for your specific market. That version takes us a few hours per property and comes back as a scored report with a sequenced fix list, which is exactly how every client engagement we run begins.

## Frequently Asked Questions

### How often should a hotel audit its marketing?

Fully, twice a year, ideally before your two booking seasons. The ninety-day content window means an annual audit misses too much drift.

### Can I run this audit without any paid tools?

The eight categories above, yes: a phone, your own profiles, and honesty cover it. The layers beneath (tracking verification, ad account structure, commission maths) need access and tooling, which is where a professional audit earns its place.

### What should I fix first if I score low everywhere?

Category eight, almost without exception. Every other improvement multiplies through the website and booking path, so a broken path caps the value of fixing anything else.

## Get Your Real Score

Twenty minutes, eight numbers, and you will know more about your marketing than most properties ever bother to learn. And if you want the full version, the one with the tracking checks, the commission maths, and a sequenced plan attached to the score, that is precisely what we build for every property we assess. [Book a discovery call](/contact) and ask for your audit; we will tell you what is working first.`,
};

// ---------------------------------------------------------------------------
// Apply
// ---------------------------------------------------------------------------
const posts = [post20, post21, post22];
const now = Date.now();

for (const p of posts) {
  const body = markdownToPortableText(p.body);
  const tableCount = body.filter((b) => b._type === "comparisonTable").length;
  const emDashes = (p.body.match(/—/g) || []).length;
  const rand = (p.body.match(/\bR\s?\d|ZAR|rand\b/gi) || []).length;
  const deadGa4 = (p.body.match(/ga4-events-vs-key-events-hotels/g) || []).length;
  const doc = {
    _type: "post",
    _id: `post-${p.slug}`,
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    excerpt: p.excerpt,
    body,
    category: p.category,
    author: "Revolution Media",
    publishedAt: p.publishedAt,
  };
  await client.createOrReplace(doc);
  const scheduled = new Date(p.publishedAt).getTime() > now ? " (scheduled, hidden until publish date)" : "";
  console.log(
    `Seeded post-${p.slug} [${p.category}] publishedAt ${p.publishedAt}${scheduled}\n  blocks:${body.length} tables:${tableCount} emDashes:${emDashes} randRefs:${rand} deadGa4Links:${deadGa4}`,
  );
}
console.log("\nDone. Batch 7 seeded (3 posts).");

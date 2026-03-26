/**
 * Seed script: pushes all 7 blog posts into Sanity.
 * Run with: node scripts/seed-blog.mjs
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_READ_TOKEN (must have write permissions)
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

/**
 * Convert markdown text to Sanity Portable Text blocks.
 * Handles headings (h1-h3), paragraphs, bold, italic, and basic structure.
 */
function markdownToPortableText(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let skipFirstH1 = true;

  for (const line of lines) {
    if (line.trim() === "") continue;

    // H3
    if (line.startsWith("### ")) {
      blocks.push({
        _type: "block",
        _key: randomKey(),
        style: "h3",
        markDefs: [],
        children: parseInlineMarks(line.slice(4)),
      });
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      blocks.push({
        _type: "block",
        _key: randomKey(),
        style: "h2",
        markDefs: [],
        children: parseInlineMarks(line.slice(3)),
      });
      continue;
    }

    // H1 (skip the first one — it's the title)
    if (line.startsWith("# ")) {
      if (skipFirstH1) {
        skipFirstH1 = false;
        continue;
      }
      blocks.push({
        _type: "block",
        _key: randomKey(),
        style: "h2",
        markDefs: [],
        children: parseInlineMarks(line.slice(2)),
      });
      continue;
    }

    // Regular paragraph
    blocks.push({
      _type: "block",
      _key: randomKey(),
      style: "normal",
      markDefs: [],
      children: parseInlineMarks(line),
    });
  }

  return blocks;
}

/**
 * Parse inline bold (**text**) and italic (*text*) marks.
 */
function parseInlineMarks(text) {
  const children = [];
  // Match **bold** patterns
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before the bold
    if (match.index > lastIndex) {
      children.push({
        _type: "span",
        _key: randomKey(),
        text: text.slice(lastIndex, match.index),
        marks: [],
      });
    }
    // Bold text
    children.push({
      _type: "span",
      _key: randomKey(),
      text: match[1],
      marks: ["strong"],
    });
    lastIndex = regex.lastIndex;
  }

  // Remaining text after last bold
  if (lastIndex < text.length) {
    children.push({
      _type: "span",
      _key: randomKey(),
      text: text.slice(lastIndex),
      marks: [],
    });
  }

  // If no children were created, add the whole text as a plain span
  if (children.length === 0) {
    children.push({
      _type: "span",
      _key: randomKey(),
      text,
      marks: [],
    });
  }

  return children;
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

// ────────────────────────────────────────────────────────────────
// Blog post data
// ────────────────────────────────────────────────────────────────

const posts = [
  // ── Existing 3 posts ──────────────────────────────────────────
  {
    title: "5 Ways to Reduce OTA Dependency and Keep More Revenue",
    slug: "5-ways-to-reduce-ota-dependency",
    excerpt:
      "Online travel agencies take up to 25% in commission fees. Here are five proven strategies to shift bookings to your direct channels and protect your bottom line.",
    publishedAt: "2026-02-03T08:00:00Z",
    author: "Revolution Media",
    category: "Revenue Strategy",
    content: `# 5 Ways to Reduce OTA Dependency and Keep More Revenue

Online travel agencies like Booking.com, Expedia, and Hotels.com have become a dominant force in the hospitality industry. While they provide undeniable exposure, the cost of that visibility is steep: commission rates ranging from 15% to 25% per booking eat directly into your profit margins. For many independent hotels and boutique properties, OTA dependency is one of the single biggest threats to long-term financial health.

The good news is that reducing your reliance on OTAs does not mean cutting them off entirely. It means building a smarter, more balanced distribution strategy that puts your direct channels front and centre. Here are five proven ways to do exactly that.

## 1. Invest in a High-Converting Direct Booking Website

Your website is the foundation of every direct booking strategy. If it loads slowly, looks outdated, or makes it difficult to complete a reservation, guests will default to the OTA they already trust. A modern hotel website should feature a fast, mobile-first design, professional photography, persuasive copy, and an integrated booking engine that makes the reservation process seamless.

Make sure your booking engine is prominently placed on every page, not buried behind multiple clicks. Include urgency triggers such as limited availability notices and best-rate guarantees to give visitors a compelling reason to book right there and then.

## 2. Run a Best-Rate Guarantee Campaign

One of the most effective ways to shift bookings away from OTAs is to guarantee that the best available rate is always found on your own website. Promote this guarantee across your social media channels, email marketing, and even on physical signage at your property. When guests understand they will never find a cheaper price elsewhere, the psychological barrier to booking direct disappears.

Pair this with an exclusive perk for direct bookers, such as a complimentary drink, a room upgrade, or late checkout. These small touches cost you far less than a 20% OTA commission and create a memorable guest experience at the same time.

## 3. Build a Retargeting Funnel with Paid Ads

Most travellers do not book on their first visit to a hotel website. They browse, compare, and return later, often through an OTA. A well-structured retargeting campaign on Google Display, Meta, and even TikTok can bring those undecided visitors back to your direct booking page before they complete the reservation elsewhere.

Dynamic retargeting ads that display the exact room type or dates a visitor searched for are particularly effective. Combine these with a clear call to action and your best-rate guarantee messaging for maximum impact.

## 4. Leverage Email Marketing and Guest Data

Every guest who has stayed at your property is a potential direct booker for their next visit. Collect email addresses at check-in and through your booking engine, then nurture these contacts with personalised email campaigns. Pre-arrival emails, post-stay thank-you messages, seasonal promotions, and loyalty offers all keep your property top of mind.

Unlike OTA customers (who belong to the platform, not to you), direct bookers become part of your own database. Over time, this asset compounds in value and drastically reduces your cost per acquisition.

## 5. Optimise Your Google Business Profile

When a potential guest searches for your hotel by name, your Google Business Profile is often the first thing they see. An optimised profile with up-to-date photos, accurate contact information, a direct booking link, and strong review scores can intercept the guest before they ever reach an OTA listing.

Encourage satisfied guests to leave Google reviews, respond to every review promptly, and keep your profile active with posts and updates. This is free real estate in the search results. Use it wisely.

## The Bottom Line

Reducing OTA dependency is not an overnight project. It requires consistent investment in your brand, your digital presence, and your guest relationships. But every percentage point you shift from OTA bookings to direct bookings flows straight to your bottom line. Start with one or two of these strategies, measure the results, and scale from there. Your future self (and your accountant) will thank you.`,
  },
  {
    title:
      "Google Ads for Hotels: The Complete Guide to Driving Direct Bookings",
    slug: "google-ads-for-hotels-complete-guide",
    excerpt:
      "A step-by-step breakdown of how hotels can use Google Search, Display, and Performance Max campaigns to capture high-intent travellers and reduce OTA commissions.",
    publishedAt: "2026-02-10T08:00:00Z",
    author: "Revolution Media",
    category: "Paid Advertising",
    content: `# Google Ads for Hotels: The Complete Guide to Driving Direct Bookings

Google is the starting point for the vast majority of travel research. Whether a guest types "boutique hotel in Tel Aviv" or searches your property by name, Google Ads gives you the ability to appear at the very top of the results, above OTAs, above competitors, and above organic listings. For hotels serious about driving direct revenue, a well-managed Google Ads strategy is not optional. It is essential.

This guide breaks down the key campaign types, targeting strategies, and optimisation techniques that hospitality businesses should be using right now.

## Understanding the Campaign Types

### Google Search Ads

Search campaigns target users who are actively looking for accommodation. These are high-intent queries: people ready to compare options and book. Your search campaigns should cover three categories of keywords: branded terms (your hotel name), non-branded terms (destination and category searches), and competitor terms (other hotels in your area).

Branded search campaigns are particularly critical. If you are not bidding on your own hotel name, OTAs will, and they will happily take that booking along with their commission. Protecting your brand in search results is one of the highest-ROI activities in hotel digital marketing.

### Performance Max Campaigns

Performance Max is Google's AI-driven campaign type that serves ads across Search, Display, YouTube, Gmail, and Maps from a single campaign. For hotels, this format is powerful because it reaches potential guests at multiple touchpoints throughout their research journey.

Provide Google with high-quality creative assets (professional property photos, compelling headlines, and strong calls to action), and the algorithm will optimise delivery across channels to maximise conversions. Make sure your conversion tracking is set up correctly so the system can learn which audiences and placements drive actual bookings.

### Google Hotel Ads

Google Hotel Ads display your room rates and availability directly in Google Search and Google Maps. When a traveller searches for your hotel, they can see your direct rate alongside OTA prices in a dedicated booking module. This is one of the most effective tools for competing with OTAs on a level playing field.

To run Hotel Ads, you need a connectivity partner or channel manager that integrates with Google's Hotel Center. The investment is worthwhile; properties that activate Hotel Ads consistently see a measurable shift in direct booking share.

## Targeting and Audience Strategy

Effective hotel advertising goes beyond keywords. Use Google's audience targeting to layer intent signals onto your campaigns. In-market audiences for travel, custom audiences based on competitor URLs, and remarketing lists of past website visitors all allow you to reach the right people at the right time.

Geographic targeting is equally important. Focus your budget on the markets that generate the most bookings for your property. If 40% of your guests come from the United States, allocate your spend accordingly rather than spreading it thin across every country.

## Measuring What Matters

The most important metric for hotel Google Ads is not clicks or impressions; it is cost per acquisition relative to the revenue generated. Track your return on ad spend closely and compare it against OTA commission costs. In most cases, a well-optimised Google Ads campaign will deliver direct bookings at a fraction of the cost of an OTA commission.

Set up proper conversion tracking through Google Tag Manager, integrate your booking engine data, and review performance weekly. Pause underperforming keywords, increase bids on high converters, and continuously test new ad copy.

## Getting Started

If you are new to Google Ads, start with a branded search campaign to protect your hotel name, then expand into non-branded and Performance Max campaigns as you build confidence and data. The key is to start, measure, and iterate. Every direct booking you capture through Google Ads is revenue that stays in your business, not in an OTA's pocket.`,
  },
  {
    title:
      "Why Your Hotel Needs TikTok: A Hospitality Marketing Playbook",
    slug: "why-your-hotel-needs-tiktok",
    excerpt:
      "TikTok is reshaping how travellers discover and choose hotels. Learn how to create content that drives awareness, engagement, and direct bookings for your property.",
    publishedAt: "2026-02-17T08:00:00Z",
    author: "Revolution Media",
    category: "Social Media",
    content: `# Why Your Hotel Needs TikTok: A Hospitality Marketing Playbook

The way travellers discover hotels has fundamentally changed. A growing number of guests, particularly millennials and Gen Z, are now turning to TikTok before Google when researching their next trip. Short-form video content showcasing stunning properties, unique experiences, and behind-the-scenes moments is driving real booking decisions every single day. If your hotel is not on TikTok, you are invisible to an entire generation of high-value travellers.

This is not a trend that is going away. TikTok has over 1.5 billion monthly active users, and travel is consistently one of the top-performing content categories on the platform. Here is how your property can take advantage of it.

## The Power of Discovery

Unlike Instagram or Facebook, where your content is primarily shown to people who already follow you, TikTok's algorithm is designed for discovery. A single well-crafted video can reach hundreds of thousands of viewers who have never heard of your hotel. This makes TikTok one of the most cost-effective awareness channels available to hospitality brands today.

The algorithm rewards engaging content, not follower count. A boutique hotel with 200 followers can outperform a major chain with 200,000 followers if the content resonates with viewers. This levels the playing field in a way that no other social platform does.

## What Content Works for Hotels

The most successful hotel TikTok accounts share content that falls into a few proven categories.

### Room Reveals and Property Tours

Short, visually striking videos that showcase your rooms, common areas, pools, restaurants, and views perform exceptionally well. Use trending audio, smooth transitions, and text overlays to guide the viewer through the experience. The goal is to make someone stop scrolling and think, "I need to stay there."

### Behind the Scenes

Guests love seeing the human side of hospitality. Content showing your team preparing for a VIP arrival, setting up a rooftop dinner, arranging fresh flowers in a suite, or preparing a signature cocktail creates an emotional connection that polished marketing materials cannot replicate. Authenticity is the currency of TikTok.

### Local Area Guides

Position your hotel as the gateway to an unforgettable destination experience. Create short videos highlighting the best restaurants, hidden beaches, cultural landmarks, and activities near your property. This type of content attracts travellers who are still in the research phase and plants your hotel in their consideration set early.

### Guest Reactions and User-Generated Content

Encourage guests to create TikTok content during their stay. Offer a small incentive (a welcome drink, a discount on their next booking) in exchange for tagging your property. Repost the best guest content on your own account. User-generated content carries an authenticity that branded content simply cannot match, and it provides you with a steady stream of material without any production cost.

## Turning Views into Bookings

Awareness is valuable, but the ultimate goal is revenue. Include a clear call to action in your bio linking to your direct booking page. Use TikTok's advertising platform to retarget users who have engaged with your organic content, serving them ads with a direct booking offer. Run seasonal promotions exclusive to your TikTok audience to create urgency and reward engagement.

Track the results by using UTM parameters on your bio link and booking page URLs. Over time, you will build a clear picture of how TikTok activity correlates with website traffic and reservation volume.

## Consistency Is Everything

The biggest mistake hotels make on TikTok is posting a few videos, seeing modest results, and giving up. The algorithm rewards consistency. Commit to posting three to five times per week for at least 90 days before evaluating performance. Batch your content creation (dedicate one morning per week to filming multiple videos) and use a scheduling tool to maintain a steady cadence.

TikTok is not a passing fad for the hospitality industry. It is a fundamental shift in how travellers discover, evaluate, and choose where to stay. The hotels that embrace it now will build audiences, brand equity, and direct booking pipelines that competitors will struggle to replicate later. Start today.`,
  },

  // ── 4 New posts ────────────────────────────────────────────────
  {
    title: "Hotel SEO: How to Rank Higher and Drive More Direct Bookings",
    slug: "hotel-seo-rank-higher-direct-bookings",
    excerpt:
      "Search engine optimisation is the most cost-effective way for hotels to capture high-intent travellers. Learn the key on-page and local SEO strategies that drive direct bookings.",
    publishedAt: "2026-02-24T08:00:00Z",
    author: "Revolution Media",
    category: "SEO",
    content: `# Hotel SEO: How to Rank Higher and Drive More Direct Bookings

Search engine optimisation remains one of the most powerful and cost-effective marketing channels for hotels. Unlike paid advertising, where traffic stops the moment you pause your budget, SEO builds compounding organic visibility that delivers qualified visitors to your website month after month. For independent and boutique properties competing against OTAs with massive advertising budgets, ranking on the first page of Google is not a luxury. It is a necessity.

This guide covers the essential SEO strategies every hotel should implement to attract more direct bookings through organic search.

## Why SEO Matters for Hotels

When a traveller searches for accommodation in your destination, Google returns a mix of OTA listings, map results, and organic website links. Most hotels pay no attention to their organic search presence, which means they cede those valuable positions to OTAs and competitors. Investing in SEO allows you to reclaim visibility in the search results where your potential guests are already looking.

The economics are compelling. A direct booking from an organic search visitor has zero commission cost and zero advertising cost. The only investment is the upfront work of optimising your website and creating quality content. Over time, this delivers one of the lowest cost-per-acquisition rates in hospitality marketing.

## On-Page SEO Essentials

### Optimise Your Page Titles and Meta Descriptions

Every page on your hotel website should have a unique, keyword-rich title tag and a compelling meta description. Your homepage title should include your hotel name, location, and a key differentiator. For example, instead of "Home | Hotel Name" use "Hotel Name | Boutique Beachfront Hotel in Bali | Direct Rates."

Meta descriptions do not directly affect rankings but heavily influence click-through rates. Write descriptions that highlight your unique selling points and include a clear call to action.

### Create Dedicated Landing Pages

Do not rely on a single homepage to rank for all your target keywords. Create individual pages for each room type, your restaurant, your spa, wedding venues, and any other amenities or services your property offers. Each page should target specific search queries that potential guests are using.

For example, a page dedicated to "Rooftop Bar in Cape Town" with quality photos, opening hours, and a menu description can attract local and visiting searchers who may not have been looking for a hotel but discover your property through your venue content.

### Improve Page Speed and Mobile Performance

Google uses page speed as a ranking factor, and most hotel searches now happen on mobile devices. A slow, poorly optimised mobile experience will hurt both your search rankings and your conversion rate. Use compressed images, modern image formats like WebP, and a content delivery network to ensure your site loads in under three seconds on any device.

## Local SEO and Google Business Profile

For hotels, local SEO is arguably the most important category of search optimisation. Your Google Business Profile appears in map results and knowledge panels when potential guests search for accommodation in your area. A fully optimised profile dramatically increases your visibility in these high-intent search results.

Ensure your profile has accurate business information, professional photos, up-to-date room rate links, and a direct booking URL. Post regular updates about events, promotions, and seasonal highlights. Respond to every review, both positive and negative, to signal active engagement.

Encourage guests to leave reviews by sending a polite follow-up email after checkout with a direct link to your Google review page. Review volume and rating quality are among the strongest local ranking signals available.

## Content Marketing and Blog Strategy

A blog is one of the most effective tools for expanding your organic search footprint. By publishing articles about your destination, local events, travel tips, and insider guides, you attract visitors who are in the research and planning phase of their trip. These readers may not be ready to book today, but they are building awareness of your property.

Target long-tail keywords like "best restaurants near [your area]," "things to do in [your destination] in winter," or "how to plan a weekend in [your city]." These queries have lower competition and attract highly relevant traffic.

## Technical SEO Fundamentals

Ensure your website has a clean, crawlable structure with an XML sitemap submitted to Google Search Console. Use proper heading hierarchy (one H1 per page, descriptive H2s and H3s), internal linking between related pages, and descriptive alt text on all images.

Implement structured data markup for hotels, including your address, star rating, price range, and reviews. This can earn rich snippets in search results that make your listing more prominent and clickable.

## The Long-Term Perspective

SEO is not a one-time project. It is an ongoing discipline that compounds over time. The hotels that commit to consistent optimisation, regular content creation, and proactive local SEO management build a durable competitive advantage that paid channels cannot replicate. Start with the fundamentals, measure your progress in Google Search Console, and expand your efforts as you see results.`,
  },
  {
    title:
      "Email Marketing for Hotels: Build Loyalty and Drive Repeat Bookings",
    slug: "email-marketing-hotels-loyalty-repeat-bookings",
    excerpt:
      "Email is the highest-ROI marketing channel in hospitality. Discover how to build your guest database, automate key campaigns, and turn one-time visitors into loyal repeat guests.",
    publishedAt: "2026-03-03T08:00:00Z",
    author: "Revolution Media",
    category: "Email Marketing",
    content: `# Email Marketing for Hotels: Build Loyalty and Drive Repeat Bookings

Email marketing consistently delivers the highest return on investment of any digital marketing channel. For hotels, it is also one of the most underused. While OTAs and social media demand ongoing spend, email allows you to communicate directly with guests who already know and trust your property, at virtually zero marginal cost per message.

The difference between a hotel that sends occasional blast emails and one that runs a strategic email marketing programme is enormous. Here is how to build an email engine that drives repeat bookings, strengthens guest loyalty, and protects your revenue from OTA dependency.

## Building Your Guest Database

Before you can run effective email campaigns, you need a quality subscriber list. The good news is that hotels have natural touchpoints for collecting email addresses that most businesses lack.

Capture emails at every opportunity: during the online booking process, at check-in (digital registration cards make this seamless), through your website with a newsletter signup offering exclusive rates or destination guides, and at your on-property restaurant or spa. Every legitimate email address you collect is a future marketing asset with compounding value.

Segment your database from the start. At minimum, separate guests by booking source (direct versus OTA), stay type (business versus leisure), frequency (first-time versus repeat), and geographic origin. These segments allow you to send relevant, personalised messages rather than generic blasts that end up in spam folders.

## The Essential Email Sequences

### Pre-Arrival Sequence

Send a series of emails between booking and arrival. A confirmation email with booking details and a warm welcome message should go out immediately. Follow up a week before arrival with a personalised guide to your property and destination, including restaurant recommendations, local events, and available add-ons or upgrades. This sequence builds anticipation, reduces pre-arrival anxiety, and generates ancillary revenue from upsells.

### On-Property Engagement

If a guest has opted in, a mid-stay email can enhance their experience and drive on-property spending. Highlight spa offers, dining specials, or activities they may not know about. Keep these brief and helpful, not salesy. The goal is to improve their stay, not overwhelm their inbox.

### Post-Stay Sequence

Your post-stay email sequence is where long-term loyalty is built. Send a thank-you email within 24 hours of checkout, inviting the guest to leave a Google review. Follow up a few weeks later with a personalised offer for a return visit, perhaps a special rate or room upgrade for direct bookers. Add them to your seasonal campaign calendar for ongoing nurture.

### Win-Back Campaigns

Guests who have not returned within 12 to 18 months are at risk of being lost forever. A win-back campaign with a compelling offer and emotional messaging reminding them of their stay can reactivate a meaningful percentage of lapsed guests. These campaigns are low-cost and often deliver surprisingly strong conversion rates.

## Personalisation and Automation

Modern email marketing platforms like Klaviyo, Mailchimp, or ActiveCampaign allow you to automate these sequences entirely. Set up the workflows once, and every guest receives the right message at the right time without any manual effort from your team.

Personalisation goes beyond using the guest's name. Reference their room type, the dates of their stay, the amenities they used, and the destination experiences available during their next potential visit. The more relevant and personal the message feels, the higher the engagement and conversion rate.

## Measuring Email Marketing Performance

Track four core metrics: open rate, click-through rate, conversion rate (bookings generated), and revenue per email sent. Compare your direct booking revenue from email campaigns against the cost of OTA commissions to demonstrate the channel's return on investment.

Monitor list health by watching unsubscribe rates and bounce rates. A small, engaged list is far more valuable than a large, unresponsive one. Remove inactive subscribers regularly to maintain deliverability.

## Getting Started

If you are not currently running a structured email marketing programme, start with the post-stay thank-you email and a seasonal promotion to your existing database. These two campaigns alone can generate meaningful direct booking revenue and establish the foundation for a more sophisticated programme over time.`,
  },
  {
    title:
      "Social Media Strategy for Hotels: Beyond Likes to Direct Revenue",
    slug: "social-media-strategy-hotels-beyond-likes",
    excerpt:
      "Likes and followers do not pay the bills. Learn how to build a social media strategy that drives measurable awareness, engagement, and direct bookings for your hotel.",
    publishedAt: "2026-03-10T08:00:00Z",
    author: "Revolution Media",
    category: "Social Media",
    content: `# Social Media Strategy for Hotels: Beyond Likes to Direct Revenue

Social media has become a cornerstone of hotel marketing, but too many properties measure success by vanity metrics: follower counts, like totals, and reach numbers that look impressive in a monthly report but contribute nothing to the bottom line. A truly effective social media strategy connects every post, story, and reel to a measurable business outcome, whether that is website traffic, direct enquiries, or completed bookings.

Here is how to build a social media strategy that moves beyond likes and into revenue.

## Choosing the Right Platforms

Not every social platform deserves your time and budget. For most hotels, focus on three channels.

**Instagram** remains the most important platform for hospitality brands. Its visual-first format is perfectly suited to showcasing properties, rooms, dining, and destination experiences. Reels and Stories drive discovery, while your feed acts as a curated portfolio that visitors review before booking.

**TikTok** is the fastest-growing discovery platform for travel. Short-form video content has an unmatched ability to reach new audiences who have never heard of your property. Even a small hotel can achieve significant visibility with consistent, authentic content.

**Facebook** still holds value for community building, event promotion, and reaching older demographics. Its advertising platform remains one of the most sophisticated available, making it indispensable for retargeting campaigns.

Focus your organic efforts on Instagram and TikTok, and use Facebook primarily as a paid advertising channel unless your target demographic skews older.

## Content Pillars for Hotels

A consistent content strategy requires defined content pillars: recurring themes that keep your feed varied and purposeful.

### Property Showcase

High-quality photos and videos of your rooms, pool, lobby, restaurant, and grounds. These are the foundation of your feed and the content most directly tied to booking decisions. Invest in professional photography and create short video tours for Reels and TikTok.

### Destination and Experience

Content about the area surrounding your hotel: restaurants, markets, beaches, cultural sites, and activities. This positions your property as the gateway to an unforgettable trip and attracts followers who are researching the destination.

### Behind the Scenes

Authentic, unpolished content showing your team at work: chefs preparing dishes, housekeeping perfecting a room, the front desk welcoming guests. This humanises your brand and builds emotional connection.

### Guest Stories and Social Proof

Repost tagged content from guests, share testimonials, and celebrate milestones like five-star reviews or awards. User-generated content is the most trusted form of marketing and costs nothing to produce.

### Promotions and Offers

Strategic posts about exclusive rates, packages, or seasonal specials with a clear call to action. Keep these to no more than 20% of your content to avoid feeling overly commercial.

## From Engagement to Revenue

The gap between social media activity and actual revenue is where most hotel strategies fail. Bridge this gap with these tactics.

Include a direct booking link in your bio on every platform. Update it regularly to point to seasonal offers or dedicated landing pages.

Use Instagram Stories and TikTok captions to drive traffic with specific calls to action: "Link in bio for exclusive summer rates" or "Book direct and save 15% versus OTA prices."

Run retargeting campaigns on Meta to serve ads to users who have engaged with your organic content. These audiences are warm leads who already know your brand and are significantly more likely to convert.

Track social media traffic through UTM parameters and monitor the booking journey from platform to website to reservation. This data proves the channel's value and informs future content decisions.

## Consistency and Frequency

Post at least four to five times per week across your primary platforms. Use a content calendar to plan two to four weeks ahead and batch your content creation sessions to maximise efficiency. Consistency signals relevance to the algorithm and keeps your property top of mind for followers.

Stories should be daily. Quick, informal updates that show life at the property in real time. These have the highest view rates and keep your profile active between main feed posts.

## Measuring What Matters

Track website clicks from social, direct enquiry messages, booking engine visits attributed to social traffic, and revenue generated from retargeting campaigns. Report on these business metrics alongside engagement rates to paint a complete picture of your social media return on investment.

Stop chasing follower counts and start building a social media presence that directly contributes to your hotel's revenue goals.`,
  },
  {
    title:
      "Content Marketing for Hotels: Attract Guests Before They Start Searching",
    slug: "content-marketing-hotels-attract-guests",
    excerpt:
      "The best hotel marketing reaches travellers before they even start looking for accommodation. Learn how content marketing builds trust, authority, and a pipeline of future guests.",
    publishedAt: "2026-03-17T08:00:00Z",
    author: "Revolution Media",
    category: "Content Marketing",
    content: `# Content Marketing for Hotels: Attract Guests Before They Start Searching

Most hotel marketing focuses on capturing demand: reaching travellers who are already searching for accommodation and competing with OTAs for their booking. Content marketing takes a fundamentally different approach. It creates demand by reaching potential guests before they have even decided to travel, building awareness and trust so that when they are ready to book, your property is already at the top of their consideration set.

This upstream strategy is particularly powerful for independent and boutique hotels that cannot compete with OTA advertising budgets. Here is how to build a content marketing engine that attracts, nurtures, and converts future guests.

## The Content Marketing Advantage

Traditional advertising interrupts. Content marketing attracts. By publishing valuable, relevant content about your destination, travel experiences, and industry expertise, you draw visitors to your website through organic search, social sharing, and direct traffic. These visitors arrive in a mindset of trust and curiosity rather than scepticism toward advertising.

The compounding nature of content marketing is its greatest strength. A well-written blog post can drive traffic for years. A destination guide that ranks on Google delivers new potential guests to your website every single day without any ongoing cost. Over time, your content library becomes one of your most valuable marketing assets.

## Types of Content That Work for Hotels

### Destination Guides

Comprehensive guides to your destination are the highest-value content a hotel can produce. Cover the best restaurants, activities, cultural experiences, seasonal events, and insider tips. These guides rank well in search results for travel research queries and position your hotel as the local authority.

Structure these guides with clear headings, professional photography, and practical information like opening hours and booking links. Update them seasonally to keep the content fresh and accurate.

### Seasonal and Event Content

Publish content tied to specific times of year: "What to Do in [Destination] in December," "Guide to [Local Festival]," or "Best Autumn Experiences Near [Hotel Name]." Seasonal content captures search traffic from travellers planning trips around specific dates and events.

Create these articles in advance to allow time for indexing. A summer travel guide published in March will be ranking by the time travellers start their research in April and May.

### Travel Planning Resources

How-to articles and planning resources attract travellers in the early stages of their journey. Topics like "How to Plan a Week in [Destination]," "First-Timer's Guide to [Country]," or "Travelling with Kids: What to Pack and Where to Stay" cast a wide net and introduce your property to a broad audience.

Include subtle references to your hotel within these guides without making them overtly promotional. A line like "Many guests at [Hotel Name] spend their first morning exploring the nearby waterfront market" feels natural and plants a booking idea without hard selling.

### Visual Content and Video

Written content forms the foundation of your strategy, but visual and video content amplifies its reach. Short destination videos, room tour reels, and photo essays perform well on social media and can be embedded within blog posts to increase time on page and engagement.

Invest in quality photography that showcases both your property and the surrounding area. These images serve double duty across your website, blog, social media, and email campaigns.

## Distribution and Promotion

Creating content is only half the battle. Distribution determines whether anyone sees it.

Share every new piece of content across your social media channels. Repurpose blog posts into Instagram carousel posts, TikTok scripts, and email newsletter features. Submit guest articles to travel publications and destination websites to build backlinks that improve your search rankings.

Email your subscriber list whenever you publish a significant new guide or article. Your existing guests are your most engaged audience and the most likely to share content with friends and family who are planning their own trips.

## Measuring Content Marketing Results

Content marketing is a long-term strategy, and its results should be measured accordingly. Track organic search traffic growth, keyword rankings for target queries, time on page, and the booking journey of content-sourced visitors.

Use Google Analytics to identify which blog posts drive the most traffic and which lead to the highest booking conversion rates. Double down on the content themes and formats that perform best.

The return on content marketing is not always immediate, but it is durable. Hotels that commit to consistent content creation build a sustainable traffic engine that reduces dependency on paid channels and OTA commissions over time.`,
  },
];

// ────────────────────────────────────────────────────────────────
// Seed
// ────────────────────────────────────────────────────────────────

async function seed() {
  console.log("Starting blog seed...\n");

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
      console.log(`  ✓ ${post.title}`);
    } catch (err) {
      console.error(`  ✗ ${post.title}: ${err.message}`);
    }
  }

  console.log("\nDone! All posts seeded to Sanity.");
  console.log("Note: Cover images need to be uploaded via Sanity Studio at /studio.");
}

seed();

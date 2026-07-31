// Single source of truth for the five blog topic categories.
// The `name` is the exact value stored on each Sanity post's `category` field
// (see src/sanity/schemas/post.ts) and shown as the badge label. The `slug`
// powers the /blog/category/[slug] routes and the filter pills.

export interface BlogCategory {
  name: string;
  slug: string;
  intro: string;
  metaDescription: string;
  // The pillar post each intro tells readers to "start with". Its exact phrase
  // in the intro is turned into the first internal link on the category page.
  pillarSlug: string;
  pillarPhrase: string;
}

export const blogCategories: BlogCategory[] = [
  {
    name: "Direct Bookings & Revenue",
    slug: "direct-bookings",
    intro:
      "Every article in this section serves one goal: shifting your booking mix away from 15 to 25% OTA commissions and toward direct reservations you own, then squeezing more revenue from each one. Start with our complete direct booking strategy for lodges and boutique hotels, then work through the OTA economics, the commission maths, and the tactics that lift yield.",
    metaDescription:
      "Guides on direct booking strategy, OTA leakage, booking engine conversion, and hotel yield, from Revolution Media.",
    pillarSlug: "direct-booking-strategy-lodges-boutique-hotels",
    pillarPhrase: "complete direct booking strategy for lodges and boutique hotels",
  },
  {
    name: "Paid Media & Search",
    slug: "paid-media-search",
    intro:
      "Google, Meta, TikTok, and local search put your property in front of travellers at the exact moment they are choosing, provided the right campaigns are funded in the right order. Start with our complete Google Ads guide for hotels, then use the campaign type comparisons and search-visibility guides to build accounts that report in bookings, not clicks.",
    metaDescription:
      "Google Ads, Meta Ads, TikTok Ads, and local SEO guides for hotels: campaigns and search visibility that convert, from Revolution Media.",
    pillarSlug: "google-ads-for-hotels-guide-2026",
    pillarPhrase: "complete Google Ads guide for hotels",
  },
  {
    name: "Social & Content",
    slug: "social-content",
    intro:
      "Content that earns likes is easy. Content that fills rooms is a system, and these guides cover it end to end: video strategy, storytelling, where to publish, how travellers discover you, and how to make every piece bookable. Start with hotel content creation that drives bookings.",
    metaDescription:
      "Video strategy, storytelling, Instagram, and TikTok content: guides for social content that books rooms, from Revolution Media.",
    pillarSlug: "hotel-content-creation-drives-bookings",
    pillarPhrase: "hotel content creation that drives bookings",
  },
  {
    name: "Hospitality Tech",
    slug: "hospitality-tech",
    intro:
      "Your booking engine, PMS, channel manager, and tracking stack decide whether your marketing can convert at all. These guides review the software and cover the integrations behind direct bookings, starting with how to set up a booking engine that drives more direct reservations.",
    metaDescription:
      "Software reviews, channel managers, PMS, and tech stack integrations: the hospitality technology guides behind direct bookings, from Revolution Media.",
    pillarSlug: "booking-engine-setup-direct-reservations",
    pillarPhrase: "how to set up a booking engine that drives more direct reservations",
  },
  {
    name: "Strategy & Measurement",
    slug: "strategy-measurement",
    intro:
      "Strategy decides where your marketing money goes, and measurement proves whether it worked. These guides cover the thinking layer: answer engine optimisation, seasonal planning, ROI, and the analytics that keep every channel and every agency honest. Start with how to measure hotel marketing ROI.",
    metaDescription:
      "AEO, marketing ROI, GA4, and seasonal planning: strategy and measurement guides for hotels, from Revolution Media.",
    pillarSlug: "measure-hotel-marketing-roi",
    pillarPhrase: "how to measure hotel marketing ROI",
  },
];

export const categoryNames = blogCategories.map((c) => c.name);

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}

export function getCategoryByName(name: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.name === name);
}

// Resolve a stored category name to its URL slug. Returns undefined if the name
// is not one of the five (e.g. a legacy value not yet re-tagged).
export function categorySlugForName(name: string | undefined): string | undefined {
  if (!name) return undefined;
  return getCategoryByName(name)?.slug;
}

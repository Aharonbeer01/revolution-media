/**
 * Per-service detail that differentiates each service page from its siblings.
 *
 * The nine service pages were sitting in Search Console as "Discovered, not
 * crawled", the classic signature of templated near-duplicates with thin
 * internal linking. Every page shared the same six headings, carried no
 * FAQPage schema, and three of them had no inbound links from the blog at all.
 *
 * This file adds, per service: a unique opening heading, an explicit
 * "who this is for" line, service-specific FAQs (rendered and emitted as
 * FAQPage JSON-LD), related reading into the blog, and a flag for the boutique
 * safari lodge proof point where it is genuinely relevant.
 *
 * Kept separate from services.ts so the existing service data is untouched.
 */

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  /** Unique H2 for the opening section, replacing the shared "The Challenge". */
  openingHeading: string;
  /** Names the property types this service suits. */
  whoFor: string;
  /** Three to five service-specific FAQs. Also emitted as FAQPage JSON-LD. */
  faqs: ServiceFaq[];
  /** Blog slugs for the related reading block. Must be live posts. */
  relatedPosts: string[];
  /** Show the boutique safari lodge result where the service plausibly drove it. */
  showProofPoint?: boolean;
}

export const serviceDetails: Record<string, ServiceDetail> = {
  "marketing-strategy": {
    openingHeading: "Why Most Hospitality Marketing Never Compounds",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays already spending on marketing without a clear view of what it returns.",
    showProofPoint: true,
    faqs: [
      {
        question: "What does a marketing strategy actually include?",
        answer:
          "A documented plan covering where your bookings come from today, which channels can realistically grow them, what each channel is responsible for, how budget splits between them, and the numbers you will judge it all on. It is the layer above the tactics, and it is what stops every channel being run in isolation.",
      },
      {
        question: "How long before a strategy shows results?",
        answer:
          "Paid channels can move within weeks. Organic search, content and email compound over quarters. A good strategy sequences them deliberately, so the faster channels carry the load while the slower ones build, with review points where you decide to continue, adjust or stop.",
      },
      {
        question: "Do you work with properties that already have an agency?",
        answer:
          "Yes, and strategy work often runs alongside existing suppliers. Part of its job is to make every channel accountable to the same booking numbers, whoever is running it. Where existing spend is working, we will say so plainly rather than recommend replacing it.",
      },
      {
        question: "How do you measure whether the strategy is working?",
        answer:
          "Against booking outcomes rather than reach: direct booking enquiries, booking engine entries, calls and WhatsApp taps, and what it costs to acquire each one, measured against the commission an OTA would have charged for the same guest.",
      },
    ],
    relatedPosts: [
      "measure-hotel-marketing-roi",
      "direct-booking-strategy-lodges-boutique-hotels",
      "best-digital-marketing-agencies-hotels-2026",
    ],
  },

  "google-ads": {
    openingHeading: "Your Own Property Name Is Being Sold to Someone Else",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays losing high-intent searches to OTAs bidding on their own name.",
    showProofPoint: true,
    faqs: [
      {
        question: "Why would I bid on my own property name?",
        answer:
          "Because the OTAs already are. A traveller who searches for you by name is the warmest booking you will ever get, and if an OTA sits above you in that result, you pay commission for a guest who was looking for you specifically. Branded search is the first money most properties should spend on Google.",
      },
      {
        question: "Is ad spend included in your fees?",
        answer:
          "No. Ad spend goes directly to Google from your own account, which you own and keep. Our fees cover strategy, campaign build, creative, management and reporting, and you can see exactly what the platform charged versus what we charged.",
      },
      {
        question: "How quickly do Google Ads produce bookings?",
        answer:
          "Branded campaigns often convert in the first weeks because the demand already exists. Destination and category campaigns take longer, because you are reaching travellers earlier in their planning, and they need enough time in your booking window to come back and convert.",
      },
      {
        question: "Which campaign types actually suit a hotel?",
        answer:
          "Search carries branded defence and destination demand, Performance Max and Demand Gen extend reach once tracking is sound, and Hotel Ads plug into your Google Business Profile. The right mix depends on your booking window and whether your conversion tracking is genuinely firing.",
      },
    ],
    relatedPosts: [
      "google-ads-for-hotels-guide-2026",
      "google-ads-campaign-types-hotels",
      "how-to-reduce-ota-commissions",
    ],
  },

  "meta-ads": {
    openingHeading: "Filling the Weeks the Calendar Forgot",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays with shoulder seasons, midweek gaps, or a quiet month they dread.",
    showProofPoint: true,
    faqs: [
      {
        question: "Do Facebook and Instagram ads still work for hotels?",
        answer:
          "Yes, but for a different job than search. Google captures travellers already looking. Meta creates demand among travellers who were not searching yet, which is exactly what off-peak dates need, and it is the strongest remarketing surface for people who visited your site and did not book.",
      },
      {
        question: "What makes a Meta ad work for a property?",
        answer:
          "Creative that looks like the place rather than like an advert. Real rooms, real light, short vertical video, and an offer tied to specific dates. Polished stock imagery consistently underperforms footage that shows what a guest will actually walk into.",
      },
      {
        question: "Do I need a big content library before running ads?",
        answer:
          "No. A handful of honest, well-shot clips will carry a campaign, and a phone plus a gimbal produces them. What matters far more than volume is that the creative matches the offer and the dates you are trying to fill.",
      },
      {
        question: "How is this tracked back to bookings?",
        answer:
          "Through the Meta pixel and conversions API feeding the same key events as the rest of your stack: booking engine entries, enquiries, calls and WhatsApp taps. Without that, Meta will report reach and engagement, which tells you nothing about revenue.",
      },
    ],
    relatedPosts: [
      "meta-ads-campaign-types-hotels",
      "meta-ads-fill-empty-rooms-off-peak",
      "festive-season-hotel-marketing-playbook",
    ],
  },

  "tiktok-ads": {
    openingHeading: "Where Travellers Now Start Looking for Somewhere to Stay",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays with something visually distinctive and a younger guest to reach.",
    faqs: [
      {
        question: "Is my property right for TikTok?",
        answer:
          "If it has something worth filming, which almost every independent property does, then yes. TikTok rewards distinctiveness rather than polish, so a genuinely unusual room, a view, a ritual or a setting travels further there than it does anywhere else.",
      },
      {
        question: "Do TikTok ads actually produce bookings or just views?",
        answer:
          "Both, if the funnel behind them exists. TikTok excels at discovery, reaching travellers who had never heard of you. Those people rarely book on first sight, so the bookings come when remarketing and a fast booking path pick them up afterwards.",
      },
      {
        question: "How is TikTok different from running Instagram Reels?",
        answer:
          "Reach on TikTok is driven by interest rather than by who already follows you, so a new account can still travel. Instagram tends to serve validation, the profile a guest checks before booking. Most properties need both, doing different jobs.",
      },
      {
        question: "Do we need to appear on camera?",
        answer:
          "No. Plenty of high-performing hospitality content is entirely property and place, with no presenter at all. Where a person does help, a staff member doing their actual job usually outperforms anything scripted.",
      },
    ],
    relatedPosts: [
      "tiktok-marketing-hotels-vs-instagram",
      "hotel-content-creation-drives-bookings",
      "social-media-strategy-hotels-beyond-likes",
    ],
  },

  "social-media-management": {
    openingHeading: "The Feed Guests Check Before They Trust You",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays whose social presence has gone quiet, inconsistent, or off-brand.",
    showProofPoint: true,
    faqs: [
      {
        question: "How often should a property post?",
        answer:
          "A sustainable weekly rhythm beats a burst followed by silence. Consistency matters more than volume, because the feed is most often judged by a traveller checking whether you are still active and whether the place looks like the photos.",
      },
      {
        question: "Who creates the content you post?",
        answer:
          "Either we produce it on location, or we direct your team remotely with shot guides and a calendar and handle the editing and publishing. International properties usually run the second model, which is how we run full programmes for properties thousands of kilometres away.",
      },
      {
        question: "Do you handle comments and messages?",
        answer:
          "Yes. Community management is part of the work, because enquiries increasingly arrive as direct messages rather than through a form, and response speed is often what decides whether that enquiry becomes a booking.",
      },
      {
        question: "What do you report on?",
        answer:
          "Growth and engagement are included, but they are not the headline. The numbers that matter are the actions tied to revenue: link clicks into the booking engine, enquiries, calls and WhatsApp taps generated by social.",
      },
    ],
    relatedPosts: [
      "social-media-strategy-hotels-beyond-likes",
      "hotel-content-creation-drives-bookings",
      "tiktok-marketing-hotels-vs-instagram",
    ],
  },

  "content-creation": {
    openingHeading: "Guests Book With Their Eyes, and Yours Are Out of Date",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays whose real experience is better than the pictures selling it.",
    faqs: [
      {
        question: "Do you shoot internationally?",
        answer:
          "Our film crew shoots on location in South Africa. For properties elsewhere we run the Remote Content System: seasonal content calendars and shot-by-shot filming guides your own team executes on a phone and gimbal, with our creative direction, editing and publishing behind it.",
      },
      {
        question: "How much content does a property actually need?",
        answer:
          "Less than most owners fear, provided it is planned. A well-run shoot day, or a monthly filming block against a shot list, typically produces enough material to carry a content calendar for weeks rather than days.",
      },
      {
        question: "Can our own team film it?",
        answer:
          "Yes, and for many properties that is the better model. A recent phone, a gimbal and a clip-on microphone cover almost everything social needs. What changes the output is not the equipment but having a shot list and someone directing it.",
      },
      {
        question: "Do we keep the footage?",
        answer:
          "Yes. You receive the edited assets in platform-ready formats along with an organised library, and the material is yours to use across your website, ads, email and booking platforms.",
      },
    ],
    relatedPosts: [
      "hotel-content-creation-drives-bookings",
      "phone-filming-kit-hotels-gear-by-budget",
      "content-marketing-hotels-attract-guests",
    ],
  },

  photography: {
    openingHeading: "One Photograph Decides Whether They Keep Scrolling",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays whose imagery is inconsistent, dated, or does not match the stay.",
    faqs: [
      {
        question: "Is photography available outside South Africa?",
        answer:
          "Our photography and film crew shoots on location in South Africa. International properties are covered by the Remote Content System instead, where we direct your own team through detailed shot guides and handle the editing, which keeps a consistent library running year round.",
      },
      {
        question: "How long does a shoot take?",
        answer:
          "It depends on how much of the property needs covering and how much can be shot around guests. Most properties are covered in a half day to two days, planned around the light and the quieter parts of your occupancy calendar.",
      },
      {
        question: "Will the shoot disturb our guests?",
        answer:
          "We plan around occupancy deliberately, working during quieter windows and in spaces that are free, while still capturing the atmosphere of a property in use rather than an empty building.",
      },
      {
        question: "How do we use the images afterwards?",
        answer:
          "They are delivered colour graded and in platform-ready crops for your website, booking platforms, social channels and ads, so the same library feeds every channel instead of each one being solved separately.",
      },
    ],
    relatedPosts: [
      "hotel-content-creation-drives-bookings",
      "phone-filming-kit-hotels-gear-by-budget",
      "content-marketing-hotels-attract-guests",
    ],
  },

  copywriting: {
    openingHeading: "Every Property Says Luxury, Tranquil and Unforgettable",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays whose written voice sounds like every competitor in their market.",
    faqs: [
      {
        question: "What kind of copy do you write for properties?",
        answer:
          "Website and room pages, booking paths, email sequences, ad copy, destination guides and answer pages. The common thread is copy that gives a traveller a concrete reason to choose you rather than adjectives every competitor also uses.",
      },
      {
        question: "Will it still sound like us?",
        answer:
          "That is the point. We work from how you actually describe the place, what your team says to guests, and what returning guests say back, rather than imposing a house style that makes every property read the same.",
      },
      {
        question: "Does copy affect how AI assistants describe our property?",
        answer:
          "Considerably. Assistants assemble answers from published pages, and they favour writing that answers questions directly and carries clear structure. Vague brochure language gives them very little to work with and almost nothing to quote.",
      },
      {
        question: "Can you work with our existing website?",
        answer:
          "Yes. Most of this work replaces the words on pages you already have, which is usually faster and cheaper than a rebuild and frequently moves conversion on its own.",
      },
    ],
    relatedPosts: [
      "content-marketing-hotels-attract-guests",
      "aeo-for-hotels-ai-recommendations",
      "email-marketing-hotels-loyalty-repeat-bookings",
    ],
  },

  "seo-google-business-profile": {
    openingHeading: "The Map Result That Decides Who Gets the Call",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays losing local and near-me searches to OTAs and competitors.",
    showProofPoint: true,
    faqs: [
      {
        question: "Why does Google Business Profile matter so much for a property?",
        answer:
          "Because it is where a large share of local and near-me searches resolve, often without the traveller ever reaching a website. A complete, current profile with real photos, answered reviews and correct details frequently decides who receives the call or the directions tap.",
      },
      {
        question: "How long does SEO take for a hotel?",
        answer:
          "Profile work and on-page fixes can move within weeks. Content and authority build over quarters. It is the slowest channel to mature and the last to decay, which is why it belongs alongside paid rather than instead of it.",
      },
      {
        question: "Do reviews affect search visibility?",
        answer:
          "Yes, and increasingly they affect what AI assistants say about you too. Volume, recency and whether you actually respond all feed the picture, which is why review responses are part of the work rather than an afterthought.",
      },
      {
        question: "Is this the same as being found by ChatGPT and other assistants?",
        answer:
          "Related but not identical. Assistants assemble answers from published pages and consistent entity details, so the same groundwork helps, but being cited in AI answers also depends on structured content and whether your site permits those crawlers at all.",
      },
    ],
    relatedPosts: [
      "aeo-for-hotels-ai-recommendations",
      "google-search-console-platform-properties-hotels",
      "direct-booking-strategy-lodges-boutique-hotels",
    ],
  },

  "email-marketing": {
    openingHeading: "The Cheapest Booking You Will Ever Win",
    whoFor:
      "Built for lodges, boutique hotels, and unique stays sitting on a guest list they have never really used.",
    showProofPoint: true,
    faqs: [
      {
        question: "Is our list too small to bother with?",
        answer:
          "Almost certainly not. A few hundred past guests is a genuine revenue asset, because they have stayed, they opted in, and one good return offer to them routinely outperforms far more expensive cold advertising.",
      },
      {
        question: "What should be automated first?",
        answer:
          "Booking confirmation, the post-stay thank you with a review request, and a return offer some weeks after checkout. Those three alone start the repeat-booking flywheel, and the abandoned booking email is usually the highest-converting message a property sends.",
      },
      {
        question: "How do we collect addresses when OTAs withhold them?",
        answer:
          "Through the touchpoints you control: the booking engine opt-in, digital check-in registration, the WiFi portal, a genuinely useful destination guide, and spa or restaurant bookings. Consent and easy unsubscribe are built in from the start.",
      },
      {
        question: "How often should we email past guests?",
        answer:
          "Automations run on each guest's own timeline, so they take care of themselves. For campaigns, a small number of well-made sends each quarter keeps the list warm without training people to ignore you.",
      },
    ],
    relatedPosts: [
      "email-marketing-hotels-loyalty-repeat-bookings",
      "booking-engine-setup-direct-reservations",
      "festive-season-hotel-marketing-playbook",
    ],
  },
};

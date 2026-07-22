import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { AdvancedOtaCalculator } from "@/components/sections/AdvancedOtaCalculator";
import { SITE_URL } from "@/lib/constants";

const PAGE_PATH = "/tools/ota-commission-calculator";

export const metadata: Metadata = {
  title: "Free Hotel OTA Commission Calculator",
  description:
    "Calculate how much your hotel or lodge pays Booking.com, Expedia, Agoda and other OTAs in commission every year. Adjust for currency, region, platform mix and payout delays. A free tool for hospitality operators.",
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: "Free Hotel OTA Commission Calculator | Revolution Media",
    description:
      "See how much your property hands to third-party booking platforms every year, and what that budget could do reinvested into direct bookings.",
    url: `${SITE_URL}${PAGE_PATH}`,
    type: "website",
  },
};

export default function OtaCommissionCalculatorPage() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Hotel OTA Commission Calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}${PAGE_PATH}`,
    description:
      "A free calculator that estimates how much a hotel or lodge pays in OTA commission each year, based on rooms, average nightly rate, occupancy, platform mix, region, currency and payout terms.",
    featureList: [
      "Multi-currency reporting",
      "Regional commission adjustments",
      "Per-platform booking mix",
      "Premium placement surcharge modelling",
      "Average payout delay and cash-in-pipeline estimate",
      "Direct-booking shift savings scenario",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "Revolution Media Agency",
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "OTA Commission Calculator",
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Hero
        size="medium"
        eyebrow="Free Tool"
        title="Hotel OTA Commission Calculator"
        subtitle="See exactly how much you hand to Booking.com, Expedia, Agoda and other platforms every year, and what that budget could do if you won those guests directly."
        primaryCTA={{ label: "Get a Direct-Booking Plan", href: "/contact" }}
      />

      {/* How commission leakage works */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
                How OTA Commission Leakage Works
              </h2>
              <p className="mt-6 leading-relaxed text-midnight/70">
                Online Travel Agencies bring you bookings, but every reservation
                they send carries a commission, typically between 15% and 25% of
                the room rate. On paper that feels like a fair cost of
                acquisition. In practice, it compounds. The more nights you sell
                through OTAs, the larger the slice of your revenue that leaves
                the business, and the less control you keep over pricing, guest
                data and the relationship itself.
              </p>
              <p className="mt-4 leading-relaxed text-midnight/70">
                The calculator below turns that abstract percentage into a real
                annual figure for your property. Set your currency and region,
                choose the platforms you sell through, and adjust your OTA share,
                visibility programmes and payout terms. It also shows the cash
                tied up waiting for OTA payouts and how much you could save by
                shifting a portion of those bookings direct. Most operators are
                surprised by how much a single year of commission adds up to, and
                by how much of it could be redirected into marketing that drives
                direct bookings instead.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* The calculator itself */}
      <AdvancedOtaCalculator />

      <CTABanner
        variant="dark"
        title="Turn That Commission Into Direct Bookings"
        subtitle="Book a discovery call and we'll show you how to reinvest OTA spend into a direct-booking engine for your property."
      />
    </>
  );
}

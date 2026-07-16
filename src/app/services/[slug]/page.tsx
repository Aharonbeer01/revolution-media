import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/lib/services";
import type { Service } from "@/types/service";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.title,
    description: service.shortDescription,
    alternates: {
      canonical: `/services/${slug}`,
    },
  };
}

function getHeroCopy(heroDescription: string) {
  const periodIndex = heroDescription.indexOf(".");
  if (periodIndex !== -1 && periodIndex < heroDescription.length - 1) {
    return {
      title: heroDescription.slice(0, periodIndex + 1),
      subtitle: heroDescription.slice(periodIndex + 2),
    };
  }
  return { title: heroDescription, subtitle: "" };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service: Service | undefined = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const { title, subtitle } = getHeroCopy(service.heroDescription);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    serviceType: service.title,
    url: `${SITE_URL}/services/${slug}`,
    areaServed: service.isLocationRestricted ? "South Africa" : "Worldwide",
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
        name: "Services",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `${SITE_URL}/services/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* ---- Hero ---- */}
      <Hero
        size="medium"
        eyebrow={service.title}
        title={title}
        subtitle={subtitle}
        primaryCTA={{ label: "Get in Touch", href: "/contact" }}
      />

      {/* Location-restricted badge (rendered below hero) */}
      {service.isLocationRestricted && (
        <div className="bg-midnight pb-6">
          <Container>
            <Badge variant="gold">South Africa Only</Badge>
          </Container>
        </div>
      )}

      {/* ---- The Challenge ---- */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
              The Challenge
            </h2>
            <p className="mt-6 max-w-3xl leading-relaxed text-midnight/70">
              {service.challenge}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ---- Our Approach ---- */}
      <section className="bg-soft-white pb-16 sm:pb-20">
        <Container>
          <FadeIn>
            <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
              Our Approach
            </h2>
          </FadeIn>

          <ul className="mt-8 space-y-4">
            {service.approach.map((item, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <li className="flex items-start gap-3">
                  {/* Gold check icon */}
                  <svg
                    className="mt-1 h-5 w-5 flex-shrink-0 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="leading-relaxed text-midnight/70">
                    {item}
                  </span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---- What's Included ---- */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
              What&apos;s Included
            </h2>
          </FadeIn>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.includes.map((item, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <div className="flex items-start gap-3 rounded-lg bg-warm-white p-4 shadow-sm">
                  {/* Checkmark icon */}
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm leading-relaxed text-midnight/80">
                    {item}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- CTA ---- */}
      <CTABanner
        variant="dark"
        title="Ready to Get Started?"
        subtitle="Book a discovery call and let's build a marketing engine for your property."
      />
    </>
  );
}

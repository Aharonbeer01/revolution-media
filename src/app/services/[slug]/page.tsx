import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/lib/services";
import type { Service } from "@/types/service";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { Badge } from "@/components/ui/Badge";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { RelatedCaseStudies } from "@/components/sections/RelatedCaseStudies";
import { RemoteContentSystem } from "@/components/sections/RemoteContentSystem";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { serviceDetails } from "@/lib/service-details";
import { sanityClient } from "@/sanity/client";
import { POSTS_BY_SLUGS_QUERY } from "@/sanity/queries";
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
  const detail = serviceDetails[slug];

  // Related reading. The query filters publishedAt <= now(), so scheduled posts
  // never surface here, and we re-order to match the curated list.
  const relatedPosts: { title: string; slug: string; excerpt: string }[] =
    detail?.relatedPosts?.length
      ? await sanityClient
          .fetch(POSTS_BY_SLUGS_QUERY, { slugs: detail.relatedPosts })
          .then((rows: { title: string; slug: string; excerpt: string }[]) =>
            detail.relatedPosts
              .map((s) => rows.find((r) => r.slug === s))
              .filter(Boolean) as { title: string; slug: string; excerpt: string }[],
          )
      : [];

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

  const faqSchema = detail?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: detail.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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
              {detail?.openingHeading ?? "The Challenge"}
            </h2>
            {detail?.whoFor && (
              <p className="mt-4 max-w-3xl text-sm font-semibold text-gold-deep">
                {detail.whoFor}
              </p>
            )}
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

      {/* ---- Remote Content System (content-creation only) ---- */}
      {slug === "content-creation" && <RemoteContentSystem />}

      {/* ---- Proof point ---- */}
      {detail?.showProofPoint && (
        <section className="bg-midnight py-14 sm:py-16">
          <Container>
            <FadeIn>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
                  Proof
                </p>
                <p className="mt-4 text-2xl font-bold leading-snug text-soft-white sm:text-3xl">
                  A boutique safari lodge went from 90% OTA reliance to more than
                  80% direct bookings.
                </p>
                <p className="mt-4 text-soft-white/70">
                  Built on the same approach we would apply to your property.
                </p>
                <a
                  href="/case-studies/boutique-safari-lodge"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold underline underline-offset-4 hover:text-gold-deep"
                >
                  Read the full case study
                </a>
              </div>
            </FadeIn>
          </Container>
        </section>
      )}

      {/* ---- Service FAQs ---- */}
      {detail?.faqs && detail.faqs.length > 0 && (
        <section className="bg-soft-white py-16 sm:py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <FadeIn>
                <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
                  {service.title} Questions
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="mt-8">
                  <FaqAccordion items={detail.faqs} />
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>
      )}

      {/* ---- Related reading ---- */}
      {relatedPosts.length > 0 && (
        <section className="bg-cream py-16 sm:py-20">
          <Container>
            <FadeIn>
              <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
                Related Reading
              </h2>
              <p className="mt-3 max-w-2xl text-midnight/70">
                Deeper guides on {service.title.toLowerCase()} from our blog.
              </p>
            </FadeIn>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedPosts.map((post, index) => (
                <FadeIn key={post.slug} delay={index * 0.08}>
                  <a
                    href={`/blog/${post.slug}`}
                    className="flex h-full flex-col rounded-lg bg-warm-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <h3 className="text-base font-semibold leading-snug text-midnight">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-midnight/60">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-gold">
                      Read the guide
                    </span>
                  </a>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ---- Related Services ---- */}
      {service.relatedSlugs && service.relatedSlugs.length > 0 && (
        <RelatedServices slugs={service.relatedSlugs} />
      )}

      {/* ---- Proof: related case studies ---- */}
      {service.relatedCaseStudies && service.relatedCaseStudies.length > 0 && (
        <RelatedCaseStudies
          slugs={service.relatedCaseStudies}
          heading="See It In Action"
        />
      )}

      {/* ---- CTA ---- */}
      <CTABanner
        variant="dark"
        title="Ready to Get Started?"
        subtitle="Book a discovery call and let's build a marketing engine for your property."
      />
    </>
  );
}

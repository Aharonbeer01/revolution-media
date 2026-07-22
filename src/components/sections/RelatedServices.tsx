import Link from "next/link";
import { services } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

interface RelatedServicesProps {
  slugs: string[];
  heading?: string;
  variant?: "light" | "dark";
}

// Renders a curated set of related service links. Used on service and case
// study detail pages to strengthen internal linking between related topics.
export function RelatedServices({
  slugs,
  heading = "Related Services",
  variant = "light",
}: RelatedServicesProps) {
  const items = slugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  if (items.length === 0) return null;

  const isDark = variant === "dark";

  return (
    <section className={isDark ? "bg-midnight py-16 sm:py-20" : "bg-cream py-16 sm:py-20"}>
      <Container>
        <FadeIn>
          <h2
            className={`text-3xl font-bold sm:text-4xl ${
              isDark ? "text-soft-white" : "text-midnight"
            }`}
          >
            {heading}
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => (
            <FadeIn key={service.slug} delay={index * 0.05}>
              <Link
                href={`/services/${service.slug}`}
                className="group block h-full rounded-lg bg-warm-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <ServiceIcon slug={service.icon} className="h-8 w-8 text-gold" />
                <h3 className="mt-4 text-lg font-semibold text-midnight transition-colors group-hover:text-gold">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-midnight/60">
                  {service.shortDescription}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-gold">
                  Learn more
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

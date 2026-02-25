import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface CTABannerProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  variant?: "dark" | "gold";
}

export function CTABanner({
  title,
  subtitle,
  ctaLabel = "Book a Discovery Call",
  ctaHref = "/contact",
  variant = "dark",
}: CTABannerProps) {
  const bgClass = variant === "gold" ? "bg-gold" : "bg-midnight";
  const titleColor = variant === "gold" ? "text-midnight" : "text-soft-white";
  const subtitleColor =
    variant === "gold" ? "text-midnight/70" : "text-soft-white/60";
  const buttonVariant = variant === "gold" ? "dark" : "primary";

  return (
    <section className={`${bgClass} py-16 sm:py-20`}>
      <Container className="text-center">
        <h2 className={`text-3xl font-bold sm:text-4xl ${titleColor}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`mx-auto mt-4 max-w-xl text-lg ${subtitleColor}`}>
            {subtitle}
          </p>
        )}
        <div className="mt-8">
          <Button href={ctaHref} variant={buttonVariant}>
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}

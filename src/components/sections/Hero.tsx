"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  size?: "full" | "medium" | "small";
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  size = "full",
}: HeroProps) {
  const heights = {
    full: "min-h-[85vh]",
    medium: "min-h-[60vh]",
    small: "min-h-[45vh]",
  };

  return (
    <section
      className={`relative flex items-center ${heights[size]} bg-midnight dark-texture`}
    >
      <Container className="relative z-10 py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-gold"
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-soft-white sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 max-w-xl text-lg text-soft-white/70"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button href={primaryCTA.href} variant="primary" data-track="hero_cta_primary">
              {primaryCTA.label}
            </Button>
            {secondaryCTA && (
              <Button href={secondaryCTA.href} variant="secondary" data-track="hero_cta_secondary">
                {secondaryCTA.label}
              </Button>
            )}
          </motion.div>
        </div>
      </Container>

      {/* Decorative gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
}

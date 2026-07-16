import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/sections/Hero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { FeaturedCaseStudy } from "@/components/sections/FeaturedCaseStudy";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";
import { sanityClient } from "@/sanity/client";
import { ALL_POSTS_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const revalidate = 3600;

export default async function HomePage() {
  const allPosts: any[] = await sanityClient.fetch(ALL_POSTS_QUERY);
  const featuredPosts = allPosts.slice(0, 3);

  return (
    <>
      {/* --- Hero --- */}
      <Hero
        eyebrow="DIGITAL MARKETING FOR HOSPITALITY"
        title="More Guests. Fewer Commissions."
        subtitle="We help independent hospitality businesses drive direct bookings, strengthen their brand, and reduce dependency on OTAs, so more revenue stays where it belongs."
        primaryCTA={{ label: "Book a Discovery Call", href: "/contact" }}
        secondaryCTA={{ label: "See Our Work", href: "/case-studies" }}
      />

      {/* --- Knife Twist — Pain Points --- */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
              SOUND FAMILIAR?
            </p>
            <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold text-midnight sm:text-4xl">
              Your Revenue Is Leaking, and You Already Know It
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-warm-gray">
              If any of these feel familiar, you&apos;re not alone. Most hospitality businesses face the same challenges, and keep paying the price.
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "OTAs Are Eating Your Margins",
                description:
                  "Third-party booking platforms take 15–25% of every reservation. That's revenue you earned, paid to a middleman.",
                iconPath: "M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
              },
              {
                title: "Inconsistent Online Presence",
                description:
                  "Outdated photos, inactive social media, unanswered Google reviews. Guests scroll past, straight to your competitors.",
                iconPath: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
              },
              {
                title: "Ad Spend with No Clear Return",
                description:
                  "You've boosted posts or tried Google Ads, but with no strategy behind it the budget disappears and bookings don't follow.",
                iconPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
              },
              {
                title: "Dependency on Third Parties",
                description:
                  "When OTAs change their algorithm or policies, your occupancy takes the hit. You don't own the guest relationship.",
                iconPath: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182",
              },
              {
                title: "No Time to Market Properly",
                description:
                  "You're running a property, not a marketing agency. Content creation, campaigns, and strategy keep falling to the bottom of the list.",
                iconPath: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
              },
              {
                title: "No Data, No Direction",
                description:
                  "Without proper tracking and reporting, you're making decisions in the dark. You can't improve what you can't measure.",
                iconPath: "M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z",
              },
            ].map((pain, index) => (
              <FadeIn key={pain.title} delay={index * 0.08}>
                <div className="rounded-lg border border-midnight/10 bg-white p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gold-deep">
                      <path strokeLinecap="round" strokeLinejoin="round" d={pain.iconPath} />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-midnight">
                    {pain.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-gray">
                    {pain.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-12 text-center">
              <p className="text-lg font-semibold text-midnight">
                We built Revolution Media to solve exactly this.
              </p>
              <div className="mt-6">
                <Button href="/contact" variant="primary">
                  Let&apos;s Fix This Together
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- Positioning Statement --- */}
      <section className="bg-cream py-16 sm:py-20">
        <Container className="text-center">
          <FadeIn>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
              WHO WE ARE
            </p>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-midnight sm:text-4xl">
              Where Strategy Meets Hospitality
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-warm-gray">
              Revolution Media is a specialist digital marketing agency built
              exclusively for travel and hospitality businesses. From boutique
              hotels to luxury resorts, we combine deep industry knowledge with
              performance-driven strategy to turn visibility into direct
              bookings: no guesswork, no generic playbooks.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/about" variant="primary">
                Learn About Us
              </Button>
              <Button href="/services" variant="secondary">
                View Our Services
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- Services --- */}
      <ServiceGrid limit={6} />

      {/* --- Featured Case Study --- */}
      <FeaturedCaseStudy />

      {/* --- Testimonials --- */}
      <Testimonials />

      {/* --- Featured Blog Posts --- */}
      {featuredPosts.length > 0 && (
        <section className="bg-soft-white py-16 sm:py-20">
          <Container>
            <FadeIn>
              <div className="text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
                  INSIGHTS
                </p>
                <h2 className="mx-auto max-w-2xl text-3xl font-bold text-midnight sm:text-4xl">
                  From the Blog
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-warm-gray">
                  Practical hospitality marketing strategies to help your
                  property compete and drive more direct bookings.
                </p>
              </div>
            </FadeIn>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {featuredPosts.map((post: any, index: number) => (
                <FadeIn key={post._id} delay={index * 0.1}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block overflow-hidden rounded-lg bg-warm-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    {post.coverImage?.asset && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <Image
                          src={urlFor(post.coverImage)
                            .width(600)
                            .height(338)
                            .auto("format")
                            .url()}
                          alt={post.coverImage.alt || post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}

                    <div className="p-5">
                      <Badge>{post.category}</Badge>

                      <h3 className="mt-3 text-lg font-semibold text-midnight transition-colors duration-200 group-hover:text-gold">
                        {post.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-midnight/60">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.3}>
              <div className="mt-10 text-center">
                <Button href="/blog" variant="secondary">
                  View All Articles
                </Button>
              </div>
            </FadeIn>
          </Container>
        </section>
      )}

      {/* --- Referral Program CTA --- */}
      <section className="bg-cream py-16 sm:py-20">
        <Container className="text-center">
          <FadeIn>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
              REFERRAL AMBASSADOR PROGRAM
            </p>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-midnight sm:text-4xl">
              Know a Property That Needs Better Marketing?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-warm-gray">
              Earn a 15% commission for every hospitality business you refer to
              Revolution Media. It&apos;s simple: refer, we close, you get paid.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/referral-program" variant="primary">
                Refer &amp; Earn 15%
              </Button>
              <Button href="/ambassador" variant="ghost">
                Ambassador Login
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- Final CTA Banner --- */}
      <CTABanner
        variant="gold"
        title="Ready to Reduce Your OTA Dependency?"
        subtitle="Let's build a direct-booking engine tailored to your property."
      />
    </>
  );
}

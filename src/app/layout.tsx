import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { GoogleTagManager, GoogleTagManagerNoScript, AhrefsAnalytics } from "@/components/analytics/GoogleAnalytics";
import { PreferredSourceScript } from "@/components/seo/PreferredSourceButton";
import { SITE_URL } from "@/lib/constants";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Revolution Media Agency | Digital Marketing for Hotels & Hospitality",
    template: "%s | Revolution Media Agency",
  },
  description:
    "Drive direct bookings and reduce OTA commissions. Revolution Media is a specialist digital marketing agency for travel & hospitality brands worldwide.",
  keywords: [
    "hospitality marketing",
    "hotel marketing",
    "direct bookings",
    "OTA commissions",
    "digital marketing agency",
    "travel marketing",
  ],
  authors: [{ name: "Revolution Media Agency" }],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Revolution Media Blog Feed" },
      ],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Revolution Media Agency",
    url: SITE_URL,
    title: "Revolution Media Agency | Digital Marketing for Hotels & Hospitality",
    description:
      "Drive direct bookings and reduce OTA commissions. Revolution Media is a specialist digital marketing agency for travel & hospitality brands worldwide.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        {/* Warm up the connection to Google Tag Manager / Analytics so the
            deferred analytics scripts load faster once they fire. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://analytics.ahrefs.com" />
        <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />
        {/* Warm up the connection for the Google Preferred Sources library
            (loaded once, site-wide, via PreferredSourceScript below). */}
        <link rel="preconnect" href="https://news.google.com" />
        <link rel="dns-prefetch" href="https://news.google.com" />
      </head>
      <body className="antialiased">
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <AhrefsAnalytics />
        <PreferredSourceScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Revolution Media Agency",
              description:
                "Specialist digital marketing agency for travel and hospitality businesses. We drive direct bookings and reduce OTA dependency.",
              url: SITE_URL,
              email: "info@revolutionmedia.agency",
              areaServed: "Worldwide",
              serviceType: [
                "Digital Marketing",
                "Google Ads Management",
                "Social Media Marketing",
                "SEO",
                "Content Creation",
                "Hotel Marketing",
              ],
              knowsAbout: [
                {
                  "@type": "Thing",
                  name: "Online travel agency",
                  sameAs: "https://en.wikipedia.org/wiki/Online_travel_agency",
                },
                {
                  "@type": "Thing",
                  name: "Search engine optimization",
                  sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization",
                },
                {
                  "@type": "Thing",
                  name: "Pay-per-click",
                  sameAs: "https://en.wikipedia.org/wiki/Pay-per-click",
                },
                {
                  "@type": "Thing",
                  name: "Revenue management",
                  sameAs: "https://en.wikipedia.org/wiki/Revenue_management",
                },
                "Hospitality digital marketing",
                "Hotel direct bookings",
                "OTA commission reduction",
                "Travel and tourism marketing",
              ],
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-midnight focus:font-semibold"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

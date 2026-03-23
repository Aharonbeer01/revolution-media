import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/GoogleAnalytics";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Revolution Media Agency",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased">
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Revolution Media Agency",
              description:
                "Specialist digital marketing agency for travel and hospitality businesses. We drive direct bookings and reduce OTA dependency.",
              url: "https://revolutionmedia.agency",
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
      </body>
    </html>
  );
}

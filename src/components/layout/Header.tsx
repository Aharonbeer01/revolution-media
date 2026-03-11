"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/packages" },
  { label: "Revolution Motion", href: "/revolution-motion" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-soft-white shadow-lg"
            : "bg-soft-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo variant="gold" />

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-midnight/70 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button href="/ambassador" variant="secondary" className="text-xs">
              Ambassador Login
            </Button>
            <Button href="/contact" variant="primary" className="text-xs">
              Book a Discovery Call
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center text-midnight lg:hidden"
            aria-label="Open menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}

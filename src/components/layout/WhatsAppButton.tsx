"use client";

import { useEffect, useState } from "react";

// TODO: Replace the placeholder number before deploy. International format,
// digits only, no plus/spaces/dashes (e.g. South African: 27821234567).
const WHATSAPP_NUMBER = "YOUR-WHATSAPP-NUMBER";
const PREFILLED_MESSAGE =
  "Hi Revolution Media, I would like to chat about marketing for my property.";

const HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  PREFILLED_MESSAGE,
)}`;

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Appear after a short delay or a small scroll so it does not compete
    // with the hero on first paint.
    const timer = setTimeout(() => setVisible(true), 1500);
    const onScroll = () => {
      if (window.scrollY > 80) setVisible(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 flex items-center rounded-full bg-[#25D366] p-3 text-white shadow-lg outline-none transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:bottom-6 sm:right-6 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 32 32"
        width="26"
        height="26"
        fill="currentColor"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.257.59 4.46 1.71 6.402L3.2 28.8l6.57-1.723a12.74 12.74 0 0 0 6.234 1.588h.005c7.066 0 12.796-5.73 12.796-12.8 0-3.42-1.332-6.635-3.75-9.053A12.71 12.71 0 0 0 16.004 3.2zm0 23.02h-.004a10.63 10.63 0 0 1-5.417-1.483l-.389-.231-4.028 1.056 1.075-3.926-.253-.403a10.6 10.6 0 0 1-1.626-5.65c0-5.872 4.78-10.65 10.654-10.65 2.846 0 5.52 1.11 7.53 3.122a10.58 10.58 0 0 1 3.12 7.535c0 5.873-4.779 10.653-10.649 10.653zm5.84-7.977c-.32-.16-1.893-.934-2.186-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.573-1.588-.951-.848-1.593-1.895-1.78-2.215-.187-.32-.02-.493.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.735-.986-2.375-.26-.624-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.669 0 1.574 1.146 3.095 1.306 3.308.16.213 2.253 3.44 5.46 4.824.763.33 1.358.527 1.822.674.766.244 1.463.21 2.014.127.614-.092 1.893-.774 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
      </svg>
      {/* Desktop: label expands on hover/focus. Mobile (touch): icon only. */}
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[140px] group-hover:pl-2 group-hover:opacity-100 group-focus-visible:max-w-[140px] group-focus-visible:pl-2 group-focus-visible:opacity-100 sm:inline">
        Chat with us
      </span>
    </a>
  );
}

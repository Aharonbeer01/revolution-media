import Script from "next/script";

/**
 * Google "Add to Preferred Sources" button.
 *
 * Renders Google's standard button element. The publisher.js library (loaded
 * once site-wide via PreferredSourceScript) scans the DOM for this attribute
 * and hydrates it with Google's own button UI. We deliberately do not restyle
 * the button itself: Google's styling is intentional for trust signalling.
 *
 * Docs: https://developers.google.com/search/docs/appearance/preferred-sources
 */

/**
 * Loads Google's publisher.js once, site-wide. Uses afterInteractive so the
 * library runs AFTER React hydrates: it injects an iframe into each button
 * element, and doing that before hydration would cause a hydration mismatch.
 * Still async and loaded a single time. Rendered once in the root layout.
 */
export function PreferredSourceScript() {
  return (
    <Script
      id="google-preferred-source"
      src="https://news.google.com/swg/js/v1/publisher.js"
      strategy="afterInteractive"
    />
  );
}

// Google's custom boolean attribute is not part of the standard HTML attribute
// typings, so it is injected via a spread object.
const preferredSourceAttrs: Record<string, string> = {
  "google-add-preferred-source-btn": "",
  "data-theme": "dark",
};

interface PreferredSourceButtonProps {
  /** Optional label rendered above the button, in the site body font. */
  label?: string;
  /** Extra classes for the outer wrapper (e.g. spacing tweaks per placement). */
  className?: string;
}

export function PreferredSourceButton({
  label,
  className = "",
}: PreferredSourceButtonProps) {
  return (
    <div className={className}>
      {label ? (
        <p className="mb-3 text-sm font-medium text-midnight/70">{label}</p>
      ) : null}
      {/* Google injects its button (an iframe) here after hydration. The
          min-height reserves the button's rendered height (~60px) up front so
          the injection causes no layout shift (protects CLS). We only reserve
          space; we do not restyle Google's button. suppressHydrationWarning
          guards against any race where the iframe is injected before React
          finishes hydrating this node. */}
      <div
        {...preferredSourceAttrs}
        suppressHydrationWarning
        className="min-h-[60px]"
      />
    </div>
  );
}

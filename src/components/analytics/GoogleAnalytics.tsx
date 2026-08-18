import Script from "next/script";

const GTM_ID = "GTM-PBJB87C6";

// GA4 (G-0E82RYW396) fires as a tag inside this GTM container, so we only load
// GTM here. Loading a separate gtag.js would double-count GA4 and ship
// duplicate script weight.
export function GoogleTagManager() {
  return (
    <Script id="google-tag-manager" strategy="lazyOnload">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

export function GoogleTagManagerNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

const AHREFS_KEY = "TsIr6sRN3rYZLtge9eWV9Q";

// Ahrefs Web Analytics. Loaded lazily so it never blocks page rendering.
export function AhrefsAnalytics() {
  return (
    <Script
      id="ahrefs-analytics"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={AHREFS_KEY}
      strategy="lazyOnload"
    />
  );
}

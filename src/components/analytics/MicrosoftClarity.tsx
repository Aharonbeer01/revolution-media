import Script from "next/script";

const CLARITY_PROJECT_ID = "yidnqamvoe";

/**
 * Microsoft Clarity: free session recordings and heatmaps.
 *
 * Loaded afterInteractive so it never blocks rendering and runs once React has
 * hydrated. Clarity complements GA4 rather than replacing it: GA4 counts what
 * happened, Clarity shows why.
 */
export function MicrosoftClarity() {
  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
    </Script>
  );
}

# Revolution Media Agency — Project Notes

Marketing site for revolutionmedia.agency. Next.js (App Router) + Sanity CMS, deployed on Vercel.

## Canonical domain
- Canonical is **non-www**: `https://revolutionmedia.agency`
- `www` 308-redirects to non-www (set in Vercel Domains).
- `SITE_URL` in `src/lib/constants.ts` is the source of truth.

## Blog content requirements (MANDATORY)
Every blog post we write and publish must include:
- **At least 3 hyperlinks** to other pages on this website (internal links).
- **At least 2 CTAs** linked to pages on this website.

This is for SEO (internal linking / crawl depth) and conversion. Do not publish a post that doesn't meet both minimums.

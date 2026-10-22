#!/usr/bin/env bash
# Daily crawlability and SEO health check for revolutionmedia.agency.
#
# Two problems this site hit went unnoticed for weeks because nothing was
# watching: a Cloudflare WAF rule silently returning 403 to Googlebot and
# bingbot for 17 days, and production builds failing for a week. This script
# checks the live site the way search and AI crawlers see it and exits non-zero
# on any failure, so the scheduled workflow fails and GitHub emails the owner.
#
# Run locally:  bash scripts/site-health-check.sh
#
# Caveat: checks spoof crawler user agents from a non-Google IP. If Cloudflare
# ever starts challenging unverified "Googlebot" traffic, this will report a
# failure even though real Googlebot is fine. Treat that as a prompt to look,
# not proof of a block; confirm with URL Inspection in Search Console.

set -u
SITE="https://revolutionmedia.agency"
FAILURES=0
CHECKS=0

UA_GOOGLE="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
UA_BING="Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
UA_BROWSER="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
UA_OAI="Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)"
UA_CLAUDE="Mozilla/5.0 (compatible; Claude-SearchBot/1.0; +claudebot@anthropic.com)"
UA_PPLX="Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"

pass() { CHECKS=$((CHECKS + 1)); }
fail() { CHECKS=$((CHECKS + 1)); FAILURES=$((FAILURES + 1)); echo "  FAIL  $1"; }
code() { curl -s -o /dev/null --max-time 30 -w '%{http_code}' -A "$1" "$2"; }

expect_code() { # ua label url expected
  local got; got=$(code "$1" "$3")
  if [ "$got" = "$4" ]; then pass; else fail "$2 $3 returned $got, expected $4"; fi
}

echo "== Crawler access (catches firewall and bot-rule blocks) =="
for path in / /sitemap.xml /packages /services/google-ads /blog/how-to-reduce-ota-commissions; do
  expect_code "$UA_GOOGLE"  "Googlebot" "$SITE$path" 200
  expect_code "$UA_BING"    "bingbot"   "$SITE$path" 200
  expect_code "$UA_BROWSER" "browser"   "$SITE$path" 200
done
for pair in "OAI-SearchBot|$UA_OAI" "Claude-SearchBot|$UA_CLAUDE" "PerplexityBot|$UA_PPLX"; do
  expect_code "${pair#*|}" "${pair%%|*}" "$SITE/" 200
done

echo "== robots.txt =="
ROBOTS=$(curl -s --max-time 30 "$SITE/robots.txt")
if echo "$ROBOTS" | grep -q "BEGIN Cloudflare Managed"; then fail "Cloudflare managed robots.txt block is back (AI Crawl Control > Signals)"; else pass; fi
if echo "$ROBOTS" | grep -q "Content-Signal"; then pass; else fail "robots.txt lost its Content-Signal lines"; fi
if echo "$ROBOTS" | grep -q "Sitemap: $SITE/sitemap.xml"; then pass; else fail "robots.txt no longer declares the sitemap"; fi

echo "== Sitemap =="
SITEMAP=$(curl -s --max-time 30 -A "$UA_GOOGLE" "$SITE/sitemap.xml")
BLOG_COUNT=$(echo "$SITEMAP" | grep -cE "<loc>$SITE/blog/[a-z0-9-]+</loc>")
if [ "$BLOG_COUNT" -ge 15 ]; then pass; else fail "sitemap lists only $BLOG_COUNT blog posts (expected 15+)"; fi
if echo "$SITEMAP" | grep -q "<loc>https://www\."; then fail "sitemap contains www URLs"; else pass; fi

echo "== Every sitemap URL reachable as Googlebot =="
for url in $(echo "$SITEMAP" | grep -oE "<loc>[^<]+</loc>" | sed 's/<\/*loc>//g'); do
  expect_code "$UA_GOOGLE" "Googlebot" "$url" 200
done

echo "== Retired URLs still permanently redirect =="
for pair in \
  "google-ads-for-hotels-complete-guide|google-ads-for-hotels-guide-2026" \
  "5-ways-to-reduce-ota-dependency|how-to-reduce-ota-commissions" \
  "why-your-hotel-needs-tiktok|tiktok-marketing-hotels-vs-instagram" \
  "hotel-seo-rank-higher-direct-bookings|aeo-for-hotels-ai-recommendations"; do
  from="${pair%%|*}"; to="${pair#*|}"
  res=$(curl -s -o /dev/null --max-time 30 -w '%{http_code} %{redirect_url}' -A "$UA_GOOGLE" "$SITE/blog/$from")
  if [ "$res" = "308 $SITE/blog/$to" ] || [ "$res" = "301 $SITE/blog/$to" ]; then pass; else fail "/blog/$from -> '$res', expected permanent redirect to /blog/$to"; fi
done
res=$(curl -s -o /dev/null --max-time 30 -w '%{http_code} %{redirect_url}' "https://www.revolutionmedia.agency/")
if [ "$res" = "308 $SITE/" ] || [ "$res" = "301 $SITE/" ]; then pass; else fail "www root -> '$res', expected one-hop permanent redirect to $SITE/"; fi

echo "== Tracking still installed =="
HOME_HTML=$(curl -s --max-time 30 -A "$UA_BROWSER" "$SITE/")
for id in G-0E82RYW396 GTM-PBJB87C6 yidnqamvoe; do
  if echo "$HOME_HTML" | grep -q "$id"; then pass; else fail "homepage is missing tracking id $id"; fi
done

echo ""
echo "$CHECKS checks, $FAILURES failed."
[ "$FAILURES" -eq 0 ] || exit 1

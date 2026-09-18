# Ship-ready checklist

Mark each item PASS, FAIL, or N/A. Items tagged [C] are critical and block launch.

## 1. Secrets and auth
- [ ] [C] No API keys, tokens, or connection strings in source, build output, or git history (`scripts/audit.sh` runs gitleaks if installed)
- [ ] [C] Every `NEXT_PUBLIC_*` / `VITE_*` / client-exposed env var is safe to be public. Anon keys yes, service keys never
- [ ] [C] `.env*` files are gitignored; `.env.example` exists with placeholders only
- [ ] [C] Every page, server action, and route handler that reads protected data checks the session itself (data-access layer). Middleware/proxy redirects are a convenience, not the boundary
- [ ] Sessions use httpOnly, Secure, SameSite cookies; no tokens in localStorage
- [ ] Database has row-level security or equivalent on every table with user data
- [ ] Password reset, login, and signup flows rate limited

## 2. Security headers and transport
- [ ] [C] HTTPS enforced, HTTP redirects to HTTPS
- [ ] Strict-Transport-Security with max-age of at least one year
- [ ] Content-Security-Policy set (start report-only, tighten, then enforce)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY or CSP frame-ancestors
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy denies camera, microphone, geolocation unless used
- [ ] securityheaders.com grade A after deploy

## 3. Input, forms, dependencies
- [ ] [C] Every form validated server-side, not only in the browser
- [ ] Spam protection on public forms (Turnstile, hCaptcha, or honeypot plus rate limit)
- [ ] User-supplied content escaped or sanitised before render; no `dangerouslySetInnerHTML` with untrusted input
- [ ] File uploads restricted by type and size, stored outside the web root or in object storage
- [ ] [C] `npm audit` shows no high or critical vulnerabilities
- [ ] Lockfile committed; Dependabot or Renovate enabled
- [ ] No abandoned or unused dependencies (`npx depcheck`)

## 4. Data and compliance
- [ ] Data inventory written: what personal data, where stored, which vendors, which countries (see `references/compliance.md`)
- [ ] Privacy policy and terms published and linked in footer
- [ ] Consent manager blocks analytics and marketing scripts until consent is given
- [ ] [C] Card data never touches your server. Redirect-style hosted checkout keeps you in the lightest PCI tier; embedded iframe checkouts need the vendor's written confirmation of script protection (see compliance.md)
- [ ] Retention: form submissions, logs, and uploads have a deletion schedule
- [ ] Contact form states what happens to the submission

## 5. Performance
- [ ] Lighthouse mobile: Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+
- [ ] LCP under 2.5s, INP under 200ms, CLS under 0.1 on a throttled mobile profile
- [ ] Images: modern format, explicit dimensions, lazy below fold, hero preloaded
- [ ] Fonts: self-hosted or `font-display: swap`, subset, two families max
- [ ] Heavy widgets (maps, carousels, charts, editors) loaded dynamically
- [ ] Bundle inspected; no library imported for one function
- [ ] Caching and CDN verified for static assets
- [ ] Tested on a real mid-range Android over a slow connection

## 6. Accessibility
- [ ] Full keyboard navigation with visible focus states and a skip link
- [ ] Text contrast at least 4.5:1, large text 3:1
- [ ] One `h1` per page, heading order logical, landmarks used (`main`, `nav`, `footer`)
- [ ] Every form input has a label; errors are associated and announced
- [ ] Meaningful images have alt text; decorative images have empty alt
- [ ] `prefers-reduced-motion` respected
- [ ] axe DevTools: zero critical or serious issues
- [ ] One pass with a screen reader on the main flow

## 7. SEO and sharing
- [ ] Unique title and meta description per page
- [ ] Canonical URL set; no duplicate content across trailing-slash or www variants
- [ ] Open Graph and Twitter card tags with a real 1200x630 image
- [ ] `robots.txt` and `sitemap.xml` generated and submitted to Search Console
- [ ] JSON-LD structured data for Organization or LocalBusiness plus page type
- [ ] Custom 404 and 500 pages
- [ ] No orphan pages; internal links use descriptive text

## 8. Design and content
- [ ] Not default AI aesthetics: no generic gradients, three-icon feature grids, or placeholder copy
- [ ] Consistent type scale, spacing scale, radius, and shadow tokens
- [ ] Real content and real images; no lorem ipsum, no obvious stock
- [ ] Checked at 320, 768, 1024, 1440, and ultrawide; long words and names wrap cleanly
- [ ] Hover, focus, loading, empty, and error states designed
- [ ] Favicon, app icons, and theme colour set
- [ ] Print stylesheet does not break

## 9. Ops and handoff
- [ ] Error monitoring (Sentry or similar) and uptime monitoring live
- [ ] Analytics installed behind consent
- [ ] Preview, staging, and production environments separated
- [ ] Database backups scheduled and one restore tested
- [ ] Domain, DNS, SSL, and hosting ownership documented; client is not accidentally locked in
- [ ] README covers deploy, env vars, and where content lives
- [ ] Email deliverability: SPF, DKIM, DMARC set for any sending domain

## 10. Final QA
- [ ] Every link clicked, every form submitted end to end
- [ ] Chrome, Safari, Firefox, and Safari on a real iPhone
- [ ] Someone who did not build it uses the site for five minutes unassisted
- [ ] AUDIT.md written and shared with the client

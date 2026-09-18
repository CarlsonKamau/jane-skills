---
title: The checklist, explained
description: Every section of CHECKLIST.md with what it means, why it matters, how to check it, and how to fix it.
sidebar:
  order: 4
---

Items tagged **[C]** are critical and block launch. The full machine-readable list is `skills/ship-ready-web/CHECKLIST.md`; this page is the human commentary.

## 1. Secrets and auth

**What**: keys, tokens, passwords, and the code that decides who can see what.

**Why first**: every other section can be fixed after launch. A leaked service key or an open admin page cannot be un-leaked.

**How to check**
- `bash scripts/audit.sh` scans for known key shapes and committed `.env` files.
- `gitleaks detect --redact` scans git history, which the script cannot.
- Search the built client bundle for anything that looks like a key: `grep -r "eyJ" .next/static` is crude but effective.
- Open every protected page and route handler. Is there a session check inside it, or only in middleware?

**How to fix**
- Committed secret: remove it from the file, then rotate the key at the provider. Removing from git history (`git filter-repo`) is optional cleanup; rotation is mandatory.
- `NEXT_PUBLIC_` on a server key: rename without the prefix, move usage to a route handler or server component.
- Auth only in middleware: add `await requireUser()` (from `lib/auth-guard.ts`) at the top of every protected page, action, and handler.
- Tokens in localStorage: switch to httpOnly cookies set by the server.
- Supabase: enable Row Level Security on every table and write a policy for each. With RLS on, the anon key is safe to be public.

## 2. Security headers and transport

**What**: instructions your server sends the browser with every page.

**Why**: they cost nothing and shut down whole classes of attack: clickjacking, MIME sniffing, protocol downgrade, and (with CSP) most cross-site scripting.

**How to check**: securityheaders.com after deploy; `curl -I https://yoursite.com` locally.

**How to fix**: copy `headers()` from the adapter's `next.config.mjs`. Start CSP in report-only mode, watch the browser console for a week, add the domains you actually need, then rename the header to enforce it. HSTS `preload` is a commitment; only add it once every subdomain is HTTPS.

## 3. Input, forms, dependencies

**What**: everything that enters your system from outside.

**Why**: forms are the front door for spam, injection, and abuse. Dependencies are code you did not write running with your permissions; the @tanstack/react-router compromise in 2026 and event-stream before it were both supply chain attacks on ordinary packages.

**How to check**: submit the form with garbage, oversized input, and HTML tags; watch what lands in the database. `npm audit`, `npx depcheck`.

**How to fix**: validate on the server (zod is fine, plain checks are fine), cap lengths, add a honeypot field and Cloudflare Turnstile, rate limit by IP. Escape anything you render back. Pin dependencies with a lockfile, enable Dependabot, delete what `depcheck` says is unused.

## 4. Data and compliance

**What**: what personal data you collect, where it goes, and whether the law allows it.

**Why**: fines are real, but the bigger reason is that a client who gets a data subject access request or a breach will look to the agency that built the site. See the compliance guide for scoping.

**How to check**: fill in the data inventory in `references/compliance.md`. If you cannot answer "which countries is this data stored in", you are not done.

**How to fix**: privacy policy written for the real data flows; consent manager that actually blocks scripts; hosted checkout for payments; retention schedule; DPAs with vendors.

## 5. Performance

**What**: how fast the site loads and responds, measured on a phone, not your laptop.

**Why**: Google ranks on Core Web Vitals. Every extra second of load costs conversions. In markets where most traffic is mid-range Android over mobile data, a 2 MB JavaScript bundle is a broken site.

**Targets**: LCP under 2.5s, INP under 200ms, CLS under 0.1. Lighthouse mobile 90+.

**How to check**: Chrome DevTools Lighthouse with Mobile selected; PageSpeed Insights for field data; WebPageTest with a 3G profile.

**How to fix, in order of payoff**: images (format, size, lazy, `priority` on hero), fonts (self-host, subset, swap), JavaScript (server components, dynamic import for heavy widgets, delete unused libraries), caching (Vercel handles static assets; check API responses have cache headers where appropriate).

## 6. Accessibility

**What**: can someone using a keyboard, a screen reader, or with low vision use the site.

**Why**: it is the law in a growing list of places (ADA, EAA since June 2025, Kenya's PWD Act), it overlaps almost entirely with good SEO, and AI-generated designs fail it constantly on contrast and labels.

**How to check**: axe DevTools extension; unplug your mouse and try to complete the main flow; turn on VoiceOver (Mac) or NVDA (Windows) for five minutes.

**How to fix**: one `h1`, logical heading order, `label` on every input, `alt` on meaningful images, visible focus ring (do not `outline: none` without a replacement), contrast 4.5:1, `prefers-reduced-motion` media query around animations.

## 7. SEO and sharing

**What**: can search engines and social platforms understand and display the site.

**Why**: the site exists to be found. Missing OG images mean every shared link looks broken on WhatsApp, which in Kenya is where most links are shared.

**How to check**: view source for title, description, canonical, OG tags; `/robots.txt` and `/sitemap.xml` load; Google's Rich Results Test for structured data; share a link to yourself on WhatsApp.

**How to fix**: the adapter's `layout-metadata.ts`, `robots.ts`, `sitemap.ts`, and `JsonLd.tsx`. A real 1200x630 `og.jpg`. Submit the sitemap in Search Console.

## 8. Design and content

**What**: does it look like a real business made it, and does it work at every size.

**Why**: AI defaults (Inter, purple gradient, three-icon feature grid, "Unlock your potential") signal "template" to every visitor. Real photos and real copy convert; placeholders do not.

**How to check**: resize the browser from 320px to ultrawide; search the code for "lorem"; look at it with fresh eyes the next morning.

**How to fix**: a type scale and spacing scale as CSS variables; a real photographer or the client's own photos; copy written for the customer, not the search engine; designed empty, loading, and error states.

## 9. Ops and handoff

**What**: what happens after launch.

**Why**: the site will break at 2am on a Saturday. The question is whether anyone finds out, and whether the client can get help without you.

**How to fix**: Sentry (free tier is fine), an uptime monitor, database backups with one restore actually tested, a README with deploy steps and env vars, and a document listing who owns each account.

## 10. Final QA

**What**: the last human pass.

**Why**: the script checks what scripts can check. It cannot click every link or notice that the contact form's confirmation email lands in spam.

**How**: click everything, submit everything, check email deliverability (SPF, DKIM, DMARC via mxtoolbox.com), test on real Safari on a real iPhone, and watch someone unfamiliar use it.

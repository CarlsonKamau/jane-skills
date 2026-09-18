---
title: Next.js adapter
description: What each adapter file does, where it goes, and how to customise it.
sidebar:
  order: 6
---

The adapter lives in `skills/ship-ready-web/adapters/nextjs/`. It targets Next.js 16 App Router. For Next.js 13 to 15, rename `proxy.ts` to `middleware.ts` and the exported function to `middleware`; everything else is the same.

## Install into a project

```bash
SKILL=~/.claude/skills/ship-ready-web/adapters/nextjs
cp $SKILL/next.config.mjs $SKILL/proxy.ts ./
cp $SKILL/.env.example ./
mkdir -p lib app && cp $SKILL/lib/auth-guard.ts lib/
cp $SKILL/app/*.ts $SKILL/app/*.tsx app/
```

If you already have a `next.config.mjs`, copy the `headers()` function and the `poweredByHeader: false` line into it rather than replacing the file.

## next.config.mjs

Sets seven security headers on every route and disables the `X-Powered-By` header.

The CSP ships as `Content-Security-Policy-Report-Only`. Deploy, open the site, watch the browser console. Every "Refused to load" message is a domain you either need to add to the policy or a script you should remove. When the console is clean for a normal session, rename the key to `Content-Security-Policy`.

Common additions:
- Google Analytics / Tag Manager: `script-src` add `https://www.googletagmanager.com`; `connect-src` add `https://www.google-analytics.com`
- Cloudflare Turnstile: `script-src` and `frame-src` add `https://challenges.cloudflare.com`
- YouTube embeds: `frame-src` add `https://www.youtube-nocookie.com`
- Google Fonts (prefer self-hosting via `next/font`): `style-src` add `https://fonts.googleapis.com`, `font-src` add `https://fonts.gstatic.com`

`'unsafe-inline'` in `script-src` is there because Next.js injects inline scripts. Removing it requires a nonce-based CSP generated in `proxy.ts` per request; see the expert notes.

## proxy.ts and lib/auth-guard.ts

Two files because they do two different jobs.

`proxy.ts` runs before routing and redirects anonymous visitors away from `/admin` and `/dashboard` to `/login`. It is a convenience: users get a clean redirect instead of an error. It is not the security boundary. In March 2025, CVE-2025-29927 allowed any request with a crafted `x-middleware-subrequest` header to skip Next.js middleware entirely, and every app whose only auth check lived there was exposed.

`lib/auth-guard.ts` exports `requireUser()`. It runs inside the request that reads the data, which cannot be skipped. Call it at the top of every protected server component, server action, and route handler:

```ts
export default async function AdminPage() {
  const user = await requireUser({ role: "admin" });
  // safe to read admin data now
}
```

Replace the `getSession()` stub with your provider's server-side call (Supabase `auth.getUser()`, NextAuth `auth()`, Clerk `auth()`).

## .env.example

Documents every env var with a placeholder and marks which are public. The rule it encodes: anything prefixed `NEXT_PUBLIC_` is compiled into the JavaScript sent to browsers. Only put values there that are safe for the whole internet to read. Supabase anon keys are designed for this (with RLS on); service role keys, Resend keys, and Turnstile secrets are not.

## app/layout-metadata.ts

Spread `baseMetadata` into your root layout:

```ts
import { baseMetadata, baseViewport } from "./layout-metadata";
export const metadata = { ...baseMetadata };
export const viewport = baseViewport;
```

Per-page files export their own `metadata` with `title` and `description`; the `template` in the base turns "About" into "About | Site Name".

Add `/public/og.jpg` at 1200x630. Without it, shared links show no preview.

## app/robots.ts and app/sitemap.ts

Generate `/robots.txt` and `/sitemap.xml`. Add your static routes to the `routes` array in `sitemap.ts`; for CMS content, fetch the slugs and map them in. Submit the sitemap URL in Google Search Console after deploy.

## app/JsonLd.tsx

Renders structured data. Use `Organization` or `LocalBusiness` (or a subtype like `Bakery`, `TravelAgency`) in the root layout, and page-specific types (`Article`, `Product`, `Event`) on those pages. Validate at search.google.com/test/rich-results.

The component uses `dangerouslySetInnerHTML` because that is the only way to emit a `<script type="application/ld+json">` block from React. It is safe because the data is a literal object you wrote, with `<` escaped. Never pass user-supplied content into it.

## What the adapter deliberately leaves out

- A consent manager. They are opinionated and client-specific; the checklist requires one but the adapter does not pick one.
- Nonce-based CSP. See expert notes.
- Rate limiting. Depends on hosting; Vercel's WAF, Upstash, or a simple in-memory limiter for low-traffic sites.

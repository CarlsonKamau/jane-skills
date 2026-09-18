---
title: Case study, Mama Njeri Bakery
description: A deliberately broken demo site, audited before and after, with the actual script output.
sidebar:
  order: 8
---

`examples/broken-site/` is a small Next.js site for a fictional bakery, written the way AI tools often write them. `examples/fixed-site/` is the same site after the skill's workflow. Both are in the repo so you can run the audit yourself.

## What was wrong

Fourteen problems were planted. Each one is something we have actually seen in AI-generated client work.

| # | Problem | Section | Severity |
|---|---|---|---|
| 1 | `.env` committed to git with a service key inside | 1 | Critical |
| 2 | Supabase URL and key hardcoded in `lib-supabase.ts` | 1 | Critical |
| 3 | `NEXT_PUBLIC_SUPABASE_SERVICE_KEY` shipped to the browser | 1 | Critical |
| 4 | `/admin` page fetches all orders client-side with no auth | 1 | Critical |
| 5 | Login stores the token in `localStorage` | 1 | Critical |
| 6 | Contact API inserts the raw request body into the database | 3 | Critical |
| 7 | Reviews rendered with `dangerouslySetInnerHTML` from user content (stored XSS) | 3 | Critical |
| 8 | No security headers, `X-Powered-By` on | 2 | High |
| 9 | No lockfile; `moment` and `lodash` installed and unused | 3 | High |
| 10 | Plain `<img>` with no `alt`, no dimensions, no priority | 5, 6 | High |
| 11 | `h2` before `h1` | 6, 7 | Medium |
| 12 | Form inputs with placeholders but no labels | 6 | Medium |
| 13 | No metadata, robots, sitemap, 404, OG image, favicon | 7 | Medium |
| 14 | No `.env.example`, `.gitignore` missing `.env` | 9 | Medium |

## Audit output, before

```
[1] Env files
  FAIL  an .env file is tracked by git
  WARN  .gitignore does not ignore .env*
  WARN  no .env.example
[2] Secret patterns in source
  PASS  no high-confidence secret patterns
  WARN  hardcoded JWT-shaped strings (anon keys belong in env, service keys never in client code):
        ./.env:2
        ./.env:3
        ./lib-supabase.ts:5
[3] Client-exposed env vars
  FAIL  public env vars with secret-like names:
        NEXT_PUBLIC_SUPABASE_SERVICE_KEY
[4] Dependencies
  FAIL  no lockfile
[5] Next.js config
  FAIL  no headers() in next.config.mjs
  FAIL  HSTS missing
  WARN  no CSP
  WARN  poweredByHeader not disabled
  WARN  no proxy.ts or middleware.ts
  WARN  no server-side session check found in app/
  WARN  no app/robots.ts
  WARN  no app/sitemap.ts
  WARN  no app/not-found.tsx
[6] Risky code patterns
  WARN  dangerouslySetInnerHTML used in: ./app/page.tsx
  FAIL  token stored in localStorage
[7] Public assets
  WARN  no public/og.jpg
  WARN  no favicon
RESULT: critical failures found
```

Six FAILs, thirteen WARNs. Note what the script did and did not catch: it flagged the committed `.env`, the public service key, the localStorage token, and the missing headers. It did not catch the unauthenticated admin page directly (it warned that no session check exists in `app/`), the raw insert in the contact route, or the stored XSS. Those needed the checklist walk, which is the point of having both.

## What was changed

- Deleted `.env` from the repo, added `.env.example`, fixed `.gitignore`. In a real project the keys would be rotated at Supabase; deleting the file does not undo the leak.
- `lib-supabase.ts` reads from env; only the anon key is ever client-side.
- `/admin` became a server component that calls `requireUser({ role: "staff" })` before reading orders, through a server-side client.
- Login no longer touches `localStorage`; the server sets an httpOnly cookie.
- Contact route validates and length-caps every field, checks a honeypot, and inserts only known columns.
- Reviews render as text inside `blockquote`, no HTML.
- Adapter applied: `next.config.mjs` headers, `proxy.ts`, `robots.ts`, `sitemap.ts`, `JsonLd.tsx`, `layout-metadata.ts`, `not-found.tsx`.
- `next/image` with `alt`, dimensions and `priority`; `h1` before `h2`; labels on inputs.
- `moment` and `lodash` removed; `next` and `@supabase/supabase-js` moved to patched releases so `npm audit` is clean, and a real lockfile committed.
- OG image and favicon added.

## Audit output, after

```
[1] Env files
  PASS  no .env files tracked
  PASS  .env ignored
  PASS  .env.example present
[2] Secret patterns in source
  PASS  no high-confidence secret patterns
  PASS  no hardcoded JWTs
[3] Client-exposed env vars
  PASS  no suspicious public env names
[4] Dependencies
  PASS  lockfile present
  PASS  npm audit: no high/critical
[5] Next.js config
  PASS  headers() defined
  PASS  HSTS set
  PASS  CSP present
  PASS  X-Powered-By disabled
  PASS  proxy/middleware present
  PASS  server-side session checks found in app code
  PASS  robots
  PASS  sitemap
  PASS  custom 404
[6] Risky code patterns
  WARN  dangerouslySetInnerHTML used in: ./app/JsonLd.tsx  (verify input is trusted)
  PASS  no tokens in localStorage
[7] Public assets
  PASS  OG image
  PASS  favicon
RESULT: no critical failures
```

Zero FAILs. The one WARN is the JSON-LD helper, which is expected and documented. Section 1 shows PASS only when the site is inside a git repository; outside one the script prints SKIP.

## What the case study taught us about the tool

While building it, a placeholder lockfile initially passed `npm audit` with "found 0 vulnerabilities", because an empty lockfile has nothing to audit. The script now fails a lockfile with no resolved packages. That is the kind of false pass a checklist exists to catch, and it was caught by writing a test case rather than by reading the code.

## Try it

```bash
cd examples/broken-site
bash ../../skills/ship-ready-web/scripts/audit.sh
cd ../fixed-site
bash ../../skills/ship-ready-web/scripts/audit.sh
```

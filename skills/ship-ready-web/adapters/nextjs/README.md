# Next.js adapter

Copy into a Next.js App Router project. Tested conventions: Next.js 16. For 13 to 15, rename `proxy.ts` to `middleware.ts` and the export to `middleware`.

| File | Where | What it does |
|---|---|---|
| `next.config.mjs` | project root | Security headers, CSP in report-only, image formats, no `X-Powered-By` |
| `proxy.ts` | project root | Redirects unauthenticated users away from `/admin` and `/dashboard` (convenience layer) |
| `lib/auth-guard.ts` | `lib/` | `requireUser()`: the actual security check, called in every protected page and route handler |
| `.env.example` | project root | Documents which env vars are public vs server-only |
| `app/layout-metadata.ts` | `app/` | Base metadata, OG, Twitter, canonical, icons |
| `app/robots.ts` | `app/` | robots.txt |
| `app/sitemap.ts` | `app/` | sitemap.xml |
| `app/JsonLd.tsx` | `app/` | Structured data helper |

Why two auth files? Next.js middleware/proxy runs before routing and has been bypassed before (CVE-2025-29927). Treat it as a redirect helper. `requireUser()` runs inside the request that reads the data, which is where the check has to be.

After deploy: check securityheaders.com, then move the CSP from report-only to enforced once the console is clean.

Also add: `/public/og.jpg` (1200x630), `app/not-found.tsx`, `app/error.tsx`.

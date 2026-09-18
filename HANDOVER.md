# HANDOVER: ship-ready-web

Read this first. It is the full context for continuing the project in Claude Code. Written 18 September 2026 after a chat session that built everything in this repo without network access, so some things are built but untested (see "Not yet verified").

## What this project is

A Claude Code skill plus checklist, adapter, audit script, docs, case study, and docs website that audits and hardens AI-built websites before handoff. Owner: Carl, The Causality Agency, Nairobi. Private repo for now, opening later. Stack for v1: framework-agnostic core with a Next.js 16 adapter. Docs site hosts on Vercel.

## Working rules (do not skip)

1. Never use em dashes anywhere: code comments, docs, commit messages, replies.
2. When auditing anything, take your time. Verify claims against sources, test rather than assume, and report what was checked and what was not.
3. Ask before touching payments, personal data flows, third-party vendors, or legal text. Never assume.
4. Never print, log, or commit a secret. The audit script prints `file:line`, never values. Keep it that way.
5. `skills/ship-ready-web/SKILL.md` stays under 400 words. Detail goes in CHECKLIST.md, references/, adapters/, docs/.
6. Surgical diffs. Do not rewrite files wholesale.
7. Success criteria over instructions, in the skill and in your own work.

## Repo map

```
skills/ship-ready-web/      the skill (SKILL.md, CHECKLIST.md, references/compliance.md, adapters/nextjs/, scripts/audit.sh)
docs/                       10 markdown pages + assets/workflow.svg; source of truth for the website
examples/broken-site/       demo Next.js site with 14 planted problems (fake credentials, intentional)
examples/fixed-site/        same site after the workflow
examples/*-audit-*.txt      real audit.sh output before and after
site/                       Astro Starlight docs site; sync-docs copies ../docs into it; deploys to Vercel with root dir = site
.github/workflows/audit.yml regression CI: gitleaks, fixed-site must pass, broken-site must fail
.gitleaks.toml              allowlists the demo folder only
CLAUDE.md                   repo conventions for agents
SECURITY.md, LICENSE (MIT)
```

## What is done

- Skill drafted and packaged; SKILL.md at 392 words.
- Checklist: 10 sections, ~70 items, critical items tagged [C].
- Compliance reference verified against primary sources in September 2026 (ODPC thresholds, PCI SAQ A r1 and FAQ 1588, Next.js 16 proxy rename and CVE-2025-29927).
- Next.js adapter: next.config.mjs headers (CSP report-only), proxy.ts, lib/auth-guard.ts, .env.example, app/layout-metadata.ts, robots.ts, sitemap.ts, JsonLd.tsx.
- audit.sh tested against broken-site (exit 1, 6 FAIL) and fixed-site (exit 0, zero FAIL).
- Docs written for beginners through experts.
- Docs site scaffolded (Starlight ^0.40, Astro ^6.4.5, explicit sidebar items to avoid the 0.39 autogenerate breaking change).

## Verification status (updated 18 September 2026)

Done and confirmed:

1. Site: `npm install`, `sync-docs`, `build` all pass (astro 6.4.8, starlight 0.40.0). sync-docs needed a `fileURLToPath` fix to run on Windows. Edit links were removed because the synced pages are gitignored. `npm audit` on the site reports advisories in astro 6.x that need astro 7 and a newer starlight; not bumped yet.
2. fixed-site: real lockfile committed; `next` and `@supabase/supabase-js` bumped to patched releases; audit exits 0 with zero FAIL. CI step updated to match.
3. Adapter type-checks and builds in a fresh Next.js 16.3.5 app (`tsc --noEmit` clean, `next build` clean, proxy.ts recognised).
4. Pushed to https://github.com/CarlsonKamau/jane-skills (private). CI green: gitleaks action clean, fixed-site passes, broken-site fails. Found and fixed two audit.sh bugs on the way: gitleaks was called with a non-existent `-q` flag, and a run from a subfolder scanned the whole repo history.
6. `YOUR-ORG` replaced everywhere (also in `site/src/content/docs/index.mdx`, which the old list missed).

Still open:

5. Deploy site/ to Vercel: project not yet created. Settings needed: root directory `site`, framework Astro, "include files outside root" on (sync-docs reads `../docs`). `vercel.json` CSP now includes `'wasm-unsafe-eval'` because Pagefind search runs WebAssembly; the headers are still untested on a live deployment. After deploy: check securityheaders.com and that search works.

## Known limitations (documented, not bugs)

- audit.sh is heuristic; does not run Lighthouse or axe; assumes App Router.
- CSP ships with 'unsafe-inline' for scripts; nonce-based CSP is a roadmap item.
- No consent manager, no rate limiter in the adapter (deliberate; see docs/06).
- AUDIT.md is gitignored by default.

## Roadmap, in priority order

1. Verification list above.
2. Run the skill against one real client site and note which checks are noisy for Carl's actual stack (Next.js + Supabase + Vercel, some static landing pages, self-hosted Nginx/Cloudflare for a few).
3. Eval set: three starter prompts are in docs/07-expert-notes.md. Save as skills/ship-ready-web/evals/evals.json and run the skill-creator trigger evals.
4. Static/Nginx/Cloudflare adapter (`_headers`, nginx.conf) for self-hosted and static-export sites.
5. Lighthouse CI config with mobile budgets.
6. Consent manager reference implementation.
7. Nonce-based CSP variant in the adapter.
8. Open the repo publicly once 1 to 3 are done.

## Suggested first prompt for Claude Code

> Read HANDOVER.md and CLAUDE.md. Then work through the "Not yet verified" list in order, one item at a time, reporting what you checked and what the result was before moving on. Stop and ask me before changing anything in references/compliance.md or any legal wording.

## Session log summary

- Chat produced: initial skill, corrections after research audit (proxy.ts, PCI tiers, ODPC thresholds), audit.sh false-pass fix for empty lockfiles, docs, case study, site scaffold, CI regression tests.
- Files were created in a sandbox with no network; nothing has been installed or built.

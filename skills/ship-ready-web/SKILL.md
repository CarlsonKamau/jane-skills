---
name: ship-ready-web
description: Audit and harden a website before handoff so it is fast, secure, accessible, SEO-ready, compliant, and not obviously AI-generated. Use this skill whenever the user is building, finishing, reviewing, launching, or deploying a website, landing page, or web app, asks "is this ready", "audit this", "check security", "make it production ready", or mentions a client site. Trigger even if they only ask about one area (speed, SEO, headers); the others are usually missing too.
---

# ship-ready-web

Goal: every site leaves with zero critical findings in CHECKLIST.md and a written audit the client can read.

## Workflow

1. Identify the stack (package.json, config files). Load the matching adapter from `adapters/` if one exists; otherwise apply the checklist manually.
2. Run `scripts/audit.sh` from the repo root. Read its output before reading any source.
3. Walk CHECKLIST.md top to bottom. For each item record PASS, FAIL, or N/A with a one-line reason. Do not skip items because they look fine.
4. Fix FAILs in this order: secrets and auth, security headers, data handling, performance, accessibility, SEO, design, ops. Auth means the data layer checks the session; a middleware redirect alone is a FAIL.
5. Ask before touching anything involving payments, personal data flows, third-party vendors, or legal text. Read `references/compliance.md` first.
6. Re-run `scripts/audit.sh`. Write the report to `AUDIT.md` using the template below.

## Rules

- Never print, log, or commit a secret. If one is found in client code or git history, stop and tell the user; rotation is their call.
- Prefer removing code over adding it. A dependency is a liability until proven otherwise.
- Success is measurable: Lighthouse mobile 90+, axe zero critical, securityheaders.com A, `npm audit` no high/critical, no `NEXT_PUBLIC_` value that is actually a secret.
- Do not rewrite files wholesale. Surgical diffs only.
- Do not claim a check passed unless you ran it or read the evidence.

## AUDIT.md template

```
# Audit: <site> <date>
## Critical (blocks launch)
## High (fix before handoff)
## Low / advisory
## Passed
## Assumptions and questions for the client
```

## Files

- `CHECKLIST.md` the full checklist, read every time
- `references/compliance.md` DPA, GDPR, PCI, HIPAA scoping, read when data or payments are involved
- `adapters/nextjs/` headers, proxy/middleware, data-layer auth guard, metadata, robots, sitemap, env template
- `scripts/audit.sh` deterministic checks, run rather than read

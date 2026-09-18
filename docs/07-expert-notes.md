---
title: Expert notes
description: Extending the skill, hardening beyond the defaults, and the reasoning behind the design choices.
sidebar:
  order: 7
---

## Design decisions

**Why SKILL.md is under 400 words.** Skills load their body into context every time they trigger. A 3,000-token skill costs 3,000 tokens per conversation whether or not the detail is needed. The community forks of Karpathy's coding guidelines converged on roughly 650 tokens for a meta-skill; this one is about 500. The checklist, compliance notes, and adapters are progressive: read only when the workflow step calls for them.

**Why success criteria rather than instructions.** "Add security headers" produces a random subset. "securityheaders.com must return A" produces all of them, because the agent can verify. Every rule in SKILL.md that can be phrased as a measurable outcome is.

**Why the script prints locations, never values.** An audit tool that echoes the secret it found into a terminal log, a CI log, or a Claude conversation has just leaked it again. `audit.sh` prints `file:line`. Contributions that change this will be rejected.

**Why two auth layers.** Covered in the adapter page. The short version: middleware has been bypassed before and will be again; the check has to live where the data is read.

**Why AUDIT.md is gitignored by default.** It names the client's data flows and open questions. Version it in a private repo if you want; do not accidentally push it to a public one.

## Hardening beyond the defaults

### Nonce-based CSP

Removes `'unsafe-inline'` from `script-src`. In `proxy.ts`, generate a nonce per request, set it on a request header, and build the CSP string with `'nonce-<value>'` and `'strict-dynamic'`. Next.js reads the nonce from the `x-nonce` header and applies it to its own inline scripts. Dynamic rendering is forced for every page that uses it, so weigh it against static generation for marketing sites. The Next.js docs page "Content Security Policy" has the reference implementation.

### Subresource Integrity

For any third-party script you cannot self-host, add `integrity="sha384-..."` and `crossorigin="anonymous"`. If the vendor changes the file, it stops loading rather than running unknown code. Relevant to PCI 6.4.3 on payment pages.

### Rate limiting

Vercel WAF rules for the simple cases. For per-user limits, Upstash Redis with `@upstash/ratelimit` in the route handler. For low-traffic sites a `Map` in a route handler is enough and costs nothing.

### Supabase specifics

- RLS on every table. Write the policy before writing the query.
- Never call `createClient` with the service role key in a file that could be imported by a client component. Keep it in `lib/supabase-admin.ts` with `import "server-only"` at the top.
- Use the SSR helpers so the session is cookie-bound and server-readable.

### Lighthouse CI

Add `@lhci/cli` to CI with a `lighthouserc.json` that asserts mobile budgets. Fails the build when performance regresses. Roadmap item; contributions welcome.

## Extending the skill

### New adapter

Create `adapters/<framework>/` with a README table like the Next.js one. Add a detection line to `audit.sh` section 5. Keep the adapter self-contained; the skill should not need to know framework internals.

### New checklist item

Add it under the right section in `CHECKLIST.md`. Tag `[C]` only if shipping without it would expose data or break the law. If the script can check it, add the check; if not, add the manual method to `04-checklist-explained.md`.

### Evals

The skill-creator tooling can run trigger evals. Three prompts to start with:

1. "I've built a landing page for a client in Next.js. Can you check it before I send it over?"
2. "Add security headers to this site" (should trigger and pull in the whole checklist, not just headers)
3. "Is this ready to go live?" in a project with a committed `.env`

Expected: the skill triggers on all three; on the third it stops on the secret before doing anything else.

## Known limitations

- `audit.sh` is heuristic. It finds known key shapes and obvious mistakes. gitleaks is more thorough; a penetration test is more thorough still.
- The Next.js checks assume App Router. Pages Router sites get warnings that may not apply.
- `npm audit` needs network. Offline it reports as unable to run rather than passing.
- The script does not run Lighthouse or axe. Those need a browser; the checklist requires them manually.

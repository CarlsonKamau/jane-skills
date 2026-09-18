---
title: Glossary
description: Plain-language definitions of every term used in the checklist and docs.
sidebar:
  order: 9
---

**Anon key**: a Supabase key designed to be public. Safe only when Row Level Security is on.

**axe**: a free browser extension that finds accessibility problems.

**CLS (Cumulative Layout Shift)**: how much the page jumps around while loading. Target under 0.1.

**Consent manager**: the cookie banner that actually blocks scripts until the visitor agrees. A banner that only informs is not one.

**Controller / processor**: in data protection law, the controller decides why data is collected (usually your client); the processor handles it on their behalf (often you, and your vendors).

**Core Web Vitals**: Google's three speed metrics: LCP, INP, CLS.

**CSP (Content Security Policy)**: a header listing which domains the browser may load scripts, styles, images and frames from. Blocks most injected-script attacks.

**CVE**: a numbered public record of a security vulnerability.

**DPA (Data Protection Act)**: Kenya's 2019 law. Also, confusingly, Data Processing Agreement: the contract between a controller and a processor.

**Env var**: a value like a key or URL stored outside the code, read at runtime.

**gitleaks**: a tool that scans git history for secrets.

**Honeypot**: a hidden form field humans never fill in; if it has a value, the submission is a bot.

**HSTS**: a header telling browsers to only ever use HTTPS for this site.

**httpOnly cookie**: a cookie JavaScript cannot read, so a script injection cannot steal it.

**INP (Interaction to Next Paint)**: how quickly the page responds to a tap or click. Target under 200ms.

**JSON-LD**: structured data that tells search engines what a page is (a bakery, an event, an article).

**LCP (Largest Contentful Paint)**: how long until the main content is visible. Target under 2.5 seconds.

**Lighthouse**: Google's built-in audit tool in Chrome DevTools.

**Lockfile**: `package-lock.json` or equivalent, pinning exact dependency versions.

**Middleware / proxy**: code in Next.js that runs before a page. Renamed to proxy in Next.js 16. A redirect helper, not a security boundary.

**ODPC**: Kenya's Office of the Data Protection Commissioner.

**OG image**: the preview picture shown when a link is shared on WhatsApp, LinkedIn, or X.

**PCI DSS**: the card industry's security standard. Applies to anyone taking card payments.

**PHI**: protected health information, the HIPAA term.

**RLS (Row Level Security)**: database rules that decide which rows each user can see. What makes the Supabase anon key safe.

**SAQ A**: the lightest PCI self-assessment tier, for merchants who never touch card data.

**Service role key**: the Supabase key that bypasses all security rules. Server-only, always.

**Skill**: a folder of instructions Claude Code reads when a task matches.

**Turnstile**: Cloudflare's free, privacy-friendly CAPTCHA alternative.

**WCAG**: the accessibility standard. Level AA is what laws reference.

**XSS**: cross-site scripting; an attacker's script running in your users' browsers, usually via unescaped user content.

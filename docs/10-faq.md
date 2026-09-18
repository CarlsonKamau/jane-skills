---
title: FAQ
description: Questions people ask when they first use the skill.
sidebar:
  order: 10
---

**Does this work with Cursor, Codex, or other agents?**
The checklist, compliance notes, adapter, and script are plain files and work anywhere. The `SKILL.md` frontmatter is the Agent Skills format, which Claude Code reads natively and which several other tools now support. For Cursor, paste `SKILL.md` into a project rule.

**Do I need Claude Code at all?**
No. `bash scripts/audit.sh` and `CHECKLIST.md` work with a human reading them. The skill just makes the agent walk the list for you.

**Will it fix everything automatically?**
It fixes what is safe to fix without asking: headers, metadata, image attributes, labels, obvious code patterns. It stops and asks about anything touching payments, personal data, vendors, or legal text, and about any secret it finds. That is deliberate.

**It found a secret in my repo. Now what?**
Rotate it at the provider first. Then remove it from the file. Then, optionally, scrub git history. Rotation is the only step that actually closes the leak.

**The CSP broke my site.**
It should not, because it ships in report-only mode. If you enforced it early, switch back to `Content-Security-Policy-Report-Only`, read the console, add the domains you need, then enforce again.

**I use the Pages Router, not App Router.**
The headers in `next.config.mjs` work for both. The `app/` files do not apply; use `next/head` and `next-sitemap` instead. The script will warn about missing `app/` files; treat those as N/A.

**I host on Netlify / Cloudflare Pages / my own Nginx.**
`next.config.mjs` headers still apply if you run Next.js there. For static exports, headers move to `_headers` (Netlify, Cloudflare) or `nginx.conf`. A static adapter is on the roadmap.

**How much does compliance cost?**
ODPC registration is KES 4,000 for small entities. Turnstile, Sentry, and uptime monitoring have free tiers. The real cost is the hour spent on the data inventory, which is the hour that prevents the expensive mistakes.

**Can I use this for a client and charge for it?**
Yes, MIT licence. Many agencies present AUDIT.md as a deliverable.

**Why is SKILL.md so short?**
Because it loads into every conversation where it triggers. Detail lives in files that load only when needed. See the expert notes.

---
title: Step by step
description: The exact sequence to run on every project, for people who already know their way around a terminal.
sidebar:
  order: 3
---

![Workflow diagram](../assets/workflow.svg)

## Before the project starts

1. Copy the Next.js adapter into the fresh project (or your own starter). Ten minutes now, hours saved later.
2. Run the data inventory questions from `references/compliance.md` with the client. Write the answers in the project README.
3. Sign the vendor list: hosting, database, email, analytics, payments. Each one needs a Data Processing Agreement if personal data flows through it.
4. Put the audit workflow in `.github/workflows/`. Every push now scans for secrets.

## During the build

5. Keep `.env.example` current. Every new env var goes there with a placeholder and a comment saying whether it is public or server-only.
6. Every protected page or route handler starts with `await requireUser()`. No exceptions, no "the middleware handles it".
7. Every form has server-side validation and a honeypot or Turnstile before it goes live, even on staging.
8. Every image goes through `next/image` with `alt`, `width`, `height`. Hero gets `priority`.

## Before handoff (the audit)

9. `bash scripts/audit.sh` from the project root. Read the whole output.
10. Open Claude Code and run the skill: "Audit this site before handoff. Fix what you safely can and write AUDIT.md."
11. Answer its questions. It will stop on payments, personal data, vendors, and legal copy. That is deliberate.
12. Re-run `audit.sh`. Zero FAIL lines.
13. Manual checks: Lighthouse mobile (90+ all four), axe (zero critical/serious), securityheaders.com (A), real mid-range Android over mobile data.
14. Cross-browser: Chrome, Firefox, Safari desktop, Safari on a real iPhone.
15. Someone who did not build it uses the site for five minutes with no instructions. Watch, do not help.
16. Read AUDIT.md as if you were the client. Fix or explain every High.

## Handoff

17. Send AUDIT.md with the site. Include the "Assumptions and questions for the client" section; it is where liability gets clarified.
18. Document who owns the domain, DNS, hosting, and database accounts. The client should be able to fire you without losing their website.
19. Set a retention reminder: when do form submissions, logs, and uploads get deleted?

## Every quarter after launch

20. Re-run `audit.sh` and `npm audit`. Dependencies rot.
21. Re-check securityheaders.com and Lighthouse; a marketing plugin someone installed will have changed something.
22. Renew the ODPC certificate before it expires (24 months) if the client is registered.

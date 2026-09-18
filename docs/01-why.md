---
title: Why this exists
description: The case for auditing AI-built websites before they ship, and who this is for.
sidebar:
  order: 1
---

## The problem in one sentence

AI tools make a website look finished in an afternoon, and the parts that are missing are exactly the parts nobody sees until something goes wrong.

## What "looks finished" hides

A site generated with Claude, Cursor, v0, Lovable or Bolt will usually have a working homepage, a contact form, and a pleasant layout. It will usually also have some of these:

| What you see | What is actually there |
|---|---|
| A contact form that works | No server-side validation, no spam protection, submissions stored forever |
| An admin page "only staff know about" | A URL anyone can guess, with data fetched using a public key |
| Fast on your laptop | 6 seconds to first paint on a mid-range Android over 3G |
| A cookie banner | A banner that does nothing; analytics loaded before anyone clicked |
| A `.env` file | Committed to git, with the service role key inside |
| A beautiful hero | An unlabelled image, grey text at 3:1 contrast, no `h1` |
| "Deployed to Vercel" | No security headers, `X-Powered-By: Next.js` announced to every scanner |

None of these are exotic. They are the default output of a tool that optimises for "the user is happy when they see it", and every one of them has cost real businesses real money.

## Why a checklist and not "better prompts"

Prompting the AI to "make it secure" produces confident prose and a few random headers. What actually works is what works for humans in aviation and surgery: a fixed list, walked in order, with each item marked pass or fail, and the result written down.

Karpathy's observation about coding agents applies directly: they are excellent at looping until they meet a specific, verifiable goal, and poor at inventing the goal themselves. So this project gives the agent the goal ("Lighthouse mobile 90+, zero critical axe issues, securityheaders.com A, no secrets, session checked in the data layer") and a script that measures part of it, and lets it loop.

## What it costs to skip

Concrete, not hypothetical:

- A leaked Supabase service key means every row in every table is readable and writable by anyone who finds it. Rotating it after the fact does not un-leak the data.
- A Next.js middleware auth bypass (CVE-2025-29927, March 2025) meant every app that put its only auth check in `middleware.ts` had its admin pages open to the internet for as long as it took to patch.
- Under Kenya's Data Protection Act, failing to register or notify a breach within 72 hours carries fines up to KES 5 million or 1% of turnover. Under GDPR, up to 4% of global turnover.
- A payment page with an unmanaged third-party script is how British Airways lost 380,000 card numbers. PCI DSS 4.0.1 now expects merchants to control every script on a payment page.
- Google ranks on Core Web Vitals. A slow mobile site is invisible in search regardless of how good the copy is.

## Who this is for

- **Agencies and freelancers** shipping client sites with AI assistance. This is your pre-handoff gate and your `AUDIT.md` is the deliverable that shows the client what they paid for.
- **Founders** building their own site. You will not know what you do not know; the checklist does.
- **Developers** who already know all of this and want it enforced automatically instead of remembered.
- **Anyone starting a website** who wants to learn what "production ready" means without a computer science degree. Start with the beginner quickstart.

## What it is not

- Not a replacement for a penetration test on a high-value target.
- Not legal advice. The compliance notes tell you which questions to ask a lawyer.
- Not a framework. It works alongside whatever you build with.

---
title: Compliance guide
description: DPA, GDPR, PCI, HIPAA and the others, scoped for a web agency. Which apply, what to do, what to ask.
sidebar:
  order: 5
---

This is scoping guidance for developers and agency owners, verified against primary sources as of September 2026. It is not legal advice; when in doubt, the questions at the end are what to bring to a lawyer.

## Start with the data inventory

Every compliance question is answered by six facts. Write them down before writing code.

1. What personal data is collected? Names, emails, phones, addresses, payment details, health information, ID numbers, location, browsing behaviour.
2. Where is it stored? Database region, file storage, email provider, CRM, analytics.
3. Which third parties see it? Hosting, database, email, analytics, payments, chat widgets, even fonts loaded from a CDN (the CDN sees the visitor's IP).
4. Which countries are the users in, and which country is the client in?
5. Are any users under 18?
6. Is there health, financial, or biometric data?

## Kenya Data Protection Act 2019

Applies to almost every site built for or serving Kenyans.

**Registration with the ODPC**: mandatory unless the organisation is under KES 5 million annual turnover AND under 10 employees. Eighteen sectors must register regardless of size, including financial services, health, education, telecoms, hospitality, and anyone running CCTV. Registration is online at odpc.go.ke, costs KES 4,000 for micro and small entities, the certificate lasts 24 months, and it must be displayed on the website. Entities outside Kenya that process Kenyans' data above the threshold must also register.

**Ongoing obligations**: a lawful basis for each processing purpose, a privacy notice at the point of collection, consent for marketing, data subject rights (access, correction, deletion, objection), breach notification to the ODPC within 72 hours, and a documented basis for any transfer outside Kenya. That last one covers Vercel, Supabase, Mailchimp, Google Analytics, and most other SaaS; the usual basis is the data subject's consent or contractual necessity plus adequate safeguards.

**Penalties**: administrative fines up to KES 5 million or 1% of annual turnover, whichever is lower, plus criminal liability for some offences.

## GDPR and UK GDPR

Applies when the site offers goods or services to people in the EU or UK, or monitors their behaviour, regardless of where the client is. A Kenyan tour operator taking bookings from Germans is in scope.

**Practical minimum**: a consent manager that blocks non-essential scripts until consent is given and makes declining as easy as accepting; a Data Processing Agreement with every vendor; a record of processing activities; a privacy notice meeting Articles 13 and 14; breach notification within 72 hours; honouring subject rights within one month.

**Penalties**: up to 4% of global annual turnover or EUR 20 million.

## PCI DSS v4.0.1

Applies the moment a site accepts card payments. The tier you land in depends on how much of the payment page you control.

| How you take payment | Tier | What you must do |
|---|---|---|
| Redirect to the processor's hosted page (customer leaves your site) | SAQ A | Confirm your site is not susceptible to script attacks; minimal questionnaire |
| Embedded iframe or tokenised fields (Stripe Elements, Paystack inline) | SAQ A, conditionally | Get written confirmation from the processor that their solution protects the page from script attacks, or implement your own script inventory and tamper detection (requirements 6.4.3 and 11.6.1) |
| Custom card form posting to your server | SAQ A-EP or D | Full script management, quarterly ASV scans, much more. Do not do this |

M-Pesa STK push and similar mobile money flows are outside PCI scope but have their own Safaricom and CBK requirements.

## HIPAA

Applies only to US "covered entities" (providers, insurers, clearinghouses) and their business associates. A Kenyan clinic is governed by the DPA and the Health Act, not HIPAA. If a US healthcare client appears, every vendor that touches protected health information needs a signed Business Associate Agreement, PHI must be excluded from analytics, logs, and error trackers, and access must be audited. Most agencies decline this work unless they have built compliant infrastructure once already.

## CCPA / CPRA

California. Applies to businesses over certain revenue or data-volume thresholds. Mainly a "Do Not Sell or Share My Personal Information" link and a privacy notice. Rarely relevant unless the client is a sizeable US business.

## Children

COPPA in the US restricts data on under-13s. The Kenya DPA treats under-18s as children and requires parental consent and minimal collection. If the audience includes children, collect nothing you cannot justify.

## Accessibility law

The ADA (US), the European Accessibility Act (in force since 28 June 2025 for new digital services), and Kenya's Persons with Disabilities Act all point at WCAG 2.1 or 2.2 Level AA. Section 6 of the checklist is the implementation.

## SOC 2 and ISO 27001

Not laws. Audited attestations about an organisation's security practices, requested by enterprise buyers before signing. Only relevant if you are selling a SaaS product to corporates. Expect months of work; Vanta or Drata reduce it.

## Minimum implementation for any client site

- Privacy policy and terms linked in the footer, written for the real data flows
- Consent manager that blocks scripts until accepted
- Vendor list with signed DPAs, kept in the project README
- Contract naming the client as controller and the agency as processor
- Retention schedule for submissions, logs, and uploads
- Note on where data is stored and the basis for any cross-border transfer

## Questions to bring to a lawyer

- Does this client fall in one of the ODPC's mandatory sectors?
- What is our basis for storing Kenyan users' data on servers in the US or EU?
- The client wants to email past customers a newsletter; what consent do we have?
- We are taking card payments via an embedded form; has the processor confirmed script protection in writing?
- Users may be under 18; what consent flow do we need?

## Sources

- Kenya: odpc.go.ke FAQs; Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021
- GDPR: gdpr.eu; ico.org.uk
- PCI: pcisecuritystandards.org, SAQ A r1 (January 2025) and FAQ 1588
- HIPAA: hhs.gov/hipaa
- WCAG 2.2: w3.org/WAI/WCAG22/quickref

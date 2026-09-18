# Compliance scoping

Read this when a site collects personal data, takes payments, or serves users outside the client's country. This is scoping guidance, not legal advice; recommend a lawyer for anything beyond the basics.

## Step 1: data inventory

Before touching code, answer these with the user and record the answers in AUDIT.md:

1. What personal data is collected? (names, emails, phones, addresses, payment, health, ID numbers, location, behaviour)
2. Where is it stored? (database region, file storage, email provider, CRM, analytics)
3. Which third parties see it? (hosting, database, email, analytics, payments, chat widgets, fonts loaded from a CDN)
4. Which countries are the users in? Which country is the client in?
5. Are any users under 18?
6. Is there any health, financial, or biometric data?

## Step 2: which frameworks apply

| Framework | Applies when | Practical must-dos |
|---|---|---|
| Kenya DPA 2019 | Client or users in Kenya | ODPC registration unless BOTH under KES 5M turnover AND under 10 staff (18 sectors such as finance, health, education, telecoms register regardless; certificate lasts 24 months and must be displayed on the site), privacy notice, lawful basis, consent for marketing, subject rights, 72h breach notice, documented basis for data leaving Kenya |
| GDPR / UK GDPR | Site targets or tracks EU/UK residents | Consent that blocks scripts pre-consent, DPA with every vendor, records of processing, 72h breach notice, subject rights |
| PCI DSS v4.0.1 | Any card payment | Never handle raw card data. Redirect-style hosted checkout (customer leaves your page) = SAQ A, lightest tier. Embedded iframe/tokenised fields = still SAQ A only if the vendor confirms in writing their solution protects the page from script attacks, otherwise you own script inventory and tamper detection (req 6.4.3, 11.6.1). Custom card forms = SAQ A-EP or D, heavy. Quarterly ASV scans may apply |
| HIPAA | US healthcare covered entity or their vendor | BAA with every vendor touching PHI, encryption, audit logs, no PHI in analytics, logs, or error tracking. Decline unless infrastructure exists |
| CCPA / CPRA | Larger businesses serving Californians | "Do Not Sell" link, privacy notice |
| COPPA / child data | Users under 13 (US) or under 18 (Kenya DPA) | Parental consent, minimal collection |
| Accessibility law (ADA, EAA, Kenya PWD Act) | Public-facing sites, increasingly all | WCAG 2.1 AA |
| SOC 2 / ISO 27001 | Enterprise buyers ask for it | Org-level attestation, not a site fix; only pursue for SaaS products |

## Step 3: minimum implementation

- Privacy policy and terms linked in the footer, written for the actual data flows, not a template
- Consent manager that blocks analytics, ads, and embedded media until accepted; declining must be as easy as accepting
- Vendor list with signed DPAs kept in the project README or client docs
- Contract names the client as controller and the agency as processor
- Retention schedule: delete form submissions, logs, and uploads after a defined period
- Cross-border transfer note when hosting outside the users' country

## Step 4: questions to ask before proceeding

Ask, do not assume, when any of these come up:

- "This form collects phone numbers. Will they be used for SMS marketing?"
- "Payments: are we using a hosted checkout, or does the client want a custom card form?"
- "Users are in the EU. Do you want a consent manager now or a geo-gated one later?"
- "This looks like health data. Is the client a healthcare provider?"
- "Analytics loads before consent. Should I gate it, or is the client accepting the risk?"

## Sources to verify current details

- ODPC Kenya: odpc.go.ke FAQs and Registration Regulations 2021 (Legal Notice 207)
- GDPR: gdpr.eu, ICO (UK)
- PCI: pcisecuritystandards.org, FAQ 1588 on SAQ A eligibility, SAQ A r1 (Jan 2025)
- HIPAA: hhs.gov/hipaa
- WCAG 2.2 quick reference

# wicked-stacks

Wicked Stacks — the digital products storefront from The Insanely Wicked.
Live at [wickedstacks.com](https://wickedstacks.com).

## Stack

- Vite + React + TypeScript (same stack as insanely-wicked-web)
- react-router-dom for product/category pages
- Pure static site — no backend, no env vars
- Hosted on Vercel (`vercel.json` handles SPA routing)

## Local development

```bash
npm install
npm run dev      # local preview at http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Deploying

Import the repo at **vercel.com/new** — Vercel auto-detects Vite. Point
wickedstacks.com at the project in Vercel → Settings → Domains (DNS at
Porkbun: add the A/CNAME records Vercel shows you).

## Wiring up checkout (Stripe Payment Links)

1. In [Stripe → Payment Links](https://dashboard.stripe.com/payment_links),
   create one link per product/stack (set the price, and enable
   "Collect customers' email addresses").
2. Paste each link into the matching product's `buyUrl` in
   `src/products.ts`.
3. Push — buy buttons switch from "Checkout opening soon" to live
   automatically.

For delivery, start simple: in each Payment Link's confirmation settings,
show a message with the download link (Google Drive share link works day
one). Upgrade later to email delivery via MailerLite automation.

## Wiring up email capture (MailerLite)

1. Create a free MailerLite account, make a Form (embedded), copy the form
   action URL.
2. Paste it into `SITE.emailFormAction` in `src/products.ts`.
3. Until it's set, the form falls back to a mailto link.

## Editing the catalog

Everything the store sells lives in `src/products.ts` — titles, prices,
descriptions, bundles, and buy links. Edit that one file and push.

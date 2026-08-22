# cbmbook.com

Single-page sales site for Complete Business Mastery ($47), feeding the
same Stripe checkout as the storefront.

Moved off Netlify on 2026-08-22 after the Netlify account was suspended
without notice. Nothing here was Netlify-specific — no forms, no
redirects, no functions — so the page transferred unchanged.

## Vercel settings

- Root Directory: `sites/cbmbook`
- Framework Preset: **Other**
- Build Command: leave empty (override ON)
- Output Directory: `.`

Same pattern as `sites/doodleai`. Do NOT copy the Vite settings used by
`sites/womanwise` and `sites/mensread` — this is a plain static page with
no build step.

## Domain

cbmbook.com is mid-transfer from GoDaddy to Porkbun (expected ~Aug 25).
Until the transfer completes and DNS is reachable, this deploys to its
Vercel URL only. Attach the custom domain after the transfer lands.

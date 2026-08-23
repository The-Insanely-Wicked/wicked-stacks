# Working notes for Claude

Read this before starting work in this repo.

## How Michael works

- **Hand him Google Docs, not Markdown.** Anything written for him to read —
  plans, summaries, audits, checklists, drafts, article copy — goes in a
  Google Doc, with the link in chat. Markdown belongs only in files the code
  actually consumes (blog posts, README, this file). `.md` files are awkward
  for him to open.
- **He uses voice-to-text.** Expect run-on sentences, homophone slips and
  dictated punctuation. Read for intent; don't correct the wording back at him.
- **Anything he does outside the repo gets numbered steps.** Play Console,
  Stripe, Supabase, MailerLite, Vercel, DNS — name the exact button and where
  it lives on the page. Never just say "configure the webhook."
- **He merges his own pull requests.** Open them, say what's inside, stop.
  Do not merge for him.
- **He's in Central Time.**
- **Don't ask him to check his spam folder.** He already does, several times
  a day.

## Content rules — not negotiable

- **Never invent credentials, statistics, citations, expert names, degrees or
  testimonials.** Two article sites had to be taken offline because
  AI-written copy fabricated author credentials. If a claim needs a source and
  no real one exists, cut the claim.
- **Never bundle or give away something that is sold separately.** Check the
  catalog before adding any bonus or freebie.
- **Treat AI-written content as a draft that happens to be live.** The daily
  blog writers run unattended. Read what they produce.

## Money

- **Stripe prices are immutable.** You cannot edit a price — create a new one
  and repoint the link. A Payment Link's line-item price also can't be swapped
  after creation, so that needs a new link too.
- **A coupon's product restriction is fixed at creation** and needs `expand`
  to even read back. A wrong one is deleted and rebuilt, never edited.

## The properties

| Site | What it is |
| --- | --- |
| theinsanelywicked.com | Agency site (`insanely-wicked-web`) |
| wickedstacks.com | 18-product book and course store (`wicked-stacks`) |
| cbmbook.com, doodleai | Standalone sub-sites under `wicked-stacks/sites/` |
| pipsworld.app | Kids' bedtime story app (`pips-world`) — **www only** |
| coachroger.app | Wellness app (`coach-roger`) |
| mensread, womanwise | Retired — offline, domains removed, projects paused |

## This repo

Wicked Stacks — the store, plus several standalone sub-sites.

- **`src/products.ts` is the single source of truth.** 18 products. The
  homepage `ItemList` schema is generated from it at build time. A hardcoded
  product list in `index.html` once drifted to 16 of 18 — don't reintroduce
  one.
- **`npm run build` must run `scripts/prerender.mjs`.** It renders every
  route to static HTML through the same React components, so crawlers and
  answer engines get real content instead of an empty `#root`. It also emits
  per-route canonical, title, description, OG and Twitter tags, the JSON-LD,
  and the sitemap. It throws on a missing tag, an unfilled `#root`, or a
  suspiciously small homepage — a failure there is a real failure, not noise
  to route around.
- **`sites/` holds standalone sub-sites** with their own build steps:
  `cbmbook` and `doodleai` are live; `mensread` and `womanwise` are retired
  — offline, domains removed, Vercel projects paused. Leave them alone.
- `esbuild` is a declared dependency. It used to resolve only by accident
  through Vite's hoisting, which broke when Vite moved.
- If a Vite upgrade seems to have installed, confirm it:
  `node -p "require('vite/package.json').version"`. A peer-dependency
  conflict can silently leave the old version in place while the build still
  prints green.

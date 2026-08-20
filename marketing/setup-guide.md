# Wicked Stacks — Launch Setup Guide (the checklist)

Everything to go from this repo to a live, selling store. Total monthly
cost as configured: **$0** (Stripe takes ~2.9% + 30¢ per sale; MailerLite
free to 1,000 subscribers).

## 1. Deploy the site (15 min)
1. Go to **vercel.com/new**, import `The-Insanely-Wicked/wicked-stacks`.
2. Vercel auto-detects Vite — click Deploy.
3. Project → Settings → Domains → add `wickedstacks.com` (+ `www`).
4. At Porkbun → wickedstacks.com → DNS: add the A record and CNAME Vercel
   shows you. Wait ~10 minutes.

## 2. Stripe checkout (45 min, one-time)
1. Create/log into Stripe. Complete business profile so payouts work.
2. Products → add each title with its price (list in `src/products.ts`).
3. Payment Links → create one per product AND per stack. In each link's
   settings:
   - Collect customers' email addresses: ON
   - After payment → show confirmation page → custom message containing
     the download link(s) for that product (Google Drive share links work
     day one — set them to "Anyone with the link, Viewer").
4. Paste each Payment Link URL into `buyUrl` in `src/products.ts`, push.
   Buttons go live automatically.
5. Later upgrade (optional): Stripe → MailerLite Zapier/Make hook to send
   a proper delivery email instead of the confirmation-page link.

## 3. MailerLite email (30 min)
1. Create free MailerLite account (mailerlite.com).
2. Verify the sending domain (theinsanelywicked.com) — Settings → Domains:
   add the DNS records at Squarespace (where the .com DNS lives).
3. Create a Group: "Free Guide".
4. Forms → Embedded form → signs subscribers into that group. Copy the
   form's action URL and paste into `SITE.emailFormAction` in
   `src/products.ts`, push.
5. Automations → new automation, trigger "joins group Free Guide" →
   build the 5 emails from `marketing/welcome-sequence.md`
   (Day 0 / 1 / 3 / 5 / 8).
6. Upload the free guide (rebranded "Video Marketing Traffic Using AI"
   report) somewhere linkable (Drive share link) and put that link in
   Email 1.

## 4. The free guide itself (1–2 hrs)
Rebrand the PLR report before using it (its license allows full editing):
- New title: "The Video Marketing Quickstart" (or similar)
- New cover (Canva or the existing ecover as a base)
- Scrub "2025" references; add an intro paragraph in Michael's voice
- Add a back page promoting Wicked Stacks + DoodleAI with links

## 5. Launch (send when 1–4 are done)
- Send `marketing/launch-emails.md` series to the list over 4 days.
- Post the launch on the Insanely Wicked socials + YouTube community tab.
- Add a link to Wicked Stacks from theinsanelywicked.com's nav/footer
  (small change to insanely-wicked-web).

## Publishing checklist per product (before its buy button goes live)
- [ ] Final PDF/EPUB files in a clean "Store Delivery" Drive folder
- [ ] From Zero: fix the ToC page numbers first
- [ ] Cover image added to the product page (public/covers/, wire into
      products.ts when ready)
- [ ] Stripe Payment Link created, delivery message tested with a real
      $0.50 test purchase (make a coupon for 99% off, buy it yourself)
- [ ] buyUrl pasted and pushed

## Costs summary
| Thing | Cost |
|---|---|
| Hosting (Vercel) | $0 |
| Checkout (Stripe) | 2.9% + 30¢ per sale |
| Email (MailerLite) | $0 to 1k subs, ~$10/mo after |
| Domain (wickedstacks.com) | ~$11/yr at Porkbun |

/**
 * Private numbers feed for the owner dashboard (/dashboard.html).
 *
 * Env vars (Vercel):
 *   DASHBOARD_KEY      – the password the dashboard page asks for
 *   STRIPE_SECRET_KEY  – a RESTRICTED Stripe key with read-only access
 *   MAILERLITE_API_KEY – already set (shared with the delivery webhook)
 */
const PLINK_NAMES = {
  plink_1U6Xa9EUuXAf9uyBQQzcyLfO: "Complete Business Mastery",
  plink_1U6XagEUuXAf9uyBAtounPrS: "From Zero to Online Income",
  plink_1U6XakEUuXAf9uyBNiLyVJyb: "Stuck No More",
  plink_1U71RYEUuXAf9uyBlpWAhlyc: "Stuck No More",
  plink_1U6XanEUuXAf9uyByq7C1kJD: "The Digital Tapestry",
  plink_1U6XavEUuXAf9uyBpuSRik6h: "Penny's Piggy Bank",
  plink_1U6XbvEUuXAf9uyBCZh3rndD: "Princess Penny's Party",
  plink_1U6XbiEUuXAf9uyB5xU2A64J: "DoodleAI",
  plink_1U6XbCEUuXAf9uyBfekfOOQ8: "Business Starter Stack",
  plink_1U6XbHEUuXAf9uyBhknznt2Z: "Clear Head Stack",
  plink_1U71q3EUuXAf9uyBY9EgkrGZ: "Clear Head Stack",
  plink_1U6XbKEUuXAf9uyBSvsnfcQf: "Penny's Story Stack",
  plink_1U6XbdEUuXAf9uyBsajaEoLj: "Everything Stack",
  plink_1U6sDrEUuXAf9uyByfTSgSq9: "Everything Stack",
  plink_1U6n3KEUuXAf9uyBBnZog3bN: "Tapestry Debates",
  plink_1U6ny3EUuXAf9uyB95des2ne: "Your Shit Stinks Too",
  plink_1U6oBsEUuXAf9uyBzCcmjiyT: "Your Shit Stinks Too",
  plink_1U6z3eEUuXAf9uyBqKolLCBL: "Project Management Stack",
  plink_1U6z3jEUuXAf9uyBtD7zPAFO: "Communication Stack",
  plink_1U6z3nEUuXAf9uyBGgypjH0q: "Focus & Resilience Stack",
  plink_1U6z3qEUuXAf9uyBGhMmeMtp: "Career Growth Stack",
  plink_1U6z3tEUuXAf9uyBC7dlLr2Y: "Complete Course Library",
};

export default async function handler(req, res) {
  const { DASHBOARD_KEY, STRIPE_SECRET_KEY, MAILERLITE_API_KEY } = process.env;
  if (!DASHBOARD_KEY || !STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Dashboard env vars not configured yet" });
  }
  if ((req.query.key || "") !== DASHBOARD_KEY) {
    return res.status(401).json({ error: "Wrong key" });
  }

  const out = { orders: [], products: {}, revenue: { today: 0, week: 0, month: 0 }, counts: { today: 0, week: 0, month: 0 }, subscribers: null, groups: [] };
  const now = Date.now() / 1000;
  const DAY = 86400;

  // --- Stripe: paid checkout sessions from the last 30 days (up to 300) ---
  let starting_after = "";
  for (let page = 0; page < 3; page++) {
    const url = `https://api.stripe.com/v1/checkout/sessions?limit=100&created[gte]=${Math.floor(now - 30 * DAY)}${starting_after ? `&starting_after=${starting_after}` : ""}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } });
    if (!r.ok) return res.status(502).json({ error: `Stripe said ${r.status}` });
    const j = await r.json();
    for (const s of j.data) {
      if (s.payment_status !== "paid") continue;
      const amount = (s.amount_total || 0) / 100;
      const age = now - s.created;
      const product = PLINK_NAMES[s.payment_link] || "Other";
      out.revenue.month += amount; out.counts.month++;
      if (age < 7 * DAY) { out.revenue.week += amount; out.counts.week++; }
      if (age < 1 * DAY) { out.revenue.today += amount; out.counts.today++; }
      out.products[product] = (out.products[product] || 0) + 1;
      if (out.orders.length < 12) {
        out.orders.push({ when: s.created, product, amount, email: s.customer_details?.email || "" });
      }
    }
    if (!j.has_more) break;
    starting_after = j.data[j.data.length - 1]?.id;
  }

  // --- MailerLite: total subscribers + the Purchased groups ---
  if (MAILERLITE_API_KEY) {
    try {
      const ml = { headers: { Authorization: `Bearer ${MAILERLITE_API_KEY}` } };
      const subs = await fetch("https://connect.mailerlite.com/api/subscribers?limit=1", ml).then((r) => r.json());
      out.subscribers = subs?.total ?? subs?.meta?.total ?? null;
      const groups = await fetch("https://connect.mailerlite.com/api/groups?limit=100", ml).then((r) => r.json());
      out.groups = (groups?.data || [])
        .filter((g) => /purchased/i.test(g.name))
        .map((g) => ({ name: g.name.replace(/purchased\s*[–-]\s*/i, ""), count: g.active_count ?? g.total ?? 0 }));
    } catch { /* MailerLite hiccup shouldn't kill the money numbers */ }
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json(out);
}

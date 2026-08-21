/**
 * Stripe → MailerLite bridge.
 *
 * Stripe calls this the moment a checkout completes. We verify it's really
 * Stripe (signature check), look up which product the payment link sells,
 * and add the buyer to that product's "Purchased – …" group in MailerLite —
 * which fires the matching delivery email automation.
 *
 * Needs two environment variables in Vercel:
 *   STRIPE_WEBHOOK_SECRET  – from Stripe → Developers → Webhooks → this endpoint
 *   MAILERLITE_API_KEY     – from MailerLite → Integrations → API
 */
import crypto from "node:crypto";

// Live payment links → MailerLite group names. New product = one line here.
const PLINK_TO_GROUP = {
  plink_1U6Xa9EUuXAf9uyBQQzcyLfO: "Purchased – Complete Business Mastery",
  plink_1U6XagEUuXAf9uyBAtounPrS: "Purchased – From Zero to Online Income",
  plink_1U6XakEUuXAf9uyBNiLyVJyb: "Purchased – Stuck No More",
  plink_1U6XanEUuXAf9uyByq7C1kJD: "Purchased – The Digital Tapestry",
  plink_1U6XavEUuXAf9uyBpuSRik6h: "Purchased – Penny's Piggy Bank",
  plink_1U6XbvEUuXAf9uyBCZh3rndD: "Purchased – Princess Penny's Party",
  plink_1U6XbiEUuXAf9uyB5xU2A64J: "Purchased – DoodleAI",
  plink_1U6XbCEUuXAf9uyBfekfOOQ8: "Purchased – Business Starter Stack",
  plink_1U6XbHEUuXAf9uyBhknznt2Z: "Purchased – Clear Head Stack",
  plink_1U6XbKEUuXAf9uyBSvsnfcQf: "Purchased – Penny's Story Stack",
  plink_1U6XbdEUuXAf9uyBsajaEoLj: "Purchased – Everything Stack",
  plink_1U6n3KEUuXAf9uyBBnZog3bN: "Purchased – Tapestry Debates",
  plink_1U6ny3EUuXAf9uyB95des2ne: "Purchased – Your Shit Stinks Too",
};

const ML_BASE = "https://connect.mailerlite.com/api";

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/** Stripe signs `${timestamp}.${body}` with the endpoint secret (HMAC-SHA256). */
function isFromStripe(rawBody, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => p.split("=").map((s) => s.trim())),
  );
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");
  const given = Buffer.from(parts.v1 ?? "", "utf8");
  const want = Buffer.from(expected, "utf8");
  return given.length === want.length && crypto.timingSafeEqual(given, want);
}

/** Group names can drift (dash style, apostrophes) — compare letters only. */
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

async function findGroupId(apiKey, groupName) {
  const res = await fetch(`${ML_BASE}/groups?limit=100`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`MailerLite groups lookup failed: ${res.status}`);
  const { data } = await res.json();
  const want = normalize(groupName);
  const exact = data.find((g) => normalize(g.name) === want);
  if (exact) return exact.id;
  // Fall back to matching without the "Purchased" prefix.
  const bare = normalize(groupName.replace(/^Purchased/i, ""));
  const loose = data.find((g) => normalize(g.name).endsWith(bare));
  return loose ? loose.id : null;
}

async function addToGroup(apiKey, email, groupId) {
  const res = await fetch(`${ML_BASE}/subscribers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    // MailerLite upserts by email, so repeat buyers just gain the new group.
    body: JSON.stringify({ email, groups: [groupId], status: "active" }),
  });
  if (!res.ok) throw new Error(`MailerLite subscribe failed: ${res.status}`);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { STRIPE_WEBHOOK_SECRET, MAILERLITE_API_KEY } = process.env;
  if (!STRIPE_WEBHOOK_SECRET || !MAILERLITE_API_KEY) {
    return res.status(500).json({ error: "Webhook env vars not configured" });
  }

  const rawBody = await readRawBody(req);
  if (!isFromStripe(rawBody, req.headers["stripe-signature"], STRIPE_WEBHOOK_SECRET)) {
    return res.status(400).json({ error: "Bad signature" });
  }

  const event = JSON.parse(rawBody.toString("utf8"));
  // Always answer 200 for events we simply don't act on, so Stripe stops retrying.
  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ ignored: event.type });
  }

  const session = event.data.object;
  const email = session.customer_details?.email || session.customer_email;
  const groupName = PLINK_TO_GROUP[session.payment_link];
  if (!email || !groupName) {
    return res.status(200).json({ skipped: true, reason: !email ? "no email" : "unmapped payment link" });
  }

  try {
    const groupId = await findGroupId(MAILERLITE_API_KEY, groupName);
    if (!groupId) return res.status(200).json({ skipped: true, reason: `no group like "${groupName}"` });
    await addToGroup(MAILERLITE_API_KEY, email, groupId);
    return res.status(200).json({ delivered: groupName });
  } catch (err) {
    // 500 makes Stripe retry with backoff — right call for a MailerLite hiccup.
    return res.status(500).json({ error: String(err) });
  }
}

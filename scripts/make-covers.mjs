/**
 * Render product cover art for every catalog item that has no `image`.
 *
 * Not part of `npm run build` — covers change far less often than the site,
 * and this needs Playwright, which the site itself does not. Run it by hand
 * after adding a product:
 *
 *   npx playwright install chromium   # once
 *   node scripts/make-covers.mjs
 *
 * Output: public/covers/<slug>.png at 1200x675, matching the house style of
 * the hand-made course covers in public/courses/.
 *
 * Everything on a cover comes from src/products.ts. Nothing is invented —
 * the pills are the product's real `formats` entries, shortened.
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "covers");
mkdirSync(OUT, { recursive: true });

/** Accent per category, taken from the CSS custom properties in styles.css. */
const ACCENT = {
  business: { a: "#f5a623", b: "#f2545b", label: "EBOOK" },
  mindset: { a: "#8b5cf6", b: "#35c7ee", label: "EBOOK" },
  kids: { a: "#f2545b", b: "#f5a623", label: "ILLUSTRATED EBOOK" },
  stack: { a: "#35c7ee", b: "#8b5cf6", label: "BUNDLE" },
  courses: { a: "#35c7ee", b: "#8b5cf6", label: "VIDEO COURSE STACK" },
};

/** Hand-set line breaks — automatic splitting produces awkward covers. */
const TITLE_LINES = {
  "complete-business-mastery": ["Complete", "Business Mastery"],
  "from-zero-to-online-income": ["From Zero to", "Online Income"],
  "stuck-no-more": ["Stuck", "No More"],
  "the-digital-tapestry": ["The Digital", "Tapestry"],
  "the-overwhelm-detox": ["The Overwhelm", "Detox"],
  "tapestry-debates": ["The Tapestry", "Debates"],
  "your-shit-stinks-too": ["Your Shit", "Stinks Too"],
  "pennys-piggy-bank": ["Penny's", "Piggy Bank"],
  "princess-pennys-problem-solving-party": ["Princess Penny's", "Problem-Solving Party"],
  "business-starter-stack": ["The Business", "Starter Stack"],
  "clear-head-stack": ["The Clear Head", "Stack"],
  "pennys-story-stack": ["Penny's", "Story Stack"],
  "everything-stack": ["The Everything", "Stack"],
};

/** A quiet motif per category, echoing the play triangle on the course covers. */
const GLYPH = {
  business: `<path d="M40 200 L40 130 L75 130 L75 200 Z M100 200 L100 80 L135 80 L135 200 Z M160 200 L160 40 L195 40 L195 200 Z"/>`,
  mindset: `<circle cx="118" cy="118" r="96" fill="none" stroke="currentColor" stroke-width="14"/><circle cx="118" cy="118" r="56" fill="none" stroke="currentColor" stroke-width="14"/><circle cx="118" cy="118" r="18"/>`,
  kids: `<path d="M118 18 L146 92 L226 92 L162 138 L186 214 L118 168 L50 214 L74 138 L10 92 L90 92 Z"/>`,
  stack: `<path d="M118 20 L216 70 L118 120 L20 70 Z" opacity="0.95"/><path d="M118 100 L216 150 L118 200 L20 150 Z" opacity="0.55"/>`,
};

/** Shorten a formats entry into something that fits on a pill. */
function pill(text) {
  return text
    .replace(/\s*\(PDF \+ EPUB\)/, " · PDF + EPUB")
    .replace(/\s*\(MP3\)/, "")
    .replace(/\s*\(M4A\)[^,]*/, "")
    .replace(/\s*\(PDF\)/, "")
    .replace(/\s*·\s*~?[\d.]+\s*(hours?|minutes?)/i, "")
    .trim();
}

function parseProducts() {
  const src = readFileSync(path.join(ROOT, "src", "products.ts"), "utf8");
  const out = [];
  for (const block of src.split(/\n {2}\{\n/).slice(1)) {
    const slug = block.match(/slug: "([^"]+)"/);
    if (!slug) continue;
    if (/\n {4}image: "/.test(block)) continue; // already has artwork
    const fmts = block.match(/formats: \[(.*?)\]/s);
    out.push({
      slug: slug.group ? slug.group(1) : slug[1],
      title: block.match(/title: "([^"]+)"/)[1],
      subtitle: (block.match(/subtitle: "([^"]*)"/) || ["", ""])[1],
      category: block.match(/category: "([^"]+)"/)[1],
      formats: fmts
        ? fmts[1].split(/",\s*/).map((x) => x.replace(/^\s*"|"\s*$/g, "").trim()).filter(Boolean)
        : [],
    });
  }
  return out;
}

function html(p) {
  const acc = ACCENT[p.category] ?? ACCENT.mindset;
  const lines = TITLE_LINES[p.slug] ?? [p.title, ""];
  const pills = p.formats.map(pill).filter(Boolean).slice(0, 3);
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:675px;background:#0d0b14;overflow:hidden;position:relative;
       font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .glow{position:absolute;inset:0;
        background:radial-gradient(900px 600px at 88% 22%, ${acc.a}1f, transparent 60%),
                   radial-gradient(700px 500px at 4% 96%, ${acc.b}1a, transparent 62%)}
  .bar{position:absolute;left:0;top:0;bottom:0;width:7px;
       background:linear-gradient(180deg, ${acc.a}, ${acc.b})}
  .wrap{position:absolute;inset:0;padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between}
  .eyebrow{display:flex;align-items:center;gap:16px}
  .chip{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,${acc.a},${acc.b})}
  .eyebrow span{font-size:17px;font-weight:700;letter-spacing:.20em;color:#a49dbd}
  h1{font-family:Sora,system-ui,sans-serif;font-weight:800;font-size:78px;line-height:1.03;
     letter-spacing:-.025em;color:#ece9f4;max-width:720px}
  h1 .accent{background:linear-gradient(90deg,${acc.a},${acc.b});-webkit-background-clip:text;
             background-clip:text;color:transparent;display:block}
  .sub{margin-top:22px;font-size:23px;font-weight:600;color:#a49dbd;max-width:660px;line-height:1.35}
  .pills{display:flex;gap:14px;flex-wrap:wrap}
  .p{background:#1a1526;border:1px solid #2b2440;border-radius:999px;padding:13px 24px;
     font-size:16px;font-weight:600;color:#ece9f4}
  .motif{position:absolute;right:78px;top:196px;width:288px;height:288px;border-radius:44px;
         border:2px solid ${acc.a}38;display:grid;place-items:center}
  .motif svg{width:150px;height:150px;color:${acc.a};opacity:.34}
  </style></head><body>
  <div class="glow"></div><div class="bar"></div>
  <div class="motif"><svg viewBox="0 0 236 236" fill="currentColor">${GLYPH[p.category] ?? GLYPH.mindset}</svg></div>
  <div class="wrap">
    <div class="eyebrow"><div class="chip"></div><span>WICKED STACKS &nbsp;·&nbsp; ${acc.label}</span></div>
    <div>
      <h1>${esc(lines[0])}${lines[1] ? `<span class="accent">${esc(lines[1])}</span>` : ""}</h1>
      ${p.subtitle ? `<div class="sub">${esc(p.subtitle)}</div>` : ""}
    </div>
    <div class="pills">${pills.map((t) => `<div class="p">${esc(t)}</div>`).join("")}</div>
  </div></body></html>`;
}

const products = parseProducts();
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
// 1200x675 at 1x — the standard og:image size. Rendering at 2x quadrupled
// the file size for images that load on every product page and get downscaled
// by every social preview anyway.
const page = await browser.newPage({ viewport: { width: 1200, height: 675 } });

const written = [];
for (const p of products) {
  await page.setContent(html(p), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${p.slug}.png`);
  await page.screenshot({ path: file });
  written.push(`${p.slug}.png`);
  console.log(`  ${p.slug}.png`);
}
await browser.close();
console.log(`\n${written.length} covers written to public/covers/`);

/**
 * Render every route to real HTML after the Vite build.
 *
 * The store is a single-page app, which meant all 34 URLs shipped the same
 * <head> — and that head carried `<link rel="canonical" href="…/">`. Every
 * product page was therefore telling Google it *was* the homepage, which is
 * not a missing optimisation but an instruction to drop nineteen product
 * pages from the index. Titles, descriptions and social cards were identical
 * everywhere for the same reason, and the crawlers behind ChatGPT, Claude and
 * Perplexity don't run JavaScript at all, so to them the whole catalog was
 * one page.
 *
 * This renders each route through the same React components the browser uses
 * — one source of truth, no second copy of the markup to drift — and writes
 * the result with a head that describes that page and nothing else. React
 * takes over on mount exactly as before.
 *
 * Vercel checks the filesystem before applying rewrites, so dist/p/<slug>/
 * index.html wins over the SPA catch-all in vercel.json. The catch-all stays
 * as the fallback for anything not prerendered.
 */
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const SITE_URL = "https://wickedstacks.com";
const OUT = "dist";
const CACHE = "node_modules/.cache/ws-prerender.cjs";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* ------------------------------------------------------------------ */
/* Bundle the app for Node                                             */
/* ------------------------------------------------------------------ */

mkdirSync("node_modules/.cache", { recursive: true });

await build({
  stdin: {
    contents: `
      const { renderToStaticMarkup } = require("react-dom/server");
      const { StaticRouter } = require("react-router-dom/server");
      const App = require("./src/App").default;
      const { PRODUCTS, CATEGORY_LABELS } = require("./src/products");
      const { POSTS } = require("./src/posts");
      const React = require("react");

      const routes = [];
      routes.push({ url: "/", kind: "home" });
      for (const p of PRODUCTS) routes.push({ url: "/p/" + p.slug, kind: "product", slug: p.slug });
      for (const c of Object.keys(CATEGORY_LABELS)) routes.push({ url: "/c/" + c, kind: "category", slug: c });
      routes.push({ url: "/blog", kind: "blogIndex" });
      for (const b of POSTS) routes.push({ url: "/blog/" + b.slug, kind: "post", slug: b.slug });

      const rendered = routes.map((r) => ({
        ...r,
        html: renderToStaticMarkup(
          React.createElement(StaticRouter, { location: r.url }, React.createElement(App)),
        ),
      }));

      console.log(JSON.stringify({ rendered, PRODUCTS, POSTS, CATEGORY_LABELS }));
    `,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  bundle: true,
  platform: "node",
  // ESM output fails here with "Dynamic require of \\"stream\\" is not
  // supported" — react-dom/server reaches for Node built-ins at load time.
  format: "cjs",
  jsx: "automatic",
  loader: { ".css": "empty" },
  outfile: CACHE,
  logLevel: "silent",
});

const payload = execSync(`node ${CACHE}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const { rendered, PRODUCTS, POSTS, CATEGORY_LABELS } = JSON.parse(payload);

/* ------------------------------------------------------------------ */
/* Per-route head                                                      */
/* ------------------------------------------------------------------ */

const bySlug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));
const postBySlug = Object.fromEntries(POSTS.map((p) => [p.slug, p]));

/** Schema type that matches what the thing actually is. */
function productSchema(p) {
  const url = `${SITE_URL}/p/${p.slug}`;
  const offer = {
    "@type": "Offer",
    price: String(p.price),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url,
  };
  if (p.category === "courses") {
    return {
      "@context": "https://schema.org",
      "@type": "Course",
      name: p.title,
      description: p.blurb,
      url,
      provider: { "@type": "Organization", name: "Wicked Stacks", url: SITE_URL },
      offers: offer,
    };
  }
  if (p.category === "stack") {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.title,
      description: p.blurb,
      url,
      brand: { "@type": "Brand", name: "Wicked Stacks" },
      offers: offer,
    };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: p.title,
    description: p.blurb,
    url,
    bookFormat: "https://schema.org/EBook",
    author: { "@type": "Person", name: "Michael Gardner" },
    offers: offer,
  };
}

function meta(route) {
  if (route.kind === "product") {
    const p = bySlug[route.slug];
    return {
      title: `${p.title} — ${p.subtitle} | Wicked Stacks`,
      description: p.blurb,
      ogType: "product",
      jsonLd: productSchema(p),
    };
  }
  if (route.kind === "category") {
    const label = CATEGORY_LABELS[route.slug];
    const items = PRODUCTS.filter((p) => p.category === route.slug);
    return {
      title: `${label} — Wicked Stacks`,
      description: `${label} from Wicked Stacks: ${items
        .slice(0, 4)
        .map((p) => p.title)
        .join(", ")}. Every format included, instant delivery.`,
      ogType: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: label,
        url: `${SITE_URL}/c/${route.slug}`,
        hasPart: items.map((p) => ({
          "@type": "Product",
          name: p.title,
          url: `${SITE_URL}/p/${p.slug}`,
        })),
      },
    };
  }
  if (route.kind === "post") {
    const b = postBySlug[route.slug];
    return {
      title: `${b.title} — The Wicked Blog`,
      description: b.excerpt,
      ogType: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: b.title,
        description: b.excerpt,
        datePublished: b.date,
        author: { "@type": "Person", name: "Michael Gardner" },
        publisher: { "@type": "Organization", name: "Wicked Stacks", url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${b.slug}` },
      },
    };
  }
  if (route.kind === "blogIndex") {
    return {
      title: "The Wicked Blog — Wicked Stacks",
      description:
        "Plain-spoken writing on business, money, motivation and getting unstuck — from the desk of Michael Gardner.",
      ogType: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "The Wicked Blog",
        url: `${SITE_URL}/blog`,
      },
    };
  }
  return null; // home keeps the head it already has
}

/* ------------------------------------------------------------------ */
/* Write the pages                                                     */
/* ------------------------------------------------------------------ */

const template = readFileSync(path.join(OUT, "index.html"), "utf8");
const MARKER = '<div id="root"></div>';
if (!template.includes(MARKER)) throw new Error("prerender: no empty #root in dist/index.html");

/** Swap one tag's content, matched on the attribute that identifies it. */
function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: expected tag not found — ${pattern}`);
  return html.replace(pattern, replacement);
}

let written = 0;

for (const route of rendered) {
  const m = meta(route);
  const canonical = route.url === "/" ? `${SITE_URL}/` : SITE_URL + route.url;

  let html = template;

  if (m) {
    html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`);
    html = setTag(
      html,
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${esc(m.description)}" />`,
    );
    html = setTag(
      html,
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${esc(m.title)}" />`,
    );
    html = setTag(
      html,
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${esc(m.description)}" />`,
    );
    html = setTag(
      html,
      /<meta\s+property="og:type"[\s\S]*?\/>/,
      `<meta property="og:type" content="${m.ogType}" />`,
    );
    html = setTag(
      html,
      /<meta\s+name="twitter:title"[\s\S]*?\/>/,
      `<meta name="twitter:title" content="${esc(m.title)}" />`,
    );
    html = setTag(
      html,
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${esc(m.description)}" />`,
    );
    html = html.replace(
      "</head>",
      `  <script type="application/ld+json">${JSON.stringify(m.jsonLd)}</script>\n  </head>`,
    );
  }

  // Canonical and og:url are per-page on every route, home included — this is
  // the tag that was telling Google the whole catalog was one page.
  html = setTag(html, /<link rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${canonical}" />`);
  html = setTag(
    html,
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${canonical}" />`,
  );

  html = html.replace(MARKER, `<div id="root">${route.html}</div>`);

  const dir = route.url === "/" ? OUT : path.join(OUT, route.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
  written++;
}

const home = readFileSync(path.join(OUT, "index.html"), "utf8");
if (home.includes(MARKER)) throw new Error("prerender: homepage body was not filled");
if (home.length < 20000) throw new Error(`prerender: homepage suspiciously small (${home.length})`);

console.log(`prerender ok — ${written} routes written as real HTML`);

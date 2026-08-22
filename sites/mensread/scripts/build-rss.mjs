/**
 * Generates public/rss.xml from the article data at build time.
 *
 * The articles live in TypeScript modules, so they're bundled with esbuild
 * (already present as a Vite dependency) into a temp ESM file, imported, and
 * flattened. Runs before `vite build`, so Vite copies the finished feed out
 * of public/ into dist/ like any other static asset.
 */
import { build } from "esbuild";
import { readdirSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const SITE = JSON.parse(readdirSync("scripts").includes("rss.config.json")
  ? (await import("node:fs")).readFileSync("scripts/rss.config.json", "utf8")
  : "{}");

const { title, link, description, language = "en-us", articlePath = "article" } = SITE;
if (!title || !link) {
  console.error("scripts/rss.config.json needs at least { title, link, description }");
  process.exit(1);
}

const dataDir = "src/data";
const files = readdirSync(dataDir).filter((f) => /^articles[-\d]/i.test(f) && f.endsWith(".ts"));
if (!files.length) {
  console.error(`No article modules found in ${dataDir}`);
  process.exit(1);
}

// One entry point that re-exports every article module.
const entry = path.resolve(".rss-entry.ts");
writeFileSync(entry, files.map((f, i) => `export * as m${i} from "./${dataDir}/${f.replace(/\.ts$/, "")}";`).join("\n"));

const outfile = path.resolve(".rss-bundle.mjs");
await build({ entryPoints: [entry], bundle: true, format: "esm", outfile, logLevel: "silent", platform: "node" });

const mod = await import(pathToFileURL(outfile).href);
unlinkSync(entry);
unlinkSync(outfile);

// Collect every exported array that looks like a list of articles.
const articles = [];
for (const ns of Object.values(mod)) {
  for (const value of Object.values(ns ?? {})) {
    if (Array.isArray(value) && value[0]?.slug && value[0]?.title) articles.push(...value);
  }
}

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The two sites name the date field differently.
const when = (a) => new Date(a.publishDate ?? a.date ?? 0);

const items = articles
  .filter((a) => !Number.isNaN(when(a).getTime()))
  .sort((a, b) => when(b) - when(a))
  .slice(0, 50)
  .map((a) => {
    const url = `${link.replace(/\/$/, "")}/${articlePath}/${a.slug}`;
    return `    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${when(a).toUTCString()}</pubDate>
      <dc:creator>${esc(a.author)}</dc:creator>
      <category>${esc(a.category)}</category>
      <description>${esc(a.excerpt ?? a.metaDescription)}</description>
    </item>`;
  })
  .join("\n");

const now = new Date().toUTCString();
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(title)}</title>
    <link>${esc(link)}</link>
    <description>${esc(description)}</description>
    <language>${esc(language)}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${esc(link.replace(/\/$/, ""))}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

mkdirSync("public", { recursive: true });
writeFileSync("public/rss.xml", feed);
console.log(`rss.xml — ${articles.length} articles found, newest ${Math.min(articles.length, 50)} in the feed`);

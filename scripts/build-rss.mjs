/**
 * Generates public/rss.xml for the Wicked Stacks blog from src/posts.ts.
 * Runs before `vite build`, so the finished feed is copied into dist/.
 */
import { build } from "esbuild";
import { writeFileSync, unlinkSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const LINK = "https://wickedstacks.com";
const outfile = path.resolve(".rss-bundle.mjs");

await build({
  entryPoints: ["src/posts.ts"],
  bundle: true, format: "esm", outfile, logLevel: "silent", platform: "node",
});
const { POSTS } = await import(pathToFileURL(outfile).href);
unlinkSync(outfile);

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const items = [...POSTS]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((p) => {
    const url = `${LINK}/blog/${p.slug}`;
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <dc:creator>Michael Gardner</dc:creator>
      <category>${esc(p.category)}</category>
      <description>${esc(p.excerpt)}</description>
    </item>`;
  })
  .join("\n");

writeFileSync("public/rss.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>The Wicked Blog</title>
    <link>${LINK}/blog</link>
    <description>Ideas from the books, argued in public. No fluff, no guru voice.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${LINK}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`);
console.log(`rss.xml — ${POSTS.length} blog posts`);

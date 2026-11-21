import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Ping IndexNow (Bing / Yandex / Seznam / Naver) with every URL in the built sitemap.
 * Static sites cannot ping on publish, so run this after the GitHub Pages deploy:
 *   pnpm indexnow
 * The key file lives in public/ and is served at the keyLocation below.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const keyFile = "indexnow-d48886bd616d8c070440fb4571948abd.txt";
const key = keyFile.replace(/\.txt$/, "");
const host = "claritys.web.id";

const sitemap = readFileSync(join(root, "dist", "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("dist/sitemap.xml has no <loc> entries; build and deploy first.");

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${keyFile}`,
    urlList,
  }),
});
const body = await response.text();
console.log(`IndexNow: ${response.status} — submitted ${urlList.length} URLs`);
if (body) console.log(body.slice(0, 500));
if (!response.ok) process.exitCode = 1;

import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * GitHub Pages serves extensionless files as application/octet-stream, which
 * breaks social-card crawlers. Next's image routes emit `opengraph-image`,
 * `opengraph-image-<hash>`, `twitter-image`, etc. with no extension.
 * Copy each to a real .png and point the generated <meta> URLs at the .png.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const imageRoute = /^(?:opengraph-image|twitter-image)(?:-[a-z0-9]+)?$/;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(dist);
let copied = 0;
for (const file of files) {
  if (!imageRoute.test(basename(file)) || !statSync(file).isFile()) continue;
  const png = `${file}.png`;
  if (!existsSync(png)) {
    copyFileSync(file, png);
    copied += 1;
  }
}

let rewritten = 0;
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  const fixed = html.replace(/(opengraph-image|twitter-image)(-[a-z0-9]+)?(?=\?|")/g, "$1$2.png");
  if (fixed !== html) {
    writeFileSync(file, fixed);
    rewritten += 1;
  }
}

console.log(`OG images: ${copied} .png copies, ${rewritten} HTML files repointed`);

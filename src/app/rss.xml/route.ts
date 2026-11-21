import { getProfile, getSiteConfig, listWriteups } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value.replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char] ?? char);

/** RSS 2.0 built from published writeups only — new content appears here without editing any config. */
export async function GET() {
  const [writeups, profile, site] = await Promise.all([listWriteups(), getProfile(), getSiteConfig()]);
  const base = siteUrl();
  const title = `${profile.displayName} (${profile.alias}) — CTF Writeups`;
  const description = profile.seo.description ?? site.description;
  const items = writeups
    .map((w) => {
      const link = `${base}${w.href.replace(/\/$/, "")}/`;
      return [
        "<item>",
        `<title>${escapeXml(w.title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        w.date ? `<pubDate>${new Date(w.date).toUTCString()}</pubDate>` : "",
        `<description>${escapeXml(w.summary || `${w.category} — ${w.competition}`)}</description>`,
        `<category>${escapeXml(w.category)}</category>`,
        ...w.tags.map((tag) => `<category>${escapeXml(tag)}</category>`),
        "</item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${escapeXml(title)}</title>
<link>${escapeXml(base)}/</link>
<description>${escapeXml(description)}</description>
<language>${profile.seo.locale ?? "en-US"}</language>
<lastBuildDate>${new Date(writeups.map((w) => w.updated).sort().at(-1) ?? Date.now()).toUTCString()}</lastBuildDate>
<generator>Claritys portfolio</generator>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

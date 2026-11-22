import type { MetadataRoute } from "next";
import { listAchievements } from "@/lib/data/achievements";
import { listProjects } from "@/lib/data/projects";
import { listWriteups } from "@/lib/data/writeups";
import { getSiteConfig } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const site = await getSiteConfig();
  const route = (pathname: string) => {
    const clean = pathname.startsWith("/") ? pathname : "/" + pathname;
    const normalized = clean.replace(/\/{2,}/g, "/");
    if (normalized === "/") return `${base}/`;
    return base + (site.trailingSlash ? normalized.replace(/\/$/, "") + "/" : normalized.replace(/\/$/, ""));
  };
  const [writeups, projects, achievements] = await Promise.all([listWriteups(), listProjects(), listAchievements()]);
  const latest = writeups.map((w) => w.updated).sort().at(-1);
  const now = new Date().toISOString();
  const mod = (value?: string | null) => {
    if (!value) return latest ?? now;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return latest ?? now;
    // A future lastmod makes Search Console ignore the entry.
    return parsed.toISOString() > now ? now : parsed.toISOString();
  };
  // Sitemap images must be first-party and reachable; external hotlinks (e.g. GIF hosts)
  // can cause a "temporary processing error" in Search Console.
  const abs = (u: string | null) => {
    if (!u || u.startsWith("data:")) return null;
    if (u.startsWith("http")) return u.startsWith(base) ? u : null;
    return `${base}${u.startsWith("/") ? u : `/${u}`}`;
  };
  const images = (list: (string | null)[]) => list.map(abs).filter((u): u is string => !!u);

  return [
    { url: route("/"), lastModified: mod(latest), changeFrequency: "weekly", priority: 1 },
    { url: route("/writeups"), lastModified: mod(latest), changeFrequency: "weekly", priority: 0.9 },
    { url: route("/projects"), lastModified: mod(latest), changeFrequency: "monthly", priority: 0.7, images: images(projects.map((p) => p.imageUrl)) },
    { url: route("/links"), lastModified: mod(latest), changeFrequency: "monthly", priority: 0.5 },
    { url: route("/achievements"), lastModified: mod(achievements.map((a) => a.date).sort().at(-1) ?? latest), changeFrequency: "monthly", priority: 0.6, images: images(achievements.map((a) => a.imageUrl)).slice(0, 50) },
    { url: route("/about"), lastModified: mod(latest), changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((project) => ({
      url: route(`/projects/${encodeURIComponent(project.id)}`),
      lastModified: mod(latest),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: images([project.imageUrl]),
    })),
    ...writeups.map((w) => ({
      url: route(w.href),
      lastModified: mod(w.updated),
      changeFrequency: "yearly" as const,
      priority: w.category === "Pwn" ? 0.8 : 0.7,
      images: images([w.cover]),
    })),
  ];
}

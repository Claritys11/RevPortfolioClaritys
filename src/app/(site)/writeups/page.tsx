import type { Metadata } from "next";
import { SplitHeading } from "@/components/motion/split-heading";
import { SectionLabel } from "@/components/site/section-label";
import { WriteupFilter } from "@/components/site/writeup-filter";
import { getCategoryStats, getCompetitions, listWriteups } from "@/lib/data/writeups";
import { getProfile, listProjects } from "@/lib/content";
import { dynamicKeywords, jsonLdScript, pageOpenGraph, writeupCollectionJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";


function collectionDescription(count: number, stats: { count: number; category: string }[], competitions: string[]) {
  const mix = stats.map((s) => `${s.count} ${s.category.toLowerCase()}`).join(", ");
  return `${count} CTF writeups: ${mix}. From ${competitions.slice(0, 5).join(", ")} and more.`;
}

export async function generateMetadata(): Promise<Metadata> {
  const [items, stats, competitions, profile, projects] = await Promise.all([
    listWriteups(),
    getCategoryStats(),
    getCompetitions(),
    getProfile(),
    listProjects(),
  ]);
  const description = collectionDescription(items.length, stats, competitions);
  const categories = stats.map((s) => s.category);
  return {
    // Category list comes from published content, so a new category gets its own title segment.
    title: `CTF Writeups — ${categories.slice(0, 4).join(", ")}`,
    description,
    keywords: dynamicKeywords(profile, items, projects),
    alternates: { canonical: "/writeups" },
    openGraph: pageOpenGraph("/writeups", { title: `CTF Writeups by ${profile.displayName}`, description }, profile),
  };
}

export default async function WriteupsPage() {
  const [items, stats, competitions, profile] = await Promise.all([
    listWriteups(),
    getCategoryStats(),
    getCompetitions(),
    getProfile(),
  ]);
  const base = siteUrl();
  const jsonLd = writeupCollectionJsonLd(base, profile, items, collectionDescription(items.length, stats, competitions));
  return (
    <main className="mx-auto max-w-[1600px] px-4 pt-32 pb-24 md:px-8 md:pt-44">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <SectionLabel index={2} name="writeups" />
      <SplitHeading as="h1" text="Writeups" deferUntilIdle className="mt-4 mb-16 font-display text-[18vw] leading-[0.8] font-black tracking-[-0.05em] md:text-[12vw]" />
      <WriteupFilter items={items} categories={stats.map((s) => s.category)} />
    </main>
  );
}

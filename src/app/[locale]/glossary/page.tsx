import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUI, getGlossary, getEssay } from "@/lib/content";
import { chapterMeta } from "@/content/structure";
import { Reveal } from "@/components/motion/Reveal";
import { Veil } from "@/components/motion/Veil";
import { MEDIA } from "@/lib/media";
import { GlossaryList } from "@/components/features/GlossaryList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = await getUI(locale);
  return {
    title: ui.glossary.title,
    description: ui.glossary.intro,
    alternates: { canonical: `/${locale}/glossary` },
  };
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const [ui, glossary, essay] = await Promise.all([getUI(l), getGlossary(l), getEssay(l)]);

  const byN = new Map(essay.chapters.map((c) => [c.n, c]));

  const rows = Object.entries(glossary)
    .map(([id, e]) => ({
      id,
      ...e,
      chapters: chapterMeta
        .filter((m) => m.terms.includes(id))
        .map((m) => byN.get(m.n))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .slice(0, 4)
        .map((c) => ({ slug: c.slug, title: c.title })),
    }))
    .sort((a, b) => a.term.localeCompare(b.term, l === "yi" ? "he" : l));

  return (
    <div className="page glossary-page">
      <Veil art={MEDIA.veil.glossary} className="veil-page" />
      <header className="page-head shell">
        <Reveal as="p" className="eyebrow">{ui.glossary.eyebrow}</Reveal>
        <Reveal as="h1" className="page-title" delay={60}>{ui.glossary.title}</Reveal>
        <Reveal as="p" className="page-lede measure-wide" delay={110}>{ui.glossary.intro}</Reveal>
      </header>
      <div className="shell">
        <GlossaryList rows={rows} ui={ui} locale={l} />
      </div>
    </div>
  );
}

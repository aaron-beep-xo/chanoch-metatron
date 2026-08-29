import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUI, getEssay, getActs, getSourceCopy, readingMinutes, fill } from "@/lib/content";
import { acts, metaOf } from "@/content/structure";
import { Reveal } from "@/components/motion/Reveal";
import { StudyIndex } from "@/components/study/StudyIndex";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = await getUI(locale);
  return {
    title: ui.study.title,
    description: ui.modes.studyBlurb,
    alternates: { canonical: `/${locale}/study` },
  };
}

export default async function StudyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const [ui, essay, actCopy, sourceCopy] = await Promise.all([
    getUI(l),
    getEssay(l),
    getActs(l),
    getSourceCopy(l),
  ]);

  const grouped = acts.map((a) => ({
    act: a,
    copy: actCopy[a.id],
    chapters: essay.chapters
      .filter((c) => metaOf.get(c.n)?.act === a.id)
      .sort((x, y) => x.n - y.n),
  }));

  const totalMinutes = essay.chapters.reduce((n, c) => n + readingMinutes(c, l), 0);

  return (
    <div className="page study-page">
      <header className="page-head shell">
        <Reveal as="p" className="eyebrow">{ui.study.eyebrow}</Reveal>
        <Reveal as="h1" className="page-title" delay={70}>{essay.title}</Reveal>
        <Reveal as="p" className="page-heb sacred" delay={110} lang="he" dir="rtl">
          {essay.hebrewTitle}
        </Reveal>
        <Reveal as="p" className="page-lede measure-wide" delay={150}>{essay.subtitle}</Reveal>
        <Reveal as="p" className="page-meta" delay={190}>
          {essay.chapters.length} · {fill(ui.study.readingTime, { n: totalMinutes })}
        </Reveal>
      </header>

      <StudyIndex
        locale={l}
        ui={ui}
        groups={grouped.map((g) => ({
          actId: g.act.id,
          hue: g.act.hue,
          actTitle: g.copy.title,
          actSubtitle: g.copy.subtitle,
          chapters: g.chapters.map((c) => ({
            n: c.n,
            roman: c.roman,
            slug: c.slug,
            title: c.title,
            subtitle: c.subtitle,
            minutes: readingMinutes(c, l),
            layers: (metaOf.get(c.n)?.layers ?? []).map((id) => ({
              id,
              short: sourceCopy[id]?.short ?? id,
            })),
            motif: metaOf.get(c.n)!.motif,
          })),
        }))}
      />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUI, getActs, getEssay } from "@/lib/content";
import { ExperienceScroller } from "@/components/experience/ExperienceScroller";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = await getUI(locale);
  return {
    title: ui.modes.experienceTitle,
    description: ui.modes.experienceBlurb,
    alternates: { canonical: `/${locale}/experience` },
  };
}

export default async function ExperiencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const [ui, copy, essay] = await Promise.all([getUI(l), getActs(l), getEssay(l)]);

  const chapterIndex = Object.fromEntries(
    essay.chapters.map((c) => [c.n, { slug: c.slug, title: c.title }]),
  );

  return (
    <div className="experience-page">
      <ExperienceScroller copy={copy} ui={ui} locale={l} chapterIndex={chapterIndex} />
    </div>
  );
}

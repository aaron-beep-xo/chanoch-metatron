import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUI, getDignities, getSourceCopy, getEssay } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { CelestialOffice } from "@/components/features/CelestialOffice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = await getUI(locale);
  return {
    title: ui.office.title,
    description: ui.office.intro,
    alternates: { canonical: `/${locale}/office` },
  };
}

export default async function OfficePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const [ui, dignities, sourceCopy, essay] = await Promise.all([
    getUI(l),
    getDignities(l),
    getSourceCopy(l),
    getEssay(l),
  ]);

  const layerLabels = Object.fromEntries(
    Object.entries(sourceCopy).map(([k, v]) => [k, v.short]),
  );
  const chapterTitles = Object.fromEntries(
    essay.chapters.map((c) => [c.n, { title: c.title, slug: c.slug }]),
  );

  return (
    <div className="page office-page">
      <header className="page-head shell">
        <Reveal as="p" className="eyebrow">{ui.office.eyebrow}</Reveal>
        <Reveal as="h1" className="page-title" delay={60}>{ui.office.title}</Reveal>
        <Reveal as="p" className="page-lede measure-wide" delay={110}>{ui.office.intro}</Reveal>
        <Reveal as="p" className="office-paradox" delay={160}>{ui.office.paradox}</Reveal>
        <Reveal as="p" className="guardrail" delay={200}>{ui.office.guardrail}</Reveal>
      </header>

      <div className="shell">
        <CelestialOffice
          dignities={dignities}
          ui={ui}
          locale={l}
          layerLabels={layerLabels}
          chapterTitles={chapterTitles}
        />
      </div>
    </div>
  );
}

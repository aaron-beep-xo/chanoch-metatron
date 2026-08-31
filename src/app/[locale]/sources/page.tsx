import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUI, getSourceCopy, getEssay } from "@/lib/content";
import { chapterMeta, sourceLayerIds } from "@/content/structure";
import { Reveal } from "@/components/motion/Reveal";
import { Veil } from "@/components/motion/Veil";
import { MEDIA } from "@/lib/media";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = await getUI(locale);
  return {
    title: ui.sources.title,
    description: ui.sources.intro,
    alternates: { canonical: `/${locale}/sources` },
  };
}

export default async function SourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const [ui, sourceCopy, essay] = await Promise.all([getUI(l), getSourceCopy(l), getEssay(l)]);
  const byN = new Map(essay.chapters.map((c) => [c.n, c]));

  return (
    <div className="page sources-page">
      <Veil art={MEDIA.veil.sources} className="veil-page" />
      <header className="page-head shell">
        <Reveal as="p" className="eyebrow">{ui.sources.eyebrow}</Reveal>
        <Reveal as="h1" className="page-title" delay={60}>{ui.sources.title}</Reveal>
        <Reveal as="p" className="page-lede measure-wide" delay={110}>{ui.sources.intro}</Reveal>
      </header>

      <div className="shell">
        <ol className="layer-list">
          {sourceLayerIds.map((id, i) => {
            const chapters = chapterMeta
              .filter((m) => m.layers.includes(id))
              .map((m) => byN.get(m.n))
              .filter((c): c is NonNullable<typeof c> => Boolean(c));
            return (
              <Reveal as="li" key={id} delay={Math.min(i, 5) * 60} className="layer-row">
                <div className="layer-head">
                  <span className={`chip chip-${id}`}>{sourceCopy[id].short}</span>
                  <h2>{sourceCopy[id].label}</h2>
                </div>
                <p className="layer-desc measure-wide">{sourceCopy[id].description}</p>
                <details className="layer-chapters">
                  <summary>
                    {ui.sources.chaptersUsing} ({chapters.length})
                  </summary>
                  <ul>
                    {chapters.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/${l}/study/${c.slug}`}>
                          <span className="layer-roman">{c.n === 0 ? ui.study.prologue : c.roman}</span>
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </Reveal>
            );
          })}
        </ol>

        <section className="policy">
          <Reveal as="h2" className="section-h">{ui.sources.citationPolicy}</Reveal>
          <Reveal as="p" className="measure-wide" delay={80}>{ui.sources.citationPolicyBody}</Reveal>
        </section>
      </div>
    </div>
  );
}

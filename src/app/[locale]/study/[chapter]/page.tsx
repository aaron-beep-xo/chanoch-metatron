import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, htmlLang, locales, type Locale } from "@/lib/i18n";
import {
  getUI,
  getEssay,
  getActs,
  getGlossary,
  getSourceCopy,
  getSlugs,
  readingMinutes,
  fill,
} from "@/lib/content";
import { metaOf, actById } from "@/content/structure";
import { Motif } from "@/components/motion/Motif";
import { Reveal } from "@/components/motion/Reveal";
import { ReadingProgress } from "@/components/study/ReadingProgress";
import { ChapterTools } from "@/components/study/ChapterTools";
import { SourceDrawer } from "@/components/study/SourceDrawer";
import { createAnnotator } from "@/lib/annotate";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return locales.flatMap((locale) => slugs.map((chapter) => ({ locale, chapter })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; chapter: string }>;
}): Promise<Metadata> {
  const { locale, chapter } = await params;
  if (!isLocale(locale)) return {};
  const essay = await getEssay(locale);
  const c = essay.chapters.find((x) => x.slug === chapter);
  if (!c) return {};
  return {
    title: c.title,
    description: c.subtitle,
    alternates: {
      canonical: `/${locale}/study/${chapter}`,
      languages: {
        ...Object.fromEntries(locales.map((x) => [htmlLang[x], `/${x}/study/${chapter}`])),
        "x-default": `/en/study/${chapter}`,
      },
    },
    openGraph: { title: c.title, description: c.subtitle, type: "article" },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; chapter: string }>;
}) {
  const { locale, chapter } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;

  const [ui, essay, actCopy, glossary, sourceCopy] = await Promise.all([
    getUI(l),
    getEssay(l),
    getActs(l),
    getGlossary(l),
    getSourceCopy(l),
  ]);

  const idx = essay.chapters.findIndex((c) => c.slug === chapter);
  if (idx < 0) notFound();
  const c = essay.chapters[idx];
  const prev = essay.chapters[idx - 1];
  const next = essay.chapters[idx + 1];
  const meta = metaOf.get(c.n)!;
  const act = actById.get(meta.act)!;

  const entries = meta.terms
    .map((id) => [id, glossary[id]] as const)
    .filter((e): e is [string, NonNullable<(typeof glossary)[string]>] => Boolean(e[1]));
  const annotate = createAnnotator([...entries], `/${l}/glossary`, ui.glossary.title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: c.title,
    alternativeHeadline: c.subtitle,
    inLanguage: htmlLang[l],
    isPartOf: { "@type": "Book", name: essay.title },
    position: c.n,
    articleSection: actCopy[act.id].title,
    description: c.subtitle,
  };

  return (
    <article className="page chapter-page" style={{ ["--act-hue" as string]: act.hue }}>
      <ReadingProgress label={ui.a11y.progressBar} />

      <nav className="breadcrumbs shell no-print" aria-label={ui.nav.chapterNavigation}>
        <ol>
          <li><Link href={`/${l}`}>{ui.nav.home}</Link></li>
          <li><Link href={`/${l}/study`}>{ui.study.title}</Link></li>
          <li aria-current="page">{c.n === 0 ? ui.study.prologue : c.roman}</li>
        </ol>
      </nav>

      <header className="chapter-head shell">
        <div className="chapter-head-text">
          <Reveal as="p" className="eyebrow">
            {c.n === 0
              ? ui.study.prologue
              : `${ui.study.chapter} ${c.roman}`}
            {" · "}
            {fill(ui.study.readingTime, { n: readingMinutes(c, l) })}
          </Reveal>
          <Reveal as="h1" className="chapter-h1" delay={60}>{c.title}</Reveal>
          <Reveal as="p" className="chapter-lede measure" delay={110}>{c.subtitle}</Reveal>
          <Reveal className="chapter-layers" delay={150}>
            {meta.layers.map((id) => (
              <span key={id} className={`chip chip-${id}`}>{sourceCopy[id].short}</span>
            ))}
          </Reveal>
        </div>
        <Reveal className="chapter-cover" delay={120}>
          <Motif id={meta.motif} />
        </Reveal>
      </header>

      <ChapterTools ui={ui} slug={c.slug} />

      <div className="chapter-body">
        <div className="chapter-prose">
          {c.blocks.map((b, i) =>
            b.t === "q" ? (
              <blockquote key={i} className="chapter-quote">
                <p className="sacred" lang="he" dir="rtl">{b.v}</p>
                <span className="sr-only">{ui.study.quoteLabel}</span>
              </blockquote>
            ) : (
              <p key={i}>{annotate(b.v, i)}</p>
            ),
          )}
        </div>

        <aside className="chapter-aside no-print" aria-label={ui.study.sourceLayers}>
          <SourceDrawer
            ui={ui}
            layers={meta.layers.map((id) => ({ id, ...sourceCopy[id] }))}
            terms={entries.map(([id, e]) => ({ id, ...e }))}
            act={{
              label: `${ui.experience.actLabel} ${act.id === "FINALE" ? ui.experience.finaleLabel : act.id}`,
              title: actCopy[act.id].title,
              href: `/${l}/experience#act-${act.id}`,
            }}
          />
        </aside>
      </div>

      <nav className="chapter-pager shell" aria-label={ui.nav.chapterNavigation}>
        {prev ? (
          <Link href={`/${l}/study/${prev.slug}`} className="pager pager-prev">
            <span className="eyebrow">{ui.study.previousChapter}</span>
            <span className="pager-title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link href={`/${l}/study`} className="pager pager-index">
          <span className="eyebrow">{ui.study.backToContents}</span>
        </Link>
        {next ? (
          <Link href={`/${l}/study/${next.slug}`} className="pager pager-next">
            <span className="eyebrow">{ui.study.nextChapter}</span>
            <span className="pager-title">{next.title}</span>
          </Link>
        ) : (
          <span className="pager pager-end">
            <span className="eyebrow">{ui.study.endOfEssay}</span>
            <span className="pager-title">{ui.study.endOfEssayNote}</span>
          </span>
        )}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}

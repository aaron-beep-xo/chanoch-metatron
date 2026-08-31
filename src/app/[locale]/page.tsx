import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUI, getEssay } from "@/lib/content";
import { Hero } from "@/components/experience/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { Veil } from "@/components/motion/Veil";
import { acts } from "@/content/structure";
import { MEDIA } from "@/lib/media";
import { getActs } from "@/lib/content";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const [ui, essay, actCopy] = await Promise.all([getUI(l), getEssay(l), getActs(l)]);

  const grammar = [
    ui.circuit.stages.descent,
    ui.circuit.stages.reception,
    ui.circuit.stages.transformation,
    ui.circuit.stages.answer,
    ui.circuit.stages.return,
    ui.circuit.stages.dwelling,
  ];

  return (
    <>
      <Hero locale={l} ui={ui} />

      <section className="thesis" aria-labelledby="thesis-h">
        <div className="shell">
          <Reveal as="h2" className="thesis-line" id="thesis-h">
            {ui.hero.thesis}
          </Reveal>
          <Reveal as="p" className="thesis-stand measure-wide" delay={140}>
            {ui.hero.standfirst}
          </Reveal>
        </div>
      </section>

      <section className="modes" aria-label={ui.nav.primaryNavigation}>
        <div className="shell modes-grid">
          {[
            { href: `/${l}/experience`, t: ui.modes.experienceTitle, b: ui.modes.experienceBlurb, k: "01", art: MEDIA.card.experience },
            { href: `/${l}/study`, t: ui.modes.studyTitle, b: ui.modes.studyBlurb, k: "02", art: MEDIA.card.study },
            { href: `/${l}/office`, t: ui.office.title, b: ui.modes.officeBlurb, k: "03", art: MEDIA.card.office },
            { href: `/${l}/circuit`, t: ui.circuit.title, b: ui.modes.circuitBlurb, k: "04", art: MEDIA.card.circuit },
          ].map((m, i) => (
            <Reveal key={m.href} delay={i * 90}>
              <Link
                href={m.href}
                className="mode-card"
                style={{ ["--card-art" as string]: `url("${m.art}")` }}
              >
                <span className="mode-index" aria-hidden="true">{m.k}</span>
                <h3>{m.t}</h3>
                <p>{m.b}</p>
                <span className="mode-arrow" aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grammar" aria-labelledby="grammar-h">
        <div className="shell">
          <Reveal as="p" className="eyebrow" id="grammar-h">
            {ui.circuit.eyebrow}
          </Reveal>
          <ol className="grammar-list">
            {grammar.map((g: string, i: number) => (
              <Reveal as="li" key={i} delay={i * 70}>
                <span className="grammar-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span className="grammar-t">{g}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="acts-index" aria-labelledby="acts-h">
        <Veil art={MEDIA.veil.experience} className="veil-section" />
        <div className="shell">
          <Reveal as="h2" id="acts-h" className="section-h">
            {ui.modes.experienceTitle}
          </Reveal>
          <ol className="acts-list">
            {acts.map((a, i) => (
              <Reveal as="li" key={a.id} delay={Math.min(i, 6) * 60} style={{ ["--act-hue" as string]: a.hue }}>
                <Link href={`/${l}/experience#act-${a.id}`}>
                  <span className="act-num" aria-hidden="true">
                    {a.id === "FINALE" ? "·" : a.id}
                  </span>
                  <span className="act-body">
                    <span className="act-title">{actCopy[a.id].title}</span>
                    <span className="act-sub">{actCopy[a.id].subtitle}</span>
                  </span>
                  <span className="act-heb sacred-sm" lang="he" dir="rtl" aria-hidden="true">
                    {actCopy[a.id].hebrew}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-study" aria-labelledby="home-study-h">
        <div className="shell home-study-inner">
          <div>
            <Reveal as="p" className="eyebrow">{ui.study.eyebrow}</Reveal>
            <Reveal as="h2" id="home-study-h" className="section-h" delay={80}>
              {essay.title}
            </Reveal>
            <Reveal as="p" className="measure" delay={140}>
              {ui.modes.studyBlurb}
            </Reveal>
            <Reveal delay={200}>
              <Link href={`/${l}/study`} className="btn btn-ghost">{ui.hero.read}</Link>
            </Reveal>
          </div>
          <Reveal className="home-study-count" delay={160}>
            <span className="count-n">{essay.chapters.length}</span>
            <span className="count-l">{ui.study.chapter}</span>
          </Reveal>
        </div>
      </section>
    </>
  );
}

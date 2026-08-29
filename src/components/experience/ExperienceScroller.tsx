"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { acts, type ActDef } from "@/content/structure";
import { useGsapScope } from "@/components/motion/useGsap";
import { usePrefs } from "@/components/chrome/Preferences";
import { Scene } from "./scenes";
import type { ActCopy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export function ExperienceScroller({
  copy,
  ui,
  locale,
  chapterIndex,
}: {
  copy: Record<string, ActCopy>;
  ui: any;
  locale: Locale;
  chapterIndex: Record<number, { slug: string; title: string }>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<ActDef>(acts[0]);
  const { reduced } = usePrefs();

  // The act accent travels with the reader even when nothing is animating.
  useEffect(() => {
    document.documentElement.style.setProperty("--act-hue", String(current.hue));
    return () => {
      document.documentElement.style.removeProperty("--act-hue");
    };
  }, [current]);

  // Reduced motion still needs the accent to follow the reader, so act tracking
  // uses an IntersectionObserver that runs regardless of the motion preference.
  useEffect(() => {
    const sections = root.current?.querySelectorAll<HTMLElement>(".act");
    if (!sections?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = (visible.target as HTMLElement).dataset.act;
        const act = acts.find((a) => a.id === id);
        if (act) setCurrent(act);
      },
      { threshold: [0.15, 0.5, 0.85] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Text reveal uses the same CSS mechanism as the rest of the site rather than
  // GSAP, so a failed animation bundle can never leave an act unreadable.
  useEffect(() => {
    const targets = root.current?.querySelectorAll<HTMLElement>(".reveal");
    if (!targets?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const i = Number(el.style.getPropertyValue("--i") || 0);
          el.style.transitionDelay = `${i * 150}ms`;
          el.classList.add("is-revealed");
          io.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useGsapScope(root, ({ ScrollTrigger }, { scope: el }) => {
    const triggers: { kill: () => void }[] = [];

    el.querySelectorAll<HTMLElement>(".act").forEach((section) => {
      // --p is the scene's whole state; one scrubbed property per act.
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => section.style.setProperty("--p", self.progress.toFixed(4)),
        }),
      );
    });

    return () => triggers.forEach((t) => t.kill());
  });

  return (
    <div className="exp" ref={root}>
      <nav className="act-rail no-print" aria-label={ui.experience.actsRail}>
        <ol>
          {acts.map((a) => (
            <li key={a.id}>
              <a
                href={`#act-${a.id}`}
                className={a.id === current.id ? "is-current" : undefined}
                aria-current={a.id === current.id ? "true" : undefined}
              >
                <span className="rail-mark" aria-hidden="true" />
                <span className="rail-label">
                  {a.id === "FINALE" ? ui.experience.finaleLabel : a.id}
                </span>
                <span className="sr-only">{copy[a.id].title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {acts.map((a) => {
        const c = copy[a.id];
        return (
          <section
            key={a.id}
            id={`act-${a.id}`}
            className="act"
            data-act={a.id}
            style={{ ["--act-hue" as string]: a.hue }}
            aria-labelledby={`act-h-${a.id}`}
          >
            <div className="act-sticky">
              <div className="shell act-grid">
                <div className="act-text">
                  <p className="eyebrow act-eyebrow">
                    {a.id === "FINALE"
                      ? ui.experience.finaleLabel
                      : `${ui.experience.actLabel} ${a.id}`}
                  </p>
                  <h2 id={`act-h-${a.id}`} className="act-headline reveal">
                    {c.title}
                  </h2>
                  <p className="act-subtitle">{c.subtitle}</p>
                  <p className="act-hebrew sacred" lang="he" dir="rtl">{c.hebrew}</p>

                  <div className="act-lines">
                    {c.lines.map((line, i) => (
                      <p className="act-line reveal" key={i} style={{ ["--i" as string]: i }}>{line}</p>
                    ))}
                  </div>

                  <div className="act-links">
                    {a.chapters
                      .map((n) => chapterIndex[n])
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((ch) => (
                        <Link key={ch.slug} href={`/${locale}/study/${ch.slug}`} className="act-chapter">
                          {ch.title}
                        </Link>
                      ))}
                  </div>
                </div>

                <figure className="act-scene">
                  <Scene act={a} />
                  <figcaption className={reduced ? "act-caption is-shown" : "act-caption"}>
                    <span className="eyebrow">{ui.experience.sceneDescription}</span>
                    <span>{c.sceneDescription}</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>
        );
      })}

      <section className="exp-out">
        <div className="shell">
          <Link href={`/${locale}/study`} className="btn btn-primary">{ui.experience.enterStudy}</Link>
          <a href="#act-I" className="btn btn-ghost">{ui.experience.restart}</a>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRef } from "react";
import { WalkPath } from "@/components/motion/WalkPath";
import { useGsapScope } from "@/components/motion/useGsap";
import type { Locale } from "@/lib/i18n";

export function Hero({ locale, ui }: { locale: Locale; ui: any }) {
  const scope = useRef<HTMLElement>(null);

  useGsapScope(scope, ({ gsap }, { scope: el }) => {
    const q = gsap.utils.selector(el);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      q(".hero-verse"),
      { opacity: 0, filter: "blur(14px)", letterSpacing: "0.28em" },
      { opacity: 1, filter: "blur(0px)", letterSpacing: "0em", duration: 2.6 },
      0.35,
    )
      .fromTo(
        q(".hero-verse-gloss"),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 1.4 },
        "-=1.2",
      )
      .fromTo(
        q(".hero-title-line"),
        { yPercent: 118, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.9, stagger: 0.13 },
        "-=0.9",
      )
      .fromTo(
        q(".hero-sub"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 1.5 },
        "-=1.1",
      )
      .fromTo(
        q(".hero-actions > *"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.11 },
        "-=0.9",
      )
      .fromTo(q(".hero-hint"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, "-=0.4");

    // The palace behind the title: depth that only reveals itself on movement.
    const depth = q(".hero-depth")[0] as HTMLElement | undefined;
    const title = q(".hero-title")[0] as HTMLElement | undefined;
    const xTo = title ? gsap.quickTo(title, "x", { duration: 1.1, ease: "power3" }) : null;
    const yTo = title ? gsap.quickTo(title, "y", { duration: 1.1, ease: "power3" }) : null;
    const dxTo = depth ? gsap.quickTo(depth, "x", { duration: 1.6, ease: "power3" }) : null;
    const dyTo = depth ? gsap.quickTo(depth, "y", { duration: 1.6, ease: "power3" }) : null;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xTo?.(nx * -9);
      yTo?.(ny * -6);
      dxTo?.(nx * 26);
      dyTo?.(ny * 18);
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    // Fade the whole opening as the reader leaves it, so nothing competes.
    gsap.to(q(".hero-stage"), {
      opacity: 0.12,
      y: -40,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });

    return () => window.removeEventListener("pointermove", onMove);
  });

  const titleWords: string[] = String(ui.site.title).split(" ");
  const mid = Math.ceil(titleWords.length / 2);
  const lines = [titleWords.slice(0, mid).join(" "), titleWords.slice(mid).join(" ")].filter(Boolean);

  return (
    <section className="hero grain" ref={scope}>
      <div className="hero-depth" aria-hidden="true">
        <span>ה</span>
        <span>י</span>
        <span>כ</span>
        <span>ל</span>
      </div>

      <div className="hero-stage shell">
        <p className="hero-verse sacred" lang="he" dir="rtl">
          {ui.hero.openingVerse}
        </p>
        <p className="hero-verse-gloss">
          <span className="translit">{ui.hero.openingVerseTranslit}</span>
          <span className="hero-gloss-sep" aria-hidden="true">·</span>
          <span>{ui.hero.openingVerseTranslation}</span>
        </p>

        <h1 className="hero-title">
          {lines.map((line, i) => (
            <span className="hero-title-mask" key={i}>
              <span className="hero-title-line">{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero-sub measure-wide">{ui.site.subtitle}</p>

        <div className="hero-actions">
          <Link href={`/${locale}/experience`} className="btn btn-primary">
            {ui.hero.enter}
          </Link>
          <Link href={`/${locale}/study`} className="btn btn-ghost">
            {ui.hero.read}
          </Link>
        </div>
      </div>

      <WalkPath steps={7} className="hero-walk" />

      <p className="hero-hint eyebrow">{ui.hero.scrollHint}</p>
    </section>
  );
}

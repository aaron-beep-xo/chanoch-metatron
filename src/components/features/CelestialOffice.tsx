"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGsapScope } from "@/components/motion/useGsap";
import { usePrefs } from "@/components/chrome/Preferences";
import type { Dignity } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/**
 * THE CELESTIAL OFFICE.
 *
 * A radial constellation of received titles. The visual argument is carried by
 * the centre: as a dignity is opened, the centre becomes MORE transparent, not
 * brighter — greatness rendered as clarity rather than as opacity.
 *
 * Every node is a real <button> inside an SVG, so the constellation is fully
 * keyboard-operable; the list view presents the identical data as prose for
 * anyone who would rather not work with the diagram at all.
 */
export function CelestialOffice({
  dignities,
  ui,
  locale,
  layerLabels,
  chapterTitles,
}: {
  dignities: Dignity[];
  ui: any;
  locale: Locale;
  layerLabels: Record<string, string>;
  chapterTitles: Record<number, { title: string; slug: string }>;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<"constellation" | "list">("constellation");
  const scope = useRef<HTMLDivElement>(null);
  const { reduced } = usePrefs();

  const active = dignities.find((d) => d.id === activeId) ?? null;

  const nodes = useMemo(
    () =>
      dignities.map((d, i) => {
        const a = (i / dignities.length) * Math.PI * 2 - Math.PI / 2;
        // Two shells, so twelve titles do not read as a clock face.
        const r = i % 2 === 0 ? 38 : 30;
        const round = (n: number) => Math.round(n * 100) / 100;
        return { d, x: round(50 + Math.cos(a) * r), y: round(50 + Math.sin(a) * r * 0.92), a };
      }),
    [dignities],
  );

  useGsapScope(
    scope,
    ({ gsap }, { scope: el }) => {
      const q = gsap.utils.selector(el);
      gsap.fromTo(
        q(".co-node"),
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 1.1, stagger: 0.06, ease: "back.out(1.7)", transformOrigin: "center" },
      );
      gsap.fromTo(q(".co-spoke"), { opacity: 0 }, { opacity: 1, duration: 1.4, stagger: 0.05, delay: 0.3 });
      gsap.to(q(".co-shell"), { rotate: 360, duration: 260, repeat: -1, ease: "none", transformOrigin: "center" });
    },
    [view],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveId(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // The centre's opacity falls as more of the office is disclosed.
  const openness = active ? 0.28 : 1;

  return (
    <div className="co" ref={scope}>
      <div className="co-viewswitch no-print" role="group" aria-label={ui.office.title}>
        <button
          type="button"
          className={view === "constellation" ? "is-on" : undefined}
          aria-pressed={view === "constellation"}
          onClick={() => setView("constellation")}
        >
          {ui.office.constellationView}
        </button>
        <button
          type="button"
          className={view === "list" ? "is-on" : undefined}
          aria-pressed={view === "list"}
          onClick={() => setView("list")}
        >
          {ui.office.listView}
        </button>
      </div>

      {view === "constellation" && (
        <div className="co-stage">
          <svg viewBox="0 0 100 100" className="co-svg" role="group" aria-label={ui.office.title}>
            <g className="co-shell" style={{ transformOrigin: "50px 50px" }}>
              <circle className="co-ring co-ring-1" cx="50" cy="50" r="38" />
              <circle className="co-ring co-ring-2" cx="50" cy="50" r="30" />
            </g>

            {nodes.map(({ d, x, y }) => (
              <line
                key={`s-${d.id}`}
                className={`co-spoke${activeId === d.id ? " is-active" : ""}`}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
              />
            ))}

            <g className="co-centre" style={{ opacity: openness }}>
              <circle className="co-centre-halo" cx="50" cy="50" r="13" />
              <circle className="co-centre-core" cx="50" cy="50" r="8.5" />
            </g>

            {nodes.map(({ d, x, y }) => (
              <g key={d.id} className={`co-node${activeId === d.id ? " is-active" : ""}`}>
                <circle className="co-node-halo" cx={x} cy={y} r="2.6" />
                <circle className="co-node-dot" cx={x} cy={y} r="1.05" />
                <foreignObject x={x - 12} y={y - 12} width="24" height="24">
                  <button
                    type="button"
                    className="co-hit"
                    aria-pressed={activeId === d.id}
                    onClick={() => setActiveId(activeId === d.id ? null : d.id)}
                  >
                    <span className="sr-only">{d.title}</span>
                  </button>
                </foreignObject>
              </g>
            ))}
          </svg>

          <div className="co-centre-label" aria-hidden="true" style={{ opacity: openness }}>
            <span className="co-centre-heb sacred-sm" lang="he" dir="rtl">{ui.office.centreHebrew}</span>
            <span className="co-centre-title">{ui.office.centre}</span>
            <span className="co-centre-translit translit">{ui.office.centreTranslit}</span>
          </div>

          <ul className="co-labels" aria-hidden={reduced ? undefined : "true"}>
            {nodes.map(({ d, x, y }) => (
              <li
                key={d.id}
                className={activeId === d.id ? "is-active" : undefined}
                style={{ insetInlineStart: `${x}%`, top: `${y}%` }}
              >
                <span>{d.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === "list" && (
        <ul className="co-list">
          {dignities.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className={`co-list-btn${activeId === d.id ? " is-on" : ""}`}
                aria-expanded={activeId === d.id}
                onClick={() => setActiveId(activeId === d.id ? null : d.id)}
              >
                <span className="co-list-heb sacred-sm" lang="he" dir="rtl">{d.hebrew}</span>
                <span className="co-list-title">{d.title}</span>
                <span className={`chip chip-${d.layer}`}>{layerLabels[d.layer]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="co-panel" aria-live="polite">
        {active ? (
          <article className="co-card" key={active.id}>
            <p className="co-card-heb sacred" lang="he" dir="rtl">{active.hebrew}</p>
            <p className="translit co-card-translit" dir="ltr">{active.translit}</p>
            <h3>{active.title}</h3>
            <span className={`chip chip-${active.layer}`}>{layerLabels[active.layer]}</span>
            <p className="co-card-body">{active.body}</p>

            <div className="co-card-facets">
              <div>
                <p className="eyebrow">{ui.office.bittulLabel}</p>
                <p>{active.bittul}</p>
              </div>
              <div>
                <p className="eyebrow">{ui.office.relationLabel}</p>
                <p>{active.reception}</p>
              </div>
            </div>

            <p className="eyebrow co-card-more">{ui.office.chaptersLabel}</p>
            <ul className="co-card-links">
              {active.chapters
                .filter((n) => chapterTitles[n])
                .map((n) => (
                  <li key={n}>
                    <Link href={`/${locale}/study/${chapterTitles[n].slug}`}>{chapterTitles[n].title}</Link>
                  </li>
                ))}
            </ul>
          </article>
        ) : (
          <p className="co-prompt">{ui.office.selectPrompt}</p>
        )}
      </div>
    </div>
  );
}

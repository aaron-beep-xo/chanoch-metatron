"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefs } from "@/components/chrome/Preferences";
import type { MalchusFacet } from "@/lib/content";
import { fill } from "@/lib/format";

const STAGES = ["descent", "reception", "transformation", "answer", "return", "dwelling"] as const;
type Stage = (typeof STAGES)[number];

/**
 * THE MALCHUS CIRCUIT.
 *
 * or yashar ↓ → vessel → transformation → answer → or chozer ↑ → dwelling.
 *
 * The point the diagram has to make is that the receiver ADDS something. So the
 * returning arc is deliberately not the mirror of the descending line: it is
 * wider, it encircles, and it carries a colour the descending light did not
 * have. Stage state is plain React, so the whole thing works identically when
 * motion is reduced — it simply stops advancing on its own.
 */
export function MalchusCircuit({
  facets,
  ui,
}: {
  facets: MalchusFacet[];
    ui: any;
}) {
  const [facetId, setFacetId] = useState(facets[0]?.id ?? "moon");
  const [stage, setStage] = useState(0);
  const [playRequested, setPlayRequested] = useState(false);
  const { reduced } = usePrefs();
  const timer = useRef<number | null>(null);

  const facet = facets.find((f) => f.id === facetId) ?? facets[0];

  const stop = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  }, []);

  // Derived, not stored: a reader who has asked for less motion never gets an
  // auto-advancing diagram, whatever the transport button last said.
  const playing = playRequested && !reduced;
  const setPlaying = setPlayRequested;

  useEffect(() => {
    if (!playing) {
      stop();
      return;
    }
    timer.current = window.setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 2600);
    return stop;
  }, [playing, stop]);

  const current: Stage = STAGES[stage];
  const facetText: Record<Stage, string> = {
    descent: facet.descent,
    reception: facet.reception,
    transformation: facet.body,
    answer: facet.answer,
    return: facet.return,
    dwelling: facet.body,
  };

  return (
    <div className="mc">
      <div className="mc-opening">
        <p className="sacred" lang="he" dir="rtl">{ui.circuit.opening}</p>
        <p className="translit" dir="ltr">{ui.circuit.openingTranslit}</p>
        <p className="mc-opening-tr">{ui.circuit.openingTranslation}</p>
      </div>

      <p className="mc-notice">{ui.circuit.analogyNotice}</p>

      <div className="mc-body">
        <div className="mc-stage" data-stage={current}>
          <svg viewBox="0 0 340 470" className="mc-svg" role="img" aria-label={ui.circuit.title}>
            <defs>
              <linearGradient id="mc-down" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-flame)" stopOpacity="0.05" />
                <stop offset="60%" stopColor="var(--accent-bright)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="mc-up" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--color-moon)" stopOpacity="0.2" />
                <stop offset="60%" stopColor="var(--color-moon)" stopOpacity="0.95" />
                <stop offset="100%" stopColor="var(--color-moon)" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {/* The Source is never drawn as a figure — only as the boundary the
                light comes past. */}
            <text className="mc-label" x="170" y="14" textAnchor="middle">
              {ui.circuit.stages.descent}
            </text>
            <line className="mc-source" x1="46" y1="30" x2="294" y2="30" />

            {/* or yashar */}
            {[136, 170, 204].map((x, i) => (
              <line
                key={x}
                className="mc-down"
                style={{ ["--i" as string]: i }}
                x1={x}
                y1="38"
                x2={x}
                y2="176"
                stroke="url(#mc-down)"
              />
            ))}

            {/* the receiving vessel */}
            <path className="mc-basin-fill" d="M100 182 C 100 254, 240 254, 240 182 Z" />
            <path className="mc-basin" d="M100 182 C 100 254, 240 254, 240 182" />
            <line className="mc-basin-lip" x1="100" y1="182" x2="240" y2="182" />

            {/* transformation: the interior changes what it holds */}
            <circle className="mc-core" cx="170" cy="212" r="18" />

            {/* answer: speech leaving the vessel and reaching the floor */}
            <path className="mc-answer" d="M170 232 C 170 300, 142 322, 170 396" />

            {/* or chozer: two open arcs, wider than the descent, rising back
                toward the Source without ever closing into a second circle */}
            <path className="mc-return" pathLength={100} d="M104 218 C 58 190, 62 88, 126 48" stroke="url(#mc-up)" />
            <path className="mc-arrow" d="M126 48 L120 62 M126 48 L136 58" />
            <path className="mc-return mc-return-2" pathLength={100} d="M236 218 C 282 190, 278 88, 214 48" stroke="url(#mc-up)" />
            <path className="mc-arrow mc-arrow-2" d="M214 48 L220 62 M214 48 L204 58" />

            {/* dwelling: the lower world holding the light */}
            <line className="mc-floor" x1="46" y1="410" x2="294" y2="410" />
            {[100, 170, 240].map((x, i) => (
              <rect key={x} className="mc-object" style={{ ["--i" as string]: i }} x={x - 17} y="380" width="34" height="30" rx="2" />
            ))}
            <text className="mc-label" x="170" y="440" textAnchor="middle">
              {ui.circuit.stages.dwelling}
            </text>
          </svg>
        </div>

        <div className="mc-panel">
          <div className="mc-facets" role="group" aria-label={ui.circuit.metaphorPrompt}>
            <p className="eyebrow">{ui.circuit.metaphorLabel}</p>
            <div className="mc-facet-btns">
              {facets.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`mc-facet${f.id === facetId ? " is-on" : ""}`}
                  aria-pressed={f.id === facetId}
                  onClick={() => setFacetId(f.id)}
                >
                  {f.title}
                </button>
              ))}
            </div>
          </div>

          <div className="mc-readout" aria-live="polite">
            <p className="eyebrow">
              {fill(ui.circuit.stageLabel, { n: stage + 1, total: STAGES.length })} ·{" "}
              {ui.circuit.stages[current]}
            </p>
            <p className="mc-readout-text">{facetText[current]}</p>
          </div>

          <div className="mc-transport no-print">
            <button type="button" className="ctool" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
              {playing ? ui.circuit.pauseLabel : ui.circuit.playLabel}
            </button>
            <button type="button" className="ctool" onClick={() => { setPlaying(false); setStage(0); }}>
              {ui.circuit.restartLabel}
            </button>
            <ol className="mc-steps">
              {STAGES.map((s, i) => (
                <li key={s}>
                  <button
                    type="button"
                    className={`mc-step${i === stage ? " is-on" : ""}`}
                    aria-current={i === stage ? "step" : undefined}
                    onClick={() => { setPlaying(false); setStage(i); }}
                  >
                    <span className="sr-only">{ui.circuit.stages[s]}</span>
                    <span aria-hidden="true">{i + 1}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Accessible equivalent — the same content as a table, always present. */}
      <details className="mc-table">
        <summary>{ui.a11y.diagramTable}</summary>
        <table>
          <caption className="sr-only">{ui.circuit.title}</caption>
          <thead>
            <tr>
              <th scope="col">{ui.circuit.metaphorLabel}</th>
              {STAGES.slice(0, 5).map((s) => (
                <th key={s} scope="col">{ui.circuit.stages[s]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {facets.map((f) => (
              <tr key={f.id}>
                <th scope="row">{f.title}</th>
                <td>{f.descent}</td>
                <td>{f.reception}</td>
                <td>{f.body}</td>
                <td>{f.answer}</td>
                <td>{f.return}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

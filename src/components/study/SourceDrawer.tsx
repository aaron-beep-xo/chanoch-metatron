"use client";

import Link from "next/link";
import { usePrefs } from "@/components/chrome/Preferences";

export function SourceDrawer({
  ui,
  layers,
  terms,
  act,
}: {
  ui: any;
  layers: { id: string; label: string; short: string; description: string }[];
  terms: { id: string; term: string; hebrew: string; translit: string; definition: string }[];
  act: { label: string; title: string; href: string };
}) {
  const { sourceNotes, translit } = usePrefs();

  return (
    <div className="drawer">
      <section className="drawer-block">
        <p className="eyebrow">{ui.study.relatedAct}</p>
        <Link href={act.href} className="drawer-act">
          <span className="drawer-act-label">{act.label}</span>
          <span className="drawer-act-title">{act.title}</span>
        </Link>
      </section>

      {sourceNotes && (
        <section className="drawer-block">
          <p className="eyebrow">{ui.study.sourceLayers}</p>
          <dl className="drawer-layers">
            {layers.map((s) => (
              <div key={s.id}>
                <dt><span className={`chip chip-${s.id}`}>{s.short}</span> {s.label}</dt>
                <dd>{s.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {terms.length > 0 && (
        <section className="drawer-block">
          <p className="eyebrow">{ui.study.termsInThisChapter}</p>
          <dl className="drawer-terms">
            {terms.map((t) => (
              <div key={t.id}>
                <dt>
                  <span className="drawer-term">{t.term}</span>
                  <span className="drawer-heb sacred-sm" lang="he" dir="rtl">{t.hebrew}</span>
                  {translit && <span className="translit" dir="ltr"> {t.translit}</span>}
                </dt>
                <dd>{t.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}

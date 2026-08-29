"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePrefs } from "@/components/chrome/Preferences";
import { slugOf } from "@/components/study/GlossaryTerm";
import type { Locale } from "@/lib/i18n";

interface Row {
  id: string;
  term: string;
  hebrew: string;
  translit: string;
  definition: string;
  chapters: { slug: string; title: string }[];
}

export function GlossaryList({ rows, ui, locale }: { rows: Row[]; ui: any; locale: Locale }) {
  const [q, setQ] = useState("");
  const { translit } = usePrefs();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (r) =>
        r.term.toLowerCase().includes(needle) ||
        r.translit.toLowerCase().includes(needle) ||
        r.hebrew.includes(q.trim()) ||
        r.definition.toLowerCase().includes(needle),
    );
  }, [rows, q]);

  return (
    <>
      <div className="study-toolbar no-print">
        <label className="study-search">
          <span className="sr-only">{ui.study.searchPlaceholder}</span>
          <input
            type="search"
            value={q}
            placeholder={ui.study.searchPlaceholder}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>

      <dl className="glossary-list">
        {filtered.map((r) => (
          <div className="glossary-row" key={r.id} id={slugOf(r.term)}>
            <dt>
              <span className="glossary-term">{r.term}</span>
              <span className="glossary-heb sacred-sm" lang="he" dir="rtl">{r.hebrew}</span>
              {translit && <span className="translit" dir="ltr">{r.translit}</span>}
            </dt>
            <dd>
              <p>{r.definition}</p>
              {r.chapters.length > 0 && (
                <p className="glossary-refs">
                  <span className="eyebrow">{ui.glossary.appearsIn}</span>
                  {r.chapters.map((c) => (
                    <Link key={c.slug} href={`/${locale}/study/${c.slug}`}>{c.title}</Link>
                  ))}
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {filtered.length === 0 && <p className="empty">{ui.glossary.empty}</p>}
    </>
  );
}

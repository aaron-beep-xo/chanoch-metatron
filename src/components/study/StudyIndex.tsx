"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Motif } from "@/components/motion/Motif";
import { Reveal } from "@/components/motion/Reveal";
import { usePrefs } from "@/components/chrome/Preferences";
import type { MotifId, SourceLayerId } from "@/content/structure";
import type { Locale } from "@/lib/i18n";

interface ChapterRow {
  n: number;
  roman: string;
  slug: string;
  title: string;
  subtitle: string;
  minutes: number;
  layers: { id: SourceLayerId; short: string }[];
  motif: MotifId;
}
interface Group {
  actId: string;
  hue: number;
  actTitle: string;
  actSubtitle: string;
  chapters: ChapterRow[];
}

export function StudyIndex({
  locale,
  ui,
  groups,
}: {
  locale: Locale;
  ui: any;
  groups: Group[];
}) {
  const [query, setQuery] = useState("");
  const { bookmarks } = usePrefs();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        chapters: g.chapters.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.subtitle.toLowerCase().includes(q) ||
            c.layers.some((s) => s.short.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.chapters.length > 0);
  }, [groups, query]);

  const marked = groups.flatMap((g) => g.chapters).filter((c) => bookmarks.includes(c.slug));

  return (
    <div className="shell">
      <div className="study-toolbar no-print">
        <label className="study-search">
          <span className="sr-only">{ui.study.searchPlaceholder}</span>
          <input
            type="search"
            value={query}
            placeholder={ui.study.searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {marked.length > 0 && !query && (
        <section className="bookmarks no-print" aria-labelledby="bm-h">
          <p className="eyebrow" id="bm-h">{ui.study.bookmarksTitle}</p>
          <ul className="bookmark-list">
            {marked.map((c) => (
              <li key={c.slug}>
                <Link href={`/${locale}/study/${c.slug}`}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label={ui.nav.chapterNavigation}>
        {filtered.map((g) => (
          <section
            className="study-group"
            key={g.actId}
            style={{ ["--act-hue" as string]: g.hue }}
            aria-labelledby={`grp-${g.actId}`}
          >
            <div className="study-group-head">
              <p className="eyebrow">
                {ui.experience.actLabel} {g.actId === "FINALE" ? ui.experience.finaleLabel : g.actId}
              </p>
              <h2 id={`grp-${g.actId}`}>{g.actTitle}</h2>
              <p className="study-group-sub">{g.actSubtitle}</p>
            </div>

            <ul className="chapter-list">
              {g.chapters.map((c, i) => (
                <Reveal as="li" key={c.slug} delay={Math.min(i, 5) * 55}>
                  <Link href={`/${locale}/study/${c.slug}`} className="chapter-row">
                    <span className="chapter-motif"><Motif id={c.motif} /></span>
                    <span className="chapter-main">
                      <span className="chapter-roman">
                        {c.n === 0 ? ui.study.prologue : c.roman}
                      </span>
                      <span className="chapter-title">{c.title}</span>
                      <span className="chapter-sub">{c.subtitle}</span>
                      <span className="chapter-chips">
                        {c.layers.map((s) => (
                          <span key={s.id} className={`chip chip-${s.id}`}>{s.short}</span>
                        ))}
                        {bookmarks.includes(c.slug) && (
                          <span className="chip chip-bookmark">{ui.controls.bookmarked}</span>
                        )}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      {filtered.length === 0 && <p className="empty">{ui.glossary.empty}</p>}
    </div>
  );
}

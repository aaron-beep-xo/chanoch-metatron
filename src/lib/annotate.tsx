import { Fragment, type ReactNode } from "react";
import { GlossaryTerm } from "@/components/study/GlossaryTerm";
import type { GlossaryEntry } from "./content";

/**
 * Wraps the FIRST occurrence of each of a chapter's glossary terms, once per
 * chapter, in an annotated control. Matching runs on the locale's own term
 * strings, so the mechanism works in every script without transliterating.
 *
 * Longer terms are matched first so that "Havayah HaKatan" is not consumed by
 * "Havayah".
 */
export function createAnnotator(
  entries: [string, GlossaryEntry][],
  hrefBase: string,
  linkLabel: string,
) {
  const used = new Set<string>();
  // A term may appear under its own name or its transliteration; whichever the
  // chapter actually uses is the one glossed.
  const targets = entries
    .flatMap(([id, e]) =>
      [e.term, e.translit]
        .filter((n, i, all) => n && n.trim().length > 1 && all.indexOf(n) === i)
        .map((needle) => ({ id, e, needle })),
    )
    .sort((a, b) => b.needle.length - a.needle.length);

  return function annotate(text: string, key: string | number): ReactNode {
    const hit = targets.find((t) => !used.has(t.id) && indexOfTerm(text, t.needle) >= 0);
    if (!hit) return text;

    const at = indexOfTerm(text, hit.needle);
    used.add(hit.id);

    const before = text.slice(0, at);
    const match = text.slice(at, at + hit.needle.length);
    const after = text.slice(at + hit.needle.length);

    return (
      <Fragment key={key}>
        {before}
        <GlossaryTerm entry={hit.e} hrefBase={hrefBase} translitLabel={linkLabel}>
          {match}
        </GlossaryTerm>
        {annotate(after, `${key}-r`)}
      </Fragment>
    );
  };
}

/**
 * Case-insensitive search that refuses matches glued to a letter on either side,
 * without relying on `\b` (which is meaningless for Hebrew, Arabic and Japanese).
 */
function indexOfTerm(haystack: string, needle: string): number {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  let from = 0;
  for (;;) {
    const i = h.indexOf(n, from);
    if (i < 0) return -1;
    const prev = h[i - 1];
    const next = h[i + n.length];
    const letter = /[\p{L}]/u;
    if ((!prev || !letter.test(prev)) && (!next || !letter.test(next))) return i;
    from = i + 1;
  }
}

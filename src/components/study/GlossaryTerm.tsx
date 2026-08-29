"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { GlossaryEntry } from "@/lib/content";

/**
 * A glossed term. The definition is present in the DOM at all times — hover only
 * changes its visibility, never whether the information exists — and the control
 * is a real button, so keyboard and touch reach it exactly as a mouse does.
 */
export function GlossaryTerm({
  entry,
  children,
  hrefBase,
  translitLabel,
}: {
  entry: GlossaryEntry;
  children: React.ReactNode;
  hrefBase: string;
  translitLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span
      className={`gterm${open ? " is-open" : ""}`}
      ref={wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="gterm-trigger"
        aria-expanded={open}
        aria-describedby={id}
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </button>
      <span className="gterm-pop" id={id} role="note">
        <span className="gterm-head">
          <span className="gterm-heb sacred-sm" lang="he" dir="rtl">
            {entry.hebrew}
          </span>
          <span className="gterm-translit translit" dir="ltr">
            {entry.translit}
          </span>
        </span>
        <span className="gterm-def">{entry.definition}</span>
        <a className="gterm-link" href={`${hrefBase}#${slugOf(entry.term)}`}>
          {translitLabel}
        </a>
      </span>
    </span>
  );
}

export function slugOf(term: string): string {
  return term
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

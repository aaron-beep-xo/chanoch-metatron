"use client";

import { useState } from "react";
import { usePrefs } from "@/components/chrome/Preferences";

export function ChapterTools({ ui, slug }: { ui: any; slug: string }) {
  const { translit, setTranslit, sourceNotes, setSourceNotes, bookmarks, toggleBookmark, surface, setSurface } =
    usePrefs();
  const [copied, setCopied] = useState(false);
  const marked = bookmarks.includes(slug);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href.split("#")[0]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the address bar still holds the link */
    }
  }

  return (
    <div className="chapter-tools no-print" role="group" aria-label={ui.controls.settings}>
      <Toggle on={translit} onClick={() => setTranslit(!translit)} label={ui.controls.transliteration} />
      <Toggle on={sourceNotes} onClick={() => setSourceNotes(!sourceNotes)} label={ui.controls.sourceNotes} />
      <Toggle
        on={surface === "parchment"}
        onClick={() => setSurface(surface === "parchment" ? "night" : "parchment")}
        label={surface === "parchment" ? ui.controls.themeParchment : ui.controls.themeNight}
      />
      <Toggle
        on={marked}
        onClick={() => toggleBookmark(slug)}
        label={marked ? ui.controls.bookmarked : ui.controls.bookmark}
      />
      <button type="button" className="ctool" onClick={copy}>
        {copied ? ui.controls.copied : ui.controls.copyLink}
      </button>
      <button type="button" className="ctool" onClick={() => window.print()}>
        {ui.controls.print}
      </button>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" className={`ctool${on ? " is-on" : ""}`} aria-pressed={on} onClick={onClick}>
      <span className="ctool-dot" aria-hidden="true" />
      {label}
    </button>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeNames, locales, type Locale } from "@/lib/i18n";
import { rememberLocale } from "@/lib/locale-cookie";

/**
 * Swaps only the locale segment, keeping the route and the fragment intact so a
 * reader deep inside a chapter stays exactly where they were.
 */
export function LanguageSwitcher({
  locale,
  label,
  a11yLabel,
}: {
  locale: Locale;
  label: string;
  a11yLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

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

  function go(next: Locale) {
    const rest = pathname.split("/").slice(2).join("/");
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    rememberLocale(next);
    setOpen(false);
    router.push(`/${next}${rest ? `/${rest}` : ""}${hash}`);
  }

  return (
    <div className="lang" ref={wrap}>
      <button
        type="button"
        className="lang-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={a11yLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="lang-glyph" aria-hidden="true">
          א
        </span>
        <span className="lang-current">{localeNames[locale].native}</span>
        <span className="sr-only">{label}</span>
      </button>
      {open && (
        <ul className="lang-menu" role="listbox" aria-label={label}>
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                lang={l}
                dir={l === "he" || l === "yi" || l === "ar" ? "rtl" : "ltr"}
                className={`lang-option${l === locale ? " is-current" : ""}`}
                onClick={() => go(l)}
              >
                <span className="lang-native">{localeNames[l].native}</span>
                <span className="lang-english" dir="ltr">
                  {localeNames[l].english}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

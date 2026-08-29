"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePrefs } from "./Preferences";

export function SiteHeader({ locale, ui }: { locale: Locale; ui: any }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { reduced, setReducedChoice } = usePrefs();

  // The lifted state is a purely visual response to scroll position, so it is
  // written straight to the element rather than round-tripped through React.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onScroll = () => el.classList.toggle("is-lifted", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: `/${locale}/experience`, label: ui.nav.experience },
    { href: `/${locale}/study`, label: ui.nav.study },
    { href: `/${locale}/office`, label: ui.nav.office },
    { href: `/${locale}/circuit`, label: ui.nav.circuit },
    { href: `/${locale}/glossary`, label: ui.nav.glossary },
    { href: `/${locale}/sources`, label: ui.nav.sources },
  ];

  return (
    <header className="site-header no-print" ref={headerRef}>
      <div className="site-header-inner">
        <Link href={`/${locale}`} className="wordmark">
          <span className="wordmark-heb" lang="he" dir="rtl" aria-hidden="true">
            חֲנוֹךְ
          </span>
          <span className="wordmark-en">{ui.site.shortTitle}</span>
        </Link>

        <nav className="site-nav" aria-label={ui.nav.primaryNavigation}>
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={pathname.startsWith(l.href) ? "is-active" : undefined}
                  aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-tools">
          <button
            type="button"
            className="tool"
            aria-pressed={reduced}
            onClick={() => setReducedChoice(!reduced)}
            title={ui.controls.reducedMotion}
          >
            <span aria-hidden="true" className={`motion-dot${reduced ? " is-still" : ""}`} />
            <span className="sr-only">
              {ui.controls.reducedMotion} — {reduced ? ui.controls.motionOff : ui.controls.motionOn}
            </span>
          </button>

          <LanguageSwitcher
            locale={locale}
            label={ui.controls.language}
            a11yLabel={ui.controls.changeLanguage}
          />

          <button
            type="button"
            className="tool burger"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
            <span className="sr-only">{open ? ui.nav.close : ui.nav.menu}</span>
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`mobile-nav${open ? " is-open" : ""}`} hidden={!open}>
        <nav aria-label={ui.nav.primaryNavigation}>
          <ul>
            {links.map((l, i) => (
              <li key={l.href} style={{ ["--i" as string]: i }}>
                <Link href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

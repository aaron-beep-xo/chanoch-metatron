import { Fragment } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { BRAND, LICENCE } from "@/lib/brand";
import { fill } from "@/lib/format";

/**
 * The copyright notice carries names that are links, and names that must keep
 * Latin script and left-to-right order inside the right-to-left locales. None
 * of them survive plain interpolation, so the localised sentence is split on
 * its placeholders and each one is rendered as an element — which also lets
 * every language keep its own word order around them.
 */
function renderNotice(template: string) {
  return template.split(/(\{\{(?:brand|author|licence)\}\})/).map((part, i) => {
    switch (part) {
      case "{{brand}}":
        return (
          <a key={i} href={BRAND.url} lang="en" dir="ltr">
            {BRAND.name}
          </a>
        );
      case "{{author}}":
        return (
          <span key={i} lang="en" dir="ltr">
            {BRAND.author}
          </span>
        );
      case "{{licence}}":
        return (
          <a key={i} href={LICENCE.url} rel="license" lang="en" dir="ltr">
            {LICENCE.name}
          </a>
        );
      default:
        return <Fragment key={i}>{fill(part, { year: BRAND.year })}</Fragment>;
    }
  });
}

export function SiteFooter({ locale, ui }: { locale: Locale; ui: any }) {
  return (
    <footer className="site-footer">
      <div className="shell">
        <hr className="rule" />
        <div className="footer-grid">
          <div>
            <p className="eyebrow">{ui.footer.colophon}</p>
            <p className="footer-body">{ui.footer.colophonBody}</p>
          </div>
          <div>
            <p className="eyebrow">{ui.footer.editorialNote}</p>
            <p className="footer-body">{ui.footer.editorialNoteBody}</p>
          </div>
          <div>
            <p className="eyebrow">{ui.nav.primaryNavigation}</p>
            <ul className="footer-links">
              <li><Link href={`/${locale}/experience`}>{ui.nav.experience}</Link></li>
              <li><Link href={`/${locale}/study`}>{ui.nav.study}</Link></li>
              <li><Link href={`/${locale}/office`}>{ui.nav.office}</Link></li>
              <li><Link href={`/${locale}/circuit`}>{ui.nav.circuit}</Link></li>
              <li><Link href={`/${locale}/glossary`}>{ui.nav.glossary}</Link></li>
              <li><Link href={`/${locale}/sources`}>{ui.nav.sources}</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">{ui.footer.publishedBy}</p>
            {/* The wordmark is a name, not prose: it keeps its own script and
                direction inside the right-to-left locales. */}
            <p className="footer-brand" lang="en" dir="ltr">
              <a href={BRAND.url}>{BRAND.name}</a>
            </p>
            <p className="footer-brand-author" lang="en" dir="ltr">{BRAND.author}</p>
          </div>
        </div>
        <p className="footer-sacred sacred-sm" lang="he" dir="rtl">
          וַיִּתְהַלֵּךְ חֲנוֹךְ אֶת־הָאֱלֹהִים
        </p>
        <p className="footer-rights">{ui.footer.rights}</p>
        <p className="footer-copyright">{renderNotice(String(ui.footer.copyright))}</p>
      </div>
    </footer>
  );
}

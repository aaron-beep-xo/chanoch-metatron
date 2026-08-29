import Link from "next/link";
import type { Locale } from "@/lib/i18n";

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
        </div>
        <p className="footer-sacred sacred-sm" lang="he" dir="rtl">
          וַיִּתְהַלֵּךְ חֲנוֹךְ אֶת־הָאֱלֹהִים
        </p>
        <p className="footer-rights">{ui.footer.rights}</p>
      </div>
    </footer>
  );
}

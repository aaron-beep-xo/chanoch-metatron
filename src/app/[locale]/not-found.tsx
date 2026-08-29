import Link from "next/link";
import { getUI } from "@/lib/content";
import { defaultLocale } from "@/lib/i18n";

export default async function NotFound() {
  // A not-found boundary cannot read route params, so the fallback speaks the
  // canonical language; the layout above it still carries the reader's locale.
  const ui = await getUI(defaultLocale);
  return (
    <div className="page notfound">
      <div className="shell">
        <p className="sacred" lang="he" dir="rtl">וְאֵינֶנּוּ</p>
        <h1 className="page-title">{ui.error.notFoundTitle}</h1>
        <p className="page-lede measure">{ui.error.notFoundBody}</p>
        <p><Link href={`/${defaultLocale}`} className="btn btn-ghost">{ui.error.notFoundAction}</Link></p>
      </div>
    </div>
  );
}

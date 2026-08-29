import type { Locale } from "./i18n";

/** Remembers the reader's language so `/` resolves to it on the next visit. */
export function rememberLocale(locale: Locale): void {
  try {
    document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
  } catch {
    /* cookies may be blocked; the locale still applies for this navigation */
  }
}

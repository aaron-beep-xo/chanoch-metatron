export const locales = ["en", "he", "yi", "fr", "de", "ja", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const rtlLocales: readonly Locale[] = ["he", "yi", "ar"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

/** BCP-47 tags used for `lang`, hreflang and Intl formatting. */
export const htmlLang: Record<Locale, string> = {
  en: "en",
  he: "he",
  yi: "yi",
  fr: "fr",
  de: "de",
  ja: "ja",
  ar: "ar",
};

export const localeNames: Record<Locale, { native: string; english: string; script: string }> = {
  en: { native: "English", english: "English", script: "latin" },
  he: { native: "עברית", english: "Hebrew", script: "hebrew" },
  yi: { native: "ייִדיש", english: "Yiddish", script: "hebrew" },
  fr: { native: "Français", english: "French", script: "latin" },
  de: { native: "Deutsch", english: "German", script: "latin" },
  ja: { native: "日本語", english: "Japanese", script: "cjk" },
  ar: { native: "العربية", english: "Arabic", script: "arabic" },
};

/** Numerals rendered in the reader's own script where that is the natural convention. */
export function formatNumber(n: number, locale: Locale): string {
  if (locale === "ar") return new Intl.NumberFormat("ar-EG").format(n);
  return new Intl.NumberFormat(locale === "yi" ? "he" : locale).format(n);
}

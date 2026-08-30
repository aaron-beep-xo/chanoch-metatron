import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { dirOf, htmlLang, isLocale, locales, type Locale } from "@/lib/i18n";
import { getUI } from "@/lib/content";
import { Preferences, prefsBootScript } from "@/components/chrome/Preferences";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { AmbientField } from "@/components/motion/AmbientField";
import { SITE_URL } from "@/lib/site-url";
import { BRAND } from "@/lib/brand";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = await getUI(locale);

  const languages = Object.fromEntries(
    locales.map((l) => [htmlLang[l], `/${l}`]),
  ) as Record<string, string>;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${ui.site.title} — ${ui.site.shortTitle}`,
      template: `%s · ${ui.site.shortTitle}`,
    },
    description: ui.site.description,
    keywords: ui.site.keywords,
    authors: [{ name: BRAND.author }],
    creator: BRAND.author,
    publisher: BRAND.name,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": "/en" },
    },
    openGraph: {
      type: "article",
      locale: htmlLang[locale],
      url: `/${locale}`,
      title: ui.site.title,
      description: ui.site.description,
      siteName: ui.site.shortTitle,
    },
    twitter: {
      card: "summary_large_image",
      title: ui.site.title,
      description: ui.site.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const ui = await getUI(l);

  return (
    <html lang={htmlLang[l]} dir={dirOf(l)} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsBootScript }} />
      </head>
      <body>
        <Preferences>
          <a href="#main" className="skip-link">
            {ui.nav.skipToContent}
          </a>
          <AmbientField />
          <SiteHeader locale={l} ui={ui} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter locale={l} ui={ui} />
        </Preferences>
      </body>
    </html>
  );
}

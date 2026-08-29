import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getSlugs } from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chanoch.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getSlugs();
  const sections = ["", "/experience", "/study", "/office", "/circuit", "/glossary", "/sources"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const section of sections) {
      entries.push({
        url: `${SITE_URL}/${locale}${section}`,
        changeFrequency: "monthly",
        priority: section === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}${section}`]),
          ),
        },
      });
    }
    for (const slug of slugs) {
      entries.push({
        url: `${SITE_URL}/${locale}/study/${slug}`,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}/study/${slug}`]),
          ),
        },
      });
    }
  }

  return entries;
}

import "server-only";
import { cache } from "react";
import { defaultLocale, type Locale } from "./i18n";

export interface EssayBlock {
  t: "p" | "q";
  v: string;
}
export interface EssayChapter {
  n: number;
  roman: string;
  slug: string;
  title: string;
  subtitle: string;
  blocks: EssayBlock[];
}
export interface Essay {
  hebrewTitle: string;
  title: string;
  subtitle: string;
  chapters: EssayChapter[];
}

export interface ActCopy {
  title: string;
  subtitle: string;
  hebrew: string;
  lines: string[];
  sceneDescription: string;
}
export interface Dignity {
  id: string;
  hebrew: string;
  translit: string;
  title: string;
  layer: string;
  body: string;
  bittul: string;
  reception: string;
  chapters: number[];
}
export interface MalchusFacet {
  id: string;
  hebrew: string;
  translit: string;
  title: string;
  descent: string;
  reception: string;
  answer: string;
  return: string;
  body: string;
}
export interface GlossaryEntry {
  term: string;
  hebrew: string;
  translit: string;
  definition: string;
}
export interface SourceLayerCopy {
  label: string;
  short: string;
  description: string;
}

type Dict = Record<string, any>;

const files = ["ui", "acts", "dignities", "malchus", "glossary", "sources", "essay"] as const;
type FileName = (typeof files)[number];

/** Returns undefined when a locale has no file of its own, without falling back. */
async function loadStrict(locale: Locale, file: FileName): Promise<unknown> {
  try {
    return (await import(`@/content/locales/${locale}/${file}.json`)).default;
  } catch {
    return undefined;
  }
}

async function load(locale: Locale, file: FileName): Promise<unknown> {
  try {
    return (await import(`@/content/locales/${locale}/${file}.json`)).default;
  } catch {
    return (await import(`@/content/locales/${defaultLocale}/${file}.json`)).default;
  }
}

/**
 * Deep-merges a locale dictionary over the English one so that a partially
 * translated file still renders — any key not yet translated falls back to the
 * canonical English rather than showing an empty slot.
 */
function mergeDeep<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) return (Array.isArray(over) && over.length ? over : base) as T;
  if (typeof base === "object" && typeof over === "object") {
    const out: Dict = { ...(base as Dict) };
    for (const [k, v] of Object.entries(over as Dict)) {
      out[k] = k in out ? mergeDeep((base as Dict)[k], v) : v;
    }
    return out as T;
  }
  return (typeof over === "string" && over.trim() ? over : base) as T;
}

async function merged<T>(locale: Locale, file: FileName): Promise<T> {
  const base = (await import(`@/content/locales/${defaultLocale}/${file}.json`)).default as T;
  if (locale === defaultLocale) return base;
  return mergeDeep(base, await load(locale, file));
}

export const getUI = cache(async (locale: Locale) => merged<Dict>(locale, "ui"));
export const getActs = cache(async (locale: Locale) => merged<Record<string, ActCopy>>(locale, "acts"));
export const getDignities = cache(async (locale: Locale) => merged<Dignity[]>(locale, "dignities"));
export const getMalchus = cache(async (locale: Locale) => merged<MalchusFacet[]>(locale, "malchus"));
export const getGlossary = cache(async (locale: Locale) => merged<Record<string, GlossaryEntry>>(locale, "glossary"));
export const getSourceCopy = cache(async (locale: Locale) => merged<Record<string, SourceLayerCopy>>(locale, "sources"));
/**
 * The essay merges per chapter rather than wholesale, so a locale whose
 * translation is still in progress renders every finished chapter in its own
 * language and falls back to the canonical English for the rest — instead of
 * losing the chapter entirely.
 */
export const getEssay = cache(async (locale: Locale): Promise<Essay> => {
  const base = (await import(`@/content/locales/${defaultLocale}/essay.json`)).default as Essay;
  if (locale === defaultLocale) return base;

  const over = (await loadStrict(locale, "essay")) as Partial<Essay> | undefined;
  if (!over) return base;

  const byN = new Map<number, Partial<EssayChapter>>(
    (over.chapters ?? []).map((c) => [c.n, c]),
  );

  return {
    hebrewTitle: base.hebrewTitle,
    title: typeof over.title === "string" && over.title ? over.title : base.title,
    subtitle: typeof over.subtitle === "string" && over.subtitle ? over.subtitle : base.subtitle,
    chapters: base.chapters.map((c) => {
      const t = byN.get(c.n);
      if (!t) return c;
      const blocks =
        Array.isArray(t.blocks) && t.blocks.length === c.blocks.length ? t.blocks : c.blocks;
      return {
        ...c,
        title: t.title || c.title,
        subtitle: t.subtitle || c.subtitle,
        blocks,
      };
    }),
  };
});

/** Chapters whose body is still the canonical English, per locale. */
export const untranslatedChapters = cache(async (locale: Locale): Promise<number[]> => {
  if (locale === defaultLocale) return [];
  const base = (await import(`@/content/locales/${defaultLocale}/essay.json`)).default as Essay;
  const over = (await loadStrict(locale, "essay")) as Partial<Essay> | undefined;
  const done = new Set(
    (over?.chapters ?? [])
      .filter((c) => Array.isArray(c.blocks) && c.blocks.length > 0)
      .map((c) => c.n),
  );
  return base.chapters.filter((c) => !done.has(c.n)).map((c) => c.n);
});

export const getChapter = cache(async (locale: Locale, slug: string) => {
  const essay = await getEssay(locale);
  return essay.chapters.find((c) => c.slug === slug) ?? null;
});

/** Slugs are locale-independent, so every locale routes on the English slug. */
export const getSlugs = cache(async () => {
  const essay = await getEssay(defaultLocale);
  return essay.chapters.map((c) => c.slug);
});

/**
 * Rough reading time. Scripts that do not separate words with spaces are
 * measured in characters instead, so Japanese does not report one minute for a
 * chapter that takes ten.
 */
export function readingMinutes(chapter: EssayChapter, locale: Locale = defaultLocale): number {
  const text = chapter.blocks.map((b) => b.v).join(" ");
  if (locale === "ja") return Math.max(1, Math.round(text.replace(/\s/g, "").length / 450));
  return Math.max(1, Math.round(text.split(/\s+/).length / 190));
}

export { fill } from "./format";

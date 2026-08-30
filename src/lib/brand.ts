/**
 * The publisher of this exhibition. Kept in one place so the wordmark, the
 * copyright line, the document metadata and the structured data cannot drift
 * apart, and so the name is never handed to translators as prose.
 */
export const BRAND = {
  /** Rendered untranslated in every locale, as a wordmark rather than a phrase. */
  name: "Sacred Bridge Collective",
  author: "Aaron Abush",
  url: "https://www.sacredbridge.co",
  /** Build year, used for the copyright notice. */
  year: new Date().getFullYear(),
} as const;

/**
 * Copyright is retained; the text may be quoted, translated and built upon by
 * anyone who credits it. Named here rather than inside the localised strings so
 * the licence identifier stays exact in every language.
 */
export const LICENCE = {
  name: "CC BY 4.0",
  url: "https://creativecommons.org/licenses/by/4.0/",
} as const;

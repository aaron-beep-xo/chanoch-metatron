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

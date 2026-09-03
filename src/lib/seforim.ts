/**
 * The Web Seforim: the sibling volumes this exhibition belongs to.
 *
 * Their names are wordmarks rather than prose, so they live here beside the
 * publisher's own name instead of inside the localised strings — no translation
 * can rename a volume or break a link. The order is the collection's own, from
 * the concealed toward the revealed.
 */
export interface Sefer {
  /** A single Hebrew letter used as the volume's mark. */
  letter: string;
  /** Latin wordmark, kept in Latin script and left-to-right in every locale. */
  name: string;
  /** The same name in its own script. */
  hebrew: string;
  url: string;
  /** Set on the volume this codebase builds — a build-time fact, not a runtime guess. */
  current?: true;
}

export const SEFORIM: readonly Sefer[] = [
  { letter: "א", name: "Ein Sof", hebrew: "אין סוף", url: "https://ein-sof.chavahkadmonah.info/en" },
  { letter: "מ", name: "Metatron", hebrew: "מטטרון", url: "https://enoch-metatron.chavahkadmonah.info/en", current: true },
  { letter: "ח", name: "Chavah Kadmonah", hebrew: "חוה קדמונה", url: "https://chavahkadmonah.info/" },
  { letter: "ל", name: "Malchus", hebrew: "מלכות", url: "https://malchus.chavahkadmonah.info/en" },
  { letter: "ש", name: "Moshiach", hebrew: "משיח", url: "https://moshiach.chavahkadmonah.info/en" },
  { letter: "ח", name: "The Eighth", hebrew: "השמיני", url: "https://the-eighth.chavahkadmonah.info/en" },
] as const;

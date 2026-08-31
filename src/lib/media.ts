/**
 * The generated visual layer: cosmic plates of sacred geometry, and two slow
 * loops. Paths are collected here for the same reason the brand is — so that a
 * renamed file cannot silently leave a banner blank.
 *
 * All of it is decorative. Every plate says in light something the essay
 * already says in words, so none of it is announced to assistive technology
 * and none of it needs a translated alternative.
 */
const base = "/media";

export const MEDIA = {
  /** The opening banner: a slow loop, its own first frame, and a still plate
   *  for readers who have asked for less motion. */
  hero: {
    video: `${base}/hero.mp4`,
    poster: `${base}/hero-poster.jpg`,
    still: `${base}/hero-still.jpg`,
  },
  /** The Malchus circuit as motion: descent, reception, and the returning ring. */
  circuit: {
    video: `${base}/circuit.mp4`,
    poster: `${base}/circuit-poster.jpg`,
  },
  /** 1200×630, the card social platforms unfurl. */
  og: `${base}/og.jpg`,
  /** Behind the four mode cards on the opening page. */
  card: {
    experience: `${base}/card-experience.jpg`,
    study: `${base}/card-study.jpg`,
    office: `${base}/card-office.jpg`,
    circuit: `${base}/card-circuit.jpg`,
  },
  /** Behind a page head, or a section of one. */
  veil: {
    experience: `${base}/veil-experience.jpg`,
    study: `${base}/veil-study.jpg`,
    office: `${base}/veil-office.jpg`,
    circuit: `${base}/veil-circuit.jpg`,
    glossary: `${base}/veil-glossary.jpg`,
    sources: `${base}/veil-sources.jpg`,
  },
} as const;

/** Dimensions of the social card, declared so metadata cannot drift from the file. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

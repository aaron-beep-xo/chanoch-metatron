/**
 * Locale-independent structure: source-layer taxonomy, the thirteen Acts of
 * Experience Mode, and the mapping of every Study chapter onto an Act, a set of
 * source layers, a visual motif and a motion cue.
 *
 * Translatable strings for any of these live in the per-locale `ui.json`
 * dictionaries — nothing here is user-facing prose.
 */

export const sourceLayerIds = [
  "torah",
  "chazal",
  "gemara",
  "heikhalot",
  "midrash",
  "zohar",
  "chassidus",
  "synthesis",
] as const;
export type SourceLayerId = (typeof sourceLayerIds)[number];

/** Motif components reused across chapter covers and act scenes. */
export const motifIds = [
  "path",       // the walk: alternating contact with the baseline
  "cadence",    // the genealogy refrain and its break
  "flame",      // matter revealing its directional interior
  "crown",      // encircling light arriving from beyond
  "vessel",     // inner light increasing as the outer form clarifies
  "script",     // intent contracting into letters
  "mirage",     // a false second axis collapsing back into one
  "basin",      // Malchus: reception, transformation, answer
  "soil",       // luminous step over earth
  "ring",       // completed seven opening inward
  "dwelling",   // descending light inhabiting ordinary matter
] as const;
export type MotifId = (typeof motifIds)[number];

export type ActId =
  | "I" | "II" | "III" | "IV" | "V" | "VI" | "VII"
  | "VIII" | "IX" | "X" | "XI" | "XII" | "XIII" | "FINALE";

export interface ActDef {
  id: ActId;
  /** Ordinal shown in the act rail. */
  index: number;
  motif: MotifId;
  /** Hue anchor, degrees. Drives the per-act accent without leaving the palette. */
  hue: number;
  /** Chapters of Study Mode distilled by this act. */
  chapters: number[];
  /** Which signature motion system drives the act's scene. */
  scene:
    | "walk"
    | "cadence"
    | "fire"
    | "crown"
    | "name"
    | "scribe"
    | "acher"
    | "malchus"
    | "soil"
    | "seven-eight"
    | "speech"
    | "dwelling"
    | "return"
    | "finale";
}

export const acts: ActDef[] = [
  { id: "I",      index: 1,  motif: "cadence",  hue: 38,  scene: "cadence",     chapters: [0] },
  { id: "II",     index: 2,  motif: "path",     hue: 34,  scene: "walk",        chapters: [1, 2] },
  { id: "III",    index: 3,  motif: "flame",    hue: 26,  scene: "fire",        chapters: [3, 4] },
  { id: "IV",     index: 4,  motif: "crown",    hue: 44,  scene: "crown",       chapters: [5, 8, 11] },
  { id: "V",      index: 5,  motif: "vessel",   hue: 46,  scene: "name",        chapters: [6, 7, 17, 19] },
  { id: "VI",     index: 6,  motif: "script",   hue: 40,  scene: "scribe",      chapters: [10] },
  { id: "VII",    index: 7,  motif: "mirage",   hue: 210, scene: "acher",       chapters: [9] },
  { id: "VIII",   index: 8,  motif: "basin",    hue: 205, scene: "malchus",     chapters: [18, 12, 20, 21] },
  { id: "IX",     index: 9,  motif: "soil",     hue: 30,  scene: "soil",        chapters: [13, 14, 15, 16, 37] },
  { id: "X",      index: 10, motif: "ring",     hue: 48,  scene: "seven-eight", chapters: [22, 23, 24, 25, 44] },
  { id: "XI",     index: 11, motif: "script",   hue: 196, scene: "speech",      chapters: [26, 27, 28, 29] },
  { id: "XII",    index: 12, motif: "dwelling", hue: 36,  scene: "dwelling",    chapters: [30, 31, 32, 33, 34, 35, 36, 42] },
  { id: "XIII",   index: 13, motif: "path",     hue: 42,  scene: "return",      chapters: [38, 39, 40, 41, 43, 45, 46] },
  { id: "FINALE", index: 14, motif: "dwelling", hue: 40,  scene: "finale",      chapters: [47, 48, 49, 50] },
];

export interface ChapterMeta {
  n: number;
  act: ActId;
  layers: SourceLayerId[];
  motif: MotifId;
  /** Glossary term ids surfaced as annotations inside this chapter. */
  terms: string[];
}

export const chapterMeta: ChapterMeta[] = [
  { n: 0,  act: "I",    layers: ["torah", "chazal", "synthesis"], motif: "cadence",  terms: ["chanoch", "atzmus", "tzaddik", "heikhalot"] },
  { n: 1,  act: "II",   layers: ["torah", "chassidus"],           motif: "path",     terms: ["malchus", "chinuch", "middos", "sar-hapanim"] },
  { n: 2,  act: "II",   layers: ["chazal", "synthesis"],          motif: "path",     terms: ["avodah", "heikhalot", "tzaddik", "bittul"] },
  { n: 3,  act: "III",  layers: ["heikhalot", "chassidus"],       motif: "flame",    terms: ["metatron", "heikhalot", "avodah", "bittul"] },
  { n: 4,  act: "III",  layers: ["torah", "gemara", "synthesis"], motif: "flame",    terms: ["metatron", "heikhalot"] },
  { n: 5,  act: "IV",   layers: ["heikhalot", "zohar"],           motif: "crown",    terms: ["metatron", "malchus", "sar-hapanim", "bittul"] },
  { n: 6,  act: "V",    layers: ["torah", "zohar", "chassidus"],  motif: "vessel",   terms: ["havayah", "atzmus", "havayah-hakatan", "chassidus"] },
  { n: 7,  act: "V",    layers: ["zohar", "chassidus"],           motif: "vessel",   terms: ["levush", "havayah", "havayah-hakatan", "atzmus"] },
  { n: 8,  act: "IV",   layers: ["heikhalot", "synthesis"],       motif: "crown",    terms: ["metatron", "bittul", "malchus"] },
  { n: 9,  act: "VII",  layers: ["gemara", "synthesis"],          motif: "mirage",   terms: ["acher", "pardes", "tohu", "bittul"] },
  { n: 10, act: "VI",   layers: ["heikhalot", "chassidus"],       motif: "script",   terms: ["heikhalot", "sofer", "tzimtzum"] },
  { n: 11, act: "IV",   layers: ["heikhalot", "zohar"],           motif: "crown",    terms: ["chinuch", "naar", "bittul"] },
  { n: 12, act: "VIII", layers: ["chassidus", "synthesis"],       motif: "basin",    terms: ["or-chozer", "malchus", "mekabel"] },
  { n: 13, act: "IX",   layers: ["heikhalot", "synthesis"],       motif: "soil",     terms: ["chanoch", "metatron"] },
  { n: 14, act: "IX",   layers: ["torah", "synthesis"],           motif: "soil",     terms: ["chanoch"] },
  { n: 15, act: "IX",   layers: ["chazal", "chassidus"],          motif: "soil",     terms: ["sinai", "chassidus", "kiddush", "dirah-betachtonim"] },
  { n: 16, act: "IX",   layers: ["torah", "chassidus"],           motif: "cadence",  terms: ["bittul", "veinenu"] },
  { n: 17, act: "V",    layers: ["zohar", "chassidus"],           motif: "crown",    terms: ["chassidus", "keser", "makif", "or-chozer"] },
  { n: 18, act: "VIII", layers: ["zohar", "chassidus"],           motif: "basin",    terms: ["malchus", "shechinah", "havayah", "leis-lah"] },
  { n: 19, act: "V",    layers: ["zohar", "chassidus"],           motif: "vessel",   terms: ["havayah-hakatan", "bittul", "havayah"] },
  { n: 20, act: "VIII", layers: ["zohar", "chassidus", "synthesis"], motif: "basin", terms: ["malchus", "nukva", "bittul"] },
  { n: 21, act: "VIII", layers: ["chassidus"],                    motif: "basin",    terms: ["or-yashar", "or-chozer", "tefillah", "avodah"] },
  { n: 22, act: "X",    layers: ["chassidus", "synthesis"],       motif: "ring",     terms: ["basi-legani", "shechinah", "chassidus", "dor-hashevii"] },
  { n: 23, act: "X",    layers: ["synthesis"],                    motif: "ring",     terms: ["shemini", "shechinah", "dor-hashevii"] },
  { n: 24, act: "X",    layers: ["synthesis"],                    motif: "ring",     terms: ["chanoch", "bittul", "havayah", "chassidus"] },
  { n: 25, act: "X",    layers: ["synthesis"],                    motif: "ring",     terms: ["bittul", "chinuch"] },
  { n: 26, act: "XI",   layers: ["chassidus", "synthesis"],       motif: "script",   terms: ["metatron", "bittul"] },
  { n: 27, act: "XI",   layers: ["synthesis"],                    motif: "script",   terms: ["sofer", "shem"] },
  { n: 28, act: "XI",   layers: ["synthesis"],                    motif: "vessel",   terms: ["tzelem-elokim", "shem"] },
  { n: 29, act: "XI",   layers: ["torah", "chassidus", "synthesis"], motif: "vessel", terms: ["bittul", "tzelem-elokim"] },
  { n: 30, act: "XII",  layers: ["zohar", "synthesis"],           motif: "dwelling", terms: ["malchus", "sar-hapanim", "bittul"] },
  { n: 31, act: "XII",  layers: ["chassidus", "synthesis"],       motif: "dwelling", terms: ["heikhalot", "avodah", "tefillah", "dirah-betachtonim"] },
  { n: 32, act: "XII",  layers: ["chassidus"],                    motif: "dwelling", terms: ["dirah-betachtonim", "chassidus", "avodah", "sinai"] },
  { n: 33, act: "XII",  layers: ["chassidus", "synthesis"],       motif: "basin",    terms: ["tefillah", "or-chozer"] },
  { n: 34, act: "XII",  layers: ["gemara", "synthesis"],          motif: "mirage",   terms: ["bittul", "avodah", "acher"] },
  { n: 35, act: "XII",  layers: ["synthesis"],                    motif: "crown",    terms: ["malchus", "havayah", "havayah-hakatan", "bittul"] },
  { n: 36, act: "XII",  layers: ["synthesis"],                    motif: "dwelling", terms: ["dirah-betachtonim", "malchus"] },
  { n: 37, act: "IX",   layers: ["heikhalot", "synthesis"],       motif: "soil",     terms: ["chanoch", "metatron"] },
  { n: 38, act: "XIII", layers: ["synthesis"],                    motif: "path",     terms: ["heikhalot", "chassidus"] },
  { n: 39, act: "XIII", layers: ["synthesis"],                    motif: "path",     terms: ["avodah", "bittul"] },
  { n: 40, act: "XIII", layers: ["torah", "chassidus"],           motif: "cadence",  terms: ["bittul", "veinenu"] },
  { n: 41, act: "XIII", layers: ["chassidus", "synthesis"],       motif: "dwelling", terms: ["keilim", "dirah-betachtonim"] },
  { n: 42, act: "XII",  layers: ["chassidus"],                    motif: "dwelling", terms: ["kiddush", "dirah-betachtonim"] },
  { n: 43, act: "XIII", layers: ["synthesis"],                    motif: "path",     terms: ["bittul", "tohu", "acher"] },
  { n: 44, act: "X",    layers: ["synthesis"],                    motif: "ring",     terms: ["shemini", "dirah-betachtonim"] },
  { n: 45, act: "XIII", layers: ["synthesis"],                    motif: "dwelling", terms: ["bittul", "malchus"] },
  { n: 46, act: "XIII", layers: ["torah", "chassidus"],           motif: "path",     terms: ["chanoch", "bittul"] },
  { n: 47, act: "FINALE", layers: ["chassidus", "synthesis"],     motif: "dwelling", terms: ["chassidus", "shechinah", "malchus", "bittul"] },
  { n: 48, act: "FINALE", layers: ["zohar", "chassidus"],         motif: "vessel",   terms: ["havayah-hakatan", "havayah", "bittul"] },
  { n: 49, act: "FINALE", layers: ["synthesis"],                  motif: "vessel",   terms: ["atzmus", "giluyim", "bittul", "dirah-betachtonim"] },
  { n: 50, act: "FINALE", layers: ["heikhalot", "chassidus"],     motif: "dwelling", terms: ["chanoch", "shechinah", "malchus", "bittul"] },
];

export const actOf = new Map<number, ActId>(chapterMeta.map((c) => [c.n, c.act]));
export const metaOf = new Map<number, ChapterMeta>(chapterMeta.map((c) => [c.n, c]));
export const actById = new Map<ActId, ActDef>(acts.map((a) => [a.id, a]));

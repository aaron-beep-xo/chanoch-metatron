# Chanoch and the Name Within Him

A multilingual, motion-led digital exhibition built around one maamar on Chanoch
ben Yered and Metatron, read through Torah, Chazal, Heikhalot literature,
Kabbalah and Chassidus.

The site has two complementary ways in:

- **Experience Mode** — thirteen acts and a finale, each a scrubbed scene whose
  whole state is a single custom property.
- **Study Mode** — the complete fifty-one-chapter essay, with source-layer
  chips, original Hebrew and Aramaic quotations, glossary annotations and a
  per-chapter source drawer.

Plus two standalone interactives — **The Celestial Office** (the dignities of the
Great Servant) and **The Malchus Circuit** (or yashar → reception → answer →
or chozer) — a glossary and a sources page.

Seven locales: English, Hebrew, Yiddish, French, German, Japanese, Arabic.

---

## Run

```bash
npm install
npm run dev        # http://localhost:3939
```

```bash
npm run build      # production build (410 static pages)
npm run start      # serve the production build
npm run lint       # eslint (next/core-web-vitals + next/typescript)
npm run typecheck  # tsc --noEmit
```

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used by metadata, `hreflang`,
`sitemap.xml` and `robots.txt`. It defaults to a placeholder; set it before
deploying.

---

## Architecture

| Concern | Where |
|---|---|
| Locale config, direction, native names | `src/lib/i18n.ts` |
| Locale detection + `/` redirect | `src/proxy.ts` |
| Content loading, merge and fallback | `src/lib/content.ts` |
| Structure: acts, chapter metadata, source layers, motifs | `src/content/structure.ts` |
| Per-locale content | `src/content/locales/<locale>/*.json` |
| Design tokens, all component CSS | `src/app/globals.css` |
| Fonts | `src/lib/fonts.ts` |
| Routes | `src/app/[locale]/…` |

Everything lives under `/[locale]`, which is also the **root layout** — that is
what lets `<html lang dir>` be correct on the server, with no flash of the wrong
direction. `src/proxy.ts` redirects `/` and any unprefixed path to a locale
chosen from the `locale` cookie, then `Accept-Language`, then English.

### Content model

Content is data, never hard-coded in components. Each locale directory holds:

| File | Contents |
|---|---|
| `ui.json` | navigation, controls, labels, accessibility strings, metadata |
| `acts.json` | the fourteen Experience acts: title, subtitle, Hebrew, distilled lines, scene description |
| `essay.json` | the full essay: title, subtitle, and 51 chapters of typed blocks |
| `dignities.json` | the twelve Celestial Office entries |
| `malchus.json` | the eight Malchus facets |
| `glossary.json` | 43 terms |
| `sources.json` | the eight source layers |

Essay blocks are typed: `{"t":"p"}` for prose, `{"t":"q"}` for an original-language
quotation (rendered with `.sacred`, `lang="he"`, `dir="rtl"` and bidi isolation).

Locale-independent facts — which act a chapter belongs to, its source layers, its
cover motif, its glossary terms — live once in `src/content/structure.ts` and are
keyed by chapter number. Slugs are locale-independent too, so
`/he/study/the-seventh-walker` and `/fr/study/the-seventh-walker` are the same
chapter and the language switcher can swap locales without losing the reader's
place.

**Fallback.** `getEssay` merges per chapter: a locale that has translated forty
chapters renders those forty in its own language and the remaining eleven in
canonical English, rather than losing them. Every other file deep-merges over
English, so a missing key falls back instead of rendering blank. All seven
locales are currently complete — see `npm run i18n:status`.

### Adding or editing a translation

```bash
npm run i18n:status   # what exists, per locale
npm run i18n:lint     # missing keys, untranslated strings, misaligned chapters
```

Small files (`ui`, `acts`, `dignities`, `malchus`, `glossary`, `sources`) are
edited directly. The essay is merged in batches so block counts stay aligned
with the canonical English:

```bash
npm run i18n:merge -- he batch.json
```

where `batch.json` is

```json
{
  "title": "…",
  "subtitle": "…",
  "chapters": {
    "12": { "title": "…", "subtitle": "…", "blocks": ["…", "…"] }
  }
}
```

`blocks` is a flat array of strings in the same order and count as the English
chapter; block kinds are copied from English, and a count mismatch is a hard
error rather than a silent skip. The canonical English source text is kept
verbatim in `content-source/essay-en-canonical.txt`.

### Adding a chapter

1. Append the chapter to `src/content/locales/en/essay.json` with a new `n`,
   `roman`, `slug`, `title`, `subtitle` and `blocks`.
2. Add a matching entry to `chapterMeta` in `src/content/structure.ts` (act,
   source layers, motif, glossary terms), and add its `n` to that act's
   `chapters` array.
3. Translate it into the other locales with `merge-translation.mjs`.

Routes, the table of contents, the sitemap, the source pages and the act rail
all derive from that data — nothing else needs editing.

---

## Motion architecture

Three layers, in increasing cost:

1. **CSS only.** Chapter-cover motifs (`src/components/motion/Motif.tsx`) and all
   micro-interactions. Eleven reusable motifs rather than fifty bespoke scenes.
2. **IntersectionObserver.** `Reveal` for editorial pages, and the act text in
   Experience Mode. No animation library on ordinary reading pages.
3. **GSAP + ScrollTrigger**, loaded on demand by `useGsapScope`. Used for the
   hero timeline and for scrubbing the acts.

**One property per scene.** Each act writes a single scrubbed custom property,
`--p` (0 → 1), on its section; every scene in `src/components/experience/scenes.tsx`
is a static SVG whose state is a pure function of `--p` in CSS. Nothing reads the
clock, so the same markup serves the scrubbed experience and the reduced-motion
reading, where `--p` is parked at a legible resting value.

**The WebGL layer** (`AmbientField`) is one full-screen fragment shader carrying
slow volumetric light and drifting dust. It carries no information, so it can be
dropped entirely. It is skipped on reduced motion and on machines reporting ≤2
cores, capped at DPR 1.5, paused on `visibilitychange`, and falls back to a
static CSS gradient when WebGL is missing.

**Signature systems.** The walk (alternating contact producing ascent), the
broken genealogy cadence, matter revealing its interior grain, the crown that
arrives from beyond, the vessel that clarifies as its inner light grows, thought
contracting into letters, the Acher mirage collapsing back into one axis, the
Malchus circuit, the luminous footprint, seven turning inside out to disclose an
eighth, total speech depending on one still stroke, and the finale in which the
whole upward architecture inverts into ordinary matter.

---

## Reduced motion

`prefers-reduced-motion` is honoured, and a reader can also override it from the
header regardless of their OS setting. Both routes set `data-motion="reduced"` on
`<html>` — applied by an inline boot script *before first paint*, so a reader who
has asked for less motion never sees a burst of it.

In reduced-motion mode: no content is removed; GSAP is never loaded; scenes park
at a resting `--p` and their written descriptions become permanently visible;
the ambient WebGL layer is skipped; the Malchus circuit stops auto-advancing but
remains fully steppable.

Content is visible by default and only *hidden* once the boot script has
confirmed scripting is available (`[data-js="on"] .reveal`), so a blocked or
failed bundle can never leave the essay invisible.

---

## Accessibility

- Semantic headings, landmarks and a skip link.
- Every diagram node is a real `<button>`; the Celestial Office also offers a
  list view, and the Malchus circuit ships an equivalent `<table>`.
- Scenes are `aria-hidden` and paired with written descriptions in the content.
- Correct `lang` and `dir` per locale, server-rendered; mixed-script runs use
  `unicode-bidi: isolate`.
- Visible focus rings, keyboard-operable menus with Escape to close.
- Glossary definitions are in the DOM at all times — hover only changes
  visibility — and the trigger is a button, so touch and keyboard reach them.
- No autoplay audio anywhere. (Ambient sound was scoped and deliberately not
  shipped; see `CONTENT_NOTES.md`.)

## Performance

- Study Mode loads no animation library at all.
- GSAP is dynamically imported once, only where scroll choreography is used.
- One WebGL context for the whole site, capped DPR, paused when hidden, skipped
  on low-power devices.
- 410 pages are statically generated; middleware only handles the locale
  redirect.
- All motion is on `transform`, `opacity`, `stroke-dashoffset` and custom
  properties.

## SEO / i18n metadata

Locale-aware titles and descriptions, canonical URLs, `hreflang` alternates with
`x-default`, Open Graph and Twitter cards, `ScholarlyArticle` JSON-LD per chapter,
breadcrumbs in Study Mode, `sitemap.xml` with per-URL language alternates, and
`robots.txt`.

---

## Editorial rules

English is the source of truth. Translations aim to read as native compositions,
not mirrored English.

- Metatron is never presented as G-d, as a second authority, as a co-creator, or
  as an object of prayer. The Celestial Office page states this explicitly.
- Source layers are part of the argument, not decoration. A later mystical claim
  is never rendered as though Bereishis said it.
- Sacred Names use `הוי״ה` / Havayah / HaShem, are never used as decorative
  texture, and are never animated dissolving, shattering or breaking.
- No page or folio citations have been invented. Where an exact reference could
  not be verified, the work or tradition is named instead.

See `CONTENT_NOTES.md` for the specific places that still want rabbinic or
native-speaker review.

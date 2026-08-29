# Content notes

Places where this build made an editorial judgement that a human editor, a rav,
or a native speaker should review before the site is treated as finished.

---

## 1. Citations that should still be verified

No folio, chapter or page references were invented. Where a precise reference
could not be confirmed from the source essay, the **work or tradition is named
instead of a locus**. The following are cited at that level and would be
stronger with verified references:

| Claim | Currently cited as | Should be checked against |
|---|---|---|
| Chanoch is taken before his time because he was liable to be drawn after wrongdoing | "Rashi" | Rashi on Bereishis 5:24 |
| Acher enters Pardes, sees Metatron seated, and infers two authorities | "the Gemara in Chagigah" | Chagigah 15a |
| Metatron's name is like the Name of his Master | "the Gemara" | Sanhedrin 38b |
| "Ki Shemi b'kirbo" | quoted, but the verse is not numbered on the site | Shemos 23:21 |
| The Heikhalot identification of Chanoch with Metatron | "Heikhalot literature / 3 Enoch tradition" | Sefer Heikhalot (3 Enoch), ch. 4 and 15 |
| "Leis lah migarmah klum" | "the Zohar" | Zohar; the phrase is used across the corpus |
| "Nis'aveh HaKadosh Baruch Hu lihyos lo yisborach dirah betachtonim" | "Chassidus" | Midrash Tanchuma, Naso 16; Tanya ch. 36 |
| Rabbeinu Bachya guarding Metatron's authority through servanthood | named only by author | Rabbeinu Bachya, Shemos 23:21 |
| "Anu mad" praise of Moshe | quoted phrase only | Bamidbar 12:3 |
| Basi LeGani and the seventh-generation mandate | "Chassidus / Chabad" | Basi LeGani 5710 |

**Bereishis 5:24 is the one reference given numerically on the site**, in the
`torah` source-layer description, because it is the essay's anchor verse and is
unambiguous.

## 2. Deliberately labelled as later tradition, not as Torah or Chazal

These motifs are carried by the site and are always attributed to a layer. They
are **not** presented as statements of what Bereishis or Chazal say:

- Chanoch's flesh becoming fire, sinews flame, bones glowing coals.
- Expanded dimensions, innumerable radiant eyes, seventy names.
- Garment of splendour, radiant crown, guardianship of celestial treasures.
- A throne near the gate of the seventh palace.
- Metatron as prince and chief among celestial princes.

The last of these is the one most often flattened elsewhere. The site says, in
`sources.json` and on the Celestial Office page, that **particular** Heikhalot
traditions describe him this way and that other Jewish texts order the angelic
hierarchy differently. That qualification should not be edited out.

## 3. The "eighth generation" question

The essay's own caution is preserved verbatim in chapter XXIII and echoed in the
Act X copy, the glossary entry for `shemini`, and the `synthesis` source layer.
"Eighth" is used **only** as contemplative symbolism — what completion was for —
and never as an institutional claim about Chabad. Any future edit that softens
this qualification changes the site's theological position and should not be
made casually.

## 4. Translations wanting native or rabbinic review

All seven locales are complete. Each was written to read as a native
composition rather than as glossed English, and each preserves the Hebrew and
Aramaic technical vocabulary rather than translating it away. The following
deserve a second pass:

- **Hassidic Yiddish (`yi`).** Written in Chabad-flavoured Chassidic Yiddish with
  conventional Chassidic spelling and Loshon Kodesh vocabulary retained
  (`תורה`, `ביטול`, `מלכות`, `דירה בתחתונים`), not YIVO textbook prose. A native
  Chassidic Yiddish reader should check idiom and orthography.
- **Hebrew (`he`).** High-register Torah/Chassidic Hebrew. Worth a check for
  register consistency, especially in the more argumentative chapters
  (XXVI–XXXVI), and for the handling of `הוי״ה` throughout.
- **Arabic (`ar`).** Written in formal MSA that deliberately preserves Jewish
  terminology in transliteration (هَشِيم, إيلوكيم, مِتصڤوت, ديرا بِتَحتونيم)
  rather than substituting Islamic theological vocabulary. No Islamic honorifics
  are used. A native reader should check the transliterations for consistency
  and the vocalisation marks for correctness.
- **Japanese (`ja`).** Contemplative literary register; Hebrew terms are given in
  katakana with the original in the glossary. Kabbalistic concepts are
  deliberately **not** mapped onto Buddhist vocabulary.
- **French (`fr`) and German (`de`).** Scholarly register; transliteration
  follows each language's conventions (bittoul/Bittul, Malkhout/Malchut,
  Chekhinah/Schechina). Worth a consistency pass.

Divine Names are handled the same way in every locale: `הוי״ה` in Hebrew script,
Havayah/HaShem transliterated, and `G-d` / `D-ieu` / `G-tt` / الله used only where
the English source does.

## 5. Interpretive synthesis, marked as such

The following are the author's argument, not received sources, and carry the
`synthesis` layer wherever they appear:

- The Metatron–Malchus analogy. The Malchus Circuit page states "analogy, not
  identity" in its own notice, in every locale.
- Reading the eighth as inhabitation rather than height.
- The application of the Metatron principle to technology, artificial
  intelligence and leadership.
- The reading of `ירד` in "Chanoch ben Yered" as resonant with descent. The
  essay itself flags this as sound rather than doctrine, and chapter XXXVII
  preserves that hedge.

## 6. Scoped and deliberately not shipped

- **Ambient sound.** The brief allowed an opt-in soundscape and said to omit it
  if it could not be made excellent. No audio was produced, so no toggle ships.
  Nothing autoplays and there is no silent audio element in the DOM. If sound is
  added later, the preference store in `src/components/chrome/Preferences.tsx`
  already has a slot for it.
- **Per-chapter share images.** Open Graph metadata is per-chapter, but no
  generated OG images ship; social cards will use the text metadata only.

## 7. Known limitations

- Reading time for Japanese is estimated from character count and for every
  other locale from word count. Both are approximations.
- The glossary annotator marks the **first** occurrence of each of a chapter's
  terms. In locales where a term is inflected away from its dictionary form, the
  inline annotation may not fire; the chapter's term drawer still lists every
  term with its full definition, so no information is lost.
- The canonical origin resolves from `NEXT_PUBLIC_SITE_URL`, then Vercel's
  `VERCEL_PROJECT_PRODUCTION_URL`, then localhost. It is currently the Vercel
  subdomain; set `NEXT_PUBLIC_SITE_URL` when a custom domain is attached so
  canonical URLs, `hreflang` and the sitemap point at it.

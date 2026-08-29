#!/usr/bin/env node
/**
 * Verifies every locale against the canonical English: no missing keys, no
 * string left identical to English where it should have been translated, and
 * essay chapters aligned in count and block shape.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "src/content/locales");
const locales = ["he", "yi", "fr", "de", "ja", "ar"];
const files = ["ui", "acts", "dignities", "malchus", "glossary", "sources"];

const read = (l, f) => JSON.parse(fs.readFileSync(path.join(dir, l, `${f}.json`), "utf8"));

/**
 * Strings that are legitimately identical to English in some locales:
 * transliterations, the wordmark, and layer labels whose spelling a language
 * genuinely shares. Matching one of these is not a finding.
 */
const EXPECTED_IDENTICAL = [
  /translit$/i,
  /^site\.shortTitle$/,
  /^circuit\.openingTranslit$/,
  /^leis-lah\.term$/,
  /^torah\.label$/,
];

function paths(obj, prefix = "") {
  if (Array.isArray(obj)) return obj.flatMap((v, i) => paths(v, `${prefix}[${i}]`));
  if (obj && typeof obj === "object")
    return Object.entries(obj).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
  return [[prefix, obj]];
}

let problems = 0;
const note = (m) => { problems++; console.log("  " + m); };

for (const l of locales) {
  console.log(l);
  for (const f of files) {
    const en = Object.fromEntries(paths(read("en", f)));
    const lo = Object.fromEntries(paths(read(l, f)));
    const missing = Object.keys(en).filter((k) => !(k in lo));
    if (missing.length) note(`${f}: ${missing.length} missing key(s): ${missing.slice(0, 5).join(", ")}`);

    // Identical strings are usually untranslated. Proper nouns, ids and Hebrew
    // are legitimately identical, so only flag prose of a few words or more.
    const same = Object.keys(en).filter((k) => {
      if (!(k in lo) || typeof en[k] !== "string") return false;
      if (en[k] !== lo[k]) return false;
      if (/\.(id|layer|hebrew)$/.test(k) || /chapters\[/.test(k)) return false;
      if (EXPECTED_IDENTICAL.some((re) => re.test(k))) return false;
      if (/[֐-׿]/.test(en[k])) return false;
      return en[k].split(/\s+/).length >= 3;
    });
    if (same.length) note(`${f}: ${same.length} untranslated string(s): ${same.slice(0, 5).join(", ")}`);
  }

  const enE = read("en", "essay");
  const loE = read(l, "essay");
  const byN = new Map(loE.chapters.map((c) => [c.n, c]));
  const missingCh = enE.chapters.filter((c) => !byN.has(c.n)).map((c) => c.n);
  if (missingCh.length) note(`essay: ${missingCh.length} chapter(s) untranslated: ${missingCh.join(", ")}`);
  for (const c of enE.chapters) {
    const t = byN.get(c.n);
    if (!t) continue;
    if (t.blocks.length !== c.blocks.length) note(`essay ch ${c.n}: ${t.blocks.length} blocks vs ${c.blocks.length}`);
    const wrongKind = t.blocks.findIndex((b, i) => b.t !== c.blocks[i].t);
    if (wrongKind >= 0) note(`essay ch ${c.n}: block ${wrongKind} kind mismatch`);
    const empty = t.blocks.findIndex((b) => !String(b.v).trim());
    if (empty >= 0) note(`essay ch ${c.n}: block ${empty} empty`);
    if (!t.title?.trim()) note(`essay ch ${c.n}: no title`);
  }
}

console.log(problems ? `\n${problems} problem(s)` : "\nno problems");
process.exit(problems ? 1 : 0);

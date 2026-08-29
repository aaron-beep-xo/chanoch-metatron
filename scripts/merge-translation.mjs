#!/usr/bin/env node
/**
 * Merges a batch of translated chapters into a locale's essay.json.
 *
 * Input file shape:
 *   { "title": "...", "subtitle": "...",
 *     "chapters": { "<n>": { "title": "...", "subtitle": "...", "blocks": ["…", "…"] } } }
 *
 * `blocks` is a flat array of strings in the same order and count as the
 * canonical English chapter; the block kinds (prose vs. quotation) are copied
 * from English, and a count mismatch is a hard error rather than a silent skip.
 *
 * Usage: node scripts/merge-translation.mjs <locale> <batch.json>
 */
import fs from "node:fs";
import path from "node:path";

const [, , locale, batchPath] = process.argv;
if (!locale || !batchPath) {
  console.error("usage: merge-translation.mjs <locale> <batch.json>");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const enPath = path.join(root, "src/content/locales/en/essay.json");
const outPath = path.join(root, `src/content/locales/${locale}/essay.json`);

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));

const existing = fs.existsSync(outPath)
  ? JSON.parse(fs.readFileSync(outPath, "utf8"))
  : { title: "", subtitle: "", chapters: [] };

const byN = new Map(existing.chapters.map((c) => [c.n, c]));
const errors = [];

for (const [key, val] of Object.entries(batch.chapters ?? {})) {
  const n = Number(key);
  const source = en.chapters.find((c) => c.n === n);
  if (!source) {
    errors.push(`chapter ${n} does not exist in the canonical essay`);
    continue;
  }
  if (!Array.isArray(val.blocks) || val.blocks.length !== source.blocks.length) {
    errors.push(
      `chapter ${n}: expected ${source.blocks.length} blocks, received ${val.blocks?.length ?? 0}`,
    );
    continue;
  }
  const empty = val.blocks.findIndex((b) => typeof b !== "string" || !b.trim());
  if (empty >= 0) {
    errors.push(`chapter ${n}: block ${empty} is empty`);
    continue;
  }
  byN.set(n, {
    n,
    title: val.title ?? source.title,
    subtitle: val.subtitle ?? source.subtitle,
    blocks: val.blocks.map((v, i) => ({ t: source.blocks[i].t, v })),
  });
}

if (errors.length) {
  console.error(`${locale}: ${errors.length} problem(s)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

const out = {
  title: batch.title ?? existing.title ?? "",
  subtitle: batch.subtitle ?? existing.subtitle ?? "",
  chapters: [...byN.values()].sort((a, b) => a.n - b.n),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 1));
console.log(`${locale}: ${out.chapters.length}/${en.chapters.length} chapters translated`);

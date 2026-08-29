#!/usr/bin/env node
/** Prints, per locale, which content files exist and how much of the essay is translated. */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dir = path.join(root, "src/content/locales");
const files = ["ui", "acts", "dignities", "malchus", "glossary", "sources", "essay"];
const en = JSON.parse(fs.readFileSync(path.join(dir, "en/essay.json"), "utf8"));
const total = en.chapters.length;

for (const locale of fs.readdirSync(dir).sort()) {
  const have = files.filter((f) => fs.existsSync(path.join(dir, locale, `${f}.json`)));
  let chapters = 0;
  const essayPath = path.join(dir, locale, "essay.json");
  if (fs.existsSync(essayPath)) {
    const e = JSON.parse(fs.readFileSync(essayPath, "utf8"));
    chapters = (e.chapters ?? []).filter((c) => (c.blocks ?? []).length).length;
  }
  const missing = files.filter((f) => !have.includes(f));
  console.log(
    `${locale.padEnd(3)} files ${String(have.length).padStart(2)}/${files.length}` +
      `  essay ${String(chapters).padStart(2)}/${total}` +
      (missing.length ? `  missing: ${missing.join(", ")}` : ""),
  );
}

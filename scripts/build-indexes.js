import fs from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "src", "data");
const GLOSSARY_PATH = path.join(DATA_DIR, "glossary.json");
const CATEGORIES_PATH = path.join(DATA_DIR, "categories.json");
const TAGS_PATH = path.join(DATA_DIR, "tags.json");

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function deriveLabelObjects(terms, fieldName) {
  const counts = new Map();

  for (const term of terms) {
    const values = Array.isArray(term[fieldName]) ? term[fieldName] : [];

    for (const value of values) {
      const label = String(value ?? "").trim();
      if (!label) continue;

      const key = label.toLowerCase();
      const current = counts.get(key);

      if (current) {
        current.count += 1;
      } else {
        counts.set(key, {
          label,
          slug: slugify(label),
          count: 1,
        });
      }
    }
  }

  return Array.from(counts.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "en", { sensitivity: "base" }),
  );
}

async function main() {
  const rawGlossary = await fs.readFile(GLOSSARY_PATH, "utf8");
  const glossary = JSON.parse(rawGlossary);

  if (!Array.isArray(glossary)) {
    throw new Error("glossary.json must contain an array.");
  }

  const categories = deriveLabelObjects(glossary, "category");
  const tags = deriveLabelObjects(glossary, "tags");

  await fs.writeFile(CATEGORIES_PATH, JSON.stringify(categories, null, 2), "utf8");
  await fs.writeFile(TAGS_PATH, JSON.stringify(tags, null, 2), "utf8");

  console.log(`Read ${glossary.length} glossary entries.`);
  console.log(`Wrote: ${CATEGORIES_PATH}`);
  console.log(`Wrote: ${TAGS_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
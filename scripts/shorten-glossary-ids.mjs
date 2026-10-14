import fs from "node:fs";
import crypto from "node:crypto";

const file = "src/data/glossary.json";
const mappingFile = "scripts/glossary-id-migration.json";
const apply = process.argv.includes("--apply");

const glossary = JSON.parse(fs.readFileSync(file, "utf8"));

const MAX_BYTES = 100;
const PREFIX_LENGTH = 55;

function slugify(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shortHash(value) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex")
    .slice(0, 12);
}

const used = new Set(glossary.map((term) => term.id));
const changes = [];

for (const term of glossary) {
  const oldId = term.id;

  if (Buffer.byteLength(oldId, "utf8") <= MAX_BYTES) {
    continue;
  }

  const prefix =
    slugify(term.english).slice(0, PREFIX_LENGTH).replace(/-+$/, "") ||
    "term";

  const newId = `${prefix}-${shortHash(oldId)}`;

  if (used.has(newId)) {
    throw new Error(`ID collision: ${newId}`);
  }

  used.add(newId);

  changes.push({
    english: term.english,
    oldId,
    newId,
  });

  if (apply) {
    term.id = newId;
  }
}

console.log(`Total entries: ${glossary.length}`);
console.log(`IDs to shorten: ${changes.length}`);

for (const change of changes) {
  console.log(`\n${change.english}`);
  console.log(`  OLD: ${change.oldId}`);
  console.log(`  NEW: ${change.newId}`);
}

if (apply) {
  fs.writeFileSync(file, JSON.stringify(glossary, null, 2) + "\n");

  fs.writeFileSync(
    mappingFile,
    JSON.stringify(changes, null, 2) + "\n",
  );

  console.log(`\nUpdated ${file}`);
  console.log(`Saved migration mapping to ${mappingFile}`);
} else {
  console.log("\nDry run only. No files modified.");
}
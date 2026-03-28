import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.join(ROOT_DIR, "terminology-sources");
const OUTPUT_DIR = path.join(ROOT_DIR, "src", "data");

const VALID_STATUSES = new Set(["active", "deprecated", "draft"]);

const TERM_DEFAULTS = {
  english: "",
  englishDefinition: "",
  spanish: "",
  spanishDefinition: "",
  comments: "",
  category: [],
  tags: [],
  aliases: [],
  status: "active",
  lastUpdated: "",
  source: "",
  proposals: "",
};

const HEADER_ALIASES = {
  english: ["english", "english term", "term english", "englishterm"],
  englishDefinition: [
    "englishdefinition",
    "english definition",
    "definition english",
    "english_definiton",
  ],
  spanish: [
    "spanish",
    "spanish term",
    "term spanish",
    "spanishterm",
    "espanol",
    "español",
  ],
  spanishDefinition: [
    "spanishdefinition",
    "spanish definition",
    "definition spanish",
    "definición en español",
  ],
  comments: ["comments", "comment", "notes"],
  proposals: ["proposals", "proposal"],
  category: ["category", "categories"],
  tags: ["tag", "tags"],
  aliases: [
    "alias",
    "aliases",
    "alternate terms",
    "alternates",
    "alternateterms",
  ],
  status: ["status"],
  lastUpdated: [
    "lastupdated",
    "last updated",
    "updatedat",
    "updated at",
    "date updated",
  ],
};

function normalizeHeader(header) {
  return String(header ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function normalizeAliasKey(header) {
  return normalizeHeader(header).replace(/\s+/g, "");
}

function resolveHeaderMap(headers) {
  const map = {};

  for (const [canonicalKey, aliases] of Object.entries(HEADER_ALIASES)) {
    const aliasSet = new Set(aliases.map(normalizeAliasKey));

    const matchedHeader = headers.find((header) =>
      aliasSet.has(normalizeAliasKey(header)),
    );

    if (matchedHeader) {
      map[canonicalKey] = matchedHeader;
    }
  }

  return map;
}

function getField(row, headerMap, key) {
  const actualHeader = headerMap[key];
  if (!actualHeader) return "";
  return String(row[actualHeader] ?? "").trim();
}

function splitMultiValueField(value) {
  if (!value) return [];

  return value
    .split(/[;,|/]/g)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, arr) => {
      const lower = item.toLowerCase();
      return arr.findIndex((x) => x.toLowerCase() === lower) === index;
    });
}

function humanizeLabel(value) {
  return String(value ?? "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function maybeHumanizeLabel(value) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) return "";

  // Only humanize clearly slug-like values such as "civil-strife"
  if (/^[a-z0-9]+(?:[-_][a-z0-9]+)+$/.test(trimmed)) {
    return humanizeLabel(trimmed);
  }

  return trimmed;
}

function normalizeLabelArray(values, transformer = (value) => value) {
  return values
    .map(transformer)
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .filter((item, index, arr) => {
      const lower = item.toLowerCase();
      return arr.findIndex((x) => x.toLowerCase() === lower) === index;
    });
}

function normalizeStatus(rawStatus, warnings, contextLabel) {
  const normalized = String(rawStatus ?? "")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return "active";
  }

  if (VALID_STATUSES.has(normalized)) {
    return normalized;
  }

  warnings.push(
    `[status] Invalid status "${rawStatus}" in ${contextLabel}. Defaulting to "active".`,
  );
  return "active";
}

function normalizeDate(rawDate, warnings, contextLabel) {
  const value = String(rawDate ?? "").trim();

  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  warnings.push(
    `[lastUpdated] Invalid date "${rawDate}" in ${contextLabel}. Expected YYYY-MM-DD. Leaving blank.`,
  );
  return "";
}

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

function buildId(term, existingIds, rowIndex) {
  const base =
    slugify(`${term.english || "untitled"}-${term.spanish || "no-spanish"}`) ||
    `term-${rowIndex + 1}`;

  let id = base;
  let counter = 2;

  while (existingIds.has(id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }

  existingIds.add(id);
  return id;
}

function deriveLabelObjects(terms, fieldName) {
  const counts = new Map();

  for (const term of terms) {
    for (const value of term[fieldName]) {
      const key = value.toLowerCase();
      const current = counts.get(key);

      if (current) {
        current.count += 1;
      } else {
        counts.set(key, {
          label: value,
          slug: slugify(value),
          count: 1,
        });
      }
    }
  }

  return Array.from(counts.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "en", { sensitivity: "base" }),
  );
}

function removeSelfAliases(aliases, english, spanish) {
  const forbidden = new Set(
    [english, spanish]
      .map((v) =>
        String(v ?? "")
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean),
  );

  return aliases.filter((alias) => !forbidden.has(alias.toLowerCase()));
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readCsvFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  return entries
    .filter(
      (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".csv"),
    )
    .map((entry) => path.join(dirPath, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

async function parseCsvFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    relax_quotes: true,
  });

  return records.filter((row) =>
    Object.values(row).some((value) => String(value ?? "").trim() !== ""),
  );
}

async function main() {
  const warnings = [];
  const terms = [];
  const existingIds = new Set();

  await ensureDirectory(OUTPUT_DIR);

  const csvFiles = await readCsvFiles(SOURCE_DIR);

  if (csvFiles.length === 0) {
    console.error(`No CSV files found in ${SOURCE_DIR}`);
    process.exit(1);
  }

  for (const filePath of csvFiles) {
    const sourceFile = path.basename(filePath);
    const rows = await parseCsvFile(filePath);

    if (rows.length === 0) {
      warnings.push(`[file] ${sourceFile} contains no rows.`);
      continue;
    }

    const headers = Object.keys(rows[0]);
    const headerMap = resolveHeaderMap(headers);

    if (!headerMap.english) {
      warnings.push(`[headers] Missing "english" column in ${sourceFile}`);
    }

    if (!headerMap.spanish) {
      warnings.push(`[headers] Missing "spanish" column in ${sourceFile}`);
    }

    for (const [rowIndex, row] of rows.entries()) {
      const english = getField(row, headerMap, "english");
      const spanish = getField(row, headerMap, "spanish");
      const contextLabel = `${sourceFile} row ${rowIndex + 2}`;

      if (!english && !spanish) {
        warnings.push(`[row] Skipping blank term row in ${contextLabel}.`);
        continue;
      }

      const rawCategory = splitMultiValueField(getField(row, headerMap, "category"));
      const rawTags = splitMultiValueField(getField(row, headerMap, "tags"));
      const rawAliases = splitMultiValueField(getField(row, headerMap, "aliases"));

      const category = normalizeLabelArray(rawCategory, maybeHumanizeLabel);
      const tags = normalizeLabelArray(rawTags, maybeHumanizeLabel);
      const aliases = removeSelfAliases(
        normalizeLabelArray(rawAliases),
        english,
        spanish,
      );

      const term = {
        ...TERM_DEFAULTS,
        english,
        englishDefinition: getField(row, headerMap, "englishDefinition"),
        spanish,
        spanishDefinition: getField(row, headerMap, "spanishDefinition"),
        comments: getField(row, headerMap, "comments"),
        proposals: getField(row, headerMap, "proposals"),
        category,
        tags,
        aliases,
        status: normalizeStatus(
          getField(row, headerMap, "status"),
          warnings,
          contextLabel,
        ),
        lastUpdated: normalizeDate(
          getField(row, headerMap, "lastUpdated"),
          warnings,
          contextLabel,
        ),
        source: sourceFile,
      };

      term.id = buildId(term, existingIds, rowIndex);
      terms.push(term);
    }
  }

  const categories = deriveLabelObjects(terms, "category");
  const tags = deriveLabelObjects(terms, "tags");

  await fs.writeFile(
    path.join(OUTPUT_DIR, "glossary.json"),
    JSON.stringify(terms, null, 2),
    "utf8",
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, "categories.json"),
    JSON.stringify(categories, null, 2),
    "utf8",
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, "tags.json"),
    JSON.stringify(tags, null, 2),
    "utf8",
  );

  console.log(`Built ${terms.length} terms from ${csvFiles.length} CSV files.`);
  console.log("Wrote:");
  console.log(`- ${path.join(OUTPUT_DIR, "glossary.json")}`);
  console.log(`- ${path.join(OUTPUT_DIR, "categories.json")}`);
  console.log(`- ${path.join(OUTPUT_DIR, "tags.json")}`);

  if (warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of warnings) {
      console.log(`- ${warning}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
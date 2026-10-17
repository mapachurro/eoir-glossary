import fs from "node:fs";
import path from "node:path";
import * as parse5 from "parse5";

const datasets = [
  "glossary.json",
  "forms.json",
  "adjournmentCodes.json",
  "authority.json",
];

const issues = [];
let records = 0;
let anchors = 0;
let urls = 0;

function report(file, record, field, message) {
  issues.push({ file, record, field, message });
}

function checkText(value, file, record, field) {
  if (typeof value !== "string") return;

  // Only inspect content containing HTML anchors or URLs.
  if (!/<a\b|<\/a\s*>|https?:\/\//i.test(value)) return;

  const openingTags = [...value.matchAll(/<a\b[^>]*>/gi)];
  const closingTags = [...value.matchAll(/<\/a\s*>/gi)];

  anchors += openingTags.length;

  if (openingTags.length !== closingTags.length) {
    report(
      file,
      record,
      field,
      `${openingTags.length} opening <a> tags, ${closingTags.length} closing </a> tags`,
    );
  }

  // parse5 reports malformed HTML without requiring a browser.
  const errors = [];

  const fragment = parse5.parseFragment(value, {
    onParseError(error) {
      errors.push(error.code);
    },
  });

  for (const error of [...new Set(errors)]) {
    report(file, record, field, `HTML parse error: ${error}`);
  }

  function inspect(node) {
    if (node.tagName === "a") {
      const href = node.attrs?.find((attr) => attr.name === "href")?.value;

      if (!href) {
        report(file, record, field, "Anchor without href");
      } else {
        try {
          const url = new URL(href, "https://gringo.bingo/");

          if (!["http:", "https:"].includes(url.protocol)) {
            report(file, record, field, `Unsupported link protocol: ${href}`);
          }

          urls++;
        } catch {
          report(file, record, field, `Invalid URL: ${href}`);
        }
      }
    }

    for (const child of node.childNodes || []) {
      inspect(child);
    }
  }

  inspect(fragment);

  // Also validate standalone URLs.
  for (const match of value.matchAll(/https?:\/\/[^\s<>"']+/g)) {
    try {
      new URL(match[0]);
    } catch {
      report(file, record, field, `Invalid bare URL: ${match[0]}`);
    }
  }
}

function scan(value, file, record, field = "") {
  if (typeof value === "string") {
    checkText(value, file, record, field);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      scan(item, file, record, `${field}[${index}]`),
    );
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      scan(item, file, record, field ? `${field}.${key}` : key);
    }
  }
}

for (const filename of datasets) {
  const filepath = path.join("src/data", filename);
  const data = JSON.parse(fs.readFileSync(filepath, "utf8"));

  // Supports both array and object-based datasets.
  const entries = Array.isArray(data) ? data : Object.values(data);

  for (const [index, entry] of entries.entries()) {
    records++;

    const identifier =
      entry?.id ||
      entry?.code ||
      entry?.title ||
      entry?.english ||
      `record ${index + 1}`;

    scan(entry, filename, identifier);
  }
}

console.log(`Records scanned: ${records}`);
console.log(`HTML anchors found: ${anchors}`);
console.log(`Anchor URLs validated: ${urls}`);
console.log(`Issues: ${issues.length}`);

for (const issue of issues) {
  console.log(
    `\n${issue.file} | ${issue.record} | ${issue.field}\n  ${issue.message}`,
  );
}

if (issues.length) {
  process.exitCode = 1;
}

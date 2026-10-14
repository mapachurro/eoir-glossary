import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
}

walk(dist);

const broken = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");

  const links = [
    ...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g),
  ];

  for (const match of links) {
    const value = match[1];

    if (
      value.startsWith("#") ||
      value.startsWith("mailto:") ||
      value.startsWith("tel:") ||
      value.startsWith("data:") ||
      value.startsWith("javascript:")
    ) {
      continue;
    }

    let url;

    try {
      url = new URL(value, "https://gringo.bingo/");
    } catch {
      continue;
    }

    if (url.origin !== "https://gringo.bingo") {
      continue;
    }

    checked++;

    const pathname = decodeURIComponent(url.pathname);
    const relative = pathname.replace(/^\/+/, "");

    const candidates = [
      path.join(dist, relative),
      path.join(dist, relative, "index.html"),
      path.join(dist, `${relative}.html`),
    ];

    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      broken.push({
        page: path.relative(dist, file),
        link: value,
      });
    }
  }
}

console.log(`HTML pages audited: ${htmlFiles.length}`);
console.log(`Internal links checked: ${checked}`);
console.log(`Broken links: ${broken.length}`);

for (const item of broken.slice(0, 50)) {
  console.log(`${item.page} -> ${item.link}`);
}

if (broken.length) {
  process.exitCode = 1;
}
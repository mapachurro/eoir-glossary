import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync("src/pages/SourcesPage.jsx", "utf8");

const start = source.indexOf("const historicalGlossaries =");
const end = source.indexOf("function isUrl(");

if (start === -1 || end === -1 || end <= start) {
  throw new Error("Could not locate source data arrays.");
}

const dataSource = source.slice(start, end);

const data = vm.runInNewContext(
  `${dataSource}
  JSON.stringify({ historicalGlossaries, bibliographyEntries })`,
);

fs.mkdirSync("astro-src/data", { recursive: true });

fs.writeFileSync(
  "astro-src/data/sources.json",
  JSON.stringify(JSON.parse(data), null, 2) + "\n",
);

console.log("Extracted bibliography and historical glossary data.");
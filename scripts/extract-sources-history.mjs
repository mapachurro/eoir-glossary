import fs from "node:fs";

const source = fs.readFileSync("src/pages/SourcesPage.jsx", "utf8");

const startMarker = '<section className="source-section">';
const endMarker = '<div className="glossary-history-grid">';

const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);

if (start === -1 || end === -1) {
  throw new Error("Could not locate historical narrative.");
}

let content = source.slice(start, end);

// Convert React attributes to HTML/Astro attributes.
content = content.replaceAll("className=", "class=");

// Remove React expressions used solely for whitespace.
content = content.replace(/\{\s*" "\s*\}/g, " ");

// Normalize public asset URLs for Astro.
content = content.replaceAll(
  'href="public/resources/',
  'href="/resources/',
);

content = content.replaceAll(
  'src="public/resources/',
  'src="/resources/',
);

// Fix the supplementary glossary filename.
content = content.replaceAll(
  "Berlitz_Supplementary_List_of_Immigration_Terms.pdf",
  "Berlitz_Supplementary_List.pdf",
);

// Convert JSX self-closing conventions where necessary.
content = content.replaceAll("</img>", "");

fs.mkdirSync("astro-src/components/sources", {
  recursive: true,
});

fs.writeFileSync(
  "astro-src/components/sources/SourcesHistory.astro",
  content.trim() + "\n</section>\n",
);

console.log("Extracted historical narrative.");
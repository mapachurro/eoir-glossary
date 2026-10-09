// This script is intended to add a new data type to every glossary entry, specifically, the `contrastsWith` field. Could it be modified in the future to do more full-glossary mods and maintenance? Who knows? 

import fs from "fs";

const filePath = "./src/data/glossary.json";

const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const updated = data.map((term) => ({
  ...term,
  contrastsWith: term.contrastsWith ?? [],
}));

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

console.log("✨ contrastsWith added to all terms");
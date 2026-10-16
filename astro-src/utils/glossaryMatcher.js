import glossary from "../../src/data/glossary.json";
import { buildGlossaryMatcher } from "../../src/utils/linkGlossaryText.js";

export const glossaryMatcher = buildGlossaryMatcher(glossary);

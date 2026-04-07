  import { Link } from "react-router-dom";
import glossary from "../data/glossary.json";
import { buildGlossaryMatcher } from "../utils/linkGlossaryText";

const { lookup, regex } = buildGlossaryMatcher(glossary);

function normalizeValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

export default function LinkedGlossaryText({ text }) {
  const value = String(text ?? "");

  if (!value || !regex) {
    return value || "—";
  }

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(value)) !== null) {
    const matchedText = match[0];
    const start = match.index;
    const end = regex.lastIndex;

    if (start > lastIndex) {
      parts.push(value.slice(lastIndex, start));
    }

    const matchedTerm = lookup.get(normalizeValue(matchedText));

    if (matchedTerm) {
      parts.push(
        <Link
          key={`${matchedTerm.id}-${start}`}
          to={`/term/${matchedTerm.id}`}
          className="inline-glossary-link"
        >
          {matchedText}
        </Link>,
      );
    } else {
      parts.push(matchedText);
    }

    lastIndex = end;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
}
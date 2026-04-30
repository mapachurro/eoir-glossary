import { Link } from "react-router-dom";
import glossary from "../data/glossary.json";
import { buildGlossaryMatcher } from "../utils/linkGlossaryText";

const URL_MATCH_REGEX = /https?:\/\/[^\s]+/i;
const URL_SCAN_REGEX = /(https?:\/\/[^\s]+)/gi;

const { lookup, regex } = buildGlossaryMatcher(glossary);

function normalizeValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

export default function LinkedGlossaryText({ text, excludeId }) {
  const value = String(text ?? "");

  if (!value) return "—";

  const parts = [];
  let lastIndex = 0;

  const combinedPatternParts = [];

  if (regex?.source) {
    combinedPatternParts.push(regex.source);
  }

  combinedPatternParts.push(URL_SCAN_REGEX.source);

  const combinedRegex = new RegExp(combinedPatternParts.join("|"), "gi");

  let match;

  while ((match = combinedRegex.exec(value)) !== null) {
    const matchedText = match[0];
    const start = match.index;
    const end = combinedRegex.lastIndex;

    if (start > lastIndex) {
      parts.push(value.slice(lastIndex, start));
    }

    if (URL_MATCH_REGEX.test(matchedText)) {
      parts.push(
        <a
          key={`url-${start}`}
          href={matchedText}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link"
        >
          {matchedText}
        </a>,
      );
    } else {
      const matchedTerm = lookup.get(normalizeValue(matchedText));

      if (matchedTerm && matchedTerm.id !== excludeId) {
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
    }

    lastIndex = end;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
}
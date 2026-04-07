function normalizeValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildGlossaryLookup(glossary) {
  const map = new Map();

  for (const term of glossary) {
    const candidates = [
      term.english,
      term.spanish,
      ...(term.aliases || []),
    ];

    for (const candidate of candidates) {
      const normalized = normalizeValue(candidate);
      if (!normalized) continue;

      if (!map.has(normalized)) {
        map.set(normalized, term);
      }
    }
  }

  return map;
}

export function buildGlossaryMatcher(glossary) {
  const lookup = buildGlossaryLookup(glossary);

  const labels = Array.from(lookup.keys())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length); // longest first

  const pattern = labels
    .map((label) => escapeRegExp(label))
    .join("|");

  const regex = pattern
    ? new RegExp(`\\b(${pattern})\\b`, "gi")
    : null;

  return { lookup, regex };
}
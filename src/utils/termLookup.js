export function normalizeLookupValue(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function findTermByLabel(glossary, label) {
  const needle = normalizeLookupValue(label);

  if (!needle) return null;

  return (
    glossary.find(
      (term) => normalizeLookupValue(term.english) === needle
    ) ||
    glossary.find(
      (term) => normalizeLookupValue(term.spanish) === needle
    ) ||
    null
  );
}
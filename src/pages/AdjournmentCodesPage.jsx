import { useMemo, useState } from "react";
import codes from "../data/adjournmentCodes.json";
import SearchBar from "../components/SearchBar";

const categoryOrder = [
  "Respondent",
  "DHS",
  "Immigration Judge",
  "Court Administration",
  "Operational",
];

function matchesCode(code, query) {
  const haystack = [
    code.id,
    code.code,
    code.meaning,
    code.spanishMeaning,
    code.category,
    code.affectsAsylumClock,
    code.notes,
    code.source,
    ...(code.relatedTerms || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function groupCodesByCategory(codesToGroup) {
  return codesToGroup.reduce((groups, code) => {
    const category = code.category || "Uncategorized";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(code);
    return groups;
  }, {});
}

function sortCodes(a, b) {
  return a.code.localeCompare(b.code, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function getClockClass(value) {
  const normalized = String(value || "").toLowerCase();

  if (normalized.includes("stop")) return "clock-badge clock-badge--stops";
  if (normalized.includes("run")) return "clock-badge clock-badge--runs";
  if (normalized.includes("neutral")) return "clock-badge clock-badge--neutral";

  return "clock-badge";
}

export default function CodesPage() {
  const [query, setQuery] = useState("");

  const filteredCodes = useMemo(() => {
    if (!query.trim()) return codes;
    return codes.filter((code) => matchesCode(code, query));
  }, [query]);

  const groupedCodes = useMemo(() => {
    return groupCodesByCategory(filteredCodes);
  }, [filteredCodes]);

  const sortedCategories = Object.keys(groupedCodes).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return (
    <section className="page">
      <h1>Adjournment Code Explorer</h1>

      <p className="page-intro">
        A reference guide, fairly but not completely, complete and up-to-date,
        to the <strong>adjournment codes</strong> used in US Immigration Court
        (EOIR) proceedings.
      </p>

      <p>
        These codes embed information regarding the reason that the case is
        being continued to a later date into the record. They can affect the
        results of a case; they can affect other processes outside of the EOIR,
        most significantly the{" "}
        <a href="https://gringo.bingo/#/terms?q=asylum%20clock">
          asylum clock
        </a>
        , a timekeeping measure that determines when an asylum seeker present in
        the US is eligible to receive a work permit.
      </p>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by code, meaning, category, clock effect..."
      />

      <p className="results-count">
        {filteredCodes.length} code{filteredCodes.length === 1 ? "" : "s"} shown.
      </p>

      {sortedCategories.map((category) => {
        const categoryCodes = [...groupedCodes[category]].sort(sortCodes);

        return (
          <section className="code-category-section" key={category}>
            <h2>{category} Adjournments</h2>

            <div className="code-table">
              <div className="code-table__header">
                <span>Code</span>
                <span>Meaning</span>
                <span>EAD Clock Effect</span>
              </div>

              {categoryCodes.map((code) => (
                <article className="code-row" key={code.id || code.code}>
                  <div className="code-row__code">{code.code}</div>

                  <div className="code-row__main">
                    <h3>{code.meaning}</h3>

                    {code.spanishMeaning && (
                      <p className="code-row__spanish">
                        {code.spanishMeaning}
                      </p>
                    )}

                    {code.notes && (
                      <p className="code-row__notes">
                        <strong>Notes:</strong> {code.notes}
                      </p>
                    )}

                    {code.relatedTerms?.length > 0 && (
                      <p className="code-row__related">
                        <strong>Related terms:</strong>{" "}
                        {code.relatedTerms.join(", ")}
                      </p>
                    )}

                    {code.source && (
                      <p className="code-row__source">
                        <a href={code.source} target="_blank" rel="noreferrer">
                          Source
                        </a>
                      </p>
                    )}
                  </div>

                  <div>
                    <span className={getClockClass(code.affectsAsylumClock)}>
                      {code.affectsAsylumClock || "—"}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}
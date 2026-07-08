import { useMemo, useState } from "react";
import codes from "../data/adjournmentCodes.json";
import SearchBar from "../components/SearchBar";

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

export default function CodesPage() {
  const [query, setQuery] = useState("");

  const filteredCodes = useMemo(() => {
    if (!query.trim()) return codes;
    return codes.filter((code) => matchesCode(code, query));
  }, [query]);

  return (
    <section className="page">
      <h1>Adjournment Code explorer</h1>
      <p className="page-intro">
        A reference guide, fairly but not completely, complete and up-to-date,
        to the <strong>adjournment codes</strong> used in US Immigration Court (EOIR)
        proceedings.
      </p>

      <p>  
        These codes embed information regarding the reason that the
        case is being continued to a later date into the record. They can affect
        the results of a case; they can affect other processes outside of the
        EOIR, most significantly the <a href="https://mapachurro.github.io/eoir-glossary/#/terms?q=asylum%20clock">asylum clock</a>, a timekeeping measure that
        determines when an asylum seeker present in the US is elegible to
        receive a work permit.
      </p>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by code, meaning, category..."
      />

      <div className="codes-grid">
        {filteredCodes.map((code) => (
          <article className="code-card" key={code.code}>
            <div className="code-card__header">
              <h2>{code.code}</h2>
            </div>

            <h3>{code.meaning}</h3>

            {code.spanishMeaning && (
              <p className="code-card__spanish">{code.spanishMeaning}</p>
            )}

            <p>{code.notes}</p>

            {code.relatedTerms?.length > 0 && (
              <p>
                <strong>Related terms:</strong> {code.relatedTerms.join(", ")}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

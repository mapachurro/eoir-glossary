import { useMemo, useState } from "react";
import authority from "../data/authority.json";
import SearchBar from "../components/SearchBar";

function matchesForm(authority, query) {
  const haystack = [
    authority.body,
    authority.citation,
    authority.name,
    ...(authority.topics || []),
    authority.summary,
    authority.officialUrl,
    authority.notes,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function LegalAuthority() {
  const [query, setQuery] = useState("");

  const filteredAuthority = useMemo(() => {
    if (!query.trim()) return authority;
    return authority.filter((auth) => matchesForm(auth, query));
  }, [query]);

  return (
    <section className="page">
      <h1>Legal Authority</h1>
      <p className="page-intro">
        A wildly incomplete and non-authoritative guide to legal authority. 
        More commonly referred to as "case law", these are decisions made, generally by the appellate authority of the Board of Immigration Appeals, or by a US District Court, the Supreme Court, the Attorney General in those instances wherein he or she sees fit to <strong>write new law</strong>, or--
    </p>
    <p>
        These cases are often referred to by a series of initials, especially when they are BIA-issued.
        In case it's not clear already, <strong>this sure as hell is not legal advice</strong>.
        But if someone keeps talking about "as per Matter of W-T-A-F", and this page helps you, well... then it helps.
      </p>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by form number, agency, title, purpose..."
      />

      <div className="forms-grid">
        {filteredForms.map((form) => (
          <article className="form-card" key={form.id}>
            <div className="form-card__header">
              <span className="form-card__agency">{form.agency}</span>
              <h2>{form.formNumber}</h2>
            </div>

            <h3>{form.title}</h3>

            {form.spanishTitle && (
              <p className="form-card__spanish">{form.spanishTitle}</p>
            )}

            <p>{form.purpose}</p>

            {form.relatedTerms?.length > 0 && (
              <p>
                <strong>Related terms:</strong>{" "}
                {form.relatedTerms.join(", ")}
              </p>
            )}

            {form.officialUrl && (
              <a href={form.officialUrl} target="_blank" rel="noreferrer">
                Official form/source
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
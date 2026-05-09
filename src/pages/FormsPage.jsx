import { useMemo, useState } from "react";
import forms from "../data/forms.json";
import SearchBar from "../components/SearchBar";

function matchesForm(form, query) {
  const haystack = [
    form.agency,
    form.formNumber,
    form.title,
    form.spanishTitle,
    form.purpose,
    form.notes,
    ...(form.relatedTerms || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function FormsPage() {
  const [query, setQuery] = useState("");

  const filteredForms = useMemo(() => {
    if (!query.trim()) return forms;
    return forms.filter((form) => matchesForm(form, query));
  }, [query]);

  return (
    <section className="page">
      <h1>Forms Explorer</h1>
      <p className="page-intro">
        A reference guide to common EOIR, USCIS, and immigration-related forms.
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
import { useMemo, useState } from "react";
import authority from "../data/authority.json";
import SearchBar from "../components/SearchBar";

function matchesAuthority(item, query) {
  const haystack = [
    item.body,
    item.citation,
    item.name,
    item.year,
    item.status,
    ...(item.topics || []),
    ...(item.relatedTerms || []),
    item.summary,
    item.officialUrl,
    item.notes,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function LegalAuthority() {
  const [query, setQuery] = useState("");

  const filteredAuthority = useMemo(() => {
    if (!query.trim()) return authority;
    return authority.filter((item) => matchesAuthority(item, query));
  }, [query]);

  return (
    <section className="page">
      <h1>Legal Authority</h1>

      <p>
        Immigration law in the United States is a fascinating patchwork of Federal law, regulation, and case law from the Board of Immigration Appeals, Federal Circuit Courts, the Supreme Court, and the secret off-the-menu item of Attorney General-authored decisions. Try to keep up.
      </p>

      <p>
        This is not legal advice. This is a wildly incomplete, evolving knowledge base of case law and relevant statutes that may, or may not, come up frequently in immigration proceedings and processes. 
      </p>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by case name, citation, topic, body, summary..."
      />

      <div className="authority-grid">
        {filteredAuthority.map((item) => (
          <article className="authority-card" key={item.id}>
            <div className="authority-card__header">
              {item.body && (
                <span className="authority-card__body">{item.body}</span>
              )}

              {item.year && (
                <span className="authority-card__year">{item.year}</span>
              )}
            </div>

            <h2>{item.name}</h2>

            {item.citation && (
              <p className="authority-card__citation">{item.citation}</p>
            )}

            {item.status && (
              <p>
                <strong>Status:</strong> {item.status}
              </p>
            )}

            {item.summary && <p>{item.summary}</p>}

            {item.topics?.length > 0 && (
              <p>
                <strong>Topics:</strong> {item.topics.join(", ")}
              </p>
            )}

            {item.relatedTerms?.length > 0 && (
              <p>
                <strong>Related terms:</strong>{" "}
                {item.relatedTerms.join(", ")}
              </p>
            )}

            {item.notes && (
              <p>
                <strong>Notes:</strong> {item.notes}
              </p>
            )}

            {item.officialUrl && (
              <a href={item.officialUrl} target="_blank" rel="noreferrer">
                Official source
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
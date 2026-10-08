import { useMemo, useState } from "react";
import authority from "../data/authority.json";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";

function matchesAuthority(item, query) {
  const haystack = [
    item.body,
    ...(item.holding || []),
    item.citation,
    item.name,
    item.year,
    item.status,
    ...(item.topics || []),
    ...(item.relatedTerms || []),
    ...(item.cites || []),
    ...(item.summary || []),
    item.officialUrl,
    item.notes,
  ]
    .filter(Boolean)
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
        Immigration law in the United States is a fascinating patchwork of
        Federal law, regulation, and case law from the Board of Immigration
        Appeals, Federal Circuit Courts, the Supreme Court, and the secret
        off-the-menu item of Attorney General-authored decisions. Try to keep
        up.
      </p>

      <p>
        This is not legal advice. This is a wildly incomplete, evolving
        knowledge base of case law and relevant statutes that may, or may not,
        come up frequently in immigration proceedings and processes.
      </p>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by case name, citation, topic, body, summary..."
      />

      <div className="authority-grid">
        {filteredAuthority.map((item) => (
          <Link
            key={item.id}
            to={`/legal-authority/${item.id}`}
            className="authority-card authority-card--compact"
          >
            <div className="authority-card__header">
              <span>{item.body}</span>
              <span>{item.year ?? "Statute"}</span>
            </div>

            <h2>{item.name}</h2>

            <p className="authority-card__citation">{item.citation}</p>

            <p className="authority-card__status">{item.status}</p>

            <div className="authority-card__topics">
              {(item.topics || []).map((topic) => (
                <span key={topic} className="authority-topic">
                  {topic}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

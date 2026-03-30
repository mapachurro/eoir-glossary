import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import glossary from "../data/glossary.json";
import TermList from "../components/TermList";
import SearchBar from "../components/SearchBar";

function matchesSearch(term, query) {
  const haystack = [
    term.english,
    term.englishDefinition,
    term.spanish,
    term.spanishDefinition,
    term.comments,
    term.proposals,
    ...(term.category || []),
    ...(term.tags || []),
    ...(term.aliases || []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function AllTermsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const nextQuery = searchParams.get("q") || "";
    setQuery(nextQuery);
  }, [searchParams]);

  const filteredTerms = useMemo(() => {
    if (!query.trim()) {
      return glossary;
    }

    return glossary.filter((term) => matchesSearch(term, query));
  }, [query]);

  function handleQueryChange(nextValue) {
    setQuery(nextValue);

    if (nextValue.trim()) {
      setSearchParams({ q: nextValue });
    } else {
      setSearchParams({});
    }
  }

  return (
    <section className="page">
      <h1>All Terms</h1>
      <p>{filteredTerms.length} terms shown.</p>

      <SearchBar
        value={query}
        onChange={handleQueryChange}
        placeholder="Search English, Spanish, comments, tags, aliases..."
      />

      {filteredTerms.length === 0 ? (
        <div className="empty-state">
          <h2>No matching terms found</h2>
          <p>
            Try a broader word, a different spelling, or search in English or
            Spanish.
          </p>
        </div>
      ) : (
        <TermList terms={filteredTerms} />
      )}
    </section>
  );
}

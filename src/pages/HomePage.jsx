import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import categories from "../data/categories.json";
import tags from "../data/tags.json";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const topCategories = categories.slice(0, 12);
  const topTags = tags.slice(0, 12);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) {
      navigate("/terms");
      return;
    }

    navigate(`/terms?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="page">
      <h1>EOIR Glossary</h1>
      <p className="page-intro">
        A bilingual English-Spanish glossary for immigration court terminology.
      </p>

      <form className="home-search" onSubmit={handleSearchSubmit}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search English, Spanish, comments, tags, aliases..."
        />
        <button type="submit" className="button-link">
          Search glossary
        </button>
      </form>

      <div className="home-actions">
        <Link className="button-link" to="/terms">
          Browse all terms
        </Link>
        <Link className="button-link button-link--secondary" to="/submissions">
          Submit a revision or new term
        </Link>
      </div>

      <section className="about-card">
        <h2>About this project</h2>
        <p>
          This glossary is an independent reference project intended to help
          readers navigate English and Spanish terminology used in immigration
          court and related legal contexts.
        </p>
        <p>
          It is <strong>not</strong> an official website, publication, or service
          of the Executive Office for Immigration Review (EOIR), the U.S.
          Department of Justice (DOJ), or any other government agency.
        </p>
        <p>
          This project is provided for reference, education, and terminology
          support only. It is not legal advice, and it should not be used as a
          substitute for official guidance, governing law, court rules, or advice
          from a qualified attorney or accredited representative.
        </p>
        <p>
          Terminology, usage, and translation choices may vary by jurisdiction,
          speaker, interpreter, attorney, judge, agency, and context. Where
          possible, users should compare entries against primary legal materials
          and other authoritative sources.
        </p>
        <p>
          For background on the materials consulted in building this glossary, see{" "}
          <Link to="/sources">Bibliography &amp; Sources</Link>.
        </p>
      </section>

      <div className="browse-grid">
        <section className="browse-card">
          <h2>Browse by category</h2>
          <ul className="link-list">
            {topCategories.map((category) => (
              <li key={category.slug}>
                <Link to={`/category/${category.slug}`}>
                  {category.label} ({category.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="browse-card">
          <h2>Browse by tag</h2>
          <ul className="link-list">
            {topTags.map((tag) => (
              <li key={tag.slug}>
                <Link to={`/tag/${tag.slug}`}>
                  {tag.label} ({tag.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
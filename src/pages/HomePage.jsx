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
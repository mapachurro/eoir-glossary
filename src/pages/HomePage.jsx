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
      <h1>Immigration Glossary - Glosario de lo migratorio</h1>
      <p className="page-intro">
        A living English-Spanish bilingual glossary of immigration and migration
        terminology.
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
          This is an interactive platform to consult and maintain a living
          glossary of immigration and migration terms.
        </p>
        <p>
          The present glossary{" "}
          <strong>
            is not an official production of any branch, entity, or agency of
            any government.
          </strong>
          While it strives to be as accurate, up-to-date, and nuanced as
          possible, you should make your own decision on its trustworthiness.
          The author(s) offer no guarantees; we only hope it helps you.
        </p>
        <p>
          This project is intended to be used by anyone seeking to understand
          the similarities, differences, alignments and lacunae of immigration
          law, procedure, proceedings, contexts and experiences between the
          United States and other places. In particular,{" "}
          <strong>
            it was designed and written with the professional linguist in mind:
            translators, interpreters, and terminologists
          </strong>
          , although legal scholars, attorneys, and others may find it useful as
          well.
        </p>
        <p>Its initial version is a bilingual Spanish-English glossary.</p>
        <p>
          <strong>
            This website is not and does not provide legal advice. It should not
            be used as a substitute for official guidance, case law
            consultation, court rules, or advice from a qualified attorney or
            accredited representative.{" "}
          </strong>
        </p>
        <h3>Where did this come from?</h3>
        <p>
          This work has its origins all the way back in the 1950s, when Berlitz
          was contracted by the US Federal Government to create a glossary for
          the first interpreters, translators, and professionals who began to
          deal with the institutionalization of the movement of people across
          the Mexico - US border, given the, at the time, newly-created
          frameworks of migration and asylum laws.
        </p>
        <p>
          That glossary, over the decades, was updated from time to time, often
          by people working with or for the Immigration Courts, wherever they
          happened to be housed within the structure of the Federal Government
          at the time. Currently, that entity is the Executive Office for
          Immigration Review, or <a href="https://www.justice.gov/eoir">EOIR</a>
          .
        </p>
        <p>
          The bulk of this glossary was drawn from the work of Staff Interpreter
          Oliver JL Renwick and his colleagues, who provided a comprehensively
          updated and expanded glossary for the EOIR in 2020. For full details
          on sources and a bibliography, see the{" "}
          <Link to="/sources">Bibliography &amp; Sources</Link> page.
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

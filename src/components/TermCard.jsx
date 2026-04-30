import { useState } from "react";
import { Link } from "react-router-dom";
import slugify from "../utils/slugify";
import { buildEditSuggestionUrl } from "../utils/githubIssueLinks";
import glossary from "../data/glossary.json";
import { findTermByLabel } from "../utils/termLookup";
import LinkedGlossaryText from "./LinkedGlossaryText";

export default function TermCard({ term, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const editUrl = buildEditSuggestionUrl(term);

  return (
    <article className="term-card">
      <div className="term-card__main">
        <div className="term-head">
          <div className="term-head__english">
            <span className="term-label">English: </span>
            <span className="term-value">
              <strong>{term.english || "—"}</strong>
            </span>
          </div>
          <br />
          <div className="term-head__spanish">
            <span className="term-label">Spanish: </span>
            <span className="term-value">
              <strong>{term.spanish || "—"}</strong>
            </span>
          </div>
        </div>
        <br />
        <hr />
        <p>
          <strong>Definition</strong> (English):{" "}
          <LinkedGlossaryText
            text={term.englishDefinition}
            excludeId={term.id}
          />
        </p>

        <p>
          <strong>Definition</strong> (Spanish):{" "}
          <LinkedGlossaryText
            text={term.spanishDefinition}
            excludeId={term.id}
          />
        </p>

        <p>
          <strong>Comments:</strong>{" "}
          <LinkedGlossaryText text={term.comments} excludeId={term.id} />
        </p>
      </div>

      <div className="term-card__actions">
        <button
          type="button"
          className="term-card__toggle"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Hide details" : "Show details"}
        </button>

        <a
          className="term-card__suggest-link"
          href={editUrl}
          target="_blank"
          rel="noreferrer"
        >
          Suggest edit
        </a>
      </div>

      {expanded && (
        <div className="term-card__details">
          <p>
            <strong>Category:</strong>{" "}
            {term.category.length ? (
              <span className="term-meta-list">
                {term.category.map((category, index) => (
                  <span key={category}>
                    <Link
                      className="term-meta-link"
                      to={`/category/${slugify(category)}`}
                    >
                      {category}
                    </Link>
                    {index < term.category.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            ) : (
              "—"
            )}
          </p>

          <p>
            <strong>Tags:</strong>{" "}
            {term.tags.length ? (
              <span className="term-meta-list">
                {term.tags.map((tag, index) => (
                  <span key={tag}>
                    <Link
                      className="term-meta-link"
                      to={`/tag/${slugify(tag)}`}
                    >
                      {tag}
                    </Link>
                    {index < term.tags.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            ) : (
              "—"
            )}
          </p>
          <p>
            <strong>Aliases:</strong>{" "}
            {term.aliases.length ? (
              <span className="term-meta-list">
                {term.aliases.map((alias, index) => {
                  const matchedTerm = findTermByLabel(glossary, alias);

                  return (
                    <span key={alias}>
                      {matchedTerm ? (
                        <Link
                          className="term-meta-link"
                          to={`/term/${matchedTerm.id}`}
                        >
                          {alias}
                        </Link>
                      ) : (
                        alias
                      )}
                      {index < term.aliases.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
              </span>
            ) : (
              "—"
            )}
          </p>
          <p>
            <strong>Contrasts with:</strong>{" "}
            {term.contrastsWith?.length ? (
              <span className="term-meta-list">
                {term.contrastsWith.map((item, index) => {
                  const matchedTerm = findTermByLabel(glossary, item);

                  return (
                    <span key={item}>
                      {matchedTerm ? (
                        <Link
                          className="term-meta-link"
                          to={`/term/${matchedTerm.id}`}
                        >
                          {item}
                        </Link>
                      ) : (
                        item
                      )}
                      {index < term.contrastsWith.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
              </span>
            ) : (
              "—"
            )}
          </p>
          <p>
            <strong>Status:</strong> {term.status}
          </p>
          <p>
            <strong>Last updated:</strong> {term.lastUpdated || "—"}
          </p>
          <p>
            <strong>Source:</strong> {term.source}
          </p>
          <p>
            <strong>Proposals:</strong> {term.proposals || "—"}
          </p>
        </div>
      )}
    </article>
  );
}

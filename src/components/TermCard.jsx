import { useState } from "react";

export default function TermCard({ term }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="term-card">
      <div className="term-card__main">
        <p><strong>English:</strong> {term.english || "—"}</p>
        <p><strong>Spanish:</strong> {term.spanish || "—"}</p>
        <p><strong>Comments:</strong> {term.comments || "—"}</p>
      </div>

      <button
        type="button"
        className="term-card__toggle"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "Hide details" : "Show details"}
      </button>

      {expanded && (
        <div className="term-card__details">
          <p><strong>English definition:</strong> {term.englishDefinition || "—"}</p>
          <p><strong>Spanish definition:</strong> {term.spanishDefinition || "—"}</p>
          <p><strong>Category:</strong> {term.category.length ? term.category.join(", ") : "—"}</p>
          <p><strong>Tags:</strong> {term.tags.length ? term.tags.join(", ") : "—"}</p>
          <p><strong>Aliases:</strong> {term.aliases.length ? term.aliases.join(", ") : "—"}</p>
          <p><strong>Status:</strong> {term.status}</p>
          <p><strong>Last updated:</strong> {term.lastUpdated || "—"}</p>
          <p><strong>Source:</strong> {term.source}</p>
          <p><strong>Proposals:</strong> {term.proposals || "—"}</p>
        </div>
      )}
    </article>
  );
}
import { Link, useParams } from "react-router-dom";
import authorities from "../data/authority.json";

export default function AuthorityDetail() {
  const { id } = useParams();

  const item = authorities.find((entry) => entry.id === id);

  if (!item) {
    return (
      <main className="container">
        <h1>Authority not found</h1>
        <p>No authority matches this identifier.</p>
        <Link to="/legal-authority">← Back to authorities</Link>
      </main>
    );
  }

  return (
    <main className="container authority-detail">
      <Link to="/legal-authority" className="authority-back">
        ← All authorities
      </Link>

      <article className="authority-card">
        <div className="authority-card__header">
          <span>{item.body}</span>
          {item.year && <span>{item.year}</span>}
        </div>

        <h1>{item.name}</h1>

        <p className="authority-card__citation">
          {item.citation}
        </p>

        {item.status && (
          <p><strong>Status:</strong> {item.status}</p>
        )}

        {item.summary?.length > 0 && (
          <section>
            <h2>Summary</h2>
            {item.summary.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        )}

        {item.holding?.length > 0 && (
          <section>
            <h2>Holding</h2>
            {item.holding.map((point, index) => (
              <p key={index}>{point}</p>
            ))}
          </section>
        )}

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

        {item.cites?.length > 0 && (
          <section>
            <h2>Cited authorities</h2>
            {item.cites.map((citation, index) => (
              <p key={index}>{citation}</p>
            ))}
          </section>
        )}

        {item.notes && (
          <section>
            <h2>Notes</h2>
            <p>{item.notes}</p>
          </section>
        )}

        {item.officialUrl?.startsWith("https://") && (
          <p>
            <a
              href={item.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Official source ↗
            </a>
          </p>
        )}
      </article>
    </main>
  );
}
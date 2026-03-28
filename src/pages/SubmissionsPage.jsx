const NEW_TERM_URL =
  "https://github.com/mapachurro/eoir-glossary/issues/new";
const REVISION_URL =
  "https://github.com/mapachurro/eoir-glossary/issues/new";

export default function SubmissionsPage() {
  return (
    <section className="page">
      <h1>Submissions and Revisions</h1>
      <p className="page-intro">
        Use the options below to suggest a revision or submit a new term.
      </p>

      <div className="browse-grid">
        <article className="browse-card">
          <h2>Submit a revision</h2>
          <p>
            Suggest a change to an existing term, translation, definition, or note.
          </p>
          <a
            className="button-link"
            href={REVISION_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open revision issue
          </a>
        </article>

        <article className="browse-card">
          <h2>Submit a new term</h2>
          <p>
            Propose a new glossary entry with as many fields filled in as possible.
          </p>
          <a
            className="button-link"
            href={NEW_TERM_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open new-term issue
          </a>
        </article>
      </div>
    </section>
  );
}
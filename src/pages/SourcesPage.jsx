export default function SourcesPage() {
  return (
    <section className="page">
      <h1>Bibliography &amp; Sources</h1>
      <p className="page-intro">
        This page lists source materials consulted in compiling and maintaining
        the glossary. It is intended to provide transparency about the references
        used in the project.
      </p>

      <section className="source-section">
        <h2>Primary and institutional sources</h2>
        <ul className="source-list">
          <li>EOIR and related immigration-court terminology materials</li>
          <li>Department of Justice and immigration court publications</li>
          <li>USCIS materials where relevant to usage or terminology</li>
          <li>Other official or quasi-official legal reference materials</li>
        </ul>
      </section>

      <section className="source-section">
        <h2>Dictionaries, glossaries, and reference works</h2>
        <ul className="source-list">
          <li>Bilingual legal dictionaries and Spanish-English reference works</li>
          <li>Practice-oriented glossaries used by interpreters, advocates, or practitioners</li>
          <li>Other terminology references relevant to immigration law and court usage</li>
        </ul>
      </section>

      <section className="source-section">
        <h2>Notes on use</h2>
        <p>
          Inclusion on this page does not mean that every entry comes directly
          from one source or that all sources agree with one another. In some
          cases, entries reflect editorial judgment based on multiple references,
          usage in context, or the absence of a single exact equivalent.
        </p>
      </section>
    </section>
  );
}
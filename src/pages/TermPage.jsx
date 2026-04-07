import { useMemo } from "react";
import { useParams } from "react-router-dom";
import glossary from "../data/glossary.json";
import TermCard from "../components/TermCard";

export default function TermPage() {
  const { id } = useParams();

  const term = useMemo(
    () => glossary.find((entry) => entry.id === id),
    [id]
  );

  if (!term) {
    return (
      <section className="page">
        <h1>Term not found</h1>
        <p>The requested glossary entry could not be found.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>{term.english || term.spanish || "Glossary entry"}</h1>
      <TermCard term={term} defaultExpanded />
    </section>
  );
}
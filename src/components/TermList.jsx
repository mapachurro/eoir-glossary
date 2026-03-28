import TermCard from "./TermCard";

export default function TermList({ terms }) {
  return (
    <div className="term-list">
      {terms.map((term) => (
        <TermCard key={term.id} term={term} />
      ))}
    </div>
  );
}
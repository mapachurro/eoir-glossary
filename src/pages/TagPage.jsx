import { useMemo } from "react";
import { useParams } from "react-router-dom";
import glossary from "../data/glossary.json";
import tags from "../data/tags.json";
import TermList from "../components/TermList";
import slugify from "../utils/slugify";

export default function TagPage() {
  const { slug } = useParams();

  const tagMeta = tags.find((tag) => tag.slug === slug);

  const matchingTerms = useMemo(() => {
    return glossary.filter((term) =>
      term.tags.some((value) => slugify(value) === slug),
    );
  }, [slug]);

  return (
    <section className="page">
      <h1>Tag: {tagMeta?.label || slug}</h1>
      <p>{matchingTerms.length} terms shown.</p>
      <TermList terms={matchingTerms} />
    </section>
  );
}
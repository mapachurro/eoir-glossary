import { useMemo } from "react";
import { useParams } from "react-router-dom";
import glossary from "../data/glossary.json";
import categories from "../data/categories.json";
import TermList from "../components/TermList";
import slugify from "../utils/slugify";

export default function CategoryPage() {
  const { slug } = useParams();

  const categoryMeta = categories.find((category) => category.slug === slug);

  const matchingTerms = useMemo(() => {
    return glossary.filter((term) =>
      term.category.some((value) => slugify(value) === slug),
    );
  }, [slug]);

  return (
    <section className="page">
      <h1>Category: {categoryMeta?.label || slug}</h1>
      <p>{matchingTerms.length} terms shown.</p>
      <TermList terms={matchingTerms} />
    </section>
  );
}

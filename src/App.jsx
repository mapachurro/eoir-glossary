import glossary from "./data/glossary.json";
import TermList from "./components/TermList";

export default function App() {
  return (
    <main className="app-shell">
      <h1>EOIR Glossary</h1>
      <p>{glossary.length} terms loaded.</p>
      <TermList terms={glossary} />
    </main>
  );
}
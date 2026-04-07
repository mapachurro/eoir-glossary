import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AllTermsPage from "./pages/AllTermsPage";
import CategoryPage from "./pages/CategoryPage";
import TagPage from "./pages/TagPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import SourcesPage from "./pages/SourcesPage";
import TermPage from "./pages/TermPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="terms" element={<AllTermsPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="tag/:slug" element={<TagPage />} />
        <Route path="sources" element={<SourcesPage />} />
        <Route path="submissions" element={<SubmissionsPage />} />
        <Route path="term/:id" element={<TermPage />} />
      </Route>
    </Routes>
  );
}
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AllTermsPage from "./pages/AllTermsPage";
import CategoryPage from "./pages/CategoryPage";
import TagPage from "./pages/TagPage";
import SubmissionsPage from "./pages/SubmissionsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="terms" element={<AllTermsPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="tag/:slug" element={<TagPage />} />
        <Route path="submissions" element={<SubmissionsPage />} />
      </Route>
    </Routes>
  );
}
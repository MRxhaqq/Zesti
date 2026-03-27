import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useZesti } from "../context/ZestiContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RecipeGrid from "../components/RecipeGrid";
import RecipeModal from "../components/RecipeModal";
import BookmarkDrawer from "../components/BookmarkDrawer";
import Footer from "../components/Footer";

function Home() {
  const { setBookmarkDrawerOpen } = useZesti();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setTimeout(() => {
        document
          .querySelector("#recipes")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <Navbar onBookmarkClick={() => setBookmarkDrawerOpen(true)} />

      <Hero onSearch={handleSearch} searchQuery={searchQuery} />

      <RecipeGrid
        searchQuery={searchQuery}
        onRecipeClick={setSelectedRecipe}
        onSearchReset={() => setSearchQuery("")}
      />

      <Footer />

      {/* Recipe modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </AnimatePresence>

      {/* Bookmark drawer */}
      <BookmarkDrawer onRecipeClick={setSelectedRecipe} />
    </div>
  );
}

export default Home;

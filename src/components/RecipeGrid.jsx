import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCard from "./RecipeCard";
import LoadingGrid from "./LoadingGrid";
import EmptyState from "./EmptyState";
import FilterChips from "./FilterChips";

// Minimum time to show skeleton — prevents flash of loading state
const MIN_LOADING_MS = 400;

function RecipeGrid({ searchQuery, onRecipeClick, onSearchReset }) {
  const [category, setCategory] = useState("All");
  const [showSkeleton, setShowSkeleton] = useState(true);
  const loadStartRef = useRef(Date.now());

  const { recipes, loading, error } = useRecipes(searchQuery, category);

  // Enforce minimum 400ms loading display
  useEffect(() => {
    if (loading) {
      loadStartRef.current = Date.now();
      setShowSkeleton(true);
    } else {
      const elapsed = Date.now() - loadStartRef.current;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
      const timer = setTimeout(() => setShowSkeleton(false), remaining);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setShowSkeleton(true);
  };

  const handleReset = () => {
    setCategory("All");
    onSearchReset();
  };

  return (
    <section
      id="recipes"
      style={{
        padding: "80px 24px 120px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "32px" }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 900,
            color: "var(--text-primary)",
            margin: "0 0 8px",
            letterSpacing: "-0.5px",
          }}
        >
          {searchQuery
            ? `Results for "${searchQuery}"`
            : category !== "All"
              ? `${category} recipes`
              : "All recipes"}
        </h2>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          {showSkeleton
            ? "Finding the best recipes..."
            : `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} found`}
        </p>
      </motion.div>

      {/* Filter chips */}
      <div style={{ marginBottom: "40px" }}>
        <FilterChips selected={category} onSelect={handleCategorySelect} />
      </div>

      {/* Error state */}
      {error && !showSkeleton && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "24px",
            borderRadius: "16px",
            background: "rgba(232,93,38,0.06)",
            border: "1px solid rgba(232,93,38,0.2)",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              color: "#e85d26",
              margin: 0,
            }}
          >
            {error} —{" "}
            <button
              onClick={handleReset}
              style={{
                background: "none",
                border: "none",
                color: "#e85d26",
                fontWeight: 700,
                textDecoration: "underline",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
              }}
            >
              try again
            </button>
          </p>
        </motion.div>
      )}

      {/* Content area */}
      <AnimatePresence mode="wait">
        {/* Loading skeleton */}
        {showSkeleton && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingGrid />
          </motion.div>
        )}

        {/* Empty state */}
        {!showSkeleton && recipes.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState query={searchQuery} onReset={handleReset} />
          </motion.div>
        )}

        {/* Recipe grid */}
        {!showSkeleton && recipes.length > 0 && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                index={index}
                onClick={onRecipeClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default RecipeGrid;

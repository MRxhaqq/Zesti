import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fetchCategories } from "../hooks/useRecipes";

// Production fallback — TheMealDB's 12 most common categories
// Used when the live fetch fails or times out
const FALLBACK_CATEGORIES = [
  { strCategory: "All" },
  { strCategory: "Chicken" },
  { strCategory: "Beef" },
  { strCategory: "Seafood" },
  { strCategory: "Vegetarian" },
  { strCategory: "Pasta" },
  { strCategory: "Dessert" },
  { strCategory: "Breakfast" },
  { strCategory: "Lamb" },
  { strCategory: "Pork" },
  { strCategory: "Side" },
  { strCategory: "Starter" },
  { strCategory: "Vegan" },
];

// Category emoji map — makes the chips more visual
const CATEGORY_EMOJI = {
  All: "✨",
  Chicken: "🍗",
  Beef: "🥩",
  Seafood: "🦐",
  Vegetarian: "🥦",
  Pasta: "🍝",
  Dessert: "🍰",
  Breakfast: "🥞",
  Lamb: "🍖",
  Pork: "🥓",
  Side: "🥗",
  Starter: "🥙",
  Vegan: "🌱",
  Goat: "🐐",
  Miscellaneous: "🍽️",
};

function FilterChips({ selected, onSelect }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // 3 second timeout — if API takes longer fall back silently
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 3000),
        );

        const result = await Promise.race([fetchCategories(), timeout]);

        if (!cancelled && result.length > 0) {
          // Prepend "All" to the live list
          setCategories([{ strCategory: "All" }, ...result.slice(0, 12)]);
        }
      } catch {
        // Silently fall back to hardcoded list — user never knows
        if (!cancelled) setCategories(FALLBACK_CATEGORIES);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Browse by
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "var(--border)",
          }}
        />
      </motion.div>

      {/* Chips row */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((cat, i) => {
          const name = cat.strCategory;
          const isActive = selected === name;
          const emoji = CATEGORY_EMOJI[name] || "🍽️";

          return (
            <motion.button
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(name)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "999px",
                background: isActive ? "#e85d26" : "var(--bg-card)",
                border: isActive
                  ? "1px solid #e85d26"
                  : "1px solid var(--border)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#ffffff" : "var(--text-secondary)",
                boxShadow: isActive
                  ? "0 4px 12px rgba(232,93,38,0.3)"
                  : "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: "14px" }}>{emoji}</span>
              {name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterChips;

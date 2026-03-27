import { motion } from "motion/react";
import { Search, RefreshCw } from "lucide-react";

function EmptyState({ query, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <motion.div
        animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          fontSize: "64px",
          marginBottom: "24px",
          lineHeight: 1,
        }}
      >
        🍽️
      </motion.div>

      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "28px",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "12px",
        }}
      >
        No recipes found
      </h3>

      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "15px",
          color: "var(--text-muted)",
          lineHeight: 1.7,
          maxWidth: "380px",
          marginBottom: "32px",
        }}
      >
        {query
          ? `We couldn't find any recipes for "${query}". Try a different search term or browse by category.`
          : "No recipes in this category yet. Try a different one!"}
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReset}
        className="btn-ember"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <RefreshCw size={15} />
        Browse all recipes
      </motion.button>
    </motion.div>
  );
}

export default EmptyState;

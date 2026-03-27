import { motion } from "motion/react";

// Single skeleton card — dimensions MUST match RecipeCard exactly
// RecipeCard image: 220px tall
// RecipeCard body: ~160px
// Total card height: ~380px
function SkeletonCard({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        background: "var(--bg-card)",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Image placeholder — must match RecipeCard image height */}
      <div className="skeleton" style={{ height: "220px", width: "100%" }} />

      {/* Body placeholder */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Category + area line */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div
            className="skeleton"
            style={{ height: "22px", width: "70px", borderRadius: "999px" }}
          />
          <div
            className="skeleton"
            style={{ height: "22px", width: "55px", borderRadius: "999px" }}
          />
        </div>

        {/* Title */}
        <div className="skeleton" style={{ height: "22px", width: "85%" }} />
        <div className="skeleton" style={{ height: "22px", width: "60%" }} />

        {/* Meta row */}
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <div className="skeleton" style={{ height: "18px", width: "60px" }} />
          <div className="skeleton" style={{ height: "18px", width: "50px" }} />
          <div className="skeleton" style={{ height: "18px", width: "55px" }} />
        </div>

        {/* Button */}
        <div
          className="skeleton"
          style={{
            height: "44px",
            width: "100%",
            borderRadius: "12px",
            marginTop: "4px",
          }}
        />
      </div>
    </motion.div>
  );
}

function LoadingGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </div>
  );
}

export default LoadingGrid;

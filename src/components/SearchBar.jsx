import { useState } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search recipes, ingredients...",
}) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0 0 0 3px rgba(232,93,38,0.2), 0 8px 32px rgba(0,0,0,0.12)"
          : "0 4px 16px rgba(0,0,0,0.08)",
      }}
      transition={{ duration: 0.2 }}
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "16px",
        background: "var(--bg-card)",
        border: focused ? "1.5px solid #e85d26" : "1.5px solid var(--border)",
        transition: "border-color 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* Search icon */}
      <div
        style={{
          position: "absolute",
          left: "18px",
          top: "50%",
          transform: "translateY(-50%)",
          color: focused ? "#e85d26" : "var(--text-muted)",
          transition: "color 0.2s ease",
          pointerEvents: "none",
        }}
      >
        <Search size={20} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "18px 52px 18px 52px",
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "16px",
          fontWeight: 500,
          color: "var(--text-primary)",
          boxSizing: "border-box",
        }}
      />

      {/* Clear button */}
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => onChange("")}
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <X size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}

export default SearchBar;

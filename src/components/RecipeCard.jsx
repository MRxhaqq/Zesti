import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Star,
} from "lucide-react";
import { useZesti } from "../context/ZestiContext";
import {
  extractIngredients,
  getDifficulty,
  getAreaFlag,
  truncate,
} from "../lib/utils";

function RecipeCard({ recipe, index, onClick }) {
  const { toggleBookmark, isBookmarked } = useZesti();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const bookmarked = isBookmarked(recipe.idMeal);
  const ingredients = extractIngredients(recipe);
  const difficulty = getDifficulty(ingredients.length || 8);
  const flag = getAreaFlag(recipe.strArea);

  // Consistent pseudo-random rating based on recipe ID
  const rating = recipe.idMeal
    ? (((parseInt(recipe.idMeal) % 20) + 80) / 20).toFixed(1)
    : "4.5";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: (index % 8) * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: hovered ? "var(--shadow-xl)" : "var(--shadow-sm)",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        borderColor: hovered ? "rgba(232,93,38,0.2)" : "var(--border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image container — fixed height 220px matches skeleton exactly */}
      <div
        style={{
          position: "relative",
          height: "220px",
          overflow: "hidden",
          background: "var(--bg-elevated)",
          flexShrink: 0,
        }}
      >
        {/* Skeleton while image loads */}
        {!imgLoaded && !imgError && (
          <div
            className="skeleton"
            style={{
              position: "absolute",
              inset: 0,
            }}
          />
        )}

        {/* Actual image */}
        {!imgError && recipe.strMealThumb && (
          <motion.img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        {/* Fallback if image fails */}
        {imgError && (
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, var(--bg-cream), var(--bg-elevated))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            🍽️
          </div>
        )}

        {/* Gradient overlay at bottom of image */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.4))",
            pointerEvents: "none",
          }}
        />

        {/* Rating badge — top left */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            borderRadius: "999px",
            padding: "4px 10px",
          }}
        >
          <Star size={11} fill="#f4a261" color="#f4a261" />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {rating}
          </span>
        </div>

        {/* Bookmark button — top right */}
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(recipe);
          }}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: bookmarked ? "#e85d26" : "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            transition: "background 0.2s ease",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={bookmarked ? "saved" : "unsaved"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {bookmarked ? (
                <BookmarkCheck size={15} />
              ) : (
                <Bookmark size={15} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Area flag — bottom left of image */}
        {recipe.strArea && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "12px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "14px" }}>{flag}</span>
            {recipe.strArea}
          </div>
        )}
      </div>

      {/* Card body */}
      <div
        style={{
          padding: "18px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 1,
        }}
      >
        {/* Category + difficulty badges */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {recipe.strCategory && (
            <span
              style={{
                padding: "3px 10px",
                borderRadius: "999px",
                background: "var(--ember-light)",
                border: "1px solid rgba(232,93,38,0.2)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                color: "#e85d26",
              }}
            >
              {recipe.strCategory}
            </span>
          )}
          <span
            style={{
              padding: "3px 10px",
              borderRadius: "999px",
              background: `${difficulty.color}15`,
              border: `1px solid ${difficulty.color}30`,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: difficulty.color,
            }}
          >
            {difficulty.label}
          </span>
        </div>

        {/* Recipe title */}
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.3,
            margin: 0,
            flex: 1,
          }}
        >
          {truncate(recipe.strMeal, 50)}
        </h3>

        {/* Ingredient count */}
        {ingredients.length > 0 && (
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "12px",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {ingredients.length} ingredients
          </div>
        )}

        {/* View recipe button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onClick(recipe)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px",
            borderRadius: "12px",
            background: hovered ? "#e85d26" : "var(--bg-elevated)",
            border: hovered ? "1px solid #e85d26" : "1px solid var(--border)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 700,
            color: hovered ? "#ffffff" : "var(--text-secondary)",
            transition: "all 0.25s ease",
            boxShadow: hovered ? "0 4px 12px rgba(232,93,38,0.3)" : "none",
          }}
        >
          View recipe
          <ChevronRight size={15} />
        </motion.button>
      </div>
    </motion.article>
  );
}

export default RecipeCard;

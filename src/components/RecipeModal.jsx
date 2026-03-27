import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ChefHat,
  Clock,
  Users,
  Star,
  UtensilsCrossed,
  ScrollText,
  Info,
  Video,
} from "lucide-react";

import { useZesti } from "../context/ZestiContext";
import { fetchRecipeById } from "../hooks/useRecipes";
import {
  extractIngredients,
  getDifficulty,
  getAreaFlag,
  truncate,
} from "../lib/utils";

const TABS = [
  { id: "ingredients", label: "Ingredients", icon: UtensilsCrossed },
  { id: "instructions", label: "Instructions", icon: ScrollText },
  { id: "details", label: "Details", icon: Info },
];

function RecipeModal({ recipe: initialRecipe, onClose }) {
  const { toggleBookmark, isBookmarked } = useZesti();

  const [recipe, setRecipe] = useState(initialRecipe);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [servings, setServings] = useState(4);

  const bookmarked = isBookmarked(recipe?.idMeal);
  const ingredients = extractIngredients(recipe);
  const difficulty = getDifficulty(ingredients.length || 8);
  const flag = getAreaFlag(recipe?.strArea);

  const rating = recipe?.idMeal
    ? (((parseInt(recipe.idMeal) % 20) + 80) / 20).toFixed(1)
    : "4.5";

  // If recipe came from filter endpoint it has minimal data
  // Fetch the full recipe by ID to get ingredients + instructions
  useEffect(() => {
    const needsFullData = !initialRecipe?.strInstructions;

    if (needsFullData && initialRecipe?.idMeal) {
      setLoading(true);
      fetchRecipeById(initialRecipe.idMeal)
        .then((full) => {
          if (full) setRecipe(full);
        })
        .finally(() => setLoading(false));
    }
  }, [initialRecipe]);

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Parse instructions into numbered steps
  const steps = recipe?.strInstructions
    ? recipe.strInstructions
        .split(/\r\n|\n|\r/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20)
    : [];

  // Scale ingredient measures by servings
  // Base servings assumed to be 4
  const scaleAmount = (measure) => {
    if (!measure) return "";
    const base = servings / 4;
    // Try to find a number in the measure and scale it
    const scaled = measure.replace(/[\d.\/]+/g, (num) => {
      try {
        // Handle fractions like "1/2"
        if (num.includes("/")) {
          const [a, b] = num.split("/");
          return ((parseFloat(a) / parseFloat(b)) * base)
            .toFixed(1)
            .replace(/\.0$/, "");
        }
        const result = parseFloat(num) * base;
        return result % 1 === 0 ? result.toString() : result.toFixed(1);
      } catch {
        return num;
      }
    });
    return scaled;
  };

  if (!recipe) return null;

  return (
    // Overlay
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0",
      }}
    >
      {/* Modal panel */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "720px",
          maxHeight: "92vh",
          background: "var(--bg-card)",
          borderRadius: "28px 28px 0 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Hero image */}
        <div
          style={{
            position: "relative",
            height: "260px",
            flexShrink: 0,
            overflow: "hidden",
            background: "var(--bg-elevated)",
          }}
        >
          {recipe.strMealThumb && (
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(transparent 30%, rgba(0,0,0,0.75))",
            }}
          />

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            <X size={16} />
          </motion.button>

          {/* Bookmark button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleBookmark(recipe)}
            style={{
              position: "absolute",
              top: "16px",
              right: "60px",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: bookmarked ? "#e85d26" : "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              border: bookmarked
                ? "1px solid #e85d26"
                : "1px solid rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              transition: "background 0.2s ease",
            }}
          >
            {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </motion.button>

          {/* Title + meta on image */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              right: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "8px",
                flexWrap: "wrap",
              }}
            >
              {recipe.strCategory && (
                <span
                  style={{
                    background: "#e85d26",
                    color: "#fff",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "999px",
                  }}
                >
                  {recipe.strCategory}
                </span>
              )}
              <span
                style={{
                  background: `${difficulty.color}`,
                  color: "#fff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "999px",
                }}
              >
                {difficulty.label}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(20px, 4vw, 28px)",
                fontWeight: 900,
                color: "#ffffff",
                margin: "0 0 8px",
                lineHeight: 1.2,
              }}
            >
              {recipe.strMeal}
            </h2>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: Star, value: rating, color: "#f4a261" },
                {
                  icon: ChefHat,
                  value: `${ingredients.length} ingredients`,
                  color: "#fff",
                },
                recipe.strArea && {
                  icon: () => <span style={{ fontSize: "14px" }}>{flag}</span>,
                  value: recipe.strArea,
                  color: "#fff",
                },
              ]
                .filter(Boolean)
                .map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Icon
                        size={13}
                        color={item.color}
                        fill={item.color === "#f4a261" ? "#f4a261" : "none"}
                      />
                      <span
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "16px 20px 0",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 16px",
                  borderRadius: "10px 10px 0 0",
                  background: isActive ? "var(--bg-page)" : "transparent",
                  border: isActive
                    ? "1px solid var(--border)"
                    : "1px solid transparent",
                  borderBottom: isActive
                    ? "1px solid var(--bg-page)"
                    : "1px solid transparent",
                  marginBottom: isActive ? "-1px" : "0",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#e85d26" : "var(--text-muted)",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content — scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 20px",
          }}
        >
          {/* Loading state for full recipe fetch */}
          {loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: "20px", width: `${70 + (i % 3) * 10}%` }}
                />
              ))}
            </div>
          )}

          {/* Ingredients tab */}
          {!loading && activeTab === "ingredients" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Servings scaler */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                  padding: "16px",
                  background: "var(--bg-elevated)",
                  borderRadius: "14px",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Users size={16} color="#e85d26" />
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    Servings
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                    }}
                  >
                    −
                  </motion.button>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#e85d26",
                      minWidth: "28px",
                      textAlign: "center",
                    }}
                  >
                    {servings}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setServings((s) => Math.min(20, s + 1))}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#e85d26",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Ingredients list */}
              {ingredients.length === 0 ? (
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  Ingredients not available for this recipe.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {ingredients.map((ing, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        background: "var(--bg-elevated)",
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#e85d26",
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            textTransform: "capitalize",
                          }}
                        >
                          {ing.name}
                        </div>
                        {ing.measure && (
                          <div
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: "11px",
                              color: "#e85d26",
                              fontWeight: 500,
                            }}
                          >
                            {scaleAmount(ing.measure)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Instructions tab */}
          {!loading && activeTab === "instructions" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {steps.length === 0 ? (
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  Instructions not available. Watch the video below!
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Step number */}
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background:
                            i === 0 ? "#e85d26" : "var(--bg-elevated)",
                          border: i === 0 ? "none" : "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: i === 0 ? "#fff" : "var(--text-muted)",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>

                      {/* Step text */}
                      <p
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.75,
                          margin: "4px 0 0",
                        }}
                      >
                        {step}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* YouTube link */}
              {recipe.strYoutube && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    window.open(
                      recipe.strYoutube,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "24px",
                    padding: "14px",
                    borderRadius: "14px",
                    background: "rgba(255,0,0,0.08)",
                    border: "1px solid rgba(255,0,0,0.2)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#ff4444",
                  }}
                >
                  <Video size={18} />
                  Watch on YouTube
                  <ExternalLink size={13} />
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Details tab */}
          {!loading && activeTab === "details" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {[
                { label: "Recipe name", value: recipe.strMeal },
                { label: "Category", value: recipe.strCategory },
                {
                  label: "Cuisine",
                  value: recipe.strArea ? `${flag} ${recipe.strArea}` : null,
                },
                { label: "Difficulty", value: difficulty.label },
                { label: "Ingredients", value: `${ingredients.length} items` },
                { label: "Rating", value: `⭐ ${rating} / 5.0` },
              ]
                .filter((item) => item.value)
                .map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 16px",
                      background: "var(--bg-elevated)",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--text-muted)",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.value}
                    </span>
                  </motion.div>
                ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default RecipeModal;

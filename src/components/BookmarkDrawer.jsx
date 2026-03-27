import { motion, AnimatePresence } from "motion/react";
import { X, Bookmark, Trash2, ChefHat } from "lucide-react";
import { useZesti } from "../context/ZestiContext";
import { truncate } from "../lib/utils";

function BookmarkDrawer({ onRecipeClick }) {
  const {
    bookmarks,
    toggleBookmark,
    bookmarkDrawerOpen,
    setBookmarkDrawerOpen,
  } = useZesti();

  return (
    <AnimatePresence>
      {bookmarkDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setBookmarkDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 150,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "400px",
              zIndex: 151,
              background: "var(--bg-card)",
              borderLeft: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px 20px 20px",
                borderBottom: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "var(--ember-light)",
                    border: "1px solid rgba(232,93,38,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e85d26",
                  }}
                >
                  <Bookmark size={16} />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    Saved recipes
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    {bookmarks.length} recipe{bookmarks.length !== 1 ? "s" : ""}{" "}
                    saved
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setBookmarkDrawerOpen(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px 20px",
              }}
            >
              {bookmarks.length === 0 ? (
                // Empty state
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    textAlign: "center",
                    padding: "40px 20px",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    🔖
                  </div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: "8px",
                    }}
                  >
                    No saved recipes yet
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      marginBottom: "24px",
                    }}
                  >
                    Tap the bookmark icon on any recipe card to save it here for
                    later.
                  </p>
                  <button
                    onClick={() => setBookmarkDrawerOpen(false)}
                    className="btn-ember"
                    style={{ fontSize: "13px", padding: "10px 20px" }}
                  >
                    Browse recipes
                  </button>
                </motion.div>
              ) : (
                // Bookmark list
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <AnimatePresence>
                    {bookmarks.map((recipe, i) => (
                      <motion.div
                        key={recipe.idMeal}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        style={{
                          display: "flex",
                          gap: "12px",
                          padding: "12px",
                          background: "var(--bg-elevated)",
                          borderRadius: "14px",
                          border: "1px solid var(--border)",
                          alignItems: "center",
                        }}
                      >
                        {/* Thumbnail */}
                        <div
                          onClick={() => {
                            setBookmarkDrawerOpen(false);
                            onRecipeClick(recipe);
                          }}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            flexShrink: 0,
                            background: "var(--bg-card)",
                          }}
                        >
                          {recipe.strMealThumb ? (
                            <img
                              src={recipe.strMealThumb}
                              alt={recipe.strMeal}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                              }}
                            >
                              🍽️
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div
                          style={{ flex: 1, minWidth: 0 }}
                          onClick={() => {
                            setBookmarkDrawerOpen(false);
                            onRecipeClick(recipe);
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              marginBottom: "4px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {recipe.strMeal}
                          </div>
                          {recipe.strCategory && (
                            <div
                              style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: "11px",
                                color: "#e85d26",
                                fontWeight: 600,
                              }}
                            >
                              {recipe.strCategory}
                            </div>
                          )}
                        </div>

                        {/* Remove button */}
                        <motion.button
                          whileHover={{ scale: 1.1, color: "#e85d26" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleBookmark(recipe)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-muted)",
                            flexShrink: 0,
                            transition: "color 0.15s ease",
                          }}
                        >
                          <Trash2 size={13} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BookmarkDrawer;

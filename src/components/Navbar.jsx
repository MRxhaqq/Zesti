import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bookmark, Menu, X, ChefHat, Calendar } from "lucide-react";
import { useZesti } from "../context/ZestiContext";

function Navbar({ onBookmarkClick }) {
  const { isDark, toggleTheme, bookmarks } = useZesti();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled
            ? isDark
              ? "rgba(15,15,15,0.92)"
              : "rgba(250,250,248,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--border)"
            : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: 0,
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                background: "#e85d26",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(232,93,38,0.35)",
              }}
            >
              <ChefHat size={18} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: 900,
                color: "var(--text-primary)",
                letterSpacing: "-0.3px",
              }}
            >
              Zesti<span style={{ color: "#e85d26" }}>.</span>
            </span>
          </motion.button>

          {/* Desktop controls */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Meal planner — uses navigate */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/planner")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                <Calendar size={15} />
                Meal planner
              </motion.button>

              {/* Bookmark button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBookmarkClick}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                <Bookmark size={15} />
                Saved
                {bookmarks.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "#e85d26",
                      color: "#fff",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {bookmarks.length}
                  </motion.span>
                )}
              </motion.button>

              {/* Theme toggle */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleTheme}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>

              {/* CTA */}
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 8px 24px rgba(232,93,38,0.35)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  document
                    .querySelector("#search")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-ember"
              >
                Explore recipes
              </motion.button>
            </div>
          )}

          {/* Mobile controls */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onBookmarkClick}
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                }}
              >
                <Bookmark size={16} />
                {bookmarks.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "#e85d26",
                      color: "#fff",
                      fontSize: "9px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {bookmarks.length}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={toggleTheme}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                }}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.button>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "68px",
              left: 0,
              right: 0,
              zIndex: 99,
              background: isDark
                ? "rgba(15,15,15,0.97)"
                : "rgba(250,250,248,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid var(--border)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/planner");
              }}
              className="btn-ghost"
              style={{ width: "100%", textAlign: "center" }}
            >
              Meal planner
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                document
                  .querySelector("#search")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-ember"
              style={{ width: "100%", textAlign: "center" }}
            >
              Explore recipes
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

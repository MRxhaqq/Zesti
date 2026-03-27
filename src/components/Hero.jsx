import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Clock, ChefHat, Globe } from "lucide-react";
import SearchBar from "./SearchBar";

const STATS = [
  { icon: ChefHat, value: "300+", label: "Recipes" },
  { icon: Globe, value: "25+", label: "Cuisines" },
  { icon: Clock, value: "15min", label: "Avg time" },
];

const SUGGESTIONS = [
  "Chicken",
  "Pasta",
  "Salmon",
  "Tacos",
  "Salad",
  "Soup",
  "Steak",
  "Sushi",
];

function Hero({ onSearch, searchQuery }) {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "var(--bg-page)",
        paddingTop: "68px",
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,93,38,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45,106,79,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Floating food emojis — decorative */}
      {[
        { emoji: "🍝", top: "15%", left: "8%", delay: 0.2, size: "32px" },
        { emoji: "🥗", top: "20%", right: "6%", delay: 0.4, size: "28px" },
        { emoji: "🍜", top: "65%", left: "5%", delay: 0.6, size: "30px" },
        { emoji: "🥘", top: "70%", right: "8%", delay: 0.3, size: "26px" },
        { emoji: "🍣", top: "40%", left: "3%", delay: 0.5, size: "24px" },
        { emoji: "🍖", top: "45%", right: "4%", delay: 0.7, size: "28px" },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0, 0.6, 0.6],
            y: [20, 0, -8, 0],
          }}
          transition={{
            delay: item.delay,
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: item.top,
            left: item.left,
            right: item.right,
            fontSize: item.size,
            pointerEvents: "none",
            filter: "grayscale(20%)",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Main content */}
      <div
        style={{
          maxWidth: "780px",
          width: "100%",
          padding: "60px 24px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--bg-cream)",
            border: "1px solid rgba(232,93,38,0.2)",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "28px",
          }}
        >
          <Sparkles size={13} color="#e85d26" />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "#e85d26",
              letterSpacing: "0.05em",
            }}
          >
            300+ recipes from 25 cuisines
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(42px, 8vw, 80px)",
            fontWeight: 900,
            color: "var(--text-primary)",
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
            margin: "0 0 16px",
          }}
        >
          Discover recipes
          <br />
          <span
            style={{
              color: "#e85d26",
              fontStyle: "italic",
            }}
          >
            you'll love.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(15px, 2vw, 18px)",
            fontWeight: 400,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "40px",
            maxWidth: "520px",
            margin: "0 auto 40px",
          }}
        >
          Search thousands of recipes by name or ingredient. Plan your week.
          Cook with confidence.
        </motion.p>

        {/* Search bar */}
        <motion.div
          id="search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          style={{ marginBottom: "20px" }}
        >
          <SearchBar
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search recipes or ingredients..."
          />
        </motion.div>

        {/* Quick suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
            marginBottom: "56px",
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-muted)",
              padding: "6px 0",
            }}
          >
            Try:
          </span>
          {SUGGESTIONS.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.04 }}
              whileHover={{ scale: 1.06, background: "var(--bg-cream)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSearch(s)}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                transition: "all 0.15s ease",
              }}
            >
              {s}
            </motion.button>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            flexWrap: "wrap",
          }}
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.1 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "var(--bg-cream)",
                    border: "1px solid rgba(232,93,38,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e85d26",
                    marginBottom: "4px",
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;

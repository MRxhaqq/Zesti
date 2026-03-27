import { motion } from "motion/react";
import { ChefHat, Heart } from "lucide-react";

function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        padding: "40px 24px",
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "#e85d26",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(232,93,38,0.3)",
            }}
          >
            <ChefHat size={16} color="#fff" />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.3px",
            }}
          >
            Zesti<span style={{ color: "#e85d26" }}>.</span>
          </span>
        </div>

        {/* Center — tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            Built with
          </span>
          <Heart size={13} fill="#e85d26" color="#e85d26" />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            by Shuaib Abdulhaqq Omeiza
          </span>
        </div>

        {/* Right — copyright + API credit */}
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "12px",
              color: "var(--text-muted)",
              margin: "0 0 4px",
            }}
          >
            © {new Date().getFullYear()} Zesti. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "11px",
              color: "var(--text-muted)",
              margin: 0,
              opacity: 0.6,
            }}
          >
            Powered by{" "}
            <button
              onClick={() =>
                window.open(
                  "https://www.themealdb.com",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "11px",
                color: "#e85d26",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              TheMealDB
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
